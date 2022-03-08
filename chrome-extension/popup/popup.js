const sendMessageButton = document.getElementById('sendMessage')
const inputQuery = document.getElementById('queryInput')
sendMessageButton.onclick = async function(e) {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);

    // chrome.tabs.sendMessage(tabs[0].id, {query: inputQuery.value}, function(response) {
    //     console.log(response?.status);
    // });
    const query = (new QueryEngineQA()).addQuery( JSON.parse(inputQuery.value) ).build().lazy()

    chrome.scripting.executeScript(tabs[0].id, { code: query }, function (response) {})

}
