# FUNNYLOL.COM The place to be for funny lol
### API project Minor Web Design & Developent
### Ik wil een site maken waar ik mom vs dad jokes kan raten. De home pagina is opgebouwd uit een joke. een like of dislike knop en een copy knop om de grappen te delen. Als je jokes hebt gerate komt in het archief. Hier kan je jokes verwijderen als je dat wilt of vind dat je een verkeerde rating hebt gegeven. Dit is mijn eerste keer werken met APIs dus ik ga mij vooral focussen op een leuke ervaring te maken en dat niet te complex wordt.

### Gekozen APIs. 2 Joke content API en 2 Web APIs
[CA 01 DAD Joke API](https://icanhazdadjoke.com/)  Generate Dad Jokes  
[CA 02 MOM Joke API](https://www.yomama-jokes.com/docs/)  Generate Mom Jokes  
[WA 01 Speech Synthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)  Laat mijn mascotte praten  
[WA 02 Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)  zorgt ervoor dat je jokes can kopiëren  

## Process
Ik was begonnen met Client side jokes laden met een button die steeds de pagina reload. Dit werd opgeslagen in local storage. Dit was nice voor een 'proof of concept' maar elke keer als ik de browser een refresh gaf was mijn archive leeg. Ik had een een probleem Cross-Origin Resource Sharing (CORS), dit kwam omdat ik de Yo Mama API rechtstreeks naar de client stuurde. ChatGPT schreef dat ik eerst via de server en dan naar de client moest sturen.  
De nieuwe manier werkt nu wel omdat de server geen browser is en het niet blokkeerd. Door het op de server op te slaan is het ook meer future proof, ik kan functies toevoegen zoals meest gelikede joke, door een like counter toe te voegen in de `jokes.json`.

OUD

```js
fetch('https://www.yomama-jokes.com/api/v1/jokes/random/')
  .then(response => response.json())
  .then(data => {
    document.getElementById('joke').textContent = data.joke;
  });
```

NIEUW

```js
app.get('/api/joke', async (req, res) => {
  const type = req.query.type === 'dad' ? 'dad' : 'mom';
  const jokeText = await getJoke(type);
  res.json({ joke: jokeText });
});
```

De client haalt de grap nu op met:

```js
const res = await fetch(`/api/joke?type=${type}`);
const data = await res.json();
```
😊😊😊😊😊😊😊 

## Web api's

### Hoe slaat de server de jokes op?
Ik sla alle jokes op in de server door een JSON file te maken met een array. Alle jokes worden daar gearchiveerd tenzij het in de detail pagina verwijderd wordt. 
```fs.writeFileSync(jokesFilePath, JSON.stringify(ratedJokes, null, 2));```

### Archiefpagina & Templatesysteem

Voor het overzicht van beoordeelde grappen heb ik een aparte pagina gemaakt: `/archive`.

Deze maakt gebruik van een **Liquid template systeem** waarbij ik componenten herbruikbaar kan maken.  
Op de `/archive` pagina laad ik het template `detail.liquid`, en daarin gebruik ik een losse component in de `ul` `list-item.liquid` voor elke grap.

#### Hoe het werkt:

- In `server.js` maak ik een route aan:
```js
app.get('/archive', (req, res) => {
  return res.send(renderTemplate('server/views/detail.liquid', {
    title: 'Archive',
    ratedJokes 
  }));
});
```

- In `detail.liquid` gebruik ik een `for-loop` om door alle beoordeelde grappen te loopen en een component in te laden:

```liquid
<ul class="joke-list">
  {% for joke in ratedJokes %}
    {% include "server/components/list-item/list-item.liquid", joke: joke %}
  {% endfor %}
</ul>
```

- In de `list-item.liquid` component toon ik de grap, de rating (👍 of 👎) en een verwijderknop:

```liquid
<li class="joke-card">
  <p>{{ joke.joke }}</p>
  <p>{{ joke.rating == 'good' ? '👍' : '👎' }}</p>
  <form method="POST" action="/delete">
    <input type="hidden" name="index" value="{{ forloop.index0 }}">
    <button type="submit">Verwijder</button>
  </form>
</li>
```

Met deze structuur kan ik de grappen netjes weergeven én makkelijk uitbreiden of stylen zonder steeds alles te kopiëren.  

## Web APIs + Content APIs
### SpeechSynthesis
Ik vond het belangrijk om een web API uit te kiezen die mijn grappige site nog grappiger kon maken. Ik heb daarom gekozen voor de SpeechSynthesis API die zorgt ervoor dat alle jokes uitgesproken worden. Ik heb hier nog een Wiggle animatie aan gekoppeld om het te laten lijken alsof Clippy aan het praten is.

```` js
    const spraak = new SpeechSynthesisUtterance(data.joke); speechSynthesis.speak(spraak);
````  
```` js
clippyImg.classList.add('talking');
    spraak.onend = () => {
  clippyImg.classList.remove('talking');
};
````  
### Notifications
Een 2e API vinden die echt leuk was moeilijk. Ik heb gekozen voor Notifications gekozen. Als je echt een leuke joke ziet dan kan je het met notifications. Om het een beetje interessant te maken en onderdeel van de site heb ik de notification `geEDGYfied` en sound effects toegevoegd

````js 
if (Notification.permission === 'granted') {
  new Notification('You better not send this to yo momma bro!🤓');
} else if (Notification.permission !== 'denied') {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      new Notification('You better not send this to yo momma bro!🤓');
    }
  });
} ````

# Conclusie!
Ik heb een interactieve site gemaakt en ik heb veel geleerd over APIs. Ik heb API data gefetched op de client en server side. Web en Content APIs aaan elkaar gekoppeld en daar interactie aan toegevoegd.  Het leukste vond ik toch de styling en hoe Clippy interactie heeft met de API. 

Ondanks dat ik 'teveel' nieuwe impressies heb gehad, waardoor ik veel moeite heb gehad. vind ik het stiekem toch wel leuk, ik heb alleen meer tijd nodig om er meer grip op te krijgen zodat ik veel beter dingen begrijp zoals syntax en waaar in de order het moet.  
APIs maken sites wel leuk informatief en interactief, een statische site is vaak een beetje saai tenzij het echt informatief moet zijn.  

Ik heb wel het meeste plezier gehad met het bedenken hoe Clippy interactie heeft met de API en hoe hij/zij eruit moet zien.

## Als ik nog meer tijd had zou ik...
likes willen toevoegen aan mijn JSON template zodat ik joke met de meeste likes op de home pagina met een kroontje zou kunnen displayen en wat styling dingentjes tweaken om het gelikt te maken.