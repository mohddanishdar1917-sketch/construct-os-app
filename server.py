import http.server
import socketserver
import os
import json
import urllib.request

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def calculate_gstin_checksum(gstin14):
    chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    total_sum = 0
    for i in range(14):
        char = gstin14[i]
        val = chars.find(char)
        if val == -1:
            return None
        factor = 1 if (i % 2 == 0) else 2
        product = val * factor
        quotient = product // 36
        remainder = product % 36
        total_sum += (quotient + remainder)
    check_value = (36 - (total_sum % 36)) % 36
    return chars[check_value]

def parse_official_gst_response(json_data):
    if not json_data or not isinstance(json_data, dict):
        return None

    obj = json_data.get("data") or json_data.get("taxpayerDetails") or json_data.get("taxpayer") or json_data.get("result") or json_data

    legal_name = (
        obj.get("lgnm") or
        obj.get("legal_name") or
        obj.get("legalName") or
        obj.get("taxpayerName") or
        obj.get("contactPerson") or
        obj.get("promoter_name") or
        obj.get("promoterName") or
        json_data.get("lgnm") or json_data.get("legal_name") or json_data.get("legalName")
    )

    trade_name = (
        obj.get("tradeNam") or
        obj.get("trade_name") or
        obj.get("tradeName") or
        obj.get("companyName") or
        obj.get("company_name") or
        obj.get("businessName") or
        json_data.get("tradeNam") or json_data.get("trade_name") or json_data.get("tradeName") or
        legal_name
    )

    if legal_name or trade_name:
        return {
            "owner_name": str(legal_name or trade_name).strip().upper(),
            "company_name": str(trade_name or legal_name).strip().upper(),
            "status": obj.get("sts") or obj.get("status") or "Active",
            "address": obj.get("pradr", {}).get("addr", {}) if isinstance(obj.get("pradr"), dict) else {}
        }

    return None

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/fetch-gstin':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode('utf-8'))
                gstin = payload.get('gstin', '').strip().upper()

                if len(gstin) != 15:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Invalid GSTIN length. Must be 15 characters."}).encode('utf-8'))
                    return

                expected_ck = calculate_gstin_checksum(gstin[:14])
                if not expected_ck or expected_ck != gstin[14]:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": f"Incorrect GSTIN Number! Altered digit detected."}).encode('utf-8'))
                    return

                fetched_data = None
                api_providers = [
                    f"https://api.allorigins.win/raw?url=https://services.gst.gov.in/services/api/search/taxpayerDetails/{gstin}",
                    f"https://api.sandbox.co.in/gsp/v1/taxpayer/{gstin}",
                    f"https://api.izendata.com/v1/gstin/verify/{gstin}",
                    f"https://api.cleartax.in/v1/gstin/{gstin}",
                    f"https://sheet.gstin.in/api/v1/search/{gstin}"
                ]
                for provider_url in api_providers:
                    try:
                        req = urllib.request.Request(provider_url, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(req, timeout=4) as resp:
                            if resp.status == 200:
                                res_json = json.loads(resp.read().decode('utf-8'))
                                parsed = parse_official_gst_response(res_json)
                                if parsed and (parsed["owner_name"] or parsed["company_name"]):
                                    fetched_data = parsed
                                    break
                    except Exception:
                        pass

                if fetched_data:
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(fetched_data).encode('utf-8'))
                else:
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Could not retrieve official details for this GSTIN from live GST portal. Please check the entered GSTIN."}).encode('utf-8'))

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            super().do_POST()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"ConstructOS server running at http://localhost:{PORT}")
        httpd.serve_forever()
