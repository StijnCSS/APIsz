import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
//body parser nodig. ff googlen wat dat betekent en check NPM
import { urlencoded } from 'milliparsec';
import sirv from 'sirv';

//nodig om files te laden uit json file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jokesFilePath = path.join(__dirname, 'data', 'jokes.json');


// weet wat rated jokes zijn ind earray in data jokes.json
let ratedJokes = [];

try {
  const jokesData = fs.readFileSync(jokesFilePath, 'utf-8');
  ratedJokes = JSON.parse(jokesData);
} catch (err) {
  console.warn('No existing jokes file found, starting fresh.');
}

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
  .use(urlencoded()) // ✅ THIS should be placed BEFORE .post or .get routes
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


// de url arcive werkt nu en displayed de detail.liquid file
app.get('/archive', (req, res) => {
  return res.send(renderTemplate('server/views/detail.liquid', {
    title: 'Archive',
    ratedJokes 
  }));
});

// New route to serve jokes via API without CORS issues
app.get('/api/joke', async (req, res) => {
  const type = req.query.type === 'dad' ? 'dad' : 'mom';
  const jokeText = await getJoke(type);
  res.json({ joke: jokeText });
});

const renderTemplate = (template, data) => {
  return engine.renderFileSync(template, data);
};

// serverside jokes database 

app.post('/like', (req, res) => {
  const { joke, rating } = req.body;
  if (joke && rating) {
    ratedJokes.push({ joke, rating });
    console.log('Rated joke added:', { joke, rating });
  }
  res.redirect('/');
});

// Jokes verwijderen uit het archief
app.post('/delete', (req, res) => {
  const { index } = req.body;
  if (index !== undefined && ratedJokes[index]) {
    ratedJokes.splice(index, 1);
    fs.writeFileSync(jokesFilePath, JSON.stringify(ratedJokes, null, 2));
    console.log(`Deleted joke at index ${index}`);
  }
  res.redirect('/archive');
});


// Delete joke
app.post('/delete', (req, res) => {
  const { index } = req.body;
  if (index !== undefined && ratedJokes[index]) {
    ratedJokes.splice(index, 1);
    fs.writeFileSync(jokesFilePath, JSON.stringify(ratedJokes, null, 2)); // ✅ safe here too
    console.log(`Deleted joke at index ${index}`);
  }
  res.redirect('/archive');
});

//load json file.