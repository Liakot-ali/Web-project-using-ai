Run a simple static server that also exposes an API to persist products.

Install dependencies and start:

```bash
cd "j:/Web Design/liton-desk-studio"
npm install
npm start
```

- Server runs on http://localhost:3000 by default.
- The site will be served as static files and the API endpoints:
  - GET /api/products -> returns `assets/data/seed-products.json`
  - PUT /api/products -> overwrite `assets/data/seed-products.json` with posted JSON array

Notes:
- For multi-device access use http://<host-ip>:3000 and open that URL from other devices on your LAN.
- Admin actions in the site now attempt to persist changes to the server file; if the server is not running the site falls back to localStorage.
