
function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let c of cookies) {
        let [key, value] = c.split("=");
        if (key === name) return value;
    }
    return null;
}

let usuario = getCookie("LoggedIn");
if(!usuario) {
    window.location.replace("/login");
}
