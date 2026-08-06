/**
 * ConstructOS - Main Application Controller
 */

window.ConstructApp = {
  currentTab: 'dashboard',

  init: function() {
    ConstructAuth.init();
    this.bindEvents();
    this.renderCurrentTab();
  },

  bindEvents: function() {
    const aiInput = document.getElementById('ai-drawer-input');
    if (aiInput) {
      aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendAIMessage();
        }
      });
    }
  },

  switchTab: function(tabName) {
    if (!ConstructData.isLoggedIn) {
      ConstructAuth.showLandingGate();
      return;
    }

    this.currentTab = tabName;

    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const targetNav = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
    if (targetNav) targetNav.classList.add('active');

    this.renderCurrentTab();
  },

  refreshCurrentTab: function() {
    this.renderCurrentTab();
  },

  renderCurrentTab: function() {
    const container = document.getElementById('main-content');
    if (!container) return;

    if (!ConstructData.isLoggedIn) {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; gap: 16px;">
          <div style="font-size: 48px;">🔐</div>
          <h2 style="font-size: 22px; font-weight: 700; color: #fff;">Contractor Login Required</h2>
          <p style="font-size: 14px; color: var(--text-dim); max-width: 450px;">Please enter your company credentials or create a free demo account to access ConstructOS.</p>
          <button class="btn btn-primary" onclick="ConstructAuth.showLandingGate()">
            🚀 Open Contractor Login Portal
          </button>
        </div>
      `;
      return;
    }

    let html = '';
    switch (this.currentTab) {
      case 'dashboard':
        html = window.DashboardModule.render();
        break;
      case 'tenders':
        html = window.TendersModule.render();
        break;
      case 'boq':
        html = window.BOQModule.render();
        break;
      case 'projects':
        html = window.ProjectsModule.render();
        break;
      case 'finance':
        html = window.FinanceModule.render();
        break;
      case 'inventory':
        html = window.InventoryModule.render();
        break;
      case 'documents':
        html = window.DocumentsModule.render();
        break;
      case 'crm':
        html = window.CRMModule.render();
        break;
      default:
        html = window.DashboardModule.render();
    }

    container.innerHTML = `<div class="tab-content active">${html}</div>`;

    if (this.currentTab === 'dashboard' && window.DashboardModule.initCharts) {
      setTimeout(() => window.DashboardModule.initCharts(), 100);
    }
  },

  // Generic & Dynamic Modal Dialog Controllers
  openModal: function(title, bodyHtml) {
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const overlayEl = document.getElementById('modal-overlay');

    if (titleEl && bodyEl && overlayEl) {
      titleEl.innerText = title || 'ConstructOS Modal';
      bodyEl.innerHTML = bodyHtml || '';
      overlayEl.classList.add('active');
    }
  },

  closeModal: function() {
    const overlayEl = document.getElementById('modal-overlay');
    if (overlayEl) overlayEl.classList.remove('active');
  },

  openTenderModal: function(tenderId) {
    if (!ConstructData.isLoggedIn) {
      ConstructAuth.showLandingGate();
      return;
    }

    const tender = ConstructData.tenders.find(t => t.id === tenderId);
    if (!tender) return;

    const analysis = ConstructAI.analyzeTender(tenderId);

    const title = `AI Tender Analysis: ${tender.id}`;
    const bodyHtml = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; background: rgba(6,182,212,0.08); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--accent-cyan-glow);">
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: #fff;">${tender.title}</h3>
          <p style="font-size: 12px; color: var(--text-dim);">Department: ${tender.department} (${tender.district})</p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 20px; font-weight: 800; color: var(--accent-emerald);">${analysis.winProbability}</div>
          <span class="badge emerald">AI Estimated Win Probability</span>
        </div>
      </div>

      <h4 style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 10px;">📋 PDF Clause Extraction & Key Risks</h4>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        ${analysis.keyRisks.map(r => `
          <div style="padding: 10px; background: rgba(15,20,32,0.8); border-left: 3px solid var(--accent-amber); border-radius: 4px; font-size: 13px;">
            ⚠️ ${r}
          </div>
        `).join('')}
      </div>

      <h4 style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 10px;">✅ Eligibility Qualification Audit for ${ConstructData.user.name}</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px;">
        ${analysis.eligibilityChecklist.map(c => `
          <div style="padding: 10px; background: rgba(22,28,46,0.6); border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
            <span>${c.item}</span>
            <span class="badge ${c.status === 'PASS' ? 'emerald' : 'rose'}">${c.status}</span>
          </div>
        `).join('')}
      </div>

      <button class="btn btn-primary" style="width: 100%;" onclick="window.ConstructApp.closeModal(); window.ConstructApp.openAIDrawer('Draft bid submission proposal for ${tender.id}')">
        🚀 Draft Bid Submission Proposal with AI
      </button>
    `;

    this.openModal(title, bodyHtml);
  },

  // AI Copilot Drawer Controllers
  openAIDrawer: function(initialPrompt) {
    if (!ConstructData.isLoggedIn) {
      ConstructAuth.showLandingGate();
      return;
    }

    const drawer = document.getElementById('ai-drawer');
    if (drawer) {
      drawer.classList.add('active');
      if (initialPrompt) {
        this.addAIMessage('user', initialPrompt);
        setTimeout(() => {
          const response = ConstructAI.processQuery(initialPrompt);
          this.addAIMessage('bot', response);
        }, 400);
      }
    }
  },

  closeAIDrawer: function() {
    const drawer = document.getElementById('ai-drawer');
    if (drawer) drawer.classList.remove('active');
  },

  sendAIMessage: function() {
    if (!ConstructData.isLoggedIn) {
      ConstructAuth.showLandingGate();
      return;
    }

    const input = document.getElementById('ai-drawer-input');
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = '';

    this.addAIMessage('user', query);

    setTimeout(() => {
      const response = ConstructAI.processQuery(query);
      this.addAIMessage('bot', response);
    }, 400);
  },

  addAIMessage: function(sender, text) {
    const list = document.getElementById('ai-messages-list');
    if (!list) return;

    const div = document.createElement('div');
    div.className = `ai-msg ${sender}`;
    div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.ConstructApp.init();
});
