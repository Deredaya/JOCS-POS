import cookieManager from "./class/cookieManager";

cookieManager.getCookie("LoggedIn") ? null : window.location.replace("/login");