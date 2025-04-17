import './index.css';

console.log('Hello, world!');

const now = new Date();
const time = now.toLocaleTimeString();
document.getElementById('time').textContent = time;


// const jokeText = {{ joke | json }};
//   document.querySelectorAll('[data-rating]').forEach(button => {
//     button.addEventListener('click', () => {
//       const rating = button.dataset.rating;
//       const stored = JSON.parse(localStorage.getItem('jokes') || '[]');
//       stored.push({ joke: jokeText, rating });
//       localStorage.setItem('jokes', JSON.stringify(stored));
//       window.location.href = '/';
//     });
//   });
