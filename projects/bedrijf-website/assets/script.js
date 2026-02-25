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

const form=document.getElementById('intakeForm');
if(form){
  track('intake_form_view');
  form.addEventListener('focusin',()=>track('intake_form_start'),{once:true});

  const buildTrelloText=(data,traceId)=>{
    return [
      `# Intake ${traceId}`,
      `Naam: ${data.name || '-'}`,
      `Bedrijf/team: ${data.company || '-'}`,
      `E-mail: ${data.email || '-'}`,
      `Urgentie: ${data.urgency || '-'}`,
      `Budget: ${data.budget || '-'}`,
      '',
      '## Probleem',
      data.problem || '-',
      '',
      '## Gewenste uitkomst',
      data.outcome || '-',
      '',
      `Trace ID: ${traceId}`,
      `Ingestuurd: ${new Date().toISOString()}`
    ].join('\n');
  };

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const feedback=document.getElementById('formFeedback');
    const fd=new FormData(form);
    const data=Object.fromEntries(fd.entries());

    if(!form.checkValidity() || (data.problem||'').trim().length<20){
      feedback.textContent='Controleer je invoer: alle velden zijn verplicht en beschrijf het probleem in minimaal 20 tekens.';
      feedback.className='form-feedback err';
      track('intake_form_error',{reason:'validation'});
      return;
    }

    const traceId=`NX-${Date.now().toString(36).toUpperCase()}`;
    const trelloText=buildTrelloText(data,traceId);
    const submissions=JSON.parse(localStorage.getItem('nexus_intakes')||'[]');
    submissions.push({traceId,createdAt:new Date().toISOString(),trelloText,...data});
    localStorage.setItem('nexus_intakes',JSON.stringify(submissions.slice(-50)));

    feedback.textContent=`Intake ontvangen. Referentie: ${traceId}. We komen binnen 1 werkdag bij je terug.`;
    feedback.className='form-feedback ok';
    track('intake_form_submit',{traceId,urgency:data.urgency,budget:data.budget});
    form.reset();

    const payload=document.getElementById('trelloPayload');
    if(payload){
      payload.hidden=false;
      payload.textContent=trelloText;
    }
  });

  const btnExport=document.getElementById('btnTrelloExport');
  if(btnExport){
    btnExport.addEventListener('click',()=>{
      const fd=new FormData(form);
      const data=Object.fromEntries(fd.entries());
      const traceId=`NX-DRAFT-${Date.now().toString(36).toUpperCase()}`;
      const text=buildTrelloText(data,traceId);
      const payload=document.getElementById('trelloPayload');
      if(payload){
        payload.hidden=false;
        payload.textContent=text;
      }
      navigator.clipboard?.writeText(text).catch(()=>{});
      track('intake_trello_export',{traceId});
    });
  }
}
