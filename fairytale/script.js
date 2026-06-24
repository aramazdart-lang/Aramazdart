
let planName='Անհատական գիրք + NFC';
let planPrice=17000;
let currentMode='custom';
let heroes=0;
let pages=0;
let uploadedCount=0;

function format(n){return n.toLocaleString('hy-AM')+' դր․'}

function updateTotal(){
  const heroPrice = heroes * 2000;
  const pagePrice = pages * 2500;
  const total = planPrice + heroPrice + pagePrice;

  const planNameEl = document.getElementById('planName');
  const planPriceEl = document.getElementById('planPrice');
  const heroPriceEl = document.getElementById('heroPrice');
  const pagePriceEl = document.getElementById('pagePrice');
  const totalPriceEl = document.getElementById('totalPrice');

  if(planNameEl) planNameEl.textContent = planName;
  if(planPriceEl) planPriceEl.textContent = format(planPrice);
  if(heroPriceEl) heroPriceEl.textContent = format(heroPrice);
  if(pagePriceEl) pagePriceEl.textContent = format(pagePrice);
  if(totalPriceEl) totalPriceEl.textContent = format(total);
}

function setMode(mode){
  currentMode = mode;

  const templates = document.getElementById('templates');
  const customOnly = document.getElementById('customOnlyFields');
  const readyInfo = document.getElementById('readyOnlyInfo');
  const readyBlock = document.getElementById('readyBlock');
  const selectedLine = document.getElementById('selectedTemplateLine');
  const customQuestions = document.getElementById('customQuestions');

  if(templates) templates.classList.toggle('hidden', mode !== 'ready');
  if(customOnly) customOnly.classList.toggle('hidden', mode === 'ready');
  if(readyInfo) readyInfo.classList.toggle('hidden', mode !== 'ready');
  if(readyBlock) readyBlock.classList.toggle('hidden', mode !== 'ready');
  if(selectedLine) selectedLine.classList.toggle('hidden', mode !== 'ready');
  if(customQuestions) customQuestions.classList.toggle('hidden', mode !== 'custom');

  if(mode === 'ready'){
    heroes = 0;
    pages = 0;
    const hc = document.getElementById('heroCount');
    const pc = document.getElementById('pageCount');
    if(hc) hc.textContent = '0';
    if(pc) pc.textContent = '0';
  }
  updateTotal();
}

function selectPlan(name, price, mode='custom', btn){
  planName = name;
  planPrice = price;
  setMode(mode);

  document.querySelectorAll('.plan-card').forEach(card => card.classList.remove('selected-plan'));
  const card = btn ? btn.closest('.plan-card') : null;
  if(card) card.classList.add('selected-plan');

  if(mode === 'ready'){
    const templates = document.getElementById('templates');
    if(templates) templates.scrollIntoView({behavior:'smooth', block:'start'});
  }else{
    const order = document.getElementById('order');
    if(order) order.scrollIntoView({behavior:'smooth', block:'start'});
  }
}

function selectTemplate(name, el){
  const selected = document.getElementById('selectedTemplate');
  const line = document.getElementById('selectedTemplateLine');

  if(selected) selected.textContent = name;
  if(line) line.classList.remove('hidden');

  document.querySelectorAll('.template-card').forEach(card => card.classList.remove('selected'));
  const card = el ? el.closest('.template-card') : null;
  if(card) card.classList.add('selected');

  const order = document.getElementById('order');
  if(order) order.scrollIntoView({behavior:'smooth', block:'start'});
}

function changeHero(delta){
  if(currentMode === 'ready') return;
  heroes = Math.max(0, heroes + delta);
  const el = document.getElementById('heroCount');
  if(el) el.textContent = heroes;
  updateTotal();
}

function changePage(delta){
  if(currentMode === 'ready') return;
  pages = Math.max(0, pages + delta);
  const el = document.getElementById('pageCount');
  if(el) el.textContent = pages;
  updateTotal();
}

function handleFiles(event){
  const files = Array.from(event.target.files || []);
  uploadedCount = files.length;

  const uploadStatus = document.getElementById('uploadStatus');
  if(uploadStatus) uploadStatus.textContent = `Կցված է ${uploadedCount} նկար / նվազագույնը 10`;

  const thumbs = document.getElementById('thumbs');
  if(thumbs){
    thumbs.innerHTML = '';
    files.slice(0,12).forEach(file => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      thumbs.appendChild(img);
    });
  }
}

function fakeSubmit(){
  if(currentMode === 'ready'){
    const selected = document.getElementById('selectedTemplate');
    if(selected && selected.textContent.trim() === 'չի ընտրված'){
      alert('Խնդրում ենք ընտրել պատրաստի հեքիաթի տարբերակը։');
      return;
    }
  }
  if(currentMode === 'custom' && uploadedCount < 10){
    alert('Խնդրում ենք կցել նվազագույնը 10 նկար։');
    return;
  }
  alert('Պատվերի demo ձևը պատրաստ է։ Հաջորդ փուլում սա կկապենք իրական backend-ին։');
}

document.addEventListener('DOMContentLoaded', () => {
  setMode('custom');
  updateTotal();
});
