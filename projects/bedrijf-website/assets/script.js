/** NEXUS site scripts: reveal, tracking, intake + feedback */

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.setProperty('--i', i);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  io.observe(el);
});

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

const INTAKE_API_BASE = (window.NEXUS_INTAKE_API_BASE || '/api');

const showToast = (type, title, message) => {
  const host = document.getElementById('toastHost');
  if (!host) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<div class="toast-title">${title}</div><div class="toast-msg">${message}</div>`;
  host.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toast-out .2s ease forwards';
    setTimeout(() => el.remove(), 220);
  }, 4200);
};

const showConfirmationModal = () => {
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';
  overlay.innerHTML = `
    <div class="confirm-card" role="dialog" aria-modal="true" aria-label="Aanvraag ontvangen">
      <h3 class="confirm-title">Bedankt voor je aanvraag bij Nexus</h3>
      <p class="confirm-text">We gaan direct voor je aan de slag. Als we extra vragen hebben, nemen we contact op via het e-mailadres dat je hebt ingevuld.</p>
      <div class="confirm-actions">
        <button class="btn primary" type="button" id="confirmCloseBtn">Top, bedankt</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('#confirmCloseBtn')?.addEventListener('click', close);
};

const effortFromFrequency = (frequency = '') => {
  const f = frequency.toLowerCase();
  if (f.includes('dagelijks')) return 'L (3-7 dagen)';
  if (f.includes('wekelijks')) return 'M (1-3 dagen)';
  return 'S (4-8 uur)';
};

const urgencyFromTarget = (dateStr = '') => {
  if (!dateStr) return 'Midden (deze week)';
  const target = new Date(dateStr);
  const diff = (target - new Date()) / (1000 * 60 * 60 * 24);
  if (diff <= 7) return 'Hoog (zsm)';
  if (diff <= 21) return 'Midden (deze week)';
  return 'Laag (deze maand)';
};

const intakeForm = document.getElementById('intakeForm');
if (intakeForm) {
  track('intake_form_view');
  intakeForm.addEventListener('focusin', () => track('intake_form_start'), { once: true });

  intakeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(intakeForm);
    const data = Object.fromEntries(fd.entries());

    if (!intakeForm.checkValidity() || (data.problemDescription || '').trim().length < 50) {
      showToast('error', 'Hoe duidelijker je aanvraag, hoe sneller je oplossing', 'Vul alle verplichte velden in en beschrijf concreet je probleem, workflow en gewenste resultaat.');
      track('intake_form_error', { reason: 'validation' });
      return;
    }

    const traceId = `NX-${Date.now().toString(36).toUpperCase()}`;
    const taskId = `BUILD-${traceId}`;

    const revitVersions = (data.revitVersions || '').split(',').map(x => x.trim()).filter(Boolean);
    const primaryRevit = revitVersions[0] || '2025';
    const disciplines = fd.getAll('disciplines');

    const task = {
      taskId,
      traceId,
      createdAt: new Date().toISOString(),
      customer: {
        name: data.contactName,
        company: data.company,
        email: data.email,
        role: data.contactRole,
        companyType: data.companyType
      },
      intake: {
        addinType: 'Client Intake',
        revitVersion: primaryRevit,
        revitVersions,
        disciplines,
        problem: data.problemDescription,
        workflow: data.currentWorkflow,
        outcome: data.successCriteria,
        urgency: urgencyFromTarget(data.targetDate),
        budget: data.budget || 'geen',
        filesUrl: data.filesUrl || '',
        constraints: data.constraints || '',
        frequency: data.frequency || '',
        impactHours: data.impactHours || ''
      },
      triage: {
        scope: 'Nieuwe Revit add-in op basis van intake',
        effort: effortFromFrequency(data.frequency),
        risk: (data.constraints || '').trim() ? 'Randvoorwaarden aanwezig; extra validatie vereist.' : 'Laag-middel; standaard intake-build flow toepassen.',
        priority: urgencyFromTarget(data.targetDate).includes('Hoog') ? 'P1' : 'P2'
      },
      acceptanceCriteria: [
        `Build target: Revit ${primaryRevit}`,
        'UI target: WPF/XAML, huisstijl-conform (kleuren, rondingen, knoppen)',
        'Ribbon: eigen knop met bedrijfsnaam (fallback Tool)',
        'Artifacts: .dll + .addin geleverd',
        'Build: 0 errors / 0 warnings',
        `Functioneel: ${data.successCriteria || 'doel behalen volgens intake'}`
      ],
      handoff: 'Client intake track: eerst kwalificatie + Robin GO/NO-GO, daarna build.'
    };

    const submissions = JSON.parse(localStorage.getItem('nexus_intakes') || '[]');
    submissions.push(task);
    localStorage.setItem('nexus_intakes', JSON.stringify(submissions.slice(-100)));

    let apiOk = false;
    let apiError = '';

    try {
      const res = await fetch(`${INTAKE_API_BASE}/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok) {
        apiOk = true;
        showConfirmationModal();
      } else {
        apiError = out?.error || `HTTP ${res.status}`;
      }
    } catch (err) {
      apiError = err?.message || 'onbekende netwerkfout';
    }

    if (!apiOk) {
      const queue = JSON.parse(localStorage.getItem('nexus_build_queue') || '[]');
      queue.push(task);
      localStorage.setItem('nexus_build_queue', JSON.stringify(queue.slice(-100)));
      showToast('error', 'Aanvraag lokaal opgeslagen', `Verbinding met intake service mislukt (${apiError || 'onbekend'}).`);
    }

    track('intake_build_created', { traceId, taskId: task.taskId, effort: task.triage.effort, centralQueue: apiOk });
    intakeForm.reset();
  });
}

const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(feedbackForm).entries());
    if (!feedbackForm.checkValidity() || (data.description || '').trim().length < 20) {
      showToast('error', 'Controleer je feedback', 'Beschrijf je feedback in minimaal 20 tekens.');
      return;
    }
    try {
      const r = await fetch(`${INTAKE_API_BASE}/feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) {
        const out = await r.json().catch(() => ({}));
        throw new Error(out.error || `HTTP ${r.status}`);
      }
      showToast('success', 'Bedankt voor je feedback', 'We hebben je feedback ontvangen en nemen dit mee in de volgende iteratie.');
      feedbackForm.reset();
    } catch (err) {
      showToast('error', 'Feedback niet verstuurd', `Probeer het opnieuw (${err.message || 'onbekend'}).`);
    }
  });
}
