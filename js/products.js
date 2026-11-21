/*
  Novaris Photo Guides — product catalog.

  Product pages, the cart (js/cart.js), and the checkout read names, prices,
  and add-ons from this file. Every product page has an Add to cart button;
  the cart is kept in the buyer's browser until checkout.

  Field Kit products (no format) unlock with a license code. After payment,
  send the buyer to the product's confirmationPath, adding the order ID as a
  query parameter (for example ?order_id=...). The confirmation page then
  issues the same license code for that order every time.

  Products with format "pdf" are printable PDF guides. Their options are
  add-ons the buyer can tick before adding the guide to the cart.

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
    confirmationPath: "/thank-you/portrait-session-guide/"
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
    confirmationPath: "/thank-you/wedding-day-guide/"
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
    confirmationPath: "/thank-you/product-photography-guide/"
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
    confirmationPath: "/thank-you/landscape-travel-field-guide/"
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
    confirmationPath: "/thank-you/event-coverage-guide/"
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
    confirmationPath: "/thank-you/complete-reference-library/"
  },
  {
    id: "seasonal-mini-sessions-guide",
    slug: "seasonal-mini-sessions-guide",
    name: "Seasonal Mini Sessions Guide",
    format: "pdf",
    category: "portraits",
    price: 20,
    currency: "USD",
    short: "Shot lists, a back-to-back scheduling template, and set-up notes for short seasonal mini sessions.",
    pages: 9,
    options: [
      {
        id: "holiday-backdrop-setup-cards",
        name: "Holiday backdrop setup cards",
        price: 2
      },
      {
        id: "booking-slot-planner",
        name: "Booking slot planner",
        price: 1
      },
      {
        id: "client-reminder-message-templates",
        name: "Client reminder message templates",
        price: 2
      }
    ]
  },
  {
    id: "street-photography-field-guide",
    slug: "street-photography-field-guide",
    name: "Street Photography Field Guide",
    format: "pdf",
    category: "outdoors",
    price: 24,
    currency: "USD",
    short: "Zone-focus reference, a walk planner, and pocket settings for shooting in public spaces.",
    pages: 8,
    options: [
      {
        id: "pocket-settings-card",
        name: "Pocket settings card",
        price: 2
      },
      {
        id: "zone-focus-distance-chart",
        name: "Zone focus distance chart",
        price: 2
      },
      {
        id: "photo-walk-route-planner",
        name: "Photo walk route planner",
        price: 1
      }
    ]
  },
  {
    id: "large-group-reunion-guide",
    slug: "large-group-reunion-guide",
    name: "Large Group & Reunion Guide",
    format: "pdf",
    category: "portraits",
    price: 26,
    currency: "USD",
    short: "Group arrangement diagrams, a name-list grouping planner, and outdoor setup notes for big groups.",
    pages: 9,
    options: [
      {
        id: "group-arrangement-planner",
        name: "Group arrangement planner",
        price: 3
      },
      {
        id: "name-list-grouping-sheet",
        name: "Name-list grouping sheet",
        price: 2
      },
      {
        id: "outdoor-reflector-setup-card",
        name: "Outdoor reflector setup card",
        price: 2
      }
    ]
  },
  {
    id: "pet-photography-guide",
    slug: "pet-photography-guide",
    name: "Pet Photography Guide",
    format: "pdf",
    category: "portraits",
    price: 28,
    currency: "USD",
    short: "Shot lists for dogs, cats, and small pets, attention prompts, and an owner questionnaire.",
    pages: 9,
    options: [
      {
        id: "owner-questionnaire",
        name: "Owner questionnaire",
        price: 2
      },
      {
        id: "attention-prompt-cards",
        name: "Attention prompt cards",
        price: 1
      },
      {
        id: "outdoor-session-shot-list",
        name: "Outdoor session shot list",
        price: 2
      },
      {
        id: "studio-pet-setup-diagrams",
        name: "Studio pet setup diagrams",
        price: 3
      }
    ]
  },
  {
    id: "macro-close-up-guide",
    slug: "macro-close-up-guide",
    name: "Macro & Close-Up Guide",
    format: "pdf",
    category: "outdoors",
    price: 30,
    currency: "USD",
    short: "Depth-of-field charts, focus stacking worksheets, and diffuser setups for close-up work.",
    pages: 9,
    options: [
      {
        id: "focus-stacking-worksheet",
        name: "Focus stacking worksheet",
        price: 3
      },
      {
        id: "depth-of-field-chart",
        name: "Depth of field chart",
        price: 2
      },
      {
        id: "diffuser-setup-cards",
        name: "Diffuser setup cards",
        price: 2
      }
    ]
  },
  {
    id: "engagement-session-guide",
    slug: "engagement-session-guide",
    name: "Engagement Session Guide",
    format: "pdf",
    category: "weddings",
    price: 30,
    currency: "USD",
    short: "Engagement shot lists, a location scouting form, and couple posing prompts.",
    pages: 10,
    options: [
      {
        id: "couple-questionnaire",
        name: "Couple questionnaire",
        price: 2
      },
      {
        id: "prompt-card-deck",
        name: "Prompt card deck",
        price: 3
      },
      {
        id: "location-scouting-form",
        name: "Location scouting form",
        price: 2
      },
      {
        id: "outfit-planning-sheet",
        name: "Outfit planning sheet",
        price: 1
      }
    ]
  },
  {
    id: "maternity-portrait-guide",
    slug: "maternity-portrait-guide",
    name: "Maternity Portrait Guide",
    format: "pdf",
    category: "portraits",
    price: 32,
    currency: "USD",
    short: "Maternity shot lists, posing references, and natural-light setups for indoor and outdoor sessions.",
    pages: 9,
    options: [
      {
        id: "wardrobe-planning-sheet",
        name: "Wardrobe planning sheet",
        price: 2
      },
      {
        id: "client-questionnaire",
        name: "Client questionnaire",
        price: 2
      },
      {
        id: "golden-hour-location-worksheet",
        name: "Golden hour location worksheet",
        price: 3
      }
    ]
  },
  {
    id: "concert-live-music-guide",
    slug: "concert-live-music-guide",
    name: "Concert & Live Music Guide",
    format: "pdf",
    category: "events",
    price: 34,
    currency: "USD",
    short: "Low-light settings, venue access checklists, and set-list shot planning for live shows.",
    pages: 7,
    options: [
      {
        id: "low-light-pocket-settings-card",
        name: "Low-light pocket settings card",
        price: 3
      },
      {
        id: "venue-access-checklist",
        name: "Venue access checklist",
        price: 2
      },
      {
        id: "set-list-shot-planner",
        name: "Set-list shot planner",
        price: 2
      }
    ]
  },
  {
    id: "video-b-roll-shot-list-guide",
    slug: "video-b-roll-shot-list-guide",
    name: "Video B-Roll & Shot List Guide",
    format: "pdf",
    category: "events",
    price: 35,
    currency: "USD",
    short: "B-roll checklists, storyboard sheets, and shot lists for short video projects.",
    pages: 8,
    options: [
      {
        id: "storyboard-sheets",
        name: "Storyboard sheets",
        price: 3
      },
      {
        id: "audio-recording-checklist",
        name: "Audio recording checklist",
        price: 2
      },
      {
        id: "interview-setup-diagrams",
        name: "Interview setup diagrams",
        price: 4
      },
      {
        id: "edit-log-template",
        name: "Edit log template",
        price: 1
      }
    ]
  },
  {
    id: "newborn-baby-session-guide",
    slug: "newborn-baby-session-guide",
    name: "Newborn & Baby Session Guide",
    format: "pdf",
    category: "portraits",
    price: 36,
    currency: "USD",
    short: "Newborn and baby shot lists, a session timeline, and gentle posing and safety references.",
    pages: 9,
    options: [
      {
        id: "safety-and-posing-checklist-cards",
        name: "Safety and posing checklist cards",
        price: 3
      },
      {
        id: "parent-prep-questionnaire",
        name: "Parent prep questionnaire",
        price: 2
      },
      {
        id: "session-timeline-template",
        name: "Session timeline template",
        price: 2
      },
      {
        id: "prop-and-wrap-planning-sheet",
        name: "Prop and wrap planning sheet",
        price: 1
      }
    ]
  },
  {
    id: "astrophotography-night-sky-guide",
    slug: "astrophotography-night-sky-guide",
    name: "Astrophotography & Night Sky Guide",
    format: "pdf",
    category: "outdoors",
    price: 38,
    currency: "USD",
    short: "Night-sky settings, dark-site scouting forms, and planning sheets for Milky Way and star-trail shots.",
    pages: 8,
    options: [
      {
        id: "moon-phase-planning-sheet",
        name: "Moon phase planning sheet",
        price: 2
      },
      {
        id: "star-trail-stacking-worksheet",
        name: "Star trail stacking worksheet",
        price: 3
      },
      {
        id: "red-light-pocket-card",
        name: "Red-light pocket card",
        price: 2
      },
      {
        id: "dark-site-scouting-form",
        name: "Dark-site scouting form",
        price: 1
      }
    ]
  },
  {
    id: "food-photography-guide",
    slug: "food-photography-guide",
    name: "Food Photography Guide",
    format: "pdf",
    category: "commercial",
    price: 39,
    currency: "USD",
    short: "Window-light and overhead setups, styling checklists, and shot lists for menus and recipes.",
    pages: 9,
    options: [
      {
        id: "plating-and-styling-checklist",
        name: "Plating and styling checklist",
        price: 2
      },
      {
        id: "window-light-setup-cards",
        name: "Window-light setup cards",
        price: 3
      },
      {
        id: "overhead-rig-planning-sheet",
        name: "Overhead rig planning sheet",
        price: 2
      }
    ]
  },
  {
    id: "wildlife-bird-photography-guide",
    slug: "wildlife-bird-photography-guide",
    name: "Wildlife & Bird Photography Guide",
    format: "pdf",
    category: "outdoors",
    price: 40,
    currency: "USD",
    short: "Field settings, hide planning sheets, and species logs for wildlife and bird photography.",
    pages: 9,
    options: [
      {
        id: "hide-and-blind-planning-sheet",
        name: "Hide and blind planning sheet",
        price: 3
      },
      {
        id: "species-log-worksheet",
        name: "Species log worksheet",
        price: 2
      },
      {
        id: "field-ethics-checklist",
        name: "Field ethics checklist",
        price: 1
      },
      {
        id: "shutter-and-iso-pocket-card",
        name: "Shutter and ISO pocket card",
        price: 2
      }
    ]
  },
  {
    id: "headshot-corporate-team-guide",
    slug: "headshot-corporate-team-guide",
    name: "Headshot & Corporate Team Guide",
    format: "pdf",
    category: "portraits",
    price: 42,
    currency: "USD",
    short: "Team-day scheduling, consistent lighting setups, and shot lists for corporate headshots.",
    pages: 9,
    options: [
      {
        id: "team-day-scheduling-sheet",
        name: "Team day scheduling sheet",
        price: 3
      },
      {
        id: "client-wardrobe-and-background-guide",
        name: "Client wardrobe and background guide",
        price: 2
      },
      {
        id: "retouch-notes-template",
        name: "Retouch notes template",
        price: 1
      },
      {
        id: "multi-location-setup-cards",
        name: "Multi-location setup cards",
        price: 4
      }
    ]
  },
  {
    id: "real-estate-interiors-guide",
    slug: "real-estate-interiors-guide",
    name: "Real Estate & Interiors Guide",
    format: "pdf",
    category: "commercial",
    price: 44,
    currency: "USD",
    short: "Room-by-room shot lists, bracketing references, and twilight exterior planning for property shoots.",
    pages: 9,
    options: [
      {
        id: "room-by-room-shot-list-cards",
        name: "Room-by-room shot list cards",
        price: 3
      },
      {
        id: "twilight-exterior-planner",
        name: "Twilight exterior planner",
        price: 4
      },
      {
        id: "flash-bracketing-reference-card",
        name: "Flash bracketing reference card",
        price: 2
      },
      {
        id: "homeowner-property-prep-checklist",
        name: "Homeowner property prep checklist",
        price: 1
      }
    ]
  },
  {
    id: "elopement-small-wedding-guide",
    slug: "elopement-small-wedding-guide",
    name: "Elopement & Small Wedding Guide",
    format: "pdf",
    category: "weddings",
    price: 45,
    currency: "USD",
    short: "Elopement timelines, location and permit checklists, and shot lists for small weddings.",
    pages: 10,
    options: [
      {
        id: "elopement-timeline-template",
        name: "Elopement timeline template",
        price: 3
      },
      {
        id: "permit-and-location-checklist",
        name: "Permit and location checklist",
        price: 2
      },
      {
        id: "vow-moment-shot-list",
        name: "Vow moment shot list",
        price: 2
      },
      {
        id: "weather-backup-planner",
        name: "Weather backup planner",
        price: 1
      }
    ]
  },
  {
    id: "sports-action-guide",
    slug: "sports-action-guide",
    name: "Sports & Action Guide",
    format: "pdf",
    category: "events",
    price: 46,
    currency: "USD",
    short: "Shutter-speed references, sideline positioning diagrams, and shot lists for sports and action.",
    pages: 9,
    options: [
      {
        id: "sport-specific-shot-list-pack",
        name: "Sport-specific shot list pack",
        price: 4
      },
      {
        id: "shutter-speed-pocket-card",
        name: "Shutter speed pocket card",
        price: 2
      },
      {
        id: "sideline-positioning-diagrams",
        name: "Sideline positioning diagrams",
        price: 3
      },
      {
        id: "season-planning-calendar",
        name: "Season planning calendar",
        price: 2
      }
    ]
  },
  {
    id: "automotive-photography-guide",
    slug: "automotive-photography-guide",
    name: "Automotive Photography Guide",
    format: "pdf",
    category: "commercial",
    price: 48,
    currency: "USD",
    short: "Static and rolling shot lists, reflection control setups, and location planning for vehicles.",
    pages: 8,
    options: [
      {
        id: "rolling-shot-safety-checklist",
        name: "Rolling shot safety checklist",
        price: 3
      },
      {
        id: "light-painting-worksheet",
        name: "Light painting worksheet",
        price: 4
      },
      {
        id: "detail-shot-list",
        name: "Detail shot list",
        price: 2
      }
    ]
  },
  {
    id: "architecture-photography-guide",
    slug: "architecture-photography-guide",
    name: "Architecture Photography Guide",
    format: "pdf",
    category: "commercial",
    price: 50,
    currency: "USD",
    short: "Perspective references, sun-path facade planning, and interior and exterior shot lists.",
    pages: 8,
    options: [
      {
        id: "perspective-correction-reference",
        name: "Perspective correction reference",
        price: 2
      },
      {
        id: "sun-path-facade-planner",
        name: "Sun-path facade planner",
        price: 4
      },
      {
        id: "interior-bracketing-sheet",
        name: "Interior bracketing sheet",
        price: 3
      }
    ]
  },
  {
    id: "drone-aerial-planning-guide",
    slug: "drone-aerial-planning-guide",
    name: "Drone & Aerial Planning Guide",
    format: "pdf",
    category: "outdoors",
    price: 52,
    currency: "USD",
    short: "Pre-flight checklists, airspace and permit planning sheets, and aerial shot pattern diagrams.",
    pages: 8,
    options: [
      {
        id: "pre-flight-checklist-cards",
        name: "Pre-flight checklist cards",
        price: 3
      },
      {
        id: "airspace-and-permit-planning-sheet",
        name: "Airspace and permit planning sheet",
        price: 4
      },
      {
        id: "aerial-shot-pattern-diagrams",
        name: "Aerial shot pattern diagrams",
        price: 3
      },
      {
        id: "battery-and-flight-log",
        name: "Battery and flight log",
        price: 1
      }
    ]
  },
  {
    id: "brand-content-photography-guide",
    slug: "brand-content-photography-guide",
    name: "Brand Content Photography Guide",
    format: "pdf",
    category: "commercial",
    price: 54,
    currency: "USD",
    short: "Content calendars, product and lifestyle shot lists, and mood boards for small-business brand shoots.",
    pages: 10,
    options: [
      {
        id: "content-calendar-sheet",
        name: "Content calendar sheet",
        price: 3
      },
      {
        id: "product-and-lifestyle-shot-list",
        name: "Product and lifestyle shot list",
        price: 3
      },
      {
        id: "brand-mood-board-template",
        name: "Brand mood board template",
        price: 2
      },
      {
        id: "image-usage-notes-template",
        name: "Image usage notes template",
        price: 1
      }
    ]
  },
  {
    id: "fashion-lookbook-guide",
    slug: "fashion-lookbook-guide",
    name: "Fashion & Lookbook Guide",
    format: "pdf",
    category: "commercial",
    price: 58,
    currency: "USD",
    short: "Call sheets, garment shot lists, and strobe setups for fashion and lookbook shoots.",
    pages: 9,
    options: [
      {
        id: "mood-board-template",
        name: "Mood board template",
        price: 3
      },
      {
        id: "model-call-sheet",
        name: "Model call sheet",
        price: 2
      },
      {
        id: "garment-shot-list",
        name: "Garment shot list",
        price: 3
      },
      {
        id: "strobe-lighting-setup-cards",
        name: "Strobe lighting setup cards",
        price: 4
      }
    ]
  },
  {
    id: "studio-lighting-setups-library",
    slug: "studio-lighting-setups-library",
    name: "Studio Lighting Setups Library",
    format: "pdf",
    category: "commercial",
    price: 64,
    currency: "USD",
    short: "A library of overhead studio lighting diagrams with placement notes for one to four lights.",
    pages: 13,
    options: [
      {
        id: "gel-and-color-setup-cards",
        name: "Gel and color setup cards",
        price: 3
      },
      {
        id: "light-ratio-reference-sheet",
        name: "Light ratio reference sheet",
        price: 2
      },
      {
        id: "studio-booking-checklist",
        name: "Studio booking checklist",
        price: 1
      },
      {
        id: "background-setup-diagrams",
        name: "Background setup diagrams",
        price: 4
      }
    ]
  },
  {
    id: "client-workflow-kit",
    slug: "client-workflow-kit",
    name: "Client Workflow Kit",
    format: "pdf",
    category: "commercial",
    price: 68,
    currency: "USD",
    short: "Booking, session-day, and delivery checklists plus message templates for running client shoots.",
    pages: 9,
    options: [
      {
        id: "client-message-template-pack",
        name: "Client message template pack",
        price: 3
      },
      {
        id: "pricing-worksheet",
        name: "Pricing worksheet",
        price: 2
      },
      {
        id: "session-booking-checklist",
        name: "Session booking checklist",
        price: 2
      },
      {
        id: "gallery-delivery-checklist",
        name: "Gallery delivery checklist",
        price: 1
      }
    ]
  },
  {
    id: "wedding-portrait-pro-bundle",
    slug: "wedding-portrait-pro-bundle",
    name: "Wedding & Portrait Pro Bundle",
    format: "pdf",
    category: "weddings",
    price: 145,
    currency: "USD",
    short: "Seven guides together: Wedding Day, Portrait Session, Engagement Session, Elopement & Small Wedding, Newborn & Baby, Maternity Portrait, and Large Group & Reunion.",
    pages: 83,
    options: [
      {
        id: "pocket-card-set-for-every-included-guide",
        name: "Pocket card set for every included guide",
        price: 5
      },
      {
        id: "client-questionnaire-bundle",
        name: "Client questionnaire bundle",
        price: 3
      },
      {
        id: "yearly-booking-calendar",
        name: "Yearly booking calendar",
        price: 2
      },
      {
        id: "a4-and-us-letter-print-editions",
        name: "A4 and US Letter print editions",
        price: 4
      }
    ]
  }
];
