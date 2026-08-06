from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

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

@app.route("/api/fetch-gstin", methods=["POST"])
def fetch_gstin():
    data = request.get_json() or {}
    gstin = data.get("gstin", "").strip().upper()
    
    if len(gstin) != 15:
        return jsonify({"error": "Invalid GSTIN length. Must be 15 characters."}), 400

    expected_ck = calculate_gstin_checksum(gstin[:14])
    if not expected_ck or expected_ck != gstin[14]:
        return jsonify({"error": f"Incorrect GSTIN Number! Altered digit detected (Checksum mismatch: expected '{expected_ck}', got '{gstin[14]}')"}), 400

    # Query Live GST API Providers
    api_providers = [
        f"https://api.allorigins.win/raw?url=https://services.gst.gov.in/services/api/search/taxpayerDetails/{gstin}",
        f"https://api.sandbox.co.in/gsp/v1/taxpayer/{gstin}",
        f"https://api.izendata.com/v1/gstin/verify/{gstin}",
        f"https://api.cleartax.in/v1/gstin/{gstin}",
        f"https://sheet.gstin.in/api/v1/search/{gstin}"
    ]

    for provider_url in api_providers:
        try:
            resp = requests.get(provider_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=4)
            if resp.status_code == 200:
                res_json = resp.json()
                parsed = parse_official_gst_response(res_json)
                if parsed and (parsed["owner_name"] or parsed["company_name"]):
                    return jsonify(parsed), 200
        except Exception:
            pass

    # STRICT NO-MOCK RULE: Return error if live GST API did not return official taxpayer data
    return jsonify({"error": "Could not retrieve official details for this GSTIN from live GST portal. Please check the entered GSTIN."}), 404

if __name__ == "__main__":
    print("ConstructOS Flask Backend running at http://localhost:5000/api/fetch-gstin")
    app.run(debug=True, host="0.0.0.0", port=5000)
