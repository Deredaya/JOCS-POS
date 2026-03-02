class CookieManager {

    setCookie(name, value, hours) {
        const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    }
    
    getCookie(name) {
        let cookies = document.cookie.split("; ");
        for (let c of cookies) {
            let [key, value] = c.split("=");
            if (key === name) return value;
        }
        return null;
    }
}

const cookieManager = new CookieManager();

export default cookieManager;