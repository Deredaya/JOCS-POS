import cookieManager from "./class/cookieManager";
import supabase from "./supabase.js";

cookieManager.getCookie("LoggedIn") ? null : window.location.replace("/login");

const searchDelay = 500;

let { data: Products, error } = await supabase
  .from('Products')
  .select('*')

document.getElementById("searchLabel").addEventListener("input", function(event) {
    buscar(event.target.value);
});


const content = document.getElementById("content");


const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};


const buscar = debounce((valor) => {
    const productos = Products.filter(p => p.name.toLowerCase().includes(valor.toLowerCase()));
    content.innerHTML = "";
    productos.forEach(product => {
        mostrarProducto(product);
    })
}, searchDelay);


document.addEventListener("paste", function(event) {
  const pastedData = event.clipboardData.getData('text');
  const product = Products.find(p => p.sku.toString() === pastedData);
    content.innerHTML = "";
  mostrarProducto(product);
}
);

function mostrarProducto(producto) {
    const card = content.appendChild(document.createElement("div"));
    card.className = "card";
    card.id = `card-${producto.sku}`;
    card.innerHTML = `
      <img class="img" src="${producto.image_path}" alt="${producto.name}">
      <div class="space"></div>
      <p class="cant">1</p>
      <p class="sku">${producto.sku}</p>
      <div class="specs">
        <p class="nameProduct">${producto.name}</p>
        <p class="discont"> Descuento: $0</p>
        <p class="price">Precio: $${producto.price}</strong></p>
      </div>`;        
}

document.addEventListener("click", (event) => {
  const tarjetaClickeada = event.target.closest(".card");

  if (!tarjetaClickeada) {
    const tarjetaActiva = document.querySelector(".card.active");
    if (tarjetaActiva) {
        tarjetaActiva.classList.remove("active");
    }
  } else {
    const todasLasCards = document.querySelectorAll(".card");
    todasLasCards.forEach(c => c.classList.remove("active"));
    tarjetaClickeada.classList.add("active");
  }
});