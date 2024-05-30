chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^https?:/.test(tab.url)) {
      // Inject the content script into the active tab once the page is loaded
      chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ['content.js']
      }, () => {
        // Send a message to the content script to get the data
        chrome.tabs.sendMessage(tabId, {action: 'getData'}, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError.message);
            return;
          }
          console.log("Response received: ", response);
          if (response && response.data) {
            saveDataToFile(response.data, response.url);
          } else {
            console.error('No data found or unable to extract the element.');
          }
        });
      });
    }
  });
  
  function saveDataToFile(data, url) {
    const jsonData = {
      url: url,
      text: data.text
    };
  
    const jsonString = JSON.stringify(jsonData, null, 2);
  
    chrome.downloads.download({
      url: 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString),
      filename: 'extracted_data.json',
    }, () => {
      console.log('File saved.');
    });
  }
  
  