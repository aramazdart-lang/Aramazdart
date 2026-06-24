const prices={A5:{10:{normal:3000,watercolor:3300},20:{normal:4000,watercolor:4500}},A4:{10:{normal:4000,watercolor:4500},20:{normal:5500,watercolor:6300}}};
let size='A5', count=10, paper='normal', uploaded=0;
function fmt(n){return n.toLocaleString('hy-AM')+' դր․'}
function refresh(){document.querySelectorAll('.card').forEach(c=>c.classList.remove('active'));document.querySelectorAll('.card input:checked').forEach(i=>i.closest('.card').classList.add('active'))}
function setSize(v){size=v;refresh();updateTotal()}
function setCount(v){count=v;refresh();updateTotal()}
function setPaper(v){paper=v;refresh();updateTotal()}
function updateTotal(){document.getElementById('sumSize').textContent=size;document.getElementById('sumCount').textContent=count+' նկար';document.getElementById('sumPaper').textContent=paper==='normal'?'Սովորական':'Ջրաներկի / գուաշի';document.getElementById('total').textContent=fmt(prices[size][count][paper]);document.getElementById('limitText').textContent='Պետք է կցել նվազագույնը '+count+' նկար'}
function handlePhotos(e){const files=[...e.target.files];uploaded=files.length;document.getElementById('photoStatus').textContent='Կցված է '+uploaded+' նկար';const t=document.getElementById('thumbs');t.innerHTML='';files.slice(0,12).forEach(f=>{const img=document.createElement('img');img.src=URL.createObjectURL(f);t.appendChild(img)})}
function submitOrder(){if(uploaded<count){alert('Խնդրում ենք կցել նվազագույնը '+count+' նկար։');return}alert('Demo պատվերը պատրաստ է։ Հաջորդ փուլում կկապենք backend-ին։')}
refresh();updateTotal();
