/**
 * ConstructOS - Tender Intelligence & AI PDF Clause Extraction Module
 */

const TendersModule = {
  selectedDept: 'ALL',
  selectedDistrict: 'ALL',

  render: function() {
    const data = ConstructData;
    let tenders = data.tenders;

    if (this.selectedDept !== 'ALL') {
      tenders = tenders.filter(t => t.department.includes(this.selectedDept));
    }
    if (this.selectedDistrict !== 'ALL') {
      tenders = tenders.filter(t => t.district === this.selectedDistrict);
    }

    return `
      <!-- Header & Filter Bar -->
      <div class="filter-bar">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Tender Intelligence & AI Scanner</h2>
          <p style="font-size: 13px; color: var(--text-dim);">Live tender feed from JKTenders, CPWD, NHAI, LAHDC & PMGSY across Jammu, Kashmir & Ladakh</p>
        </div>

        <div class="filter-group">
          <select class="select-input" onchange="TendersModule.filterDept(this.value)">
            <option value="ALL">All Departments</option>
            <option value="PWD">PWD (R&B)</option>
            <option value="Smart City">Smart City Ltd</option>
            <option value="Health">Health & Medical</option>
            <option value="PMGSY">PMGSY Rural</option>
            <option value="NHAI">NHAI Highways</option>
            <option value="Jal Shakti">Jal Shakti / PHE</option>
            <option value="LAHDC">LAHDC Ladakh</option>
            <option value="Industries">Industries & Commerce</option>
          </select>

          <select class="select-input" onchange="TendersModule.filterDistrict(this.value)">
            <option value="ALL">All Districts (22 Districts - J&K & Ladakh)</option>
            ${data.districts.map(d => `<option value="${d}" ${this.selectedDistrict === d ? 'selected' : ''}>${d}</option>`).join('')}
          </select>

          <button class="btn btn-primary" onclick="window.ConstructApp.openAIDrawer('Find best matching tenders across Jammu, Kashmir & Ladakh')">
            🔍 AI Tender Matcher
          </button>
        </div>
      </div>

      <!-- Tender Grid Cards -->
      ${tenders.length === 0 ? `
        <div class="glass-card" style="text-align: center; padding: 40px;">
          <div style="font-size: 32px; margin-bottom: 8px;">📍</div>
          <h3 style="font-size: 16px; font-weight: 700; color: #fff;">No active tenders currently bidded in ${this.selectedDistrict}</h3>
          <p style="font-size: 12px; color: var(--text-dim); margin-top: 4px;">Try selecting "All Districts" or search with AI Assistant.</p>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px;">
          ${tenders.map(t => `
            <div class="glass-card interactive" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <span class="badge cyan">${t.id}</span>
                  <span class="badge emerald" style="font-size: 13px;">🎯 Win Probability ${t.aiWinProbability}</span>
                </div>

                <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px; line-height: 1.4;">${t.title}</h3>
                <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">🏛️ ${t.department} • 📍 ${t.district}</p>

                <!-- Stats Pill Matrix -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: rgba(15,20,32,0.7); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 16px;">
                  <div>
                    <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">Est. Contract Value</div>
                    <div style="font-size: 14px; font-weight: 700; color: #fff;">₹${(t.estValue / 100000).toFixed(2)} Lakhs</div>
                  </div>
                  <div>
                    <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">EMD Deposit</div>
                    <div style="font-size: 14px; font-weight: 700; color: var(--accent-amber);">₹${(t.emd / 100000).toFixed(2)} Lakhs</div>
                  </div>
                  <div>
                    <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">Time Allowed</div>
                    <div style="font-size: 13px; font-weight: 600; color: var(--text-main);">${t.completionDays} Days</div>
                  </div>
                  <div>
                    <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">Submission Due</div>
                    <div style="font-size: 13px; font-weight: 600; color: var(--accent-rose);">${t.bidSubmissionDeadline}</div>
                  </div>
                </div>

                <!-- AI Rationale bullet points -->
                <div style="font-size: 12px; color: var(--text-main); background: rgba(6,182,212,0.06); padding: 10px; border-left: 3px solid var(--accent-cyan); border-radius: 4px; margin-bottom: 16px;">
                  <strong>AI Match Insight:</strong> ${t.matchReasons[0]}
                </div>
              </div>

              <div style="display: flex; gap: 10px; margin-top: 12px;">
                <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.ConstructApp.openTenderModal('${t.id}')">
                  📄 Extract PDF Clauses & Risk
                </button>
                <button class="btn btn-secondary btn-sm" onclick="window.ConstructApp.openAIDrawer('Check if missing documents exist for ${t.id}')">
                  ❓ Ask AI
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  },

  filterDept: function(val) {
    this.selectedDept = val;
    window.ConstructApp.refreshCurrentTab();
  },

  filterDistrict: function(val) {
    this.selectedDistrict = val;
    window.ConstructApp.refreshCurrentTab();
  }
};

window.TendersModule = TendersModule;
