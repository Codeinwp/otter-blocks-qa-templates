/**
 * Inject the `queryEngine` in the page.
 * @type {HTMLScriptElement}
 */

window.addEventListener('load', (event) => {
    const settingsBar = document.querySelector("#editor div.edit-post-header__settings")
    if( settingsBar ) {
        var s = document.createElement('script');
        s.defer = true;
        s.type = "module"
        s.src = "https://cdn.jsdelivr.net/gh/Codeinwp/otter-query-engine@master/dist/index.js";
        (document.head||document.documentElement).appendChild(s);
        console.log(s)
        s.onload = function() {
           //  s.parentNode.removeChild(s);
           const btn = document.createElement('span')
           btn.innerText = "Query Engine Active"
           settingsBar.insertBefore(btn, settingsBar.firstChild)
           
        };
    }
});
