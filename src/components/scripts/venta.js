import cookieManager from "./class/cookieManager";
import supabase from "./supabase.js";

////////////////////////////////////////////////////////////////////////
// Pre-Load

if (!cookieManager.getCookie("LoggedIn")) window.location.replace("/login");


////////////////////////////////////////////////////////////////////////
// Variables

const userId = cookieManager.getCookie("UserId");
const sellerElement = document.getElementById("sellerdb");
const content = document.getElementById("content");
const dateElement = document.getElementById("dateJs");
const noResults = document.getElementById("no-results");
const searchInput = document.getElementById("searchLabel");
const canvas = document.querySelector(".Canvas");

////////////////////////////////////////////////////////////////////////
// Fetch Data
const { data: User } = await supabase.from("Users").select("*").eq("id", userId).single();

  
////////////////////////////////////////////////////////////////////////
//Config

const searchDelay = 500;
const texts = {
  noResults: "No se encontraron resultados"
};
  

////////////////////////////////////////////////////////////////////////
// Funciones

const debounceTime = (fn, delay) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

const updateTime = () =>
  (dateElement.textContent = new Date().toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }));

setInterval(updateTime, 1000);
updateTime();


const buscar = debounceTime(search => {
  supabase
    .from("Products")
    .select("*")
    .ilike("name", `%${search}%`)
    .then(({ data: resultados }) => {
      content.innerHTML = "";

      if (!resultados.length) {
        content.remove();
        canvas.appendChild(noResults);
        noResults.innerHTML = `<p>${texts.noResults}</p>`;
        return;
      }

      noResults.remove();
      canvas.appendChild(content);
      const fragment = document.createDocumentFragment();
      resultados.forEach(p => fragment.appendChild(createProduct(p)));
      content.appendChild(fragment);
    });
}, searchDelay);


function createProduct({ sku, image_path, name, price }) {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `card-${sku}`;
    card.onclick = () => {
      if(card.classList.contains("active")) return card.classList.remove("active");
      document.querySelectorAll(".card.active").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    };
    card.innerHTML = `
      <img class="img" src="${image_path}" alt="${name}">
      <div class="space"></div>
      <p class="cant">1</p>
      <p class="sku">${sku}</p>
      <div class="specs">
        <p class="nameProduct">${name}</p>
        <p class="discount"> Descuento: $0</p>
        <p class="price">Precio: $${price}</strong></p>
      </div>`;        
      return card;
}


////////////////////////////////////////////////////////////////////////
// Eventos

buscar("");
sellerElement.textContent = User.user;

searchInput.addEventListener("input", e => buscar(e.target.value));

