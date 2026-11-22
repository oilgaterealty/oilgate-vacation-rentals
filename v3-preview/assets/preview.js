import {context, isUnsafe, localReply} from './conversation.mjs';
const iso = d => [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
const tomorrow = value => { const date = new Date(value + 'T12:00:00'); date.setDate(date.getDate()+1); return iso(date); };
const allowed = ['603326','603323','728474'];
const meta = fetch(new URL('./catalog.json',import.meta.url)).then(r=>r.ok?r.json():{}).catch(()=>({}));
for (const form of document.querySelectorAll('[data-book]')) {
  const input=form.elements.stay, arrival=form.elements.arrival, departure=form.elements.departure, guests=form.elements.guests;
  const today=iso(new Date());
  arrival.min=today; departure.min=tomorrow(today);
  const setDeparture=()=>{if(arrival.value) { departure.min=tomorrow(arrival.value); if(!departure.value||departure.value<departure.min)departure.value=departure.min; }};
  arrival.addEventListener('change',setDeparture);
  const shell=form.querySelector('.custom-picker');
  if (shell) {
    const button=shell.querySelector('button'), list=shell.querySelector('ul'), pic=form.querySelector('[data-selected-photo]');
    const source=[...input.options]; let active=0, current=0;
    const wanted=new URLSearchParams(location.search).get('stay');
    const setPhoto=i=>{pic.src=source[i].dataset.image;pic.alt=source[i].dataset.alt;};
    const setActive=i=>{
      active=(i+source.length)%source.length;
      list.setAttribute('aria-activedescendant','rental-option-'+active);
      [...list.children].forEach((x,j)=>x.dataset.active=String(j===active));
      setPhoto(active);
    };
    const select=i=>{
      current=i; input.value=source[i].value; button.textContent=source[i].textContent;
      button.setAttribute('aria-label','Choose your stay: '+source[i].textContent);
      [...list.children].forEach((x,j)=>x.setAttribute('aria-selected',String(j===i)));
      const old=Number(guests.value); guests.replaceChildren(...Array.from({length:Number(source[i].dataset.max)},(_,j)=>new Option(j+1,j+1)));
      guests.value=String(Math.min(old||1,guests.options.length));
      setPhoto(i);
    };
    const toggle=(open, refocus=false)=>{
      list.hidden=!open; button.setAttribute('aria-expanded',String(open));
      if(open){setActive(current);list.focus();}else{setPhoto(current);if(refocus)button.focus();}
    };
    source.forEach((x,i)=>{
      const opt=document.createElement('li'); opt.id='rental-option-'+i; opt.setAttribute('role','option');
      const thumbnail=document.createElement('img');thumbnail.src=x.dataset.image;thumbnail.alt='';thumbnail.width=72;thumbnail.height=45;
      opt.append(thumbnail,document.createTextNode(x.textContent));list.append(opt);
      opt.addEventListener('pointermove',()=>setActive(i));opt.addEventListener('click',()=>{select(i);toggle(false,true);});
    });
    const label=form.querySelector('label[for="stay"]');
    button.id='stay-picker-button';label.htmlFor=button.id;
    shell.hidden=false; input.hidden=true;select(Math.max(0,source.findIndex(s=>s.value===(wanted||input.dataset.default))));
    button.addEventListener('click',()=>toggle(list.hidden));
    button.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();toggle(true);}});
    list.addEventListener('keydown',e=>{
      if(['ArrowDown','ArrowUp','Home','End','Escape','Enter',' '].includes(e.key))e.preventDefault();
      if(e.key==='ArrowDown')setActive(active+1);
      if(e.key==='ArrowUp')setActive(active-1);
      if(e.key==='Home')setActive(0);
      if(e.key==='End')setActive(source.length-1);
      if(e.key==='Escape')toggle(false,true);
      if(['Enter',' '].includes(e.key)){select(active);toggle(false,true);}
    });
    document.addEventListener('pointerdown',e=>{if(!list.hidden&&!shell.contains(e.target))toggle(false);});
    shell.addEventListener('focusout',e=>{if(!list.hidden&&!shell.contains(e.relatedTarget))toggle(false);});
  }
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const status=form.querySelector('.book-status');
    if(!allowed.includes(input.value)||!arrival.value||arrival.value<today||!departure.value||departure.value<=arrival.value){
      status.textContent='Choose valid dates before proceeding.';return;
    }
    // The same provider checkout route used by the current site. No hold or purchase.
    const url=new URL('https://checkout.lodgify.com/en/ogr/'+input.value+'/reservation');
    url.search=new URLSearchParams({currency:'USD',adults:guests.value,arrival:arrival.value,departure:departure.value}).toString();
    location.assign(url.href);
  });
}
const compare=document.querySelector('[data-price]');
const priceSource=location.hostname==='oilgaterealty.github.io'
  ? 'https://raw.githubusercontent.com/oilgaterealty/oilgate-vacation-rentals/main/data/prices.json'
  : new URL('../../data/prices.json',import.meta.url);
