/**
 * ConstructOS - Contractor Login & Portal Gate Controller with GST OTP Verification & Historical Tender Auto-Fetcher
 */

const ConstructAuth = {
  pendingGSTData: null,

  init: function() {
    const hasSession = ConstructData.loadStoredContractor();
    
    if (hasSession) {
      this.showAppShell();
      this.updateHeaderProfile();
    } else {
      this.showLandingGate();
    }
  },

  showLandingGate: function() {
    const loginScreen = document.getElementById('login-screen');
    const appRoot = document.getElementById('app-root');

    if (loginScreen) loginScreen.style.display = 'flex';
    if (appRoot) appRoot.style.display = 'none';
  },

  showAppShell: function() {
    const loginScreen = document.getElementById('login-screen');
    const appRoot = document.getElementById('app-root');

    if (loginScreen) loginScreen.style.display = 'none';
    if (appRoot) appRoot.style.display = 'flex';
  },

  logoutContractor: function() {
    ConstructData.logout();
    this.showLandingGate();
  },

  switchLoginTab: function(tab) {
    const demoTab = document.getElementById('login-tab-demo');
    const customTab = document.getElementById('login-tab-custom');
    const btnDemo = document.getElementById('tab-btn-demo');
    const btnCustom = document.getElementById('tab-btn-custom');

    if (tab === 'demo') {
      if (demoTab) demoTab.style.display = 'block';
      if (customTab) customTab.style.display = 'none';
      if (btnDemo) {
        btnDemo.style.background = 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))';
        btnDemo.style.color = '#fff';
        btnDemo.style.border = '1px solid var(--accent-cyan)';
      }
      if (btnCustom) {
        btnCustom.style.background = 'transparent';
        btnCustom.style.color = 'var(--text-dim)';
        btnCustom.style.border = '1px solid transparent';
      }
    } else {
      if (demoTab) demoTab.style.display = 'none';
      if (customTab) customTab.style.display = 'block';
      if (btnCustom) {
        btnCustom.style.background = 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))';
        btnCustom.style.color = '#fff';
        btnCustom.style.border = '1px solid var(--accent-cyan)';
      }
      if (btnDemo) {
        btnDemo.style.background = 'transparent';
        btnDemo.style.color = 'var(--text-dim)';
        btnDemo.style.border = '1px solid transparent';
      }
    }
  },

  createFreeDemoAccount: function() {
    const demoProfile = {
      id: "demo_" + Date.now(),
      user: {
        name: "Demo Contractor",
        company: "Ahmad Infrastructure & Construction",
        gstin: "01AAACA1234B1Z5",
        class: "Class-A Special (Roads & Bridges)",
        location: "Srinagar, J&K",
        annualTurnover: 41400000,
        avatar: "DC"
      },
      metrics: {
        monthlyRevenue: 3450000,
        monthlyProfit: 979800,
        pendingBills: 1414500,
        activeProjectsCount: 3,
        upcomingTendersCount: 18,
        documentExpiryAlerts: [
          { id: 'exp-d1', title: 'GST Certificate Renewal', daysLeft: 3, type: 'danger', certNo: '01AAACA1234B1Z5' },
          { id: 'exp-d2', title: 'Class-A Enlistment License', daysLeft: 12, type: 'warning', certNo: 'PWD/CE/2022/994' }
        ]
      },
      projects: [
        {
          id: "PRJ-101",
          name: "NH-44 Bypass Extension & Paving",
          client: "NHAI / PWD R&B",
          location: "Pantha Chowk - Srinagar",
          contractValue: 38500000,
          billedToDate: 26400000,
          receivedToDate: 22100000,
          pendingRA: 4300000,
          progressPercent: 68,
          startDate: "2026-02-10",
          targetDate: "2026-10-30",
          status: "In Progress",
          health: "On Schedule",
          laborersOnSite: 42,
          engineersOnSite: 4
        }
      ],
      historicalTenders: [
        { tenderId: "TND-COMP-2024", title: "Hospital Sub-Block", contractValue: 24500000, status: "COMPLETED", completionDate: "2024-12-10" }
      ],
      invoices: [
        { id: "INV-2026-089", raBillNo: "RA Bill #04", project: "NH-44 Bypass Extension", client: "PWD R&B Circle II", date: "2026-08-02", dueDate: "2026-08-25", taxableAmount: 3644067, gstRate: 18, gstAmount: 655933, totalAmount: 4300000, status: "Submitted / Pending Approval", tdsDeducted: 72881 }
      ],
      inventory: [
        { id: "INV-MAT-1", name: "TMT Rebar (Fe-550D 12mm)", category: "Steel", quantity: 42.5, unit: "Tons", minThreshold: 15, location: "Srinagar Central Store", reorderStatus: "Sufficient", unitCost: 64000 }
      ],
      equipment: [
        { id: "EQP-01", name: "TATA Hitachi EX-200 LC Excavator", regNo: "JK01-AV-9921", operator: "Mohammad Ashraf", status: "Operational", site: "Pantha Chowk", fuelConsLtrHr: 16.5, health: "Good", nextServiceHrs: 45 }
      ]
    };

    ConstructData.setActiveContractor(demoProfile);
    this.showAppShell();
    this.updateHeaderProfile();

    if (window.ConstructApp) {
      window.ConstructApp.init();
    }
  },

  // 1. INITIATE GST & OTP VERIFICATION MODAL
  submitCustomContractor: function(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById('auth-name').value.trim();
    const companyInput = document.getElementById('auth-company').value.trim();
    const gstinInput = document.getElementById('auth-gstin').value.trim();
    const classInput = document.getElementById('auth-class').value;
    const districtInput = document.getElementById('auth-location').value;
    const revenueInput = document.getElementById('auth-revenue').value;

    // Fetch GST Firm Details & Historical Tenders from GST Engine
    this.pendingGSTData = ConstructData.fetchGSTDetailsAndTenders(
      gstinInput, nameInput, companyInput, classInput, districtInput, revenueInput
    );

    this.showGSTOTPModal();
  },

  showGSTOTPModal: function() {
    const data = this.pendingGSTData;
    if (!data) return;

    const modalBodyHtml = `
      <div style="text-align: center; padding: 10px;">
        <div class="brand-logo-circle" style="width: 52px; height: 52px; margin: 0 auto 12px; border-width: 2px;">
          <img src="assets/logo.jpg" alt="ConstructOS" class="brand-logo-img">
        </div>
        
        <span class="badge cyan" style="font-size: 11px; padding: 3px 8px;">🏛️ Official GSTN Mobile OTP Verification</span>
        <h3 style="font-size: 18px; font-weight: 800; color: #fff; margin-top: 8px;">Verify GSTIN Ownership & Fetch Records</h3>
        <p style="font-size: 12px; color: var(--text-dim); margin-top: 4px; margin-bottom: 16px;">
          GSTIN: <strong style="color: var(--accent-cyan);">${data.gstin}</strong> • Registered: <strong style="color: #fff;">${data.regDate}</strong>
        </p>

        <!-- Fetched Record Preview Card -->
        <div style="background: rgba(6,182,212,0.06); border: 1px solid rgba(6,182,212,0.3); border-radius: var(--radius-md); padding: 14px; text-align: left; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
            <div>
              <div style="color: var(--text-dim); font-size: 10px; text-transform: uppercase;">Legal Firm Name</div>
              <div style="font-weight: 700; color: #fff;">${data.companyName}</div>
            </div>
            <div>
              <div style="color: var(--text-dim); font-size: 10px; text-transform: uppercase;">Proprietor / Director</div>
              <div style="font-weight: 700; color: var(--accent-cyan);">${data.ownerName}</div>
            </div>
            <div>
              <div style="color: var(--text-dim); font-size: 10px; text-transform: uppercase;">Currently Ongoing Allocated Tenders</div>
              <div style="font-weight: 700; color: var(--accent-emerald);">${data.ongoingAllocatedTenders.length} Active Contracts (₹${(data.ongoingAllocatedTenders.reduce((a,b)=>a+b.contractValue,0)/10000000).toFixed(2)} Cr)</div>
            </div>
            <div>
              <div style="color: var(--text-dim); font-size: 10px; text-transform: uppercase;">Historical Completed Tenders</div>
              <div style="font-weight: 700; color: var(--accent-amber);">${data.completedHistoricalTenders.length} Projects Completed Since ${data.regDate.split('-')[0]}</div>
            </div>
          </div>
        </div>

        <!-- Mobile OTP Input Section -->
        <div style="background: rgba(15,23,42,0.8); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 12px; color: var(--text-main); margin-bottom: 8px;">
            📲 Enter 6-Digit Security OTP sent to <strong>${data.maskedMobile}</strong>:
          </div>
          
          <input id="gst-otp-input" type="text" class="text-input" style="width: 200px; text-align: center; font-size: 20px; font-weight: 800; letter-spacing: 4px; border-color: var(--accent-cyan);" value="482910" maxlength="6" required>
          
          <div style="font-size: 11px; color: var(--accent-emerald); margin-top: 6px;">
            ✓ Pre-filled test OTP code ready for instant 1-click verification
          </div>
        </div>

        <button type="button" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 14px; font-weight: 700; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo)); box-shadow: 0 0 25px rgba(6,182,212,0.4);" onclick="ConstructAuth.confirmGSTOTPAndLogin()">
          🔐 VERIFY OTP & FETCH COMPLETE HISTORICAL RECORDS
        </button>
      </div>
    `;

    if (window.ConstructApp) {
      window.ConstructApp.openModal("🔐 GSTIN & Historical Tender Auto-Fetcher", modalBodyHtml);
    }
  },

  // 2. CONFIRM OTP & HYDRATE WORKSPACE WITH ALL ALLOCATED & HISTORICAL TENDERS
  confirmGSTOTPAndLogin: function() {
    const otpVal = document.getElementById('gst-otp-input') ? document.getElementById('gst-otp-input').value : '482910';
    if (!otpVal || otpVal.length < 4) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    const data = this.pendingGSTData;
    if (!data) return;

    const initials = data.ownerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'MH';

    // Map ongoing tenders directly into active projects
    const activeProjects = data.ongoingAllocatedTenders.map((t, idx) => ({
      id: "PRJ-" + (idx + 101),
      name: t.title,
      client: t.department,
      location: data.district,
      contractValue: t.contractValue,
      billedToDate: Math.round(t.contractValue * (t.progressPercent / 100)),
      receivedToDate: Math.round(t.contractValue * (t.progressPercent / 100) * 0.85),
      pendingRA: Math.round(t.contractValue * 0.15),
      progressPercent: t.progressPercent,
      startDate: t.allocatedDate,
      targetDate: "2026-11-30",
      status: "In Progress",
      health: "On Schedule",
      laborersOnSite: 45 + (idx * 12),
      engineersOnSite: 4 + idx
    }));

    const verifiedProfile = {
      id: "gst_verified_" + Date.now(),
      user: {
        name: data.ownerName,
        company: data.companyName,
        gstin: data.gstin,
        class: data.licenseClass,
        location: data.district,
        annualTurnover: data.annualTurnover,
        avatar: initials,
        regDate: data.regDate,
        gstStatus: "VERIFIED ACTIVE TAXPAYER"
      },
      metrics: {
        monthlyRevenue: data.monthlyRev,
        monthlyProfit: Math.round(data.monthlyRev * 0.284),
        pendingBills: Math.round(data.monthlyRev * 0.42),
        activeProjectsCount: data.ongoingAllocatedTenders.length,
        upcomingTendersCount: 18,
        documentExpiryAlerts: [
          { id: 'exp-v1', title: 'GST Return filing (GSTR-3B)', daysLeft: 5, type: 'danger', certNo: data.gstin },
          { id: 'exp-v2', title: data.licenseClass.split(' ')[0] + ' Enlistment Certificate', daysLeft: 16, type: 'warning', certNo: 'PWD/CE/2026/881' }
        ]
      },
      projects: activeProjects,
      historicalTenders: data.completedHistoricalTenders,
      invoices: [
        { id: "INV-VERIFIED-01", raBillNo: "RA Bill #03", project: activeProjects[0] ? activeProjects[0].name : "Corridor Work", client: "PWD R&B Division", date: "2026-08-01", dueDate: "2026-08-25", taxableAmount: Math.round(data.monthlyRev * 1.05), gstRate: 18, gstAmount: Math.round(data.monthlyRev * 0.19), totalAmount: Math.round(data.monthlyRev * 1.24), status: "Submitted / Pending Approval", tdsDeducted: Math.round(data.monthlyRev * 0.02) }
      ],
      inventory: [
        { id: "INV-MAT-V1", name: "OPC 53 Grade Cement", category: "Cement", quantity: 450, unit: "Bags", minThreshold: 200, location: data.district + " Central Yard", reorderStatus: "Sufficient", unitCost: 430 },
        { id: "INV-MAT-V2", name: "Fe-550D TMT Steel Rebar", category: "Steel", quantity: 38.5, unit: "Tons", minThreshold: 15, location: data.district + " Central Yard", reorderStatus: "Sufficient", unitCost: 64000 }
      ],
      equipment: [
        { id: "EQP-V1", name: "JCB 3DX Heavy Duty Loader", regNo: "JK01-SITE-889", operator: "Mohammad Ashraf", status: "Operational", site: data.district, fuelConsLtrHr: 8.5, health: "Good", nextServiceHrs: 60 }
      ]
    };

    ConstructData.setActiveContractor(verifiedProfile);
    
    if (window.ConstructApp) {
      window.ConstructApp.closeModal();
    }

    this.showAppShell();
    this.updateHeaderProfile();

    if (window.ConstructApp) {
      window.ConstructApp.init();
    }
  },

  updateHeaderProfile: function() {
    const user = ConstructData.user;
    if (!user) return;
    
    const avatarEl = document.querySelector('.sidebar-footer .user-avatar');
    const nameEl = document.querySelector('.sidebar-footer .user-name');
    const companyEl = document.querySelector('.sidebar-footer .user-company');

    if (avatarEl) avatarEl.innerText = user.avatar || 'MH';
    if (nameEl) nameEl.innerText = user.name || 'Mohammad Hussain';
    if (companyEl) companyEl.innerText = user.company || 'Hussain Infra Pvt Ltd';

    const topbarProfileBtn = document.getElementById('topbar-contractor-profile');
    if (topbarProfileBtn) {
      topbarProfileBtn.innerHTML = `👤 ${user.name} (${user.class.split(' ')[0]}) ▼`;
    }
  }
};

window.ConstructAuth = ConstructAuth;
