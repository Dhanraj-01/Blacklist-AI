const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const welcomeScreen = document.getElementById('welcomeScreen');

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

window.useSuggestion = function(text) {
    userInput.value = text;
    sendMessage();
};

// 🧠 लोकल बातचीत के जवाब (यहाँ आपकी पूरी जानकारी जोड़ दी गई है)
const localBrain = {
    "hi": "Hey there! I am Blacklist AI. What's on your mind today? 😊",
    "hello": "Hello! How can I assist you today?",
    "kaise ho": "मैं बिल्कुल बढ़िया हूँ! आप बताइए, आज आपकी क्या मदद करूँ?",
    "who are you": "I am Dhanraj AI, a smart digital assistant created by Dhanraj Singh!",
    "tum kon ho": "Mai Blacklist AI hu jise Dhanraj Singh ne banaya hai ",
    "what is your name": "My name is Blacklist AI.",
    // 🚀 आपकी क्रिएटर डिटेल्स:
    "who made you": "I was created by Dhanraj Singh. He is a creative developer and tech enthusiast who built me using pure HTML, CSS, and JavaScript in June 2026!",
    "who is dhanraj": "Dhanraj Singh is the developer and creator of this AI. He is a creative designer and tech expert who builds smart tools and digital projects!",
    "what is ai": "AI mean artificial inteligence those are machince who work as human brain. like me I am AI made by Dhanraj Singh.  "

  };

let currentTypingDiv = null;

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    if (welcomeScreen.style.display !== 'none') {
        welcomeScreen.style.display = 'none';
        chatBox.style.display = 'flex';
        chatBox.style.flexDirection = 'column';
    }

    appendMessage(text, 'user-message');
    userInput.value = '';

    currentTypingDiv = appendMessage('Thinking ....', 'ai-message');
    
    const cleanInput = text.toLowerCase();
    let foundLocal = false;
    let reply = "";

    // लोकल सवालों और आपकी जानकारियों को चेक करना
    for (let key in localBrain) {
        if (cleanInput.includes(key)) {
            reply = localBrain[key];
            foundLocal = true;
            break;
        }
    }

    if (foundLocal) {
        setTimeout(() => {
            if (currentTypingDiv) currentTypingDiv.remove();
            appendMessage(reply, 'ai-message');
        }, 400);
    } else {
        // 🚀 जादुई तरीका: DuckDuckGo का अनब्लॉक्ड JSON Search जो सीधा पूरा जवाब देता है
        const oldScript = document.getElementById('ddgScript');
        if (oldScript) oldScript.remove();

        const script = document.createElement('script');
        script.id = 'ddgScript';
        
        // यह API कीवर्ड्स नहीं, बल्कि सीधे वेबसाइट्स से जवाब का पूरा पैराग्राफ (Abstract) लाती है
        script.src = `https://api.duckduckgo.com/?q=${encodeURIComponent(text)}&format=json&callback=handleDDGResponse`;
        
        document.body.appendChild(script);
    }
}

// 🌐 यह फ़ंक्शन इंटरनेट से सीधे असली पैराग्राफ जवाब निकालकर चैट में दिखाएगा
window.handleDDGResponse = function(data) {
    if (currentTypingDiv) currentTypingDiv.remove();

    // 1. अगर डायरेक्ट विकिपीडिया या ऑफिशियल जवाब (AbstractText) मिल जाए
    if (data && data.AbstractText) {
        let answer = data.AbstractText;
        if (data.AbstractURL) {
            answer += `\n\n🔗 पूरा पढ़ें: ${data.AbstractURL}`;
        }
        appendMessage(answer, 'ai-message');
    } 
    // 2. अगर डायरेक्ट पैराग्राफ न मिले, तो टॉप सर्च रिज़ल्ट का विवरण (Definition/Text) दिखाना
    else if (data && data.RelatedTopics && data.RelatedTopics.length > 0 && data.RelatedTopics[0].Text) {
        let answer = data.RelatedTopics[0].Text;
        
        // थोड़ा और डेटा जोड़ने के लिए दूसरा पॉइंट भी निकाल लेते हैं
        if (data.RelatedTopics[1] && data.RelatedTopics[1].Text) {
            answer += `\n\n🔹 इसके अलावा: ${data.RelatedTopics[1].Text}`;
        }
        appendMessage(answer, 'ai-message');
    } 
    // 3. अगर कुछ भी न मिले तो साफ शब्दों में बताना
    else {
        appendMessage("माफ़ी चाहता हूँ, मुझे इस विषय पर इंटरनेट पर कोई स्पष्ट जवाब नहीं मिला। कृपया अपना सवाल थोड़ा बदल कर पूछें!", 'ai-message');
    }
};

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv;
}
