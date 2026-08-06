/**
 * ConstructOS Data Store
 * Mock Database & Dynamic Contractor Session Manager with GST & Historical Tender Extraction Engine
 */

const ALL_DISTRICTS = [
  "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda",
  "Ganderbal", "Jammu", "Kargil (Ladakh)", "Kathua", "Kishtwar",
  "Kulgam", "Kupwara", "Leh (Ladakh)", "Poonch", "Pulwama",
  "Rajouri", "Ramban", "Reasi", "Samba", "Shopian",
  "Srinagar", "Udhampur"
];

const BASE_TENDERS = [
  {
    id: "TND-2026-8891",
    title: "Construction of 4-Lane Flyover & Approach Roads from Parimpora to Shalteng",
    department: "Public Works Department (R&B)",
    district: "Srinagar",
    estValue: 48500000,
    emd: 970000,
    completionDays: 365,
    publishDate: "2026-08-01",
    bidSubmissionDeadline: "2026-08-20",
    minTurnover: 35000000,
    requiredClass: "Class-A",
    clauses: { defectLiability: "36 Months", liquidatedDamages: "0.5% per week", escrowRequired: true }
  },
  {
    id: "TND-2026-7742",
    title: "Upgradation of Smart City Underground Drainage Network & Culverts - Phase III",
    department: "Srinagar Smart City Ltd",
    district: "Srinagar",
    estValue: 24000000,
    emd: 480000,
    completionDays: 180,
    publishDate: "2026-07-28",
    bidSubmissionDeadline: "2026-08-15",
    minTurnover: 15000000,
    requiredClass: "Class-B",
    clauses: { defectLiability: "24 Months", liquidatedDamages: "1% per week", escrowRequired: false }
  },
  {
    id: "TND-2026-5044",
    title: "PMGSY Rural Road Connectivity - Macadamization from Bijbehara to Liram (12.4 km)",
    department: "PMGSY Rural Roads",
    district: "Anantnag",
    estValue: 12000000,
    emd: 240000,
    completionDays: 150,
    publishDate: "2026-08-02",
    bidSubmissionDeadline: "2026-08-18",
    minTurnover: 8000000,
    requiredClass: "Class-C",
    clauses: { defectLiability: "60 Months", liquidatedDamages: "0.5% per week", escrowRequired: false }
  },
  {
    id: "TND-2026-3390",
    title: "Construction of 100-Bed Sub-District Hospital OPD Block at Sopore",
    department: "Health & Medical Education Dept",
    district: "Baramulla",
    estValue: 32000000,
    emd: 640000,
    completionDays: 270,
    publishDate: "2026-08-03",
    bidSubmissionDeadline: "2026-08-25",
    minTurnover: 22000000,
    requiredClass: "Class-A",
    clauses: { defectLiability: "36 Months", liquidatedDamages: "0.5% per week", escrowRequired: false }
  },
  {
    id: "TND-2026-4412",
    title: "Construction of RCC Retaining Wall & Slope Stabilization on Jammu-Akhnoor Highway",
    department: "NHAI / PWD R&B",
    district: "Jammu",
    estValue: 41000000,
    emd: 820000,
    completionDays: 300,
    publishDate: "2026-07-30",
    bidSubmissionDeadline: "2026-08-22",
    minTurnover: 30000000,
    requiredClass: "Class-A",
    clauses: { defectLiability: "36 Months", liquidatedDamages: "0.5% per week", escrowRequired: true }
  },
  {
    id: "TND-2026-1188",
    title: "Water Treatment Plant & Feeder Main Pipeline Network Extension",
    department: "Jal Shakti / PHE Dept",
    district: "Budgam",
    estValue: 18500000,
    emd: 370000,
    completionDays: 210,
    publishDate: "2026-08-04",
    bidSubmissionDeadline: "2026-08-26",
    minTurnover: 12000000,
    requiredClass: "Class-B",
    clauses: { defectLiability: "24 Months", liquidatedDamages: "0.5% per week", escrowRequired: false }
  },
  {
    id: "TND-2026-7811",
    title: "Leh Solar Infra Park Access Road & High Altitude Retaining Bund Construction",
    department: "LAHDC Ladakh",
    district: "Leh (Ladakh)",
    estValue: 36500000,
    emd: 730000,
    completionDays: 240,
    publishDate: "2026-08-01",
    bidSubmissionDeadline: "2026-08-24",
    minTurnover: 25000000,
    requiredClass: "Class-A",
    clauses: { defectLiability: "36 Months", liquidatedDamages: "0.5% per week", escrowRequired: true }
  },
  {
    id: "TND-2026-9022",
    title: "Construction of Cold-Insulated District Medical Complex & Emergency Block at Kargil",
    department: "PWD Ladakh / PWD R&B",
    district: "Kargil (Ladakh)",
    estValue: 29000000,
    emd: 580000,
    completionDays: 210,
    publishDate: "2026-08-02",
    bidSubmissionDeadline: "2026-08-28",
    minTurnover: 20000000,
    requiredClass: "Class-A",
    clauses: { defectLiability: "36 Months", liquidatedDamages: "0.5% per week", escrowRequired: false }
  }
];

const ConstructData = {
  isLoggedIn: false,
  districts: ALL_DISTRICTS,
  user: null,
  metrics: null,
  projects: [],
  historicalTenders: [],
  invoices: [],
  inventory: [],
  equipment: [],
  tenders: [],
  crmContacts: [
    { id: "CRM-01", name: "Er. Altaf Hussain", designation: "Chief Engineer (R&B)", dept: "PWD J&K", phone: "+91 94190XXXXX", email: "ce.rb.srinagar@jk.gov.in", totalTendersAwarded: 4 },
    { id: "CRM-02", name: "Er. Mushtaq Zargar", designation: "Executive Engineer", dept: "Srinagar Smart City", phone: "+91 94191XXXXX", email: "xen.smartcity@jk.gov.in", totalTendersAwarded: 2 },
    { id: "CRM-03", name: "Sunil Kumar & Sons", designation: "Material Supplier (TMT & Cement)", dept: "Vendor", phone: "+91 99065XXXXX", email: "sales@sunilsteel.com", creditLimit: 2500000 }
  ],

  // GST Portal Lookup & Historical Tender Fetcher
  fetchGSTDetailsAndTenders: function(gstin, nameInput, companyInput, classInput, districtInput, revenueInput) {
    const cleanGstin = (gstin || "01AAACA1234B1Z5").toUpperCase();
    const ownerName = nameInput || "Mohammad Hussain";
    const companyName = companyInput || (ownerName.split(' ')[1] || ownerName) + " Infrastructure & Constructions";
    const district = districtInput || "Srinagar, J&K";
    const licenseClass = classInput || "Class-A Special (Roads & Bridges)";
    const monthlyRev = parseFloat(revenueInput) || 3850000;

    const regYear = 2018;
    const regDate = `${regYear}-04-16`;
    const maskedMobile = "+91 94190*****";

    // Ongoing Allocated Tenders
    const ongoingAllocatedTenders = [
      {
        tenderId: "TND-ALLOC-2025-09",
        title: `${district.split(',')[0]} Flyover & Link Corridor Construction`,
        department: "PWD (R&B) Division I",
        allocatedDate: "2025-11-10",
        contractValue: Math.round(monthlyRev * 9.5),
        status: "ONGOING",
        progressPercent: 74,
        executingOfficer: "Er. Altaf Hussain (Chief Engineer)"
      },
      {
        tenderId: "TND-ALLOC-2026-03",
        title: `Smart City Underground Drainage Network Extension`,
        department: "Smart City Development Authority",
        allocatedDate: "2026-01-20",
        contractValue: Math.round(monthlyRev * 4.2),
        status: "ONGOING",
        progressPercent: 45,
        executingOfficer: "Er. Mushtaq Zargar (Superintending Engineer)"
      }
    ];

    // Historical Completed Tenders from Reg Date (2018 - Present)
    const completedHistoricalTenders = [
      {
        tenderId: "TND-COMP-2024-88",
        title: "Sub-District Hospital Block Expansion & Structural Work",
        department: "Health & Medical Education Dept",
        allocatedDate: "2023-05-12",
        completionDate: "2024-12-20",
        contractValue: Math.round(monthlyRev * 8.2),
        status: "COMPLETED",
        qualityRating: "5.0 ★ Excellent",
        completionCertificateNo: `PWD/CC/${regYear}/9981`
      },
      {
        tenderId: "TND-COMP-2023-41",
        title: "PMGSY All-Weather Hill Road Macadamization (18.6 km)",
        department: "PMGSY J&K / LAHDC",
        allocatedDate: "2022-04-05",
        completionDate: "2023-11-15",
        contractValue: Math.round(monthlyRev * 6.8),
        status: "COMPLETED",
        qualityRating: "4.9 ★ Excellent",
        completionCertificateNo: `PMGSY/CC/2023/401`
      },
      {
        tenderId: "TND-COMP-2021-19",
        title: "Govt Higher Secondary School RCC Structural Building",
        department: "School Education Dept / PWD R&B",
        allocatedDate: "2020-09-01",
        completionDate: "2021-10-10",
        contractValue: Math.round(monthlyRev * 3.9),
        status: "COMPLETED",
        qualityRating: "4.8 ★ Very Good",
        completionCertificateNo: `PWD/CC/2021/112`
      },
      {
        tenderId: "TND-COMP-2019-04",
        title: "District Bridge Abutment & Slope Protection Bunds",
        department: "Jal Shakti / Irrigation & Flood Control",
        allocatedDate: "2018-08-15",
        completionDate: "2019-09-30",
        contractValue: Math.round(monthlyRev * 2.5),
        status: "COMPLETED",
        qualityRating: "4.9 ★ Excellent",
        completionCertificateNo: `IFC/CC/2019/088`
      }
    ];

    const totalHistoricalValue = [...ongoingAllocatedTenders, ...completedHistoricalTenders].reduce((acc, curr) => acc + curr.contractValue, 0);

    return {
      gstin: cleanGstin,
      ownerName: ownerName,
      companyName: companyName,
      licenseClass: licenseClass,
      district: district,
      regDate: regDate,
      maskedMobile: maskedMobile,
      taxpayerType: "Regular Taxpayer (Proprietorship / Pvt Ltd)",
      gstStatus: "ACTIVE / VERIFIED",
      monthlyRev: monthlyRev,
      annualTurnover: monthlyRev * 12,
      totalHistoricalValue: totalHistoricalValue,
      ongoingAllocatedTenders: ongoingAllocatedTenders,
      completedHistoricalTenders: completedHistoricalTenders
    };
  },

  setActiveContractor: function(contractorProfile) {
    this.user = contractorProfile.user;
    this.metrics = contractorProfile.metrics;
    this.projects = contractorProfile.projects;
    this.historicalTenders = contractorProfile.historicalTenders || [];
    this.invoices = contractorProfile.invoices;
    this.inventory = contractorProfile.inventory;
    this.equipment = contractorProfile.equipment;
    this.isLoggedIn = true;

    const turnover = contractorProfile.user.annualTurnover || 35000000;
    const userClass = contractorProfile.user.class || "Class-A";

    this.tenders = BASE_TENDERS.map(t => {
      let winScore = 50;
      let reasons = [];

      if (turnover >= t.minTurnover) {
        winScore += 25;
        reasons.push(`Turnover (₹${(turnover/100000).toFixed(1)} L) exceeds min criteria (₹${(t.minTurnover/100000).toFixed(1)} L)`);
      } else {
        winScore -= 20;
        reasons.push(`⚠️ Turnover is below standalone bid minimum; JV partner required`);
      }

      if (userClass.includes("Class-A")) {
        winScore += 20;
        reasons.push("Class-A Special license confers maximum technical qualification points");
      } else if (userClass.includes("Class-B") && (t.requiredClass === "Class-B" || t.requiredClass === "Class-C")) {
        winScore += 15;
        reasons.push("Class-B license fully qualifies for building & drainage tenders");
      } else if (userClass.includes("Class-C") && t.requiredClass === "Class-C") {
        winScore += 20;
        reasons.push("Class-C license fully qualifies for PMGSY rural road tenders");
      } else {
        reasons.push("License category upgrade recommended for higher tender value");
      }

      winScore = Math.min(Math.max(winScore, 35), 96);

      return {
        ...t,
        aiMatchScore: winScore,
        aiWinProbability: winScore + "%",
        aiRecommendation: winScore >= 80 ? "Highly Recommended (Top Fit)" : winScore >= 60 ? "Moderate Fit / Conditional" : "Requires Joint Venture (JV)",
        matchReasons: reasons,
        missingDocs: turnover < t.minTurnover ? ["JV MoU Agreement"] : []
      };
    });

    localStorage.setItem('constructos_active_contractor', JSON.stringify(contractorProfile));
  },

  loadStoredContractor: function() {
    const stored = localStorage.getItem('constructos_active_contractor');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.user && parsed.user.name) {
          this.setActiveContractor(parsed);
          return true;
        }
      } catch (e) {
        console.error("Error loading contractor session", e);
      }
    }
    this.isLoggedIn = false;
    this.user = null;
    return false;
  },

  logout: function() {
    localStorage.removeItem('constructos_active_contractor');
    this.isLoggedIn = false;
    this.user = null;
    this.metrics = null;
    this.projects = [];
    this.historicalTenders = [];
    this.invoices = [];
    this.inventory = [];
    this.equipment = [];
    this.tenders = [];
  }
};

window.ConstructData = ConstructData;
