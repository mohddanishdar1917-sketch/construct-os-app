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

  const { gstin } = body || {};
  if (!gstin || gstin.trim().length !== 15) {
    return res.status(400).json({ error: "Invalid GSTIN length. Must be 15 characters." });
  }

  const cleanGstin = gstin.trim().toUpperCase();

  // 1. Official Govt Modulo-36 Checksum Validation
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
    return res.status(400).json({ error: `Incorrect GSTIN Number! Altered digit detected (Checksum mismatch: expected '${expectedCheck}', got '${cleanGstin.charAt(14)}')` });
  }

  // Helper function for deep nested official GST JSON parsing
  function parseOfficialGSTResponse(json) {
    if (!json) return null;
    const obj = json.data || json.taxpayerDetails || json.taxpayer || json.result || json;

    // Legal Name (Taxpayer / Proprietor / Owner Name)
    let legalName = 
      obj.lgnm || 
      obj.legal_name || 
      obj.legalName || 
      obj.taxpayerName || 
      obj.contactPerson || 
      obj.promoter_name || 
      obj.promoterName || 
      (obj.promoters && obj.promoters[0] && (obj.promoters[0].name || obj.promoters[0].lgnm)) ||
      (obj.pradr && obj.pradr.addr && (obj.pradr.addr.name || obj.pradr.addr.bno)) ||
      json.lgnm || json.legal_name || json.legalName;

    // Trade Name (Company / Firm Name)
    let tradeName = 
      obj.tradeNam || 
      obj.trade_name || 
      obj.tradeName || 
      obj.companyName || 
      obj.company_name || 
      obj.businessName || 
      obj.business_name || 
      json.tradeNam || json.trade_name || json.tradeName || 
      legalName;

    if (legalName || tradeName) {
      return {
        owner_name: (legalName || tradeName).toString().trim().toUpperCase(),
        company_name: (tradeName || legalName).toString().trim().toUpperCase(),
        status: obj.sts || obj.status || obj.gstin_status || "Active",
        address: (obj.pradr && obj.pradr.addr) ? obj.pradr.addr : {}
      };
    }
    return null;
  }

  // 2. Query Live GST API Providers (Clear, Sandbox, Izen, Govt GST Portal)
  const apiProviders = [
    `https://api.allorigins.win/raw?url=https://services.gst.gov.in/services/api/search/taxpayerDetails/${cleanGstin}`,
    `https://api.sandbox.co.in/gsp/v1/taxpayer/${cleanGstin}`,
    `https://api.izendata.com/v1/gstin/verify/${cleanGstin}`,
    `https://api.cleartax.in/v1/gstin/${cleanGstin}`,
    `https://sheet.gstin.in/api/v1/search/${cleanGstin}`
  ];

  for (const providerUrl of apiProviders) {
    try {
      const apiRes = await fetch(providerUrl, { 
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept': 'application/json' }
      });
      if (apiRes.ok) {
        const json = await apiRes.json();
        const parsed = parseOfficialGSTResponse(json);
        if (parsed && (parsed.owner_name || parsed.company_name)) {
          return res.status(200).json(parsed);
        }
      }
    } catch (e) {
      // Continue to next GSP provider
    }
  }

  // STRICT NO-MOCK RULE: Return error if live GST portal returned no taxpayer data
  return res.status(404).json({
    error: "Could not retrieve official details for this GSTIN from live GST portal. Please verify the GSTIN."
  });
};
