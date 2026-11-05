# Novaris Photo Guides

Static website for Novaris Photo Guides, which sells downloadable PDF reference guides for photographers. Plain HTML, CSS, and vanilla JavaScript with no build step, published with GitHub Pages from the root of `main`.

## Adding checkout links

Product names, prices, and checkout links live in `js/products.js`. Each product has a `checkoutUrl` field. While it is an empty string, no buy button is shown on that product's page; the price and details still display. Paste a full `https://` checkout link into `checkoutUrl`, commit, and push, and the buy button appears on that product's page automatically.

## Structure

- `index.html`: home page
- `*-guide.html`, `complete-reference-library.html`: one page per product
- `about.html`, `faq.html`, `contact.html`
- `terms.html`, `privacy.html`, `refunds.html`, `delivery.html`, `disclaimer.html`
- `404.html`, `sitemap.xml`, `robots.txt`, `favicon.svg`
- `css/styles.css`, `js/main.js`, `js/products.js`
