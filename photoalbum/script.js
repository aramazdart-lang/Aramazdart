const basePrices={
 "15x21":{"20-40":7500,"40-70":11500,"60-100":15500,"80-150":20500,"100-250":23500},
 "18x25":{"20-40":11000,"40-70":16000,"60-100":21000,"80-150":33000,"100-250":37000},
 "21x30":{"20-40":16000,"40-70":21000,"60-100":26000,"80-150":33000,"100-250":37000}
};

const pageMap={
 "20-40":"մոտ 15–25 էջ",
 "40-70":"մոտ 30–40 էջ",
 "60-100":"մոտ 45–55 էջ",
 "80-150":"մոտ 65–85 էջ",
 "100-250":"մոտ 85–115 էջ"
};

let cover="hard";
let size="18x25";
let range="20-40";
let paper="normal";
let uploaded=0;
let currentTotal=11000;

const SUPABASE_URL = 'https://xxbvitnrnloscrrmlaui.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4_qeOASRgzI1mEpEioICow_hHSB5HPi';

const supabaseClient =
window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

function fmt(n){
  return n.toLocaleString("hy-AM")+" դր․";
}

function refreshActive(){
  document
  .querySelectorAll(".card")
  .forEach(c=>c.classList.remove("active"));

  document
  .querySelectorAll(".card input:checked")
  .forEach(i=>i.closest(".card").classList.add("active"));
}

function setCover(v){
  cover=v;
  if(size==="10x15") cover="spring";
  refreshActive();
  updateTotal();
}

function setSize(v){
  size=v;
  if(size==="10x15") cover="spring";
  refreshActive();
  updateTotal();
}

function setRange(v){
  range=v;
  refreshActive();
  updateTotal();
}

function setPaper(v){
  paper=v;
  refreshActive();
  updateTotal();
}

function updateTotal(){
  let total=0;

  let coverName={
    hard:"Կոշտ կազմ",
    soft:"Փափուկ կազմ",
    spring:"Պրուժինով"
  }[cover];

  let nfc =
  (cover==="hard" && size!=="10x15")
  ? "ներառված"
  : "չկա";

  if(size==="10x15"){
    const count =
    parseInt(
      document.getElementById("smallCount")?.value || "0",
      10
    );

    total =
    count * (paper==="normal" ? 130 : 170);

    coverName="Պրուժինով";

    document.getElementById("normalAlbum")?.classList.add("hidden");
    document.getElementById("smallAlbum")?.classList.remove("hidden");
    document.getElementById("nfcBox")?.classList.add("hidden");

    document.getElementById("sumRange").textContent =
    count+" նկար";

    document.getElementById("sumPages").textContent =
    "10×15";

    document.getElementById("limitText").textContent =
    "Կցեք այնքան նկար, որքան նշել եք հաշվարկի մեջ։";

  } else {
    document.getElementById("normalAlbum")?.classList.remove("hidden");
    document.getElementById("smallAlbum")?.classList.add("hidden");
    document.getElementById("nfcBox")?.classList.toggle("hidden",cover!=="hard");

    total = basePrices[size][range];

    if(cover==="soft") total -= 3500;
    if(cover==="spring") total -= 2000;

    document.getElementById("sumRange").textContent =
    range.replace("-","–")+" նկար";

    document.getElementById("sumPages").textContent =
    pageMap[range];

    document.getElementById("limitText").textContent =
    `Այս փաթեթի համար՝ ${range.replace("-","–")} նկար • ${pageMap[range]}`;
  }

  currentTotal = Math.max(total,0);

  document.getElementById("sumCover").textContent = coverName;
  document.getElementById("sumSize").textContent = size.replace("x","×")+" սմ";
  document.getElementById("sumNfc").textContent = nfc;
  document.getElementById("total").textContent = fmt(currentTotal);
}

function handlePhotos(e){
  const files=[...e.target.files];

  uploaded=files.length;

  document.getElementById("photoStatus").textContent =
  `Կցված է ${uploaded} նկար`;

  const t=document.getElementById("thumbs");
  t.innerHTML="";

  files.slice(0,12).forEach(f=>{
    const img=document.createElement("img");
    img.src=URL.createObjectURL(f);
    t.appendChild(img);
  });
}

async function submitOrder(){
  if(uploaded<20){
    alert("Խնդրում ենք կցել նվազագույնը 20 նկար։");
    return;
  }

  const customerName =
  prompt("Ձեր անունը");

  if(!customerName) return;

  const phone =
  prompt("Հեռախոսահամար");

  if(!phone) return;

  const btn =
  document.querySelector(".summary button") ||
  document.querySelector("button[onclick='submitOrder()']");

  if(btn){
    btn.disabled=true;
    btn.textContent="Ուղարկվում է...";
  }

  const coverName={
    hard:"Կոշտ կազմ",
    soft:"Փափուկ կազմ",
    spring:"Պրուժինով"
  }[cover];

  const { error } =
  await supabaseClient
  .from("orders")
  .insert([{
    product:"Ֆոտոալբոմ",
    status:"Նոր պատվեր",
    customer_name:customerName,
    phone:phone,
    price:currentTotal,
    details:{
      product_type:"photoalbum",
      cover:coverName,
      size:size.replace("x","×")+" սմ",
      range:range.replace("-","–")+" նկար",
      pages:size==="10x15" ? "10×15" : pageMap[range],
      paper:paper==="normal" ? "Սովորական ֆոտոթուղթ" : "Սատին",
      uploaded_count:uploaded,
      nfc:(cover==="hard" && size!=="10x15")
    }
  }]);

  if(error){
    alert("Սխալ եղավ։ " + error.message);

    if(btn){
      btn.disabled=false;
      btn.textContent="Ուղարկել պատվերը";
    }

    return;
  }

  alert("Ֆոտոալբոմի պատվերը հաջողությամբ գրանցվեց ✅");

  if(btn){
    btn.disabled=false;
    btn.textContent="Ուղարկել պատվերը";
  }
}

refreshActive();
updateTotal();
