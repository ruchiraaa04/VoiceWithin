document.addEventListener("DOMContentLoaded", () => {
    const voiceChatButton = document.getElementById("voiceChat");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.querySelector(".chat-messages");

    // Initialize Speech Recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    voiceChatButton.addEventListener("click", () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        const userMessage = event.results[0][0].transcript;
        chatInput.value = userMessage;
        sendMessage(userMessage);
    };

    recognition.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
    };

    const sendMessage = (message) => {
        if (!message) return;

        // To Display user message
        chatMessages.innerHTML += `<div class="user-message"><strong>You:</strong> ${message}</div>`;
        
        fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        })
        .then(response => response.json())
        .then(data => {
            chatMessages.innerHTML += `<div class="bot-message"><strong>Bot:</strong> ${data.response}</div>`;
            synthesizeSpeech(data.response);
        });
    };

    const synthesizeSpeech = (text) => {
        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        window.speechSynthesis.speak(speech);
    };
});
