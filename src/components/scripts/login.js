import supabase from "./supabase.js";
import cookieManager from "./class/cookieManager.js";

cookieManager.getCookie("LoggedIn") ? window.location.replace("/venta") : null;

let { data: Users, error } = await supabase
  .from('Users')
  .select('user,password')

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const User = Users.find(user => user.user === this.username.value && user.password === this.password.value);

    if (User) {
        cookieManager.setCookie("LoggedIn", User.user, 18);
        window.location.reload();
    } else {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "Usuario o contraseña incorrectos.";
        setTimeout(() => {
            errorMessage.textContent = "";
        }, 3000);
    }
});