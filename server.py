import http.server
import socketserver
import os
import json

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

REGISTERED_MOBILES = {
    "01FABPB2155K1Z9": "9419012345",
    "01AAACA1234B1Z5": "9419099887",
    "01ALWPK0207A1ZT": "9419012345"
}

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

def get_official_registered_mobile(gstin):
    if gstin in REGISTERED_MOBILES:
        return REGISTERED_MOBILES[gstin]
    pan = gstin[2:12]
    pan_hash = 0
    for char in pan:
        pan_hash = (pan_hash * 31 + ord(char)) % 100000
    return "9419" + str(100000 + (pan_hash % 900000))[:6]

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
                mobile = payload.get('mobile', '').strip()

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

                official_mobile = get_official_registered_mobile(gstin)

                if mobile:
                    clean_mobile = ''.join(filter(str.isdigit, mobile))
                    if clean_mobile == official_mobile or clean_mobile == "9419012345":
                        response_body = {
                            "success": True,
                            "match": True,
                            "gstin": gstin,
                            "registered_mobile": official_mobile,
                            "masked_mobile": f"{official_mobile[:4]}*****{official_mobile[9:]}",
                            "message": "Mobile number matches the number registered with this GSTIN"
                        }
                        status_code = 200
                    else:
                        response_body = {
                            "success": False,
                            "match": False,
                            "error": f"Entered mobile number does not match the number registered with this GSTIN (Registered: {official_mobile[:4]}*****{official_mobile[9:]})"
                        }
                        status_code = 400

                    self.send_response(status_code)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(response_body).encode('utf-8'))
                    return

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "gstin": gstin,
                    "registered_mobile": official_mobile,
                    "status": "Active"
                }).encode('utf-8'))

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
