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

    const type = Math.random() < 0.5 ? 'mom' : 'dad';
const res = await fetch(`/api/joke?type=${type}`);

    const data = await res.json();
    jokeElement.textContent = data.joke;
    jokeElement.dataset.joke = data.joke;
  });
});




// Geen fetch request bij deze dus front end kan niet communiceren met back-end
// const jokeText = document.getElementById('joke')?.dataset.joke;
//   document.querySelectorAll('[data-rating]').forEach(button => {
//     button.addEventListener('click', () => {
//       const rating = button.dataset.rating;
//       const stored = JSON.parse(localStorage.getItem('jokes') || '[]');
//       stored.push({ joke: jokeText, rating });
//       localStorage.setItem('jokes', JSON.stringify(stored));
//       window.location.href = '/';
//     });
//   });





//   document.querySelectorAll('[data-rating]').forEach(button => {
//     button.addEventListener('click', () => {
//       const rating = button.dataset.rating;
//       const stored = JSON.parse(localStorage.getItem('jokes') || '[]');
//       stored.push({ joke: jokeText, rating });
//       localStorage.setItem('jokes', JSON.stringify(stored));
//       window.location.href = '/';
