/*
  Novaris Photo Guides — product catalog.

  Product pages read names and prices from this file and render their buy
  buttons from checkoutUrl. While checkoutUrl is an empty string, no buy
  button (and no terms checkbox) is shown. Paste a full https:// checkout
  link into checkoutUrl and the button appears on that product's page.

  After payment, set the payment provider's success URL to the product's
  confirmationPath on the live site, adding the provider's order or session
  ID as a query parameter (for example ?session_id=...). The confirmation
  page then issues the same license code for that order every time.

  Prices are in US dollars.
*/
window.NOVARIS_PRODUCTS = [
  {
    id: "portrait-session-guide",
    slug: "portrait-session-guide",
    name: "Portrait Session Guide",
    productCode: "PT",
    price: 34,
    currency: "USD",
    short: "Interactive shot lists for headshot, family, and couples sessions, tap-to-explain lighting diagrams, illustrated posing references, a settings reference with exposure calculator, session planning sheets, and a client questionnaire.",
    description: "A browser-based field guide for portrait sessions, built for use on a phone during the shoot.",
    confirmationPath: "/thank-you/portrait-session-guide/",
    checkoutUrl: ""
  },
  {
    id: "wedding-day-guide",
    slug: "wedding-day-guide",
    name: "Wedding Day Guide",
    productCode: "WD",
    price: 52,
    currency: "USD",
    short: "A full-day shot list by phase, an editable wedding timeline, a family formals grouping planner, a venue scouting worksheet, a gear checklist, a client questionnaire, and a settings reference with exposure calculator.",
    description: "A browser-based field guide for covering a wedding day from preparation to reception.",
    confirmationPath: "/thank-you/wedding-day-guide/",
    checkoutUrl: ""
  },
  {
    id: "product-photography-guide",
    slug: "product-photography-guide",
    name: "Product Photography Guide",
    productCode: "PD",
    price: 39,
    currency: "USD",
    short: "Tap-to-explain tabletop lighting diagrams, a background and surface reference, shot lists for standard e-commerce angles, and settings charts with an exposure calculator.",
    description: "A browser-based field guide for tabletop product photography.",
    confirmationPath: "/thank-you/product-photography-guide/",
    checkoutUrl: ""
  },
  {
    id: "landscape-travel-field-guide",
    slug: "landscape-travel-field-guide",
    name: "Landscape & Travel Field Guide",
    productCode: "FD",
    price: 29,
    currency: "USD",
    short: "A sunrise, sunset, golden and blue hour planner, location scouting worksheets, a composition reference, field settings with an exposure and filter calculator, a gear checklist, and a printable pocket card.",
    description: "A browser-based field guide for landscape and travel photography.",
    confirmationPath: "/thank-you/landscape-travel-field-guide/",
    checkoutUrl: ""
  },
  {
    id: "event-coverage-guide",
    slug: "event-coverage-guide",
    name: "Event Coverage Guide",
    productCode: "EV",
    price: 44,
    currency: "USD",
    short: "Interactive shot lists for corporate events, parties, and conferences, tap-to-explain flash setups, a low-light settings reference with exposure calculator, and run-of-show planning sheets.",
    description: "A browser-based field guide for covering corporate events, parties, and conferences.",
    confirmationPath: "/thank-you/event-coverage-guide/",
    checkoutUrl: ""
  },
  {
    id: "complete-reference-library",
    slug: "complete-reference-library",
    name: "Complete Reference Library",
    productCode: "CR",
    price: 119,
    currency: "USD",
    short: "All five field guides unlocked by a single license: Portrait Session, Wedding Day, Product Photography, Landscape & Travel Field, and Event Coverage.",
    description: "All five Novaris field guides, unlocked together with one license code.",
    confirmationPath: "/thank-you/complete-reference-library/",
    checkoutUrl: ""
  }
];
