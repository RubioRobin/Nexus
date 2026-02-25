document.querySelectorAll('.reveal').forEach(el=>{
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.15});
  io.observe(el);
});

const track=(eventName,payload={})=>{
  const evt={event:eventName,at:new Date().toISOString(),...payload};
  const key='nexus_events';
  const prev=JSON.parse(localStorage.getItem(key)||'[]');
  prev.push(evt);
  localStorage.setItem(key,JSON.stringify(prev.slice(-200)));
  console.log('[track]',evt);
};

document.querySelectorAll('.track-cta').forEach(btn=>{
  btn.addEventListener('click',()=>track('cta_click',{id:btn.dataset.cta||'unknown'}));
});

const INTAKE_API_BASE=(window.NEXUS_INTAKE_API_BASE||'http://localhost:8787');

const form=document.getElementById('intakeForm');
if(form){
  track('intake_form_view');
  form.addEventListener('focusin',()=>track('intake_form_start'),{once:true});

  const estimateEffort=(data)=>{
    const txt=`${data.problem||''} ${data.outcome||''}`.toLowerCase();
    let score=1;
    if((data.filesUrl||'').trim()) score+=1;
    if((data.urgency||'').includes('Hoog')) score+=1;
    if(txt.includes('excel')||txt.includes('ifc')||txt.includes('export')) score+=1;
    if(txt.includes('api')||txt.includes('sync')||txt.includes('koppeling')) score+=2;

    if(score<=2) return 'S (4-8 uur)';
    if(score<=4) return 'M (1-3 dagen)';
    return 'L (3-7 dagen)';
  };

  const buildAcceptance=(data)=>[
    `Build target: Revit ${data.revitVersion}`,
    'UI target: WPF/XAML, huisstijl-conform (kleuren, rondingen, knoppen)',
    'Ribbon: eigen knop (32x32 icoon indien beschikbaar)',
    'Artifacts: .dll + .addin geleverd',
    'Build: 0 errors / 0 warnings',
    `Functioneel: ${data.outcome || 'doel behalen volgens intake'}`
  ];

  const buildRisk=(data)=>{
    if(!(data.filesUrl||'').trim()) return 'Inputbestanden ontbreken; risico op extra afstemming.';
    if((data.urgency||'').includes('Hoog')) return 'Hoge urgentie; scope strikt afbakenen voor snelle oplevering.';
    return 'Laag-middel; standaard intake-build flow toepassen.';
  };

  const buildTask=(data,traceId)=>{
    const effort=estimateEffort(data);
    const acceptance=buildAcceptance(data);
    const risk=buildRisk(data);

    const task={
      taskId:`BUILD-${traceId}`,
      traceId,
      createdAt:new Date().toISOString(),
      customer:{name:data.name,company:data.company,email:data.email},
      intake:{
        addinType:data.addinType,
        revitVersion:data.revitVersion,
        problem:data.problem,
        outcome:data.outcome,
        urgency:data.urgency,
        budget:data.budget,
        filesUrl:data.filesUrl || ''
      },
      triage:{
        scope:'Nieuwe Revit add-in op basis van intake',
        effort,
        risk,
        priority:data.urgency?.includes('Hoog')?'P1':'P2'
      },
      acceptanceCriteria:acceptance,
      handoff:'Codeur start direct met WPF/XAML implementatie volgens huisstijlhandboek.'
    };

    const text=[
      `# Build Task ${task.taskId}`,
      `Trace ID: ${traceId}`,
      `Klant: ${data.name} (${data.company})`,
      `Contact: ${data.email}`,
      '',
      '## Intake',
      `Type add-in: ${data.addinType}`,
      `Revit versie: ${data.revitVersion}`,
      `Urgentie: ${data.urgency}`,
      `Budget: ${data.budget}`,
      `Bestanden: ${data.filesUrl || '-'}`,
      '',
      '## Probleem',
      data.problem || '-',
      '',
      '## Gewenste uitkomst',
      data.outcome || '-',
      '',
      '## Triage',
      `Effort: ${effort}`,
      `Risico: ${risk}`,
      '',
      '## Acceptance criteria',
      ...acceptance.map((a,i)=>`${i+1}. ${a}`),
      '',
      `Handoff: ${task.handoff}`
    ].join('\n');

    return {task,text};
  };

  const renderPayload=(text)=>{
    const payload=document.getElementById('intakePayload');
    if(payload){
      payload.hidden=false;
      payload.textContent=text;
    }
  };

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const feedback=document.getElementById('formFeedback');
    const fd=new FormData(form);
    const data=Object.fromEntries(fd.entries());

    if(!form.checkValidity() || (data.problem||'').trim().length<20){
      feedback.textContent='Controleer je invoer: alle verplichte velden invullen en probleem minimaal 20 tekens.';
      feedback.className='form-feedback err';
      track('intake_form_error',{reason:'validation'});
      return;
    }

    const traceId=`NX-${Date.now().toString(36).toUpperCase()}`;
    const {task,text}=buildTask(data,traceId);

    const submissions=JSON.parse(localStorage.getItem('nexus_intakes')||'[]');
    submissions.push(task);
    localStorage.setItem('nexus_intakes',JSON.stringify(submissions.slice(-100)));

    let apiOk=false;
    try{
      const res=await fetch(`${INTAKE_API_BASE}/api/intake`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(task)
      });
      if(res.ok){
        const out=await res.json();
        apiOk=true;
        feedback.textContent=`Intake verwerkt. Build-opdracht ${task.taskId} staat in centrale queue (${out.assignedTo}).`;
      }
    }catch(_err){
      // fallback below
    }

    if(!apiOk){
      const queue=JSON.parse(localStorage.getItem('nexus_build_queue')||'[]');
      queue.push(task);
      localStorage.setItem('nexus_build_queue',JSON.stringify(queue.slice(-100)));
      feedback.textContent=`Intake verwerkt. Build-opdracht ${task.taskId} lokaal in wachtrij gezet (backend niet bereikbaar).`;
    }

    feedback.className='form-feedback ok';
    renderPayload(text);
    navigator.clipboard?.writeText(text).catch(()=>{});
    track('intake_build_created',{traceId,taskId:task.taskId,effort:task.triage.effort,centralQueue:apiOk});

    form.reset();
  });

  const btnExport=document.getElementById('btnBuildExport');
  if(btnExport){
    btnExport.addEventListener('click',()=>{
      const fd=new FormData(form);
      const data=Object.fromEntries(fd.entries());
      const traceId=`NX-DRAFT-${Date.now().toString(36).toUpperCase()}`;
      const {text}=buildTask(data,traceId);
      renderPayload(text);
      navigator.clipboard?.writeText(text).catch(()=>{});
      track('intake_build_export',{traceId});
    });
  }
}
