import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';

const API_URL_DAD = 'https://icanhazdadjoke.com';
const API_URL_MOM = 'https://www.yomama-jokes.com/api/v1/jokes/random/';

// ✅ Function to fetch the joke
async function getJoke(type = 'mom') {
  const url = type === 'dad' ? API_URL_DAD : API_URL_MOM;
  const headers = type === 'dad'
    ? { Accept: 'application/json' }
    : {};

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    const jokeText = type === 'dad' ? data.joke : data.joke;
    console.log(`[${type.toUpperCase()} JOKE]`, jokeText);
    return jokeText;
  } catch (error) {
    console.error(`[ERROR FETCHING ${type.toUpperCase()} JOKE]`, error);
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
  .use('/', sirv('client'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

app.get('/', async (req, res) => {
  const type = req.query.type === 'dad' ? 'dad' : 'mom';
  const jokeValue = await getJoke(type);
  return res.send(renderTemplate('server/views/index.liquid', {
    title: 'Home',
    joke: jokeValue,
    currentType: type
  }));
});

const renderTemplate = (template, data) => {
  return engine.renderFileSync(template, data);
};
