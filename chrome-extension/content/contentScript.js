window.addEventListener('load', (event) => {
    let count = 0;
    const interv = setInterval( () => {
        count ++;
        const settingsBar = document.querySelector("#editor div.edit-post-header__settings")
        if( settingsBar ) {
            var s = document.createElement('script');
            s.defer = true;
            s.type = "module";
            s.src = "https://cdn.jsdelivr.net/gh/Codeinwp/otter-query-engine@master/dist/index.js";
            (document.head||document.documentElement).appendChild(s);
            clearInterval(interv);
        }
        if(count > 6) {
            clearInterval(interv);
        }
    }, 500);
});
