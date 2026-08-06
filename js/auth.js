/**
 * ConstructOS - Contractor Login & Portal Gate Controller
 */

const ConstructAuth = {
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
          engineersOnSite: 4,
          milestones: [
            { name: "Site Clearance & Grading", status: "Completed", date: "2026-03-15" },
            { name: "Sub-grade & GSB Layering", status: "Completed", date: "2026-05-20" },
            { name: "Wet Mix Macadam (WMM)", status: "In Progress", date: "2026-08-25" }
          ]
        },
        {
          id: "PRJ-102",
          name: "Govt Degree College Science Block",
          client: "JK Higher Education Dept",
          location: "Baramulla",
          contractValue: 52000000,
          billedToDate: 41000000,
          receivedToDate: 36000000,
          pendingRA: 5000000,
          progressPercent: 78,
          startDate: "2025-11-01",
          targetDate: "2026-09-15",
          status: "In Progress",
          health: "Minor Delay (Steel Supply)",
          laborersOnSite: 56,
          engineersOnSite: 5,
          milestones: [
            { name: "Foundation RCC", status: "Completed", date: "2026-01-30" },
            { name: "Superstructure Frame", status: "Completed", date: "2026-06-15" }
          ]
        }
      ],
      invoices: [
        { id: "INV-2026-089", raBillNo: "RA Bill #04", project: "NH-44 Bypass Extension", client: "PWD R&B Circle II", date: "2026-08-02", dueDate: "2026-08-25", taxableAmount: 3644067, gstRate: 18, gstAmount: 655933, totalAmount: 4300000, status: "Submitted / Pending Approval", tdsDeducted: 72881 }
      ],
      inventory: [
        { id: "INV-MAT-1", name: "TMT Rebar (Fe-550D 12mm)", category: "Steel", quantity: 42.5, unit: "Tons", minThreshold: 15, location: "Srinagar Central Store", reorderStatus: "Sufficient", unitCost: 64000 },
        { id: "INV-MAT-2", name: "OPC 53 Grade Cement", category: "Cement", quantity: 380, unit: "Bags", minThreshold: 500, location: "Srinagar Site Yard", reorderStatus: "Low Stock Alert", unitCost: 430 }
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

  submitCustomContractor: function(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('auth-name').value.trim() || 'Contractor Owner';
    const company = document.getElementById('auth-company').value.trim() || 'Contractor Infrastructure Pvt Ltd';
    const gstin = document.getElementById('auth-gstin').value.trim() || '01AAACA1234B1Z5';
    const classVal = document.getElementById('auth-class').value || 'Class-A Special (Roads & Bridges)';
    const location = document.getElementById('auth-location').value.trim() || 'Srinagar, J&K';
    const monthlyRev = parseFloat(document.getElementById('auth-revenue').value) || 3500000;

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CO';

    const customProfile = {
      id: "contractor_" + Date.now(),
      user: {
        name: name,
        company: company,
        gstin: gstin,
        class: classVal,
        location: location,
        annualTurnover: monthlyRev * 12,
        avatar: initials
      },
      metrics: {
        monthlyRevenue: monthlyRev,
        monthlyProfit: Math.round(monthlyRev * 0.284),
        pendingBills: Math.round(monthlyRev * 0.41),
        activeProjectsCount: 2,
        upcomingTendersCount: 18,
        documentExpiryAlerts: [
          { id: 'exp-c1', title: 'GST Certificate Renewal', daysLeft: 5, type: 'danger', certNo: gstin },
          { id: 'exp-c2', title: classVal.split(' ')[0] + ' Enlistment License', daysLeft: 14, type: 'warning', certNo: 'PWD/CE/2026/88' }
        ]
      },
      projects: [
        {
          id: "PRJ-C101",
          name: company + " Prime Site Work",
          client: "PWD R&B / State Department",
          location: location,
          contractValue: Math.round(monthlyRev * 11),
          billedToDate: Math.round(monthlyRev * 7.5),
          receivedToDate: Math.round(monthlyRev * 6.3),
          pendingRA: Math.round(monthlyRev * 1.2),
          progressPercent: 72,
          startDate: "2026-02-01",
          targetDate: "2026-10-30",
          status: "In Progress",
          health: "On Schedule",
          laborersOnSite: 34,
          engineersOnSite: 3,
          milestones: [
            { name: "Site Prep & Foundation", status: "Completed", date: "2026-03-30" },
            { name: "Main Execution Phase", status: "In Progress", date: "2026-08-30" }
          ]
        }
      ],
      invoices: [
        { id: "INV-C2026-01", raBillNo: "RA Bill #02", project: company + " Prime Site Work", client: "PWD R&B", date: "2026-08-01", dueDate: "2026-08-25", taxableAmount: Math.round(monthlyRev * 1.05), gstRate: 18, gstAmount: Math.round(monthlyRev * 0.19), totalAmount: Math.round(monthlyRev * 1.24), status: "Submitted / Pending Approval", tdsDeducted: Math.round(monthlyRev * 0.02) }
      ],
      inventory: [
        { id: "INV-MAT-C1", name: "OPC 53 Cement Bags", category: "Cement", quantity: 350, unit: "Bags", minThreshold: 200, location: location + " Depot", reorderStatus: "Sufficient", unitCost: 430 }
      ],
      equipment: [
        { id: "EQP-C1", name: "JCB 3DX Backhoe Loader", regNo: "JK01-SITE-99", operator: "Site Operator", status: "Operational", site: location, fuelConsLtrHr: 8.5, health: "Good", nextServiceHrs: 80 }
      ]
    };

    ConstructData.setActiveContractor(customProfile);
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

    if (avatarEl) avatarEl.innerText = user.avatar || 'CO';
    if (nameEl) nameEl.innerText = user.name || 'Contractor Owner';
    if (companyEl) companyEl.innerText = user.company || 'Enterprise Name';

    const topbarProfileBtn = document.getElementById('topbar-contractor-profile');
    if (topbarProfileBtn) {
      topbarProfileBtn.innerHTML = `👤 ${user.name} (${user.class.split(' ')[0]}) ▼`;
    }
  }
};

window.ConstructAuth = ConstructAuth;
