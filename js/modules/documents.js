/**
 * ConstructOS - AI Document Generator Module
 */

const DocumentsModule = {
  activeTemplate: 'RA_BILL',

  render: function() {
    return `
      <!-- Header -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #fff;">AI Document & Legal Generator</h2>
        <p style="font-size: 13px; color: var(--text-dim);">One-click generation of Indian Construction Agreements, Form 26 RA Bills, Quotations, and Work Orders</p>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: 1fr 2fr;">
        <!-- Left Template Selector -->
        <div class="glass-card">
          <h3 style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 16px;">Select Document Type</h3>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button class="btn ${this.activeTemplate === 'RA_BILL' ? 'btn-primary' : 'btn-secondary'}" style="justify-content: flex-start;" onclick="DocumentsModule.selectTemplate('RA_BILL')">
              📑 Form 26 RA Bill Invoice
            </button>
            <button class="btn ${this.activeTemplate === 'QUOTATION' ? 'btn-primary' : 'btn-secondary'}" style="justify-content: flex-start;" onclick="DocumentsModule.selectTemplate('QUOTATION')">
              📄 Commercial Tender Quotation
            </button>
            <button class="btn ${this.activeTemplate === 'WORK_ORDER' ? 'btn-primary' : 'btn-secondary'}" style="justify-content: flex-start;" onclick="DocumentsModule.selectTemplate('WORK_ORDER')">
              📜 Subcontractor Work Order
            </button>
          </div>
        </div>

        <!-- Right Document Preview Pane -->
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Generated Preview</h3>
            <button class="btn btn-primary btn-sm" onclick="DocumentsModule.copyText()">
              📋 Copy Document Text
            </button>
          </div>

          <div id="doc-preview-area" style="background: #0b0f19; padding: 20px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); font-family: var(--font-mono); font-size: 12px; color: #a5f3fc; white-space: pre-wrap; max-height: 480px; overflow-y: auto;">
            ${ConstructAI.generateDocument(this.activeTemplate, {
              billNo: 'RA-04',
              projectName: 'NH-44 Bypass Extension & Paving',
              amount: 4300000,
              clientName: 'Executive Engineer, PWD R&B Circle II'
            })}
          </div>
        </div>
      </div>
    `;
  },

  selectTemplate: function(tpl) {
    this.activeTemplate = tpl;
    window.ConstructApp.refreshCurrentTab();
  },

  copyText: function() {
    const text = document.getElementById('doc-preview-area').innerText;
    navigator.clipboard.writeText(text);
    alert("✅ Document text copied to clipboard!");
  }
};

window.DocumentsModule = DocumentsModule;
