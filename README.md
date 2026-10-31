# Phone-o

Phone-o asks ten quick questions and recommends three phones sold in Australia, with the reasons for each pick. The site is a folding phone: it opens to ask the questions and folds shut to show the results.

## How it works

- **No AI picks the phones.** Each phone has 0 to 10 ratings for camera, battery, speed, screen and toughness. Answers become weights, phones over budget or on the wrong platform are filtered out, and the rest are ranked by plain maths. The same answers always give the same phones.
- **The phone list is one file**, `docs/phones.json`. Specs and ratings are shared; prices sit under a country code (`AU`) so more countries can be added later.

## Files

| Path | What it is |
|---|---|
| `docs/index.html` | The website (questions, fold animation, results) |
| `docs/scoring.js` | The ranking maths |
| `docs/phones.json` | The phone list with Australian prices |
| `scripts/test-scoring.js` | Checks the phone list and sample results |

## Updating the phone list

Edit `docs/phones.json`, then run `node scripts/test-scoring.js` to check it. Each price has a `price_status` (`verified`, `launch_rrp`, `review_listing`, `retailer_listing` or `estimate`) and a `price_source` link, plus the date it was `checked`.

## Running it locally

The page loads `phones.json`, so open it through a local server rather than double-clicking the file:

```
cd docs && python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Hosting

The site is served free by GitHub Pages from the `docs` folder of the `main` branch.
