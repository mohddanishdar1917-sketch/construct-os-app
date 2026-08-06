/**
 * ConstructOS - Inventory & Heavy Machinery Fleet Module
 */

const InventoryModule = {
  render: function() {
    const data = ConstructData;
    const items = data.inventory;
    const machines = data.equipment;

    return `
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Raw Material Inventory & Heavy Fleet</h2>
          <p style="font-size: 13px; color: var(--text-dim);">Real-time cement, steel, bitumen & diesel stock monitoring plus equipment health</p>
        </div>

        <button class="btn btn-primary" onclick="window.ConstructApp.openAIDrawer('Check diesel and cement reorder requirements')">
          ⚡ AI Stock Optimizer
        </button>
      </div>

      <!-- Section 1: Raw Materials Stock -->
      <div class="glass-card" style="margin-bottom: 28px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Raw Material Stock Balances</h3>
          <span class="badge amber">2 Low Stock Alerts</span>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Material Name</th>
                <th>Category</th>
                <th>Available Stock</th>
                <th>Yard Location</th>
                <th>Reorder Status</th>
                <th>Unit Cost</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(m => `
                <tr>
                  <td style="font-weight: 700; color: var(--accent-cyan);">${m.id}</td>
                  <td style="font-weight: 500;">${m.name}</td>
                  <td><span class="badge cyan">${m.category}</span></td>
                  <td style="font-weight: 700; font-size: 14px;">${m.quantity} ${m.unit}</td>
                  <td>${m.location}</td>
                  <td>
                    <span class="badge ${m.reorderStatus === 'Sufficient' ? 'emerald' : 'amber'}">
                      ${m.reorderStatus}
                    </span>
                  </td>
                  <td>₹${m.unitCost.toLocaleString('en-IN')} / ${m.unit}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: Heavy Equipment & Machinery Fleet -->
      <div class="glass-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Heavy Equipment & Machinery Fleet</h3>
          <span class="badge cyan">4 Active Machines</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          ${machines.map(eq => `
            <div style="background: rgba(15,20,32,0.8); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); padding: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span class="badge cyan">${eq.id}</span>
                <span class="badge ${eq.health === 'Good' ? 'emerald' : 'rose'}">${eq.health}</span>
              </div>

              <h4 style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px;">${eq.name}</h4>
              <div style="font-size: 12px; color: var(--text-dim); margin-bottom: 12px;">Reg #${eq.regNo} • Operator: ${eq.operator}</div>

              <div style="font-size: 12px; background: rgba(22,28,46,0.6); padding: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 4px;">
                <div>📍 <strong>Deployed Site:</strong> ${eq.site}</div>
                <div>⛽ <strong>Fuel Cons:</strong> ${eq.fuelConsLtrHr} Ltr/Hr</div>
                <div>🔧 <strong>Service Due:</strong> ${eq.nextServiceHrs > 0 ? eq.nextServiceHrs + ' Engine Hrs' : 'OVERDUE NOW'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

window.InventoryModule = InventoryModule;
