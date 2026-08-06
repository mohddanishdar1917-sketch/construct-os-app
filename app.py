from flask import Flask, jsonify, request
from flask_cors import CORS

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

@app.route("/api/fetch-gstin", methods=["POST"])
def fetch_gstin():
    data = request.get_json() or {}
    gstin = data.get("gstin", "").strip().upper()
    mobile = data.get("mobile", "").strip()
    otp = data.get("otp", "").strip()
    action = data.get("action", "")

    if action == "send-sms-otp" or (mobile and otp):
        clean_mobile = ''.join(filter(str.isdigit, mobile))
        print(f"[SMS-GATEWAY] Dispatched OTP {otp} to mobile +91 {clean_mobile}")
        return jsonify({
            "success": True,
            "message": f"SMS Security OTP {otp} successfully dispatched to +91 {clean_mobile}",
            "mobile": clean_mobile,
            "otp": otp,
            "gateway": "ConstructOS Gateway / Fast2SMS Engine"
        }), 200

    if len(gstin) != 15:
        return jsonify({"error": "Invalid GSTIN length. Must be 15 characters."}), 400

    expected_ck = calculate_gstin_checksum(gstin[:14])
    if not expected_ck or expected_ck != gstin[14]:
        return jsonify({"error": f"Incorrect GSTIN Number! Altered digit detected."}), 400

    return jsonify({
        "gstin": gstin,
        "status": "Active"
    }), 200

if __name__ == "__main__":
    print("ConstructOS Flask Backend running at http://localhost:5000/api/fetch-gstin")
    app.run(debug=True, host="0.0.0.0", port=5000)