if (compare) fetch(priceSource,{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(data=>{
  if(!data||!data.rentals)return;
  let latest=0;
  for(const cell of document.querySelectorAll('[data-price]')){
    const [r,c]=cell.dataset.price.split(':');const row=data.rentals[r]?.[c];
    const checked=Date.parse(row?.checkedAt);
    if(!Number.isFinite(checked)||Date.now()-checked>48*3600000||checked>Date.now()+10*60000||row.currency!=='USD'||!Number.isFinite(row.average)||row.nightly?.length!==7)continue;
    cell.textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(row.average);latest=Math.max(latest,checked);
  }
  if(latest)document.querySelector('#price-check').textContent='Checked '+new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeZone:'America/New_York'}).format(latest);
}).catch(()=>{});
const toggle=document.querySelector('.concierge-toggle'), panel=document.querySelector('.chat'), log=panel.querySelector('.chat-log'), chat=panel.querySelector('form'), field=chat.elements.message;
const key='ovr-v3-conversation';let history=[];
try {const stored=JSON.parse(sessionStorage.getItem(key)||'[]'); if(Array.isArray(stored))history=stored.filter(x=>x&&['user','assistant'].includes(x.role)&&typeof x.text==='string'&&x.text.length<1100&&!isUnsafe(x.text));} catch {}
const show=(role,text)=>{const p=document.createElement('p');p.className=role==='user'?'visitor':'';p.textContent=text;log.append(p);log.scrollTop=log.scrollHeight;};
show('assistant','Hi! Ask our concierge about an Akron rental.');
history.forEach(x=>show(x.role,x.text));
const open=value=>{toggle.setAttribute('aria-expanded',String(value));panel.hidden=!value;(value?field:toggle).focus();};
toggle.addEventListener('click',()=>open(true));panel.querySelector('[data-chat-close]').addEventListener('click',()=>open(false));
panel.addEventListener('keydown',e=>{if(e.key==='Escape')open(false);});
let busy=false;
chat.addEventListener('submit',async e=>{
 e.preventDefault();const message=field.value.trim();if(!message||busy)return;field.value='';
 if(isUnsafe(message)){show('assistant','Please don’t send personal or payment information here.');return;}
 busy=true;const submit=chat.querySelector('button');submit.disabled=true;
 const prev=history.slice(-10);
 const pid=context(message,history)||document.body.dataset.property||'';
 show('user',message);
 let answer;
 try {
   const conf=await fetch(new URL('./concierge-config.json',import.meta.url)).then(r=>r.ok?r.json():{});
   if(typeof conf.endpoint==='string'&&/^https:\/\/pepper-chat-preview\.[a-z0-9-]+\.workers\.dev\/chat$/.test(conf.endpoint)){
     let sid;
     try{sid=sessionStorage.getItem('ovr-v3-chat-id');if(!sid){sid=crypto.randomUUID();sessionStorage.setItem('ovr-v3-chat-id',sid);}}catch{sid=crypto.randomUUID();}
     const reply=await fetch(conf.endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({propertyId:pid||'603326',session:sid,message,history:prev}),signal:AbortSignal.timeout(4500)});
     if(reply.ok) {const v=(await reply.json()).reply;if(typeof v==='string'&&v.length<1100&&!isUnsafe(v))answer=v.replace(/Lodgify checkout/ig,'secure checkout').replace(/Lodgify/ig,'booking provider');}
   }
 }catch {}
 answer=answer||localReply(message,prev,await meta,pid);
 history.push({role:'user',text:message},{role:'assistant',text:answer});
 show('assistant',answer);
 try{sessionStorage.setItem(key,JSON.stringify(history));}catch{}
 submit.disabled=false;busy=false;
});
