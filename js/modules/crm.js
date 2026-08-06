/**
 * ConstructOS - Contractor CRM & Contacts Module
 */

const CRMModule = {
  render: function() {
    const contacts = ConstructData.crmContacts;

    return `
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Contractor CRM & Directory</h2>
          <p style="font-size: 13px; color: var(--text-dim);">Centralized contact hub for Department Chief Engineers, XENs, Material Vendors & Subcontractors</p>
        </div>

        <button class="btn btn-primary" onclick="alert('⚡ Add new department/engineer contact modal')">
          👤 Add New Contact
        </button>
      </div>

      <div class="glass-card">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Contact Name</th>
                <th>Designation</th>
                <th>Department / Firm</th>
                <th>Phone Number</th>
                <th>Email Address</th>
                <th>History</th>
              </tr>
            </thead>
            <tbody>
              ${contacts.map(c => `
                <tr>
                  <td style="font-weight: 700; color: #fff;">${c.name}</td>
                  <td style="color: var(--accent-cyan); font-weight: 500;">${c.designation}</td>
                  <td>${c.dept}</td>
                  <td>${c.phone}</td>
                  <td style="color: var(--text-muted);">${c.email}</td>
                  <td>
                    <span class="badge emerald">
                      ${c.totalTendersAwarded ? c.totalTendersAwarded + ' Tenders Awarded' : 'Credit ₹' + (c.creditLimit / 100000).toFixed(1) + ' L'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};

window.CRMModule = CRMModule;
