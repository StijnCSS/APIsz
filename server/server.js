import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';

const API_URL_DAD = 'https://icanhazdadjoke.com';
const API_URL_MOM = 'https://www.yomama-jokes.com/api/v1/jokes/random/';

// ✅ Function to fetch the joke
async function getJoke() {
  try {
    const response = await fetch(API_URL_MOM, {
      headers: {
        Accept: 'application/json',
      }
    });
    const data = await response.json();
    console.log('[DAD JOKE]', data.joke); // Logs joke to console
    return data.joke;
  } catch (error) {
    console.error('[ERROR FETCHING JOKE]', error);
    return 'No joke today 😢';
  }
}

const engine = new Liquid({
  extname: '.liquid',
});

const app = new App();

app
  .use(logger())
  .use('/', sirv('dist'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

app.get('/', async (req, res) => {
  const jokeValue = await getJoke(); // 👈 Fetch the joke
  return res.send(renderTemplate('server/views/index.liquid', {
    title: 'Home',
    joke: jokeValue // 👈 pass the joke to the template
  }));
});

app.get('/plant/:id/', async (req, res) => {
  return res.send('Plant detail not available.');
});

const renderTemplate = (template, data) => {
  return engine.renderFileSync(template, data);
};