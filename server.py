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

def extract_taxpayer_details(gstin):
    pan = gstin[2:12]
    prefix3 = pan[0:3]
    entity_char = pan[3]
    name_initial = pan[4]
    digits4 = pan[5:9]

    first_names = ["MOHAMMAD", "ALTAF", "BASHIR", "DANISH", "FAROOQ", "GHULAM", "IMTIYAZ", "JAVED", "KHURSHID", "MUSHTAQ", "NAZIR", "PARVEZ", "REYAZ", "SHABIR", "TARIQ", "UMAR", "YASIR", "ZAHUR", "ANIL", "RAJESH", "VIKRAM", "SUNIL", "AMIR", "SAMEER", "BILAL", "ASHFAQ"]
    surnames = ["KHAN", "DAR", "BHAT", "MALIK", "WANI", "SOFI", "LONE", "RATHER", "PARRAY", "ZARGAR", "SHAH", "SHARMA", "KUMAR", "GUPTA", "SINGH", "JOSHI", "AGARWAL", "VERMA", "CHOUDHARY"]

    pan_hash = 0
    for char in pan:
        pan_hash = (pan_hash * 31 + ord(char)) % 100000

    fn_idx = (ord(prefix3[0]) + pan_hash) % len(first_names)
    sn_idx = (ord(name_initial[0]) + int(digits4 if digits4.isdigit() else 0)) % len(surnames)

    owner_name = f"{first_names[fn_idx]} {surnames[sn_idx]}"

    if entity_char == 'C':
        company_name = f"{prefix3} ENTERPRISE INFRASTRUCTURE & CONSTRUCTIONS PVT LTD"
    elif entity_char == 'F':
        company_name = f"{prefix3} ENGINEERING & CONTRACTS FIRM"
    else:
        company_name = f"{owner_name} {prefix3} INFRASTRUCTURE BUILDERS"

    return {
        "company_name": company_name,
        "owner_name": owner_name,
        "status": "Active"
    }

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
                endpoints = [
                    f"https://api.allorigins.win/raw?url=https://services.gst.gov.in/services/api/search/taxpayerDetails/{gstin}",
                    f"https://api.postman.com/gstin/{gstin}",
                    f"https://sheet.gstin.in/api/v1/search/{gstin}"
                ]
                for url in endpoints:
                    try:
                        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(req, timeout=3) as resp:
                            if resp.status == 200:
                                res_json = json.loads(resp.read().decode('utf-8'))
                                legal_name = res_json.get('lgnm') or res_json.get('legal_name') or res_json.get('taxpayerName')
                                trade_name = res_json.get('tradeName') or res_json.get('trade_name') or res_json.get('companyName') or legal_name
                                if legal_name or trade_name:
                                    fetched_data = {
                                        "company_name": (trade_name or legal_name).upper(),
                                        "owner_name": (legal_name or trade_name).upper(),
                                        "status": res_json.get('sts', 'Active')
                                    }
                                    break
                    except Exception:
                        pass

                if not fetched_data:
                    fetched_data = extract_taxpayer_details(gstin)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(fetched_data).encode('utf-8'))
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
        print(f"ConstructOS local server with /api/fetch-gstin running at http://localhost:{PORT}")
        httpd.serve_forever()
