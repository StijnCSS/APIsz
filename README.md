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
De nieuwe manier werkt nu wel omdat de server geen browser is en het niet blokkeerd.

OUD

```js
fetch('https://www.yomama-jokes.com/api/v1/jokes/random/')
  .then(response => response.json())
  .then(data => {
    document.getElementById('joke').textContent = data.joke;
  });
```

NEW

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

Web api's

### Archiefpagina & Templatesysteem

Voor het overzicht van beoordeelde grappen heb ik een aparte pagina gemaakt: `/archive`.

Deze maakt gebruik van een **Liquid template systeem** waarbij ik componenten herbruikbaar kan maken.  
Op de `/archive`-pagina laad ik het template `detail.liquid`, en daarin gebruik ik een losse component `list-item.liquid` voor elke grap.

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