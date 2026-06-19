const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const suggestionsGrid = document.getElementById('suggestionsGrid');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const chatHistoryList = document.getElementById('chatHistoryList');
const snapAvatar = document.getElementById('snapAvatar');
const voiceWaveform = document.getElementById('voiceWaveform');
const imageModal = document.getElementById('imageModal');
const modalTargetImg = document.getElementById('modalTargetImg');

// स्प्लैश लोडर
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
    }, 2800); 
});

window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('blacklist_dark_mode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
};

if (localStorage.getItem('blacklist_dark_mode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

window.useSuggestion = function(text) { userInput.value = text; sendMessage(); };
window.handleTypingAvatar = function() {
    const len = userInput.value.length;
    snapAvatar.style.display = len > 0 ? 'flex' : 'none';
};

const localBrain = {
    "hi": "Hey there! I am Blacklist AI. What's on your mind today? 😊",
    "hello": "Hello! How can I assist you today? 👋",
    "kaise ho": "मैं बिल्कुल बढ़िया हूँ! आप बताइए, आज आपकी क्या मदद करूँ? ✨",
    "who are you": "I am Blacklist AI, a smart digital assistant created by Dhanraj Singh! 🤖",
    "who made you": "I was created, designed and developed by Dhanraj Singh! 🚀"
};

const allSuggestions = [
    { text: "Dhanraj ke mata pita ki photo dikho", title: "Show Parents ❤️", desc: "View family photo" },
    { text: "Write a viral YouTube Short script", title: "Jarvis Content 🎬", desc: "Generate gaming scripts" },
    { text: "Suggest best HTML/CSS layout", title: "Blogger Help 💻", desc: "Optimize your blog design" },
    { text: "Open YouTube", title: "System Action 🌐", desc: "Launch apps instantly" }
];

function loadRandomSuggestions() {
    suggestionsGrid.innerHTML = "";
    allSuggestions.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => useSuggestion(item.text);
        card.innerHTML = `<h4>${item.title}</h4><p>${item.desc}</p>`;
        suggestionsGrid.appendChild(card);
    });
}
loadRandomSuggestions();

window.toggleSidebar = function() { sidebar.classList.toggle('active'); sidebarOverlay.classList.toggle('active'); };

window.toggleRightMenu = function() {
    const menu = document.getElementById('dropdownMenuRight');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};

// 📩 100% वर्किंग फीडबैक लिंक फिक्स
window.sendFeedback = function() {
    window.location.href = "mailto:monuamarsingh9@gmail.com?subject=Blacklist%20AI%20Feedback";
    document.getElementById('dropdownMenuRight').style.display = 'none';
};

// 🧹 वर्किंग क्लियर चैट फिक्स (वापस वेलकम स्क्रीन लाता है)
window.clearCurrentChat = function() {
    if(window.speechSynthesis) window.speechSynthesis.cancel();
    chatBox.innerHTML = "";
    chatBox.style.display = 'none';
    welcomeScreen.style.display = 'flex';
    loadRandomSuggestions();
    document.getElementById('dropdownMenuRight').style.display = 'none';
};

window.startNewChat = function() {
    chatBox.innerHTML = "";
    chatBox.style.display = 'none';
    welcomeScreen.style.display = 'flex';
    loadRandomSuggestions();
    toggleSidebar();
};

window.openImageModal = function(src) { imageModal.style.display = "block"; modalTargetImg.src = src; };
window.closeImageModal = function() { imageModal.style.display = "none"; };

let currentTypingWrapper = null;

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    snapAvatar.style.display = 'none';
    if (welcomeScreen.style.display !== 'none') {
        welcomeScreen.style.display = 'none';
        chatBox.style.display = 'flex';
        chatBox.style.flexDirection = 'column';
    }

    appendUserMessage(text);
    userInput.value = '';
    currentTypingWrapper = appendThinkingLoader();
    const cleanInput = text.toLowerCase().trim();

    // 📱 सिस्टम असिस्टेंट कमांड एक्जीक्यूशन
    if (handleAndroidAssistantCommands(cleanInput)) return;

    if (cleanInput.includes("dhanraj ke mata pita ki photo dikho") || 
        cleanInput.includes("dhanraj ke mata pita ki photo dikhao") || 
        cleanInput.includes("dhanraj ke mata pita") || 
        cleanInput.includes("dhanraj parents")) {
        
        setTimeout(() => {
            if (currentTypingWrapper) currentTypingWrapper.remove();
            appendAiMessageWithPhoto("Here is the picture of Dhanraj Singh's mother and father! ❤️ (Tap to view full screen)", "IMG-20250917-WA0003.jpg");
        }, 800);
        return;
    }

    let foundLocal = false;
    let reply = "";
    for (let key in localBrain) {
        if (cleanInput.includes(key)) { reply = localBrain[key]; foundLocal = true; break; }
    }

    if (foundLocal) {
        setTimeout(() => { if (currentTypingWrapper) currentTypingWrapper.remove(); appendAiMessageWithTyping(reply); }, 400);
        return;
    }

    const oldScript = document.getElementById('ddgScriptFixed');
    if (oldScript) oldScript.remove();
    const script = document.createElement('script');
    script.id = 'ddgScriptFixed';
    script.src = `https://api.duckduckgo.com/?q=${encodeURIComponent(text)}&format=json&callback=handleFinalDDG`;
    document.body.appendChild(script);
}

