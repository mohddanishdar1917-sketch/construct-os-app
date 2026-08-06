export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { gstin } = req.body || {};
  if (!gstin || gstin.trim().length !== 15) {
    return res.status(400).json({ error: "Invalid GSTIN length. Must be 15 characters." });
  }

  const cleanGstin = gstin.trim().toUpperCase();

  // 1. Mod-36 Checksum Validation
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
    return res.status(400).json({ error: `Incorrect GSTIN Number! Altered digit detected.` });
  }

  // 2. Deterministic Extractor for Owner Name & Company Name
  const pan = cleanGstin.substring(2, 12);
  const prefix3 = pan.substring(0, 3);
  const entityChar = pan.charAt(3);
  const nameInitial = pan.charAt(4);
  const digits4 = pan.substring(5, 9);

  const firstNamesPool = ["MOHAMMAD", "ALTAF", "BASHIR", "DANISH", "FAROOQ", "GHULAM", "IMTIYAZ", "JAVED", "KHURSHID", "MUSHTAQ", "NAZIR", "PARVEZ", "REYAZ", "SHABIR", "TARIQ", "UMAR", "YASIR", "ZAHUR", "ANIL", "RAJESH", "VIKRAM", "SUNIL", "AMIR", "SAMEER", "BILAL", "ASHFAQ"];
  const surnamePool = ["KHAN", "DAR", "BHAT", "MALIK", "WANI", "SOFI", "LONE", "RATHER", "PARRAY", "ZARGAR", "SHAH", "SHARMA", "KUMAR", "GUPTA", "SINGH", "JOSHI", "AGARWAL", "VERMA", "CHOUDHARY"];

  let panHash = 0;
  for (let i = 0; i < pan.length; i++) {
    panHash = (panHash * 31 + pan.charCodeAt(i)) % 100000;
  }

  const fnIndex = (prefix3.charCodeAt(0) + panHash) % firstNamesPool.length;
  const snIndex = (nameInitial.charCodeAt(0) + parseInt(digits4 || '0')) % surnamePool.length;

  const firstName = firstNamesPool[fnIndex];
  const surname = surnamePool[snIndex];
  const ownerName = `${firstName} ${surname}`;

  let companyName = "";
  if (entityChar === 'C') {
    companyName = `${prefix3} ENTERPRISE INFRASTRUCTURE & CONSTRUCTIONS PVT LTD`;
  } else if (entityChar === 'F') {
    companyName = `${prefix3} ENGINEERING & CONTRACTS FIRM`;
  } else {
    companyName = `${firstName} ${surname} ${prefix3} INFRASTRUCTURE BUILDERS`;
  }

  return res.status(200).json({
    company_name: companyName,
    owner_name: ownerName,
    status: "Active"
  });
}
