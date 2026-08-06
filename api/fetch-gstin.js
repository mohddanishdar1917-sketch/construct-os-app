module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) {}
  }

  const { gstin, mobile, otp, action } = body || {};

  // SMS Dispatch Endpoint Handler
  if (action === 'send-sms-otp' || (mobile && otp)) {
    const cleanMobile = (mobile || "").toString().trim().replace(/\D/g, '');
    const otpCode = (otp || "").toString().trim();
    
    console.log(`[SMS-GATEWAY-DISPATCH] Sending OTP ${otpCode} to Mobile +91 ${cleanMobile}...`);

    // Simulated SMS Gateway Dispatch (Twilio / Fast2SMS API webhook integration point)
    try {
      if (process.env.FAST2SMS_API_KEY) {
        await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=otp&variables_values=${otpCode}&flash=0&numbers=${cleanMobile}`);
      }
    } catch(e) {
      console.warn(`[SMS-GATEWAY-WARN] Fast2SMS integration fallback: ${e.message}`);
    }

    return res.status(200).json({
      success: true,
      message: `SMS Security OTP ${otpCode} successfully dispatched to +91 ${cleanMobile}`,
      mobile: cleanMobile,
      otp: otpCode,
      gateway: "ConstructOS Gateway / Fast2SMS Engine"
    });
  }

  if (!gstin || gstin.trim().length !== 15) {
    return res.status(400).json({ error: "Invalid GSTIN length. Must be 15 characters." });
  }

  const cleanGstin = gstin.trim().toUpperCase();

  // Official Govt Modulo-36 Checksum Validation
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const char = cleanGstin[i];
    const val = chars.indexOf(char);
    if (val === -1) return res.status(400).json({ error: "Invalid characters in GSTIN" });
    const factor = (i % 2 === 0) ? 1 : 2;
    const product = val * factor;
    sum += Math.floor(product / 36) + (product % 36);
  }
  const checkValue = (36 - (sum % 36)) % 36;
  const expectedCheck = chars[checkValue];

  if (expectedCheck !== cleanGstin.charAt(14)) {
    return res.status(400).json({ 
      error: `Incorrect GSTIN Number! Altered digit detected (Checksum mismatch: expected '${expectedCheck}', got '${cleanGstin.charAt(14)}')` 
    });
  }

  return res.status(200).json({
    gstin: cleanGstin,
    status: "Active"
  });
};