// 🤖 मजबूत एंड्रॉइड असिस्टेंट ब्रिज फिक्स
function handleAndroidAssistantCommands(input) {
    // try-catch ब्लॉक ब्राउज़र एरर को रोकता है और केवल APK ऐप के अंदर कमांड ट्रिगर करता है
    try {
        if (typeof AndroidBridge !== 'undefined' && AndroidBridge !== null) {
            if (input.includes("open") || input.includes("kholo") || input.includes("chalao")) {
                if (input.includes("youtube")) { AndroidBridge.openApp("com.google.android.youtube"); respondControl("Opening YouTube... 🌐"); return true; }
                if (input.includes("whatsapp")) { AndroidBridge.openApp("com.whatsapp"); respondControl("Opening WhatsApp... 💬"); return true; }
            }
            if (input.includes("turn on wifi") || input.includes("wifi chalu")) { AndroidBridge.toggleWifi(true); respondControl("Turning on Wi-Fi... 📶"); return true; }
            if (input.includes("turn off wifi") || input.includes("wifi band")) { AndroidBridge.toggleWifi(false); respondControl("Turning off Wi-Fi... 📶"); return true; }
            if (input.includes("turn on bluetooth") || input.includes("bluetooth chalu")) { AndroidBridge.toggleBluetooth(true); respondControl("Turning on Bluetooth... 🛜"); return true; }
            if (input.includes("turn off bluetooth") || input.includes("bluetooth band")) { AndroidBridge.toggleBluetooth(false); respondControl("Turning off Bluetooth... 🛜"); return true; }
        }
    } catch(err) {
        console.log("Android Bridge is not active on this browser web rendering mode.");
    }
    return false;
}

function respondControl(message) {
    if (currentTypingWrapper) currentTypingWrapper.remove();
    appendAiMessageWithTyping(message);
}

window.handleFinalDDG = function(data) {
    if (currentTypingWrapper) currentTypingWrapper.remove();
    let answer = data && data.AbstractText ? data.AbstractText : "I am in testing mode and still learning I can't answer everything try searching any word.😕";
    appendAiMessageWithTyping(answer);
};

function appendUserMessage(text) {
    const wrapper = document.createElement('div'); wrapper.className = 'message-wrapper';
    wrapper.innerHTML = `<div class="message user-message"><span>${text}</span></div>`;
    chatBox.appendChild(wrapper); chatBox.scrollTop = chatBox.scrollHeight;
}

function appendThinkingLoader() {
    const wrapper = document.createElement('div'); wrapper.className = 'message-wrapper';
    wrapper.innerHTML = `<div class="message ai-message"><div class="typing-loader"><span></span><span></span><span></span></div></div>`;
    chatBox.appendChild(wrapper); chatBox.scrollTop = chatBox.scrollHeight;
    return wrapper;
}

function appendAiMessageWithTyping(text) {
    if (currentTypingWrapper) currentTypingWrapper.remove();
    const wrapper = document.createElement('div'); wrapper.className = 'message-wrapper';
    wrapper.innerHTML = `<div class="message ai-message typing-cursor"></div>`;
    chatBox.appendChild(wrapper);
    
    const msgDiv = wrapper.querySelector('.ai-message');
    
    const speakBtn = document.createElement('button');
    speakBtn.className = 'tts-button';
    speakBtn.innerText = '🔊';
    speakBtn.style.display = 'none';
    speakBtn.onclick = () => speakText(speakBtn, text);
    wrapper.appendChild(speakBtn);

    let i = 0; const words = text.split(" ");
    function type() {
        if (i < words.length) {
            msgDiv.innerText += (i === 0 ? "" : " ") + words[i++];
            chatBox.scrollTop = chatBox.scrollHeight;
            setTimeout(type, 35);
        } else { 
            msgDiv.classList.remove('typing-cursor'); 
            speakBtn.style.display = 'inline-flex';
        }
    }
    type();
}

function appendAiMessageWithPhoto(text, imgUrl) {
    const wrapper = document.createElement('div'); wrapper.className = 'message-wrapper';
    wrapper.innerHTML = `<div class="message ai-message"><span>${text}</span><img src="${imgUrl}" class="chat-image" onclick="openImageModal('${imgUrl}')"></div>`;
    chatBox.appendChild(wrapper); chatBox.scrollTop = chatBox.scrollHeight;
}

window.speakText = function(button, text) {
    if (!window.speechSynthesis) return;
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        button.innerText = "🔊";
        return;
    }
    button.innerText = "🛑";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = text.match(/[\u0900-\u097F]/) ? 'hi-IN' : 'en-US';
    utterance.onend = () => button.innerText = "🔊";
    window.speechSynthesis.speak(utterance);
};

function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice Input not supported.");
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    const voiceBtn = document.getElementById('voiceBtn');
    voiceBtn.innerText = "🛑";
    voiceWaveform.style.display = 'flex'; 

    recognition.onresult = (e) => { userInput.value = e.results[0][0].transcript; sendMessage(); };
    recognition.onend = () => { voiceBtn.innerText = "🎤"; voiceWaveform.style.display = 'none'; };
    recognition.start();
}

window.onclick = function(event) {
    if (!event.target.matches('.header-menu-right')) {
        const dropdowns = document.getElementsByClassName("dropdown-content-right");
        for (let i = 0; i < dropdowns.length; i++) { dropdowns[i].style.display = "none"; }
    }
};
