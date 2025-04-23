import './index.css';

console.log('Hello, world!');

const now = new Date();
const time = now.toLocaleTimeString();
document.getElementById('time').textContent = time;



document.querySelectorAll('[data-rating]').forEach(button => {
  button.addEventListener('click', async () => {
    const rating = button.dataset.rating;
    const jokeElement = document.getElementById('joke');
    const jokeText = jokeElement?.dataset.joke; // ✅ now always current

    await fetch('/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        joke: jokeText,
        rating: rating
      })
    });

// 50% kans of er een dad of mom joke komt. Als de joke een dad joke is wordt het clippy_man en als dat niet is dan wordt de vrouwelijke clippy laten zien
    const type = Math.random() < 0.5 ? 'mom' : 'dad';
    const clippyImg = document.getElementById('clippy');
    const imagePath = type === 'dad' ? 'clippy_man.png' : 'clippy_vrouw.png';
    clippyImg.src = `/images/${imagePath}`;

    const res = await fetch(`/api/joke?type=${type}`);

    const data = await res.json();
    jokeElement.textContent = data.joke;
    jokeElement.dataset.joke = data.joke;


    
    //web api 01 https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
    const spraak = new SpeechSynthesisUtterance(data.joke);
    

    clippyImg.classList.add('talking');
    spraak.onend = () => {
      
      clippyImg.classList.remove('talking');
    };
    speechSynthesis.speak(spraak);
  });
});

// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
document.getElementById('copyJoke')?.addEventListener('click', () => {
  const jokeText = document.getElementById('joke')?.textContent;
  if (!jokeText) return;

  navigator.clipboard.writeText(jokeText)
    .then(() => {
      console.log('Joke copied to clipboard!');
      // Play sound effect after copying and before notification
      const copySounds = [
        '/sounds/haha01.mp3',
        '/sounds/haha02.mp3',
        '/sounds/haha01.wav'
      ];
      const randomSound = copySounds[Math.floor(Math.random() * copySounds.length)];
      const copySound = new Audio(randomSound);
      copySound.play();
      if (typeof Notification !== 'undefined') {
        if (Notification.permission === 'granted') {
          new Notification('You better not send this to yo momma bro!🤓');
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('You better not send this to yo momma bro!🤓');
            }
          });
        }
      }
    })
    .catch(err => {
      console.error('Failed to copy joke:', err);
    });
});