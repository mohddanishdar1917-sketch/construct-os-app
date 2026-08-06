/**
 * ConstructOS - Project Management & Gantt Chart Module
 */

const ProjectsModule = {
  render: function() {
    const data = ConstructData;
    const projects = data.projects;

    return `
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Project Management & Gantt Timelines</h2>
          <p style="font-size: 13px; color: var(--text-dim);">Real-time site progress, labor attendance & milestone tracking</p>
        </div>

        <button class="btn btn-primary" onclick="window.ConstructApp.openAIDrawer('Check delay risk for projects')">
          ⚡ AI Schedule Optimizer
        </button>
      </div>

      <!-- Projects Grid & Gantt Bars -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${projects.map(p => `
          <div class="glass-card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
              <div>
                <span class="badge cyan" style="margin-right: 8px;">${p.id}</span>
                <h3 style="display: inline; font-size: 17px; font-weight: 700; color: #fff;">${p.name}</h3>
                <span style="font-size: 12px; color: var(--text-dim); margin-left: 10px;">📍 ${p.location} (${p.client})</span>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="badge ${p.health.includes('Delay') ? 'amber' : 'emerald'}">${p.health}</span>
                <span style="font-size: 14px; font-weight: 700; color: var(--accent-cyan);">${p.progressPercent}% Completed</span>
              </div>
            </div>

            <!-- Visual Progress Bar -->
            <div class="gantt-bar-bg" style="height: 12px; margin-bottom: 20px;">
              <div class="gantt-bar-fill" style="width: ${p.progressPercent}%;"></div>
            </div>

            <!-- Stats & Site Info Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; background: rgba(15,20,32,0.6); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 20px;">
              <div>
                <div style="font-size: 11px; color: var(--text-dim);">Contract Value</div>
                <div style="font-size: 15px; font-weight: 700; color: #fff;">₹${(p.contractValue / 100000).toFixed(2)} Lakhs</div>
              </div>
              <div>
                <div style="font-size: 11px; color: var(--text-dim);">Billed to Date (RA)</div>
                <div style="font-size: 15px; font-weight: 700; color: var(--accent-emerald);">₹${(p.billedToDate / 100000).toFixed(2)} Lakhs</div>
              </div>
              <div>
                <div style="font-size: 11px; color: var(--text-dim);">Pending Treasury RA</div>
                <div style="font-size: 15px; font-weight: 700; color: var(--accent-amber);">₹${(p.pendingRA / 100000).toFixed(2)} Lakhs</div>
              </div>
              <div>
                <div style="font-size: 11px; color: var(--text-dim);">Site Workforce</div>
                <div style="font-size: 14px; font-weight: 600; color: var(--text-main);">👷 ${p.laborersOnSite} Workers • 👷‍♂️ ${p.engineersOnSite} Engineers</div>
              </div>
            </div>

            <!-- Milestones Stepper -->
            <h4 style="font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase;">Milestone Timeline</h4>
            <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;">
              ${p.milestones.map(m => `
                <div style="min-width: 200px; padding: 10px 14px; background: rgba(22,28,46,0.8); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); border-left: 3px solid ${m.status === 'Completed' ? 'var(--accent-emerald)' : m.status === 'In Progress' ? 'var(--accent-cyan)' : 'var(--text-dim)'};">
                  <div style="font-size: 12px; font-weight: 600; color: #fff;">${m.name}</div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                    <span style="font-size: 10px; color: var(--text-dim);">${m.date}</span>
                    <span class="badge ${m.status === 'Completed' ? 'emerald' : m.status === 'In Progress' ? 'cyan' : 'purple'}" style="font-size: 10px; padding: 1px 6px;">${m.status}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};

window.ProjectsModule = ProjectsModule;
