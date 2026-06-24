let planName='Անհատական գիրք + NFC';
let planPrice=17000;
let currentMode='custom';
let heroes=0;
let pages=0;
let uploadedCount=0;

const SUPABASE_URL = 'https://xxbvitnrnloscrrmlaui.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4_qeOASRgzI1mEpEioICow_hHSB5HPi';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function format(n){return n.toLocaleString('hy-AM')+' դր․'}

function updateTotal(){
  const heroPrice = heroes * 2000;
  const pagePrice = pages * 2500;
  const total = planPrice + heroPrice + pagePrice;

  document.getElementById('planName').textContent = planName;
  document.getElementById('planPrice').textContent = format(planPrice);
  document.getElementById('heroPrice').textContent = format(heroPrice);
  document.getElementById('pagePrice').textContent = format(pagePrice);
  document.getElementById('totalPrice').textContent = format(total);
}

function setMode(mode){
  currentMode = mode;

  document.getElementById('templates')?.classList.toggle('hidden', mode !== 'ready');
  document.getElementById('customOnlyFields')?.classList.toggle('hidden', mode === 'ready');
  document.getElementById('readyOnlyInfo')?.classList.toggle('hidden', mode !== 'ready');
  document.getElementById('readyBlock')?.classList.toggle('hidden', mode !== 'ready');
  document.getElementById('customQuestions')?.classList.toggle('hidden', mode !== 'custom');

  if(mode === 'ready'){
    heroes = 0;
    pages = 0;
    document.getElementById('heroCount').textContent = '0';
    document.getElementById('pageCount').textContent = '0';
  }

  updateTotal();
}

function selectPlan(name, price, mode='custom', btn){
  planName = name;
  planPrice = price;
  setMode(mode);

  document.querySelectorAll('.plan-card').forEach(card => card.classList.remove('selected-plan'));
  btn?.closest('.plan-card')?.classList.add('selected-plan');

  const target = mode === 'ready'
    ? document.getElementById('templates')
    : document.getElementById('order');

  target?.scrollIntoView({behavior:'smooth', block:'start'});
}

function selectTemplate(name, el){
  const selected = document.getElementById('selectedTemplate');
  if(selected) selected.textContent = name;

  document.querySelectorAll('.template-card').forEach(card => card.classList.remove('selected'));
  el?.closest('.template-card')?.classList.add('selected');

  document.getElementById('order')?.scrollIntoView({behavior:'smooth', block:'start'});
}

function changeHero(delta){
  if(currentMode === 'ready') return;
  heroes = Math.max(0, heroes + delta);
  document.getElementById('heroCount').textContent = heroes;
  updateTotal();
}

function changePage(delta){
  if(currentMode === 'ready') return;
  pages = Math.max(0, pages + delta);
  document.getElementById('pageCount').textContent = pages;
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

async function fakeSubmit(){
  const selectedStory = document.getElementById('selectedTemplate')?.textContent || '';

  if(currentMode === 'ready' && (!selectedStory || selectedStory === 'Դեռ ընտրված չէ')){
    alert('Խնդրում ենք ընտրել պատրաստի հեքիաթի տարբերակը։');
    return;
  }

  if(currentMode === 'custom' && uploadedCount < 10){
    alert('Խնդրում ենք կցել նվազագույնը 10 նկար։');
    return;
  }

  const childName = document.querySelector('input[placeholder="օր․ Էվա"]')?.value || '';
  const phone = document.querySelector('input[placeholder="+374"]')?.value || '';
  const age = document.querySelector('input[placeholder="օր․ 5"]')?.value || '';
  const gender = document.querySelector('.grid-2 select')?.value || '';
  const notes = document.querySelector('textarea')?.value || '';

  if(!phone){
    alert('Խնդրում ենք լրացնել հեռախոսահամարը։');
    return;
  }

  const total =
    planPrice + heroes * 2000 + pages * 2500;

  const btn = document.querySelector('.submit-btn');
  btn.disabled = true;
  btn.textContent = 'Ուղարկվում է...';

  const { error } = await supabaseClient
    .from('orders')
    .insert([{
      product: planName,
      status: 'Նոր պատվեր',
      customer_name: childName || 'Չնշված',
      phone: phone,
      price: total,
      details: {
        type: currentMode,
        selected_story: selectedStory,
        child_name: childName,
        age: age,
        gender: gender,
        uploaded_count: uploadedCount,
        extra_heroes: heroes,
        extra_pages: pages,
        notes: notes
      }
    }]);

  if(error){
    alert('Սխալ եղավ։ ' + error.message);
    btn.disabled = false;
    btn.textContent = 'Ուղարկել պատվերը';
    return;
  }

  alert('Պատվերը հաջողությամբ գրանցվեց ✅');

  btn.disabled = false;
  btn.textContent = 'Ուղարկել պատվերը';
}

document.addEventListener('DOMContentLoaded', () => {
  setMode('custom');
  updateTotal();
});
