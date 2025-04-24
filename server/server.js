import { App } from '@tinyhttp/app'; // Server framework
import { logger } from '@tinyhttp/logger'; // Logging middleware
import { Liquid } from 'liquidjs'; // Template engine (Liquid)
//body parser nodig. ff googlen wat dat betekent en check NPM
import { urlencoded } from 'milliparsec'; // Middleware om form data te parsen (body parser)
import sirv from 'sirv'; // Static file server

//nodig om files te laden uit json file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup om de juiste padstructuur te gebruiken voor de server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jokesFilePath = path.join(__dirname, 'data', 'jokes.json'); // Pad naar jokes.json


// Laden van eerder opgeslagen rated jokes, of beginnen met een lege array als bestand niet bestaat
let ratedJokes = [];

try {
  const jokesData = fs.readFileSync(jokesFilePath, 'utf-8');
  ratedJokes = JSON.parse(jokesData);
} catch (err) {
  console.warn('No existing jokes file found, starting fresh.');
}

// URLs van de externe joke APIs
const API_URL_DAD = 'https://icanhazdadjoke.com';
const API_URL_MOM = 'https://www.yomama-jokes.com/api/v1/jokes/random/';

// Functie om een grap op te halen van de juiste API
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

// Setup van de Liquid template engine
const engine = new Liquid({
  extname: '.liquid',
});

// Maak een nieuwe TinyHTTP app
const app = new App();

// Setup van middleware en static files
app
  .use(logger()) 
  .use(urlencoded()) 
  .use('/', sirv('dist')) 
  .use('/', sirv('client')) 
  .listen(3000, () => console.log('Server available on http://localhost:3000')); 

// Route voor de homepage: laad grap in en render index
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
// Route om het archive met beoordeelde grappen te tonen
app.get('/archive', (req, res) => {
  return res.send(renderTemplate('server/views/detail.liquid', {
    title: 'Archive',
    ratedJokes 
  }));
});

// Nieuwe route to serve jokes via API without CORS issues
// API endpoint om een grap op te halen zonder CORS problemen
app.get('/api/joke', async (req, res) => {
  const type = req.query.type === 'dad' ? 'dad' : 'mom';
  const jokeText = await getJoke(type);
  res.json({ joke: jokeText });
});

// Functie om templates te renderen met Liquid
const renderTemplate = (template, data) => {
  return engine.renderFileSync(template, data);
};

// serverside jokes database 

// Opslaan van een joke met beoordeling ("good" of "lame") via POST request
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
    fs.writeFileSync(jokesFilePath, JSON.stringify(ratedJokes, null, 2));
    console.log(`Deleted joke at index ${index}`);
  }
  res.redirect('/archive');
});
