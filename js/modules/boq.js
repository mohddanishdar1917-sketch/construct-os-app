/**
 * ConstructOS - BOQ AI Analyzer & Cost Estimator Module
 */

const BOQModule = {
  currentBOQ: [
    { code: "BOQ-01", item: "Earthwork excavation in all soils including loading and hauling", qty: 45000, unit: "Cum", estRate: 340, total: 15300000 },
    { code: "BOQ-02", item: "Wet Mix Macadam (WMM) base course with sub-base grading", qty: 18000, unit: "Cum", estRate: 1450, total: 26100000 },
    { code: "BOQ-03", item: "Providing and laying Bituminous Concrete (BC) 50mm thick", qty: 9500, unit: "Cum", estRate: 7500, total: 71250000 },
    { code: "BOQ-04", item: "Fe-550D TMT Reinforcement Steel cutting, bending & placing", qty: 320, unit: "Tons", estRate: 68000, total: 21760000 }
  ],

  render: function() {
    const analysis = ConstructAI.analyzeBOQ(this.currentBOQ);

    return `
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff;">BOQ AI Analyzer & Cost Estimator</h2>
          <p style="font-size: 13px; color: var(--text-dim);">Upload Bill of Quantities (Excel/PDF) for AI profit predictions & material forecasting</p>
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="btn btn-secondary" onclick="BOQModule.triggerFileUpload()">
            📤 Upload New BOQ File
          </button>
          <button class="btn btn-primary" onclick="window.ConstructApp.openAIDrawer('Optimize profit margin for current BOQ')">
            ⚡ AI Profit Optimization
          </button>
        </div>
      </div>

      <!-- Analysis Top Cards -->
      <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr);">
        <div class="glass-card kpi-card cyan">
          <span class="kpi-title">Total BOQ Value</span>
          <div class="kpi-value">₹${(analysis.totalBoqValue / 100000).toFixed(2)} L</div>
          <span style="font-size: 11px; color: var(--text-dim);">4 Estimated BOQ Line Items</span>
        </div>

        <div class="glass-card kpi-card emerald">
          <span class="kpi-title">Predicted Cost & Margin</span>
          <div class="kpi-value">₹${(analysis.expectedProfit / 100000).toFixed(2)} L</div>
          <span class="badge emerald">Profit Margin ${analysis.profitMargin}</span>
        </div>

        <div class="glass-card kpi-card amber">
          <span class="kpi-title">Est. Steel & Cement</span>
          <div class="kpi-value">${analysis.materialEstimate.steelTons} T / ${analysis.materialEstimate.cementBags} B</div>
          <span style="font-size: 11px; color: var(--text-dim);">TMT Rebar / OPC Bags</span>
        </div>

        <div class="glass-card kpi-card purple">
          <span class="kpi-title">Est. Diesel Fuel</span>
          <div class="kpi-value">${analysis.materialEstimate.dieselLiters.toLocaleString()} L</div>
          <span style="font-size: 11px; color: var(--text-dim);">For Excavator, Paver & Roller</span>
        </div>
      </div>

      <!-- Main BOQ Table & AI Risk Panel -->
      <div class="dashboard-grid" style="grid-template-columns: 2fr 1fr;">
        <!-- BOQ Item breakdown -->
        <div class="glass-card">
          <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 12px;">BOQ Line Item Breakdown</h3>

          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description of Item</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Estimated Rate</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                ${this.currentBOQ.map(item => `
                  <tr>
                    <td style="font-weight: 700; color: var(--accent-cyan);">${item.code}</td>
                    <td style="font-weight: 500;">${item.item}</td>
                    <td style="font-weight: 700;">${item.qty.toLocaleString()}</td>
                    <td>${item.unit}</td>
                    <td>₹${item.estRate.toLocaleString()}</td>
                    <td style="font-weight: 700; color: var(--accent-emerald);">₹${(item.total).toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- AI Risk Detector -->
        <div class="glass-card" style="border-color: rgba(245,158,11,0.3);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <h3 style="font-size: 15px; font-weight: 700; color: #fff;">⚠️ AI BOQ Risk Detector</h3>
            <span class="badge amber">3 Risk Flags</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${analysis.risks.map(r => `
              <div style="padding: 12px; border-radius: var(--radius-sm); background: rgba(15,20,32,0.8); border-left: 3px solid ${r.level === 'HIGH' ? 'var(--accent-rose)' : r.level === 'MEDIUM' ? 'var(--accent-amber)' : 'var(--accent-cyan)'}; font-size: 12px;">
                <div style="font-weight: 700; color: ${r.level === 'HIGH' ? 'var(--accent-rose)' : r.level === 'MEDIUM' ? 'var(--accent-amber)' : 'var(--accent-cyan)'}; margin-bottom: 2px;">
                  [${r.level} RISK]
                </div>
                <div style="color: var(--text-main);">${r.text}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  triggerFileUpload: function() {
    alert("⚡ AI File Scanner: In production, upload your PDF/Excel BOQ file to extract rates & quantities automatically.");
  }
};

window.BOQModule = BOQModule;
