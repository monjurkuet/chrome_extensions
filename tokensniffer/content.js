// Extract the specific element
const element = document.evaluate('/html/body/div/div/main/div[2]/div[3]/div[1]/table[1]/tbody/tr[1]/td/h2', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

const data = element ? {text: element.textContent, html: element.outerHTML} : null;
const currentUrl = window.location.href;
console.log("Data extracted: ", data);

// Listen for messages and send the extracted data back
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script: ", request);
  if (request.action === 'getData') {
    sendResponse({data: data, url: currentUrl});
  }
});
