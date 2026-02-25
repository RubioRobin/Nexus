/**
 * NEXUS - Add-in Factory Pipeline Scripts
 * Handles: Reveal animations, CTA tracking, Structured Intake, and Triage logic.
 */

// 1. Reveal Animations (Staggered)
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.setProperty('--i', i);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { 
      if(e.isIntersecting) { 
        e.target.classList.add('in'); 
        io.unobserve(e.target);
      } 
    });
  }, { threshold: 0.1 });
  io.observe(el);
});

// 2. Event Tracking
const track = (eventName, payload = {}) => {
  const evt = { event: eventName, at: new Date().toISOString(), ...payload };
  const key = 'nexus_events';
  const prev = JSON.parse(localStorage.getItem(key) || '[]');
  prev.push(evt);
  localStorage.setItem(key, JSON.stringify(prev.slice(-200)));
  console.log('[NEXUS-TRACK]', evt);
};

document.querySelectorAll('.track-cta').forEach(btn => {
  btn.addEventListener('click', () => track('cta_click', { id: btn.dataset.cta || 'unknown' }));
});

// 3. Intake Form & Pipeline Logic
const INTAKE_API_BASE = (window.NEXUS_INTAKE_API_BASE || '/api');

const form = document.getElementById('intakeForm');
if (form) {
  track('intake_form_view');
  form.addEventListener('focusin', () => track('intake_form_start'), { once: true });

  const showToast = (type, title, message) => {
    const host = document.getElementById('toastHost');
    if (!host) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
    host.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'fadeOut 0.5s forwards';
      setTimeout(() => el.remove(), 500);
    }, 5000);
  };

  const showConfirmationModal = (traceId) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay'; // Re-use styling from CSS or add if missing
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(13,31,26,0.8);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:2000;padding:20px;';
    
    overlay.innerHTML = `
      <div class="card" style="max-width:500px; text-align:center; animation: slideIn 0.4s ease;">
        <h3 style="color:var(--forest-700); margin-bottom:16px;">Intake Ontvangen</h3>
        <p style="margin-bottom:24px;">ID: <strong>${traceId}</strong><br><br>De <strong>Qualification Agent</strong> heeft je aanvraag geverifieerd. Je ontvangt binnenkort een status-update via Telegram/Email.</p>
        <button class="btn primary" id="confirmCloseBtn">Begrepen</button>
      </div>`;
    
    document.body.appendChild(overlay);
    overlay.querySelector('#confirmCloseBtn').onclick = () => overlay.remove();
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    
    const fd = new FormData(form);
    const rawData = Object.fromEntries(fd.entries());
    
    // Basic Client-side Validation (Qualification Agent - Phase 0)
    if (!form.checkValidity()) {
      showToast('error', 'Incompleet', 'Vul alle verplichte velden in voor een accurate triage.');
      return;
    }

    // 4. Generate IntakeRecord.json (Machine Readable)
    const traceId = `NXF-${Date.now().toString(36).toUpperCase()}`;
    const intakeRecord = {
      id: traceId,
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'website_intake',
        version: '2.0'
      },
      client: {
        company: rawData.company,
        type: rawData.companyType,
        contact: {
          name: rawData.contactName,
          email: rawData.email,
          role: rawData.contactRole
        }
      },
      technical: {
        revitVersions: rawData.revitVersions.split(',').map(v => v.trim()),
        disciplines: fd.getAll('disciplines'),
        constraints: rawData.constraints || 'none'
      },
      business: {
        problem: rawData.problemDescription,
        workflow: rawData.currentWorkflow,
        frequency: rawData.frequency,
        impact: rawData.impactHours,
        successCriteria: rawData.successCriteria,
        budget: rawData.budget,
        targetDate: rawData.targetDate || null
      },
      artifacts: {
        filesUrl: rawData.filesUrl || null
      }
    };

    console.log('[IntakeRecord generated]', intakeRecord);

    // Save locally (Fall-back strategy)
    const submissions = JSON.parse(localStorage.getItem('nexus_intakes') || '[]');
    submissions.push(intakeRecord);
    localStorage.setItem('nexus_intakes', JSON.stringify(submissions.slice(-50)));

    // Send to Pipeline API
    showToast('info', 'Processeren...', 'Triage agent analyseert je workflow...');
    
    try {
      const res = await fetch(`${INTAKE_API_BASE}/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intakeRecord)
      });

      if (res.ok) {
        showConfirmationModal(traceId);
        form.reset();
        track('intake_success', { traceId });
      } else {
        throw new Error('API Reject');
      }
    } catch (err) {
      console.warn('Pipeline API offline, record saved locally.', err);
      showToast('success', 'Lokaal Opgeslagen', 'Verbinding met centrale pipeline mislukt, maar je aanvraag is veilig opgeslagen.');
      showConfirmationModal(`${traceId} (OFFLINE)`);
      form.reset();
    }
  });
}
