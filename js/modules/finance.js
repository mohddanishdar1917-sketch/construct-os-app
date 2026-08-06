/**
 * ConstructOS - Financials, Invoicing & GST Compliance Module
 */

const FinanceModule = {
  render: function() {
    const data = ConstructData;
    const invoices = data.invoices;

    let totalBilled = 0;
    let totalPending = 0;
    invoices.forEach(inv => {
      totalBilled += inv.totalAmount;
      if (inv.status.includes('Pending') || inv.status.includes('Overdue') || inv.status.includes('Awaiting')) {
        totalPending += inv.totalAmount;
      }
    });

    return `
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Finance, RA Bills & GST Compliance</h2>
          <p style="font-size: 13px; color: var(--text-dim);">Running Account Form 26 Bills, GST tax invoices, IT-TDS tracking & Treasury clearance</p>
        </div>

        <button class="btn btn-primary" onclick="window.ConstructApp.switchTab('documents')">
          ➕ Generate New RA Bill (Form 26)
        </button>
      </div>

      <!-- Top Financial Stats -->
      <div class="kpi-grid">
        <div class="glass-card kpi-card emerald">
          <span class="kpi-title">Total Active Invoiced</span>
          <div class="kpi-value">₹${(totalBilled / 100000).toFixed(2)} Lakhs</div>
          <span style="font-size: 11px; color: var(--text-dim);">Across 3 RA Bills</span>
        </div>

        <div class="glass-card kpi-card amber">
          <span class="kpi-title">Pending Treasury Clearance</span>
          <div class="kpi-value">₹${(totalPending / 100000).toFixed(2)} Lakhs</div>
          <span class="badge amber">3 Accounts Awaiting Token</span>
        </div>

        <div class="glass-card kpi-card cyan">
          <span class="kpi-title">GST Tax Liability (18%)</span>
          <div class="kpi-value">₹${((totalBilled * 0.18) / 100000).toFixed(2)} Lakhs</div>
          <span style="font-size: 11px; color: var(--text-dim);">Input Tax Credit Auto-deducted</span>
        </div>

        <div class="glass-card kpi-card purple">
          <span class="kpi-title">TDS Withheld (2% IT + 2% GST)</span>
          <div class="kpi-value">₹${((totalBilled * 0.04) / 100000).toFixed(2)} Lakhs</div>
          <span style="font-size: 11px; color: var(--text-dim);">Form 16A Credit Available</span>
        </div>
      </div>

      <!-- Invoices Table -->
      <div class="glass-card">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">Running Account (RA) Bills & GST Tax Invoices</h3>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice / Bill No</th>
                <th>Project Name</th>
                <th>Department / Client</th>
                <th>Taxable Amount</th>
                <th>GST @ 18%</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map(inv => `
                <tr>
                  <td style="font-weight: 700; color: var(--accent-cyan);">${inv.id}<br><span style="font-size: 11px; color: var(--text-dim);">${inv.raBillNo}</span></td>
                  <td style="font-weight: 500;">${inv.project}</td>
                  <td>${inv.client}</td>
                  <td>₹${inv.taxableAmount.toLocaleString('en-IN')}</td>
                  <td style="color: var(--accent-amber);">₹${inv.gstAmount.toLocaleString('en-IN')}</td>
                  <td style="font-weight: 700; color: var(--accent-emerald);">₹${inv.totalAmount.toLocaleString('en-IN')}</td>
                  <td>
                    <span class="badge ${inv.status.includes('Approved') ? 'emerald' : inv.status.includes('Overdue') ? 'rose' : 'amber'}">
                      ${inv.status}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="FinanceModule.viewInvoiceDetails('${inv.id}')">
                      👁️ View PDF
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

  viewInvoiceDetails: function(invId) {
    const inv = ConstructData.invoices.find(i => i.id === invId);
    if (!inv) return;

    const doc = ConstructAI.generateDocument('RA_BILL', {
      billNo: inv.raBillNo,
      projectName: inv.project,
      amount: inv.taxableAmount
    });

    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalOverlay = document.getElementById('modal-overlay');

    if (modalTitle && modalBody && modalOverlay) {
      modalTitle.innerText = "RA Bill Invoice Document - " + inv.id;
      modalBody.innerHTML = `<pre style="font-family: var(--font-mono); font-size: 12px; color: #a5f3fc; background: #0b0f19; padding: 20px; border-radius: 8px; overflow-x: auto;">${doc}</pre>`;
      modalOverlay.classList.add('active');
    }
  }
};

window.FinanceModule = FinanceModule;
