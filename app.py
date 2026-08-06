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

    if len(gstin) != 15:
        return jsonify({"error": "Invalid GSTIN length. Must be 15 characters."}), 400

    expected_ck = calculate_gstin_checksum(gstin[:14])
    if not expected_ck or expected_ck != gstin[14]:
        return jsonify({"error": f"Incorrect GSTIN Number! Altered digit detected."}), 400

    if mobile:
        clean_mobile = ''.join(filter(str.isdigit, mobile))
        return jsonify({
            "success": True,
            "match": True,
            "gstin": gstin,
            "mobile": clean_mobile,
            "masked_mobile": f"{clean_mobile[:4]}*****{clean_mobile[9:]}" if len(clean_mobile) >= 10 else clean_mobile,
            "message": "Mobile number accepted"
        }), 200

    return jsonify({
        "gstin": gstin,
        "status": "Active"
    }), 200

if __name__ == "__main__":
    print("ConstructOS Flask Backend running at http://localhost:5000/api/fetch-gstin")
    app.run(debug=True, host="0.0.0.0", port=5000)
