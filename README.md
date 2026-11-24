# Khep

A freight app for Indian road transport. The website explains Khep, signs people up and sends them to download the app. The app gives each kind of user their own tools.

Live site: https://anshumantewary-pm.github.io/khep/

## What's here

| File | What it is |
| --- | --- |
| `index.html` | The website: what Khep is, the **Download the app** section, sign-up, and a clickable concept prototype |
| `app.html` | The Khep app, installable on Android, iPhone and desktop as a Progressive Web App |
| `manifest.webmanifest`, `sw.js`, `icons/` | What makes the app installable and lets it open offline |

## The app, by role

Sign-up asks who you are (driver, company or contractor), what goods you deal in (including which crops), and whether you buy, sell or both. The app then shows:

- **Driver:** live loads from where to where, nearest pickup first; My trips with status updates; a map of pickups; earnings and expenses with a per-trip breakdown; and ways to earn more, such as return loads, harvest seasons and the crop calendar.
- **Company:** verified trucks near you to book, with a fair-price estimate; shipments; a map; spend analytics by month, truck type and route; and ways to save.
- **Contractor:** the nearest drivers and transport companies; bookings; a map; spend analytics; and ways to earn more. For crop sellers this includes a mandi price calculator that subtracts truck cost.

Location comes from the phone's GPS when the user allows it, and otherwise from the city they signed up with.

Try a sample account without signing up:

- https://anshumantewary-pm.github.io/khep/app.html?demo=driver
- https://anshumantewary-pm.github.io/khep/app.html?demo=company
- https://anshumantewary-pm.github.io/khep/app.html?demo=contractor

## Current limits

- All loads, trucks, buyers, prices and history are generated sample data.
- Accounts and activity are stored only in the user's browser. There is no server yet.
- Sign-ups are not sent anywhere until `SIGNUP_ENDPOINT` in `index.html` is set to a form endpoint such as Formspree.
- Mandi prices are illustrative. Real prices should come from eNAM or Agmarknet.

## Run it locally

The install and offline features need a web server, not a file opened from disk:

```
python -m http.server 8765
```

Then open http://127.0.0.1:8765/.

After changing app files, bump `VERSION` in `sw.js` so installed copies update.
