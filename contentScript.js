var s = document.createElement('script');
s.src = chrome.runtime.getURL('queryEngine.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};