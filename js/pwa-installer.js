/**
 * ConstructOS — Native PWA Installer & Store Download Controller
 */

const PWAInstaller = {
  deferredPrompt: null,

  init: function() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
  },

  registerServiceWorker: function() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('[ConstructOS PWA] ServiceWorker registered with scope:', reg.scope);
            reg.update();
          })
          .catch((err) => console.log('[ConstructOS PWA] ServiceWorker registration failed:', err));
      });
    }
  },

  setupInstallPrompt: function() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallUI('android');
    });

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && !isStandalone) {
      this.showInstallUI('ios');
    }
  },

  showInstallUI: function(platform) {
    const topbarInstallBtn = document.getElementById('pwa-install-topbar-btn');
    if (topbarInstallBtn) {
      topbarInstallBtn.style.display = 'inline-flex';
      if (platform === 'ios') {
        topbarInstallBtn.innerHTML = `📲 Download App (iOS)`;
      } else {
        topbarInstallBtn.innerHTML = `🤖 Download App (Play Store)`;
      }
    }

    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.style.display = 'flex';
      const textEl = document.getElementById('pwa-banner-text');
      const actionBtn = document.getElementById('pwa-banner-action-btn');

      if (platform === 'ios') {
        if (textEl) textEl.innerText = "Install ConstructOS App on your iPhone/iPad for 1-tap home screen access!";
        if (actionBtn) {
          actionBtn.innerText = "📲 Install on iOS";
          actionBtn.onclick = () => this.showIOSGuide();
        }
      } else {
        if (textEl) textEl.innerText = "Install ConstructOS App directly on your device from Play Store!";
        if (actionBtn) {
          actionBtn.innerText = "🤖 Download App (Play Store)";
          actionBtn.onclick = () => this.triggerNativeInstall();
        }
      }
    }
  },

  triggerNativeInstall: function() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
      this.showIOSGuide();
      return;
    }

    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[ConstructOS PWA] User accepted the install prompt');
          const banner = document.getElementById('pwa-install-banner');
          if (banner) banner.style.display = 'none';
        }
        this.deferredPrompt = null;
      });
    } else {
      alert("To install ConstructOS App:\n\n1. Tap your browser menu (⋮ or Share)\n2. Tap 'Install app' or 'Add to Home screen'");
    }
  },

  showIOSGuide: function() {
    if (window.ConstructApp) {
      window.ConstructApp.openModal(
        "📲 Install ConstructOS on iPhone / iPad",
        `
        <div style="text-align: center; padding: 10px;">
          <div class="brand-logo-circle" style="width: 56px; height: 56px; margin: 0 auto 14px;">
            <img src="assets/logo.jpg" alt="ConstructOS" class="brand-logo-img">
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px;">Add ConstructOS to Home Screen</h3>
          <p style="font-size: 12px; color: var(--text-dim); margin-bottom: 20px;">Follow these simple steps in Safari to download ConstructOS as a native iOS app:</p>

          <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; background: rgba(15,23,42,0.6); padding: 16px; border-radius: 12px; border: 1px solid var(--border-glass); margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 20px;">1️⃣</span>
              <span style="font-size: 13px; color: #fff;">Tap the <strong>Share</strong> button 📤 in your browser navigation bar.</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 20px;">2️⃣</span>
              <span style="font-size: 13px; color: #fff;">Scroll down and select <strong>'Add to Home Screen'</strong> ➕📱.</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 20px;">3️⃣</span>
              <span style="font-size: 13px; color: #fff;">Tap <strong>'Add'</strong> on the top right. Launch ConstructOS anytime from your home screen!</span>
            </div>
          </div>

          <button class="btn btn-primary" style="width: 100%; padding: 12px;" onclick="window.ConstructApp.closeModal()">Got It!</button>
        </div>
        `
      );
    }
  },

  hideBanner: function() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.style.display = 'none';
  }
};

window.PWAInstaller = PWAInstaller;
document.addEventListener('DOMContentLoaded', () => PWAInstaller.init());
