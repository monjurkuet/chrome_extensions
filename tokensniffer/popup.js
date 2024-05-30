document.addEventListener('DOMContentLoaded', () => {
    const crawlButton = document.getElementById('crawlButton');
  
    // Function to send a message to the content script and handle the response
    const crawlData = () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length === 0) {
          console.error('No active tab found.');
          return;
        }
        console.log("Active tab: ", tabs[0]);
  
        // Inject the content script into the active tab
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          files: ['content.js']
        }, () => {
          // Once the content script is injected, send a message
          chrome.tabs.sendMessage(tabs[0].id, {action: 'getData'}, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error:', chrome.runtime.lastError.message);
              return;
            }
            console.log("Response received: ", response);
            if (response && response.data) {
              displayData(response.data);
            } else {
              displayError();
            }
          });
        });
      });
    };
  
    // Add event listener for button click
    crawlButton.addEventListener('click', crawlData);
  
    // Automatically click the button once the popup is loaded
    crawlButton.click();
  });
  
  function displayData(data) {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = '';  // Clear previous data
  
    const div = document.createElement('div');
    div.textContent = `Text: ${data.text}`;
    dataContainer.appendChild(div);
  }
  
  function displayError() {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = 'No data found or unable to extract the element.';
  }
  