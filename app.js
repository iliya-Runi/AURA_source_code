'use strict';
const services=[
{id:'face',name:'Уход за лицом',category:'face',categoryName:'Уход за лицом',price:3200,duration:60,image:'assets/face.jpg',description:'Деликатная процедура ухода и расслабления.'},
{id:'massage',name:'Массаж лица',category:'face',categoryName:'Уход за лицом',price:2800,duration:50,image:'assets/massage.jpg',description:'Расслабляющий массаж и атмосфера спокойствия.'},
{id:'nails',name:'Маникюр',category:'nails',categoryName:'Ногтевой сервис',price:1900,duration:90,image:'assets/nails.jpg',description:'Аккуратный маникюр в минималистичном стиле.'},
{id:'hair',name:'Укладка волос',category:'hair',categoryName:'Волосы',price:2500,duration:65,image:'assets/hair.jpg',description:'Укладка с учётом текстуры и длины волос.'},
{id:'brow',name:'Оформление бровей',category:'brow',categoryName:'Брови и ресницы',price:1400,duration:40,image:'assets/brow.jpg',description:'Подбор формы и бережное оформление бровей.'},
{id:'spa',name:'SPA-ритуал',category:'spa',categoryName:'SPA и уход',price:4500,duration:100,image:'assets/studio.jpg',description:'Комплексный ритуал для восстановления и отдыха.'}
];
const masters=[{id:'anna',name:'Анна · мастер ухода',categories:['face','spa']},{id:'elena',name:'Елена · стилист',categories:['hair','brow']},{id:'maria',name:'Мария · nail-мастер',categories:['nails']}];
const rub=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const q=(sel,ctx=document)=>ctx.querySelector(sel);
const qa=(sel,ctx=document)=>[...ctx.querySelectorAll(sel)];
const navButton=q('#burger');const nav=q('#mobileNav');
if(navButton&&nav){navButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');navButton.setAttribute('aria-expanded',String(open));});qa('a',nav).forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));}
function cardHTML(s){return `<article class="service-card fade-in"><img src="${s.image}" alt="Иллюстрация: ${s.name}" loading="lazy"><div class="service-card-body"><span class="service-type">${s.categoryName}</span><h3>${s.name}</h3><p>${s.description}</p><div class="service-card-foot"><div><strong>от ${rub(s.price)}</strong><br><span>${s.duration} мин · демо-цена</span></div><a class="text-link" href="booking.html?service=${encodeURIComponent(s.id)}">Выбрать →</a></div></div></article>`;}
if(q('#homeServices'))q('#homeServices').innerHTML=services.slice(0,3).map(cardHTML).join('');
const serviceGrid=q('#serviceGrid');if(serviceGrid){let active='all';const render=()=>{const arr=active==='all'?services:services.filter(s=>s.category===active);serviceGrid.innerHTML=arr.map(cardHTML).join('');};qa('[data-service-filter]').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.serviceFilter;qa('[data-service-filter]').forEach(x=>x.classList.toggle('active',x===b));render();}));render();}
const book=q('#bookingForm');
if(book){let service=null,master=null,day=null,time=null;const serviceSelect=q('#bookService'),masterSelect=q('#bookMaster'),days=q('#dayGrid'),times=q('#timeGrid');
serviceSelect.innerHTML='<option value="">Выберите процедуру</option>'+services.map(s=>`<option value="${s.id}">${s.name} · ${rub(s.price)}</option>`).join('');
const options=['10:00','11:30','13:00','14:30','16:00','17:30'];
const today=new Date();today.setHours(12,0,0,0);const weekdays=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
const dateString=d=>d.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});
for(let i=1;i<=21;i++){const d=new Date(today);d.setDate(today.getDate()+i);const iso=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');const btn=document.createElement('button');btn.type='button';btn.className='day-btn';btn.dataset.iso=iso;btn.innerHTML=`<small>${weekdays[d.getDay()]}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('ru-RU',{month:'short'}).replace('.','')}</small>`;btn.addEventListener('click',()=>{day={iso,label:dateString(d)};qa('.day-btn',days).forEach(x=>x.classList.toggle('active',x===btn));refresh();});days.append(btn);}
options.forEach(t=>{const btn=document.createElement('button');btn.type='button';btn.className='time-btn';btn.textContent=t;btn.addEventListener('click',()=>{time=t;qa('.time-btn',times).forEach(x=>x.classList.toggle('active',x===btn));refresh();});times.append(btn);});
function refresh(){q('#sumService').textContent=service?.name||'Не выбрана';q('#sumMaster').textContent=master?.name||'Не выбран';q('#sumDate').textContent=day?.label||'Не выбрана';q('#sumTime').textContent=time||'Не выбрано';q('#sumPrice').textContent=service?rub(service.price):'—';q('#bookNotice').classList.remove('visible');}
serviceSelect.addEventListener('change',()=>{service=services.find(s=>s.id===serviceSelect.value)||null;master=null;const allowed=service?masters.filter(m=>m.categories.includes(service.category)):[];masterSelect.innerHTML='<option value="">Выберите мастера</option>'+allowed.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');masterSelect.disabled=!service;refresh();});
masterSelect.addEventListener('change',()=>{master=masters.find(m=>m.id===masterSelect.value)||null;refresh();});
const param=new URLSearchParams(location.search).get('service');if(param&&services.some(s=>s.id===param)){serviceSelect.value=param;serviceSelect.dispatchEvent(new Event('change'));}
book.addEventListener('submit',e=>{e.preventDefault();const n=q('#bookNotice');if(!service||!master||!day||!time){n.textContent='Пожалуйста, выберите услугу, мастера, дату и время.';n.classList.add('visible');return;}const data={service:service.name,master:master.name,date:day.label,time,price:service.price};try{localStorage.setItem('aura_demo_last_booking',JSON.stringify(data));}catch{}n.innerHTML=`<strong>Демонстрационная запись создана!</strong><br>${service.name} · ${master.name}<br>${day.label} в ${time}.<br><br>Это учебный сайт: запись НЕ отправлена в салон, реального бронирования нет.`;n.classList.add('visible');n.scrollIntoView({behavior:'smooth',block:'nearest'});});refresh();}
const contactForm=q('#contactForm');if(contactForm){contactForm.addEventListener('submit',e=>{e.preventDefault();const note=q('#contactNote');note.textContent='Демо-форма: сообщение не отправлено. Сайт создан для портфолио.';note.classList.add('visible');contactForm.reset();});}
