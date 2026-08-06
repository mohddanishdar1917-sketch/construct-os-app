/**
 * ConstructOS - Executive Dashboard Module
 */

const DashboardModule = {
  render: function() {
    const data = ConstructData;
    const m = data.metrics;
    const user = data.user || {};
    const historicalTenders = data.historicalTenders || [];

    return `
      <!-- GST & Firm Registration Verification Banner -->
      <div class="glass-card" style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(6,182,212,0.1), rgba(15,23,42,0.9)); border-color: rgba(6,182,212,0.4);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(6,182,212,0.15); border: 1.5px solid var(--accent-cyan); display: flex; align-items: center; justify-content: center; font-size: 22px;">🏛️</div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h2 style="font-size: 18px; font-weight: 800; color: #fff;">${user.company || 'Enterprise Firm'}</h2>
                <span class="badge emerald" style="font-size: 11px;">✓ GSTIN VERIFIED ACTIVE</span>
              </div>
              <p style="font-size: 12px; color: var(--text-dim); margin-top: 2px;">
                GSTIN: <strong style="color: var(--accent-cyan);">${user.gstin || '01AAACA1234B1Z5'}</strong> • Owner: <strong style="color: #fff;">${user.name}</strong> • Base: <strong>${user.location}</strong> • Reg Date: <strong>${user.regDate || '2018-04-16'}</strong>
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm" onclick="window.ConstructApp.openAIDrawer('Analyze my GST historical tender track record')">
              📑 AI Track Record Report
            </button>
            <button class="btn btn-primary btn-sm" onclick="ConstructAuth.logoutContractor()">
              🔄 Switch Account
            </button>
          </div>
        </div>
      </div>

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
            <span>Treasury Clearance Active</span>
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
                <p style="font-size: 11px; color: var(--text-muted);">"What would you like to analyze today ${user.name}?"</p>
              </div>
            </div>
            <button class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="window.ConstructApp.openAIDrawer('Draft bid submission proposal for TND-2026-8891')">
              ⚡ Draft Tender Bid Proposal with AI
            </button>
          </div>
        </div>
      </div>

      <!-- HISTORICAL TENDERS & COMPLETED CONTRACTS SINCE REGISTRATION -->
      <div class="glass-card" style="margin-top: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: #fff;">📜 Historical Completed Contracts & Tender Execution Track Record</h3>
            <p style="font-size: 12px; color: var(--text-dim);">Verified e-Procurement records completed by ${user.company} since registration (${user.regDate || '2018-04-16'})</p>
          </div>
          <span class="badge cyan">${historicalTenders.length} Verified Certificates</span>
        </div>

        <div style="overflow-x: auto;">
          <table class="data-table" style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: rgba(15,23,42,0.8); text-align: left; color: var(--text-dim);">
                <th style="padding: 10px;">Tender ID</th>
                <th style="padding: 10px;">Project Title</th>
                <th style="padding: 10px;">Department</th>
                <th style="padding: 10px;">Contract Value</th>
                <th style="padding: 10px;">Completion Date</th>
                <th style="padding: 10px;">Rating & Status</th>
              </tr>
            </thead>
            <tbody>
              ${historicalTenders.length === 0 ? `
                <tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--text-dim);">No historical tenders recorded for demo account. Login with GSTIN to view.</td></tr>
              ` : historicalTenders.map(t => `
                <tr style="border-bottom: 1px solid var(--border-subtle);">
                  <td style="padding: 12px;"><span class="badge cyan">${t.tenderId}</span></td>
                  <td style="padding: 12px; font-weight: 600; color: #fff;">${t.title}</td>
                  <td style="padding: 12px; color: var(--text-muted);">${t.department}</td>
                  <td style="padding: 12px; font-weight: 700; color: var(--accent-emerald);">₹${(t.contractValue/100000).toFixed(2)} Lakhs</td>
                  <td style="padding: 12px; color: var(--text-main);">${t.completionDate}</td>
                  <td style="padding: 12px;"><span class="badge emerald">${t.qualityRating || 'COMPLETED'}</span></td>
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

    const data = ConstructData;
    const monthlyRevLakhs = (data.metrics.monthlyRevenue / 100000);

    window.myRevenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Revenue (₹ Lakhs)',
            data: [
              Math.round(monthlyRevLakhs * 0.65),
              Math.round(monthlyRevLakhs * 0.72),
              Math.round(monthlyRevLakhs * 0.81),
              Math.round(monthlyRevLakhs * 0.90),
              Math.round(monthlyRevLakhs * 1.00),
              Math.round(monthlyRevLakhs * 1.08),
              Math.round(monthlyRevLakhs * 1.15),
              Math.round(monthlyRevLakhs * 1.20),
              Math.round(monthlyRevLakhs * 1.28),
              Math.round(monthlyRevLakhs * 1.35),
              Math.round(monthlyRevLakhs * 1.40),
              Math.round(monthlyRevLakhs * 1.48)
            ],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 3,
            pointBackgroundColor: '#06b6d4'
          },
          {
            label: 'Gross Profit (₹ Lakhs)',
            data: [
              Math.round(monthlyRevLakhs * 0.65 * 0.28),
              Math.round(monthlyRevLakhs * 0.72 * 0.28),
              Math.round(monthlyRevLakhs * 0.81 * 0.28),
              Math.round(monthlyRevLakhs * 0.90 * 0.28),
              Math.round(monthlyRevLakhs * 1.00 * 0.28),
              Math.round(monthlyRevLakhs * 1.08 * 0.28),
              Math.round(monthlyRevLakhs * 1.15 * 0.28),
              Math.round(monthlyRevLakhs * 1.20 * 0.28),
              Math.round(monthlyRevLakhs * 1.28 * 0.28),
              Math.round(monthlyRevLakhs * 1.35 * 0.28),
              Math.round(monthlyRevLakhs * 1.40 * 0.28),
              Math.round(monthlyRevLakhs * 1.48 * 0.28)
            ],
            borderColor: '#10b981',
            borderDash: [5, 5],
            tension: 0.4,
            borderWidth: 2,
            pointBackgroundColor: '#10b981'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 } }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }
};

window.DashboardModule = DashboardModule;
