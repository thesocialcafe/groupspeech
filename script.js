// Replace with your Google Cloud project credentials
const apiKey = 'YOUR_API_KEY';
const languageCode = 'en-US';    // Source language
const targetLanguage = 'es';      // Target language (e.g., 'es' for Spanish)
const voiceName = 'es-ES-Standard-A';  // Voice for text-to-speech 

// Accessing elements from the DOM
const startButton = document.getElementById('startButton');
const transcriptDiv = document.getElementById('transcript');
const translationDiv = document.getElementById('translation');

startButton.addEventListener('click', startTranslation);

function startTranslation() {
  // Check browser compatibility
  if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition. Try Chrome.");
      return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;  // Continuous listening
  recognition.interimResults = true; // Show partial results
  recognition.lang = languageCode; 

  recognition.onstart = () => {
      startButton.disabled = true;
      transcriptDiv.textContent = 'Listening...';
  };

  recognition.onresult = (event) => {
      let transcript = '';
      for (const result of event.results) {
          if (result.isFinal) {
              transcript += result[0].transcript;
          }
      }
      transcriptDiv.textContent = transcript;
      translateText(transcript);
  };

  recognition.onerror = (event) => { console.error(event.error) };
  recognition.onend = () => { startButton.disabled = false; };

  recognition.start();  
}

function translateText(text) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(text)}&target=${targetLanguage}`;

  fetch(url)
      .then(res => res.json())
      .then(data => {
          translationDiv.textContent = data.data.translations[0].translatedText;

          // Text-to-Speech Synthesis
          const synth = new SpeechSynthesisUtterance(
            data.data.translations[0].translatedText
          );
          synth.voice = getVoice();
          speechSynthesis.speak(synth);
      })
      .catch(error => console.error(error));
}

function getVoice() {
  const voices = speechSynthesis.getVoices();
  return voices.find((voice) => voice.name === voiceName) || null;
}
