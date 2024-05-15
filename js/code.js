function sendMessage(message) {
    const webhookURL = 'Not for you <3';
    
    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to send message to Discord:', response.status, response.statusText);
        }
    })
    .catch(error => {
        console.error('Error sending message to Discord:', error);
    });
  }
  
  async function checkBlacklist(text) {
    const response = await fetch('blacklist.txt');
    const blacklist = await response.text();
    const words = blacklist.split('\n');
  
    for (let word of words) {
        if (text.toLowerCase().includes(` ${word.trim()} `)) {
            return true;
        }
    }
    return false;
  }
  
  document.getElementById('send-button').addEventListener('click', async function() {
    const message = document.getElementById('message-input').value;
    const name = document.getElementById('name-input').value.toUpperCase();
    
    if (await checkBlacklist(` ${name} ${message} `)) {
        console.log('Message contains blacklisted words. Not sending.');
        return;
    }
    
    if (!messageTimer.canSend()) {
        console.log('Please wait before sending another message.');
        return;
    }
  
    sendMessage(`${name}: ${message}`);
    
    document.getElementById('message-input').value = '';
    messageTimer.startTimer();
  });
  
  const messageTimer = (function() {
    let canSendMessage = true;
  
    return {
        startTimer: function() {
            canSendMessage = false;
            setTimeout(() => {
                canSendMessage = true;
            }, 10000);
        },
        canSend: function() {
            return canSendMessage;
        }
    };
  })();
  
