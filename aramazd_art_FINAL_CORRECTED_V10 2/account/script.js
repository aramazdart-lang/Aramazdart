const buttons = document.querySelectorAll(".menu button");
const pages = document.querySelectorAll(".page");
const title = document.getElementById("pageTitle");

const titles = {
  dashboard: "Dashboard",
  orders: "Իմ պատվերները",
  library: "Թվային գրադարան",
  payments: "Վճարումներ",
  profile: "Իմ տվյալները"
};

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;

    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");

    title.textContent = titles[page];
  });
});

function openOrder(type){
  document.querySelectorAll(".order-card").forEach(card => card.classList.remove("selected"));
  event.currentTarget.classList.add("selected");

  const data = {
    fairytale: {
      title:"Էվայի հեքիաթային գիրքը",
      subtitle:"Անհատական գիրք + NFC • Ընթացքում"
    },
    album: {
      title:"Ընտանեկան ֆոտոալբոմ",
      subtitle:"18×25 կոշտ կազմ • Ավարտված"
    },
    artbook: {
      title:"ArtBook",
      subtitle:"Հեքիաթով ArtBook • Ավարտված"
    }
  };

  document.getElementById("orderTitle").textContent = data[type].title;
  document.getElementById("orderSubtitle").textContent = data[type].subtitle;
}


/* V5 product-aware timelines */
const productTimelines = {
  fairytale: {
    title: "Էվայի հեքիաթային գիրքը",
    subtitle: "Անհատական գիրք + NFC • Ընթացքում",
    badge: "Իլյուստրացիաների փուլ",
    steps: [
      "Տվյալները ստացվել են",
      "Հեքիաթը ստեղծվել է",
      "Իլյուստրացիաներ",
      "Տպագրություն",
      "Պատրաստ է",
      "Առաքում"
    ],
    current: 3
  },
  photoalbum: {
    title: "Ընտանեկան ֆոտոալբոմ",
    subtitle: "18×25 կոշտ կազմ • Ընթացքում",
    badge: "Դիզայնի փուլ",
    steps: [
      "Լուսանկարները ստացվել են",
      "Նկարները ընտրվել են",
      "Դասավորություն / դիզայն",
      "Տպագրություն",
      "Պատրաստ է",
      "Առաքում"
    ],
    current: 3
  },
  artbook: {
    title: "ArtBook",
    subtitle: "Հեքիաթով ArtBook • Ընթացքում",
    badge: "Էջադրման փուլ",
    steps: [
      "Նկարները ստացվել են",
      "Սկանավորում / մշակում",
      "Հեքիաթը ստեղծվել է",
      "Էջադրում",
      "Պատրաստ է",
      "Առաքում"
    ],
    current: 4
  },
  color: {
    title: "Ներկիր ինքդ քեզ",
    subtitle: "20 նկար A4 • Ընթացքում",
    badge: "Գծային մշակման փուլ",
    steps: [
      "Լուսանկարները ստացվել են",
      "Լավ նկարները ընտրվել են",
      "Գծային նկարների մշակում",
      "Տպագրություն",
      "Պատրաստ է",
      "Առաքում"
    ],
    current: 3
  }
};

function renderTimeline(targetId, productKey){
  const target = document.getElementById(targetId);
  if(!target) return;
  const data = productTimelines[productKey] || productTimelines.fairytale;
  target.innerHTML = data.steps.map((step, index) => {
    const n = index + 1;
    const cls = n < data.current ? "done" : (n === data.current ? "current" : "");
    const mark = n < data.current ? "✓" : n;
    return `<div class="${cls}"><b>${mark}</b><span>${step}</span></div>`;
  }).join("");
}

function setMainProduct(productKey){
  const data = productTimelines[productKey] || productTimelines.fairytale;
  const activeTitle = document.querySelector(".order-head h3");
  const activeSub = document.querySelector(".order-head p");
  const activeBadge = document.querySelector(".order-head .badge");
  if(activeTitle) activeTitle.textContent = data.title;
  if(activeSub) activeSub.textContent = data.subtitle;
  if(activeBadge) activeBadge.textContent = data.badge;
  renderTimeline("mainTimeline", productKey);
  renderTimeline("detailsTimeline", productKey);
}

const oldOpenOrder = window.openOrder;
window.openOrder = function(type){
  const key = type === "album" ? "photoalbum" : type;
  document.querySelectorAll(".order-card").forEach(card => card.classList.remove("selected"));
  if(event && event.currentTarget) event.currentTarget.classList.add("selected");
  const data = productTimelines[key] || productTimelines.fairytale;
  const t = document.getElementById("orderTitle");
  const s = document.getElementById("orderSubtitle");
  if(t) t.textContent = data.title;
  if(s) s.textContent = data.subtitle;
  setMainProduct(key);
};

document.addEventListener("DOMContentLoaded", () => {
  setMainProduct("fairytale");
});
setMainProduct("fairytale");
