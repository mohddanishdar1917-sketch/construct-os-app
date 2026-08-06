/**
 * ConstructOS - AI Intelligence Engine
 * Simulated AI Copilot, Tender Analyzer, BOQ Risk Predictor & Document Generator
 */

const ConstructAI = {
  /**
   * Evaluates Tender Eligibility & Calculates Win Probability Rationale
   */
  analyzeTender: function(tenderId) {
    const tender = ConstructData.tenders.find(t => t.id.toLowerCase().includes(tenderId.toLowerCase()) || tenderId.toLowerCase().includes(t.id.toLowerCase())) || ConstructData.tenders[0];
    if (!tender) return null;

    const user = ConstructData.user;
    const turnoverRequirement = tender.estValue * 0.75;
    const userTurnover = user.annualTurnover || 35000000;
    const hasSufficientTurnover = userTurnover >= turnoverRequirement;
    const isClassA = (user.class || '').includes("Class-A");

    let winScore = tender.aiMatchScore || 80;
    let factors = [...(tender.matchReasons || [])];

    return {
      tenderId: tender.id,
      title: tender.title,
      winProbability: tender.aiWinProbability || winScore + "%",
      score: winScore,
      recommendation: tender.aiRecommendation || "Evaluated for Contractor",
      keyRisks: [
        "Defect Liability Period: " + (tender.clauses ? tender.clauses.defectLiability : "24 Months"),
        "Liquidated Damages clause capped at 10% contract value",
        tender.clauses && tender.clauses.escrowRequired ? "Requires dedicated Escrow Account setup" : "Standard bank account accepted"
      ],
      eligibilityChecklist: [
        { item: "License Level: " + user.class.split(' ')[0], status: isClassA || (user.class.includes("Class-B") && tender.requiredClass !== "Class-A") ? "PASS" : "FAIL" },
        { item: "GSTIN Verification (" + user.gstin + ")", status: "PASS" },
        { item: "Annual Turnover Criteria (₹" + (userTurnover/100000).toFixed(1) + " L)", status: hasSufficientTurnover ? "PASS" : "FAIL" },
        { item: "Equipment Fleet Readiness", status: "PASS" }
      ],
      factors: factors
    };
  },

  /**
   * Analyzes BOQ Items & Predicts Material / Cost / Profit Metrics
   */
  analyzeBOQ: function(boqItems) {
    let totalBoqValue = 0;
    boqItems.forEach(item => {
      totalBoqValue += item.total;
    });

    const totalEstimatedCost = Math.round(totalBoqValue * 0.78);
    const expectedProfit = totalBoqValue - totalEstimatedCost;
    const profitMargin = ((expectedProfit / totalBoqValue) * 100).toFixed(1);

    const estimatedSteelTons = Math.round(totalBoqValue * 0.000008);
    const estimatedCementBags = Math.round(totalBoqValue * 0.00015);
    const estimatedDieselLiters = Math.round(totalBoqValue * 0.00022);

    return {
      totalBoqValue: totalBoqValue,
      totalEstimatedCost: totalEstimatedCost,
      expectedProfit: expectedProfit,
      profitMargin: profitMargin + "%",
      materialEstimate: {
        steelTons: estimatedSteelTons,
        cementBags: estimatedCementBags,
        dieselLiters: estimatedDieselLiters,
        aggregateCum: Math.round(totalBoqValue * 0.000005)
      },
      risks: [
        { level: "MEDIUM", text: "Bitumen VG-30 market volatility (+8% projected increase in Q4)" },
        { level: "LOW", text: "Labor availability during seasonal harvest" },
        { level: "HIGH", text: "Penalty clause: Delay exceeding 30 days incurs ₹25,000/day fine" }
      ]
    };
  },

  /**
   * Generates Official Construction Legal & Business Documents
   */
  generateDocument: function(type, params) {
    const today = new Date().toISOString().split('T')[0];
    const user = ConstructData.user || { name: 'Danish Ahmad', company: 'Ahmad Infra', class: 'Class-A Special', gstin: '01AAACA1234B1Z5', location: 'Srinagar, J&K' };

    switch (type) {
      case 'QUOTATION':
        return `
================================================================================
                        BUILDING & CONSTRUCTION QUOTATION
================================================================================
Ref No: CONST/QTN/${Math.floor(1000 + Math.random() * 9000)}
Date: ${today}

CONTRACTOR: ${user.company}
LICENSE: ${user.class}
GSTIN: ${user.gstin}
LOCATION: ${user.location}

TO: ${params.clientName || 'Executive Engineer, PWD J&K'}
PROJECT: ${params.projectName || 'Infrastructure Construction Work'}

Dear Sir/Madam,

We are pleased to submit our commercial quotation for the above project on behalf of ${user.company}.

--------------------------------------------------------------------------------
SUMMARY OF COMMERCIAL BID
--------------------------------------------------------------------------------
1. Basic Cost of Executing Work:       ₹${(params.amount || 2500000).toLocaleString('en-IN')}
2. Applicable GST @ 18%:               ₹${((params.amount || 2500000) * 0.18).toLocaleString('en-IN')}
3. TOTAL BID PRICE (INCL. GST):          ₹${((params.amount || 2500000) * 1.18).toLocaleString('en-IN')}

TERMS & CONDITIONS:
- Price validity: 60 days from submission date.
- Payment terms: Stage-wise RA Bills.

Authorized Signatory,
${user.name} (Managing Director)
${user.company}
================================================================================`;

      case 'RA_BILL':
        return `
================================================================================
                     RUNNING ACCOUNT (RA) BILL - FORM 26
================================================================================
Bill No: ${params.billNo || 'RA-04'}
Date: ${today}

CONTRACTOR: ${user.company}
LICENSE: ${user.class}
GSTIN: ${user.gstin}

WORK NAME: ${params.projectName || 'Bypass Extension & Paving Work'}
CONTRACT VALUE: ₹${(params.amount * 8 || 38500000).toLocaleString('en-IN')}

--------------------------------------------------------------------------------
BILLING PARTICULARS
--------------------------------------------------------------------------------
GROSS AMOUNT THIS BILL:                 ₹${(params.amount || 4300000).toLocaleString('en-IN')}
Add: CGST @ 9%:                         ₹${((params.amount || 4300000) * 0.09).toLocaleString('en-IN')}
Add: SGST @ 9%:                         ₹${((params.amount || 4300000) * 0.09).toLocaleString('en-IN')}
TOTAL AMOUNT CLAIMED (INCL GST):        ₹${((params.amount || 4300000) * 1.18).toLocaleString('en-IN')}

DEDUCTIONS & WITHHOLDINGS:
- Income Tax TDS @ 2%:                  ₹${((params.amount || 4300000) * 0.02).toLocaleString('en-IN')}
- GST TDS @ 2%:                         ₹${((params.amount || 4300000) * 0.02).toLocaleString('en-IN')}
- Security Retention @ 5%:              ₹${((params.amount || 4300000) * 0.05).toLocaleString('en-IN')}
--------------------------------------------------------------------------------
NET PAYABLE AMOUNT:                      ₹${((params.amount || 4300000) * 1.09).toLocaleString('en-IN')}

Signed: ___________________________
${user.name} (Contractor Signatory)
================================================================================`;

      case 'WORK_ORDER':
        return `
================================================================================
                            SUBCONTRACT WORK ORDER
================================================================================
Work Order No: WO/2026/${Math.floor(100 + Math.random() * 900)}
Date: ${today}

ISSUED BY: ${user.company} (${user.gstin})
LOCATION: ${user.location}

ISSUED TO: M/S Valley Material Suppliers & Plant
WORK DESCRIPTION: Supply and execution of civil works as specified.

Issued By:
${user.name}
${user.company}
================================================================================`;

      default:
        return "Document template selected: " + type;
    }
  },

  /**
   * AI Chat Assistant Query Handler
   */
  processQuery: function(userText) {
    const query = userText.toLowerCase();
    const user = ConstructData.user || { name: 'Danish Ahmad', company: 'Ahmad Infrastructure & Construction', class: 'Class-A Special', gstin: '01AAACA1234B1Z5' };
    const metrics = ConstructData.metrics || { monthlyRevenue: 3450000, monthlyProfit: 980000, pendingBills: 1425000, activeProjectsCount: 3 };

    // Match Bid Submission / Proposal / Draft Queries
    if (query.includes('bid') || query.includes('proposal') || query.includes('draft') || query.includes('submission') || query.includes('tnd-')) {
      // Extract tender ID or default to top tender
      let tender = ConstructData.tenders.find(t => query.includes(t.id.toLowerCase()) || query.includes(t.id.replace('tnd-2026-', '').toLowerCase()));
      if (!tender) {
        tender = ConstructData.tenders[0];
      }

      const analysis = this.analyzeTender(tender.id);
      const quotedValue = Math.round(tender.estValue * 0.96);

      return `📄 **AI BID SUBMISSION PROPOSAL GENERATED**\n` +
        `--------------------------------------------------\n` +
        `**Tender Ref**: ${tender.id}\n` +
        `**Work Name**: ${tender.title}\n` +
        `**Department**: ${tender.department} (${tender.district})\n\n` +
        `**BIDDER ENTERPRISE DETAILS**:\n` +
        `• **Contractor Name**: ${user.name}\n` +
        `• **Company**: ${user.company}\n` +
        `• **Enlistment Class**: ${user.class}\n` +
        `• **GSTIN**: ${user.gstin}\n\n` +
        `**COMMERCIAL & FINANCIAL BID**:\n` +
        `• **Estimated Contract Value**: ₹${(tender.estValue / 100000).toFixed(2)} Lakhs\n` +
        `• **Competitive Bid Quote (-4%)**: **₹${(quotedValue / 100000).toFixed(2)} Lakhs**\n` +
        `• **Earnest Money Deposit (EMD)**: ₹${(tender.emd / 100000).toFixed(2)} Lakhs\n` +
        `• **Execution Timeline**: ${tender.completionDays} Calendar Days\n` +
        `• **AI Win Probability**: **${analysis.winProbability}** (${analysis.recommendation})\n\n` +
        `✅ *All pre-qualification criteria, GST turnover certificates & Class-A enlistment documents verified for e-Tendering submission!*`;
    }

    // Match BOQ / Material / Cost Queries
    if (query.includes('boq') || query.includes('cost') || query.includes('estimate') || query.includes('material')) {
      return `📐 **BOQ & Material Forecast**: Based on active project scope, estimated gross profit margin is **28.4%**. Raw material requirements: Steel Fe-550D (**42.5 Tons**), OPC 53 Cement (**380 Bags**), Bitumen VG-30 (**18.2 Tons**).`;
    }

    // Match Finance / Revenue / Bills Queries
    if (query.includes('revenue') || query.includes('profit') || query.includes('bill') || query.includes('invoice') || query.includes('ra') || query.includes('gst')) {
      return `📊 **Profile Financial Overview for ${user.company}**:\n- Monthly Revenue: **₹${(metrics.monthlyRevenue/100000).toFixed(2)} Lakhs**\n- Net Profit: **₹${(metrics.monthlyProfit/100000).toFixed(2)} Lakhs**\n- Pending Treasury Clearance: **₹${(metrics.pendingBills/100000).toFixed(2)} Lakhs** across ${metrics.activeProjectsCount} active project(s).`;
    }

    // Match Tender Search / Eligibility Queries
    if (query.includes('tender') || query.includes('eligible') || query.includes('win') || query.includes('search')) {
      const topTender = ConstructData.tenders[0];
      return `🎯 **Tender Match Insight**: Based on your **${user.class}** and turnover, your top matching tender is **${topTender.id} (${topTender.title})** with an estimated **${topTender.aiWinProbability} Win Probability**.`;
    }

    // Fallback response with helpful triggers
    return `ConstructOS AI Copilot active for **${user.name}** (${user.company}) 👋!\n\nI can assist you with:\n1. 📄 Drafting Bid Submission Proposals (e.g. *Draft proposal for TND-2026-8891*)\n2. 🎯 Tender Win & Qualification Audits\n3. 📐 BOQ Cost & Profit Calculations\n4. 📑 Form 26 RA Bill & GST Invoice Generation`;
  }
};

window.ConstructAI = ConstructAI;
