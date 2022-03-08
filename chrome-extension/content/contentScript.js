/**
 * Inject the `queryEngine` in the page.
 * @type {HTMLScriptElement}
 */

window.addEventListener('load', (event) => {
    const settingsBar = document.querySelector("#editor div.edit-post-header__settings")
    if( settingsBar ) {
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('queryEngine.js');
        (document.head||document.documentElement).appendChild(s);
        s.onload = function() {
            s.parentNode.removeChild(s);
        };

        console.log(settingsBar)
        const btn = document.createElement('button')
        btn.innerText = "QA"
        settingsBar.appendChild(btn)
    }
});





// function runQuery(query) {
//     console.log( "Received query from extension:" + query, window.qaOtter)
//     window?.qaOtter?.addQuery(query)
// }
//
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         if (request.query) {
//             runQuery(request.query)
//             sendResponse({status: "done"});
//         }
//     }
// );
