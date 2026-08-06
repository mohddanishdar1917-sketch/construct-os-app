/**
 * ConstructOS - Executive Dashboard Module
 */

const DashboardModule = {
  render: function() {
    const data = ConstructData;
    const m = data.metrics;

    return `
      <!-- Executive Top Stats -->
      <div class="kpi-grid">
        <div class="glass-card kpi-card emerald interactive">
          <div class="kpi-header">
            <span class="kpi-title">Revenue This Month</span>
            <div class="kpi-icon">💰</div>
          </div>
          <div class="kpi-value">₹${(m.monthlyRevenue).toLocaleString('en-IN')}</div>
          <div class="kpi-footer">
            <span class="trend-badge up">↑ 14.2%</span> vs last month
          </div>
        </div>

        <div class="glass-card kpi-card emerald interactive">
          <div class="kpi-header">
            <span class="kpi-title">Gross Profit</span>
            <div class="kpi-icon">📈</div>
          </div>
          <div class="kpi-value">₹${(m.monthlyProfit).toLocaleString('en-IN')}</div>
          <div class="kpi-footer">
            <span class="trend-badge up">28.4%</span> net margin
          </div>
        </div>

        <div class="glass-card kpi-card amber interactive">
          <div class="kpi-header">
            <span class="kpi-title">Pending RA Bills</span>
            <div class="kpi-icon">⏳</div>
          </div>
          <div class="kpi-value">₹${(m.pendingBills).toLocaleString('en-IN')}</div>
          <div class="kpi-footer">
            <span>3 Invoices in Treasury Clearance</span>
          </div>
        </div>

        <div class="glass-card kpi-card purple interactive">
          <div class="kpi-header">
            <span class="kpi-title">Active Projects</span>
            <div class="kpi-icon">🏗️</div>
          </div>
          <div class="kpi-value">${m.activeProjectsCount}</div>
          <div class="kpi-footer">
            <span class="badge cyan">100% On Schedule</span>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Left: Revenue & Project Progress Chart -->
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Financial Performance & Cashflow</h3>
              <p style="font-size: 12px; color: var(--text-dim);">Monthly Revenue, Expenses & Gross Profit Trajectory (FY 2025-26)</p>
            </div>
            <div style="display: flex; gap: 8px;">
              <span class="badge cyan">Live Stream</span>
            </div>
          </div>

          <!-- Canvas for Chart.js -->
          <div class="chart-container">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>

        <!-- Right: Expiry Alerts & AI Assistant Prompt Card -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Compliance & License Expiry Alerts -->
          <div class="glass-card">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <h3 style="font-size: 15px; font-weight: 700; color: #fff;">Document Expiry Alerts</h3>
              <span class="badge rose">${m.documentExpiryAlerts.length} Action Needed</span>
            </div>

            <div class="alerts-list">
              ${m.documentExpiryAlerts.map(alert => `
                <div class="alert-item ${alert.type}">
                  <div>
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-sub">Cert #${alert.certNo}</div>
                  </div>
                  <span class="badge ${alert.type === 'danger' ? 'rose' : alert.type === 'warning' ? 'amber' : 'cyan'}">
                    ${alert.daysLeft} Days Left
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- AI Assistant Quick Launch Card -->
          <div class="glass-card" style="background: linear-gradient(135deg, rgba(6,182,212,0.12), rgba(99,102,241,0.12)); border-color: rgba(6,182,212,0.4);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--accent-cyan); display: flex; align-items: center; justify-content: center; font-size: 18px;">🤖</div>
              <div>
                <h4 style="font-size: 15px; font-weight: 700; color: #fff;">ConstructOS AI Copilot</h4>
                <p style="font-size: 11px; color: var(--text-muted);">"What would you like to do today Danish?"</p>
              </div>
            </div>
            <p style="font-size: 12px; color: var(--text-main); margin-bottom: 14px;">
              Ask AI to analyze new tenders, draft RA bills, calculate BOQ profits, or check material stock.
            </p>
            <button class="btn btn-primary" style="width: 100%;" onclick="window.ConstructApp.openAIDrawer('Find best tenders for me')">
              ⚡ Open AI Assistant
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Table: Top Matching Tenders -->
      <div class="glass-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: #fff;">AI Tender Intelligence Summary</h3>
            <p style="font-size: 12px; color: var(--text-dim);">Top recommended tenders based on company turnover & technical license</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.ConstructApp.switchTab('tenders')">View All Tenders (${data.tenders.length}) →</button>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tender ID</th>
                <th>Work Description</th>
                <th>Department</th>
                <th>Est. Value</th>
                <th>AI Match</th>
                <th>Win Prob</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${data.tenders.slice(0, 3).map(t => `
                <tr>
                  <td style="font-weight: 700; color: var(--accent-cyan);">${t.id}</td>
                  <td style="max-width: 320px; font-weight: 500;">${t.title}</td>
                  <td>${t.department}</td>
                  <td style="font-weight: 700;">₹${(t.estValue / 100000).toFixed(2)} Lakhs</td>
                  <td><span class="badge cyan">${t.aiMatchScore}% Match</span></td>
                  <td><span class="badge emerald" style="font-size: 12px;">${t.aiWinProbability}</span></td>
                  <td>
                    <button class="btn btn-primary btn-sm" onclick="window.ConstructApp.openTenderModal('${t.id}')">
                      Inspect AI PDF
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  initCharts: function() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    if (window.myRevenueChart) {
      window.myRevenueChart.destroy();
    }

    window.myRevenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug (Est)', 'Sep (Proj)'],
        datasets: [
          {
            label: 'Revenue (₹ Lakhs)',
            data: [22.5, 28.0, 31.2, 34.5, 38.0, 42.5],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Gross Profit (₹ Lakhs)',
            data: [6.1, 7.8, 8.9, 9.8, 11.2, 12.8],
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Outfit' } } }
        },
        scales: {
          x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
};

window.DashboardModule = DashboardModule;
