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
    card.innerHTML = `
      <img class="img" src="${producto.imagePath}" alt="${producto.name}">
      <p class="nameProduct">${producto.name}</p>
      <p class="discont"> descuento: $0</p>
      <p class="price">Precio: $${producto.price}</strong></p>
      <p class="sku">SKU: ${producto.sku}</p>`;
}
