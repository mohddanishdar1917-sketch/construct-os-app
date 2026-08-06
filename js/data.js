/**
 * ConstructOS Data Store
 * Mock Database & Dynamic Contractor Session Manager
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
  invoices: [],
  inventory: [],
  equipment: [],
  tenders: [],
  crmContacts: [
    { id: "CRM-01", name: "Er. Altaf Hussain", designation: "Chief Engineer (R&B)", dept: "PWD J&K", phone: "+91 94190XXXXX", email: "ce.rb.srinagar@jk.gov.in", totalTendersAwarded: 4 },
    { id: "CRM-02", name: "Er. Mushtaq Zargar", designation: "Executive Engineer", dept: "Srinagar Smart City", phone: "+91 94191XXXXX", email: "xen.smartcity@jk.gov.in", totalTendersAwarded: 2 },
    { id: "CRM-03", name: "Sunil Kumar & Sons", designation: "Material Supplier (TMT & Cement)", dept: "Vendor", phone: "+91 99065XXXXX", email: "sales@sunilsteel.com", creditLimit: 2500000 }
  ],

  setActiveContractor: function(contractorProfile) {
    this.user = contractorProfile.user;
    this.metrics = contractorProfile.metrics;
    this.projects = contractorProfile.projects;
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
    this.invoices = [];
    this.inventory = [];
    this.equipment = [];
    this.tenders = [];
  }
};

window.ConstructData = ConstructData;
