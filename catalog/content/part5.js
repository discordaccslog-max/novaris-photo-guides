import fs from "node:fs";
import path from "node:path";
import { shotlist, checklist, worksheet, table, cards, templates, settings, setup, questionnaire, text, poses, calendar, rows, el, beam } from "./helpers.js";
import portraitFK from "../../field-kit/guides/portrait-session-guide.js";
import weddingFK from "../../field-kit/guides/wedding-day-guide.js";
import part1 from "./part1.js";
import part2 from "./part2.js";
import part4 from "./part4.js";
import { aperture } from "../../tools/site-svg.js";

const camera = (notes, x = 180, label = "Camera") => el("camera", "camera", x, 262, label, "Your shooting position.", notes);
const subject = (notes, label = "Subject", x = 180, y = 140) => el("subject", "subject", x, y, label, "The person being photographed.", notes);
const key = (notes, x = 100, y = 120, type = "softbox", label = "Key light (softbox)") => el("key", type, x, y, label, "Main light: direction and shadow shape.", notes);

/* ---------- Field Kit guides as print blocks (for the bundle) ---------- */

function fromFieldKit(g, name, subtitle, intro) {
  const blocks = [];
  for (const s of g.shotlists || []) blocks.push(shotlist(s.title, s.description, s.sections.map((sec) => ({ title: sec.title, items: sec.items.map((i) => (i.note ? [i.text, i.note] : i.text)) }))));
  for (const l of g.lighting || []) blocks.push(setup(l.title, l.summary, l.elements, l.beams, l.tips));
  if (g.poses) blocks.push(poses("Posing references", "Simple figure diagrams with notes. The amber figure is the main subject; the camera marker shows a suggested lens height.", g.poses));
  for (const t of (g.settings && g.settings.tables) || []) blocks.push(settings(t.title, "Starting points. Adjust for your light, lens, and subject.", t.rows, g.settings.rules));
  for (const p of g.planning || []) {
    if (p.kind === "worksheet") blocks.push(worksheet(p.title, p.description, p.sections.flatMap((s) => s.fields.map((f) => (f.type === "textarea" ? "+" : "") + f.label))));
    if (p.kind === "table") blocks.push(table(p.title, p.description, p.columns.map((c) => c.label), p.rows, { widths: p.columns.map((c) => c.width) }));
    if (p.kind === "groups") blocks.push(table(p.title, p.description, ["#", "Group", "Names", "Done"], p.groups.map((x, i) => [String(i + 1), x, "", ""]), { widths: [0.06, 0.34, 0.5, 0.1] }));
    if (p.kind === "checklist") blocks.push(checklist(p.title, p.description, p.sections.map((s) => ({ title: s.title, items: s.items }))));
    if (p.kind === "questionnaire") blocks.push(questionnaire(p.title, p.intro, p.questions));
  }
  return { name, subtitle, intro, blocks };
}

const portraitGuide = fromFieldKit(portraitFK, "Portrait Session Guide", "Shot lists for headshot, family, and couples sessions, lighting setups, posing references, settings, a session planning sheet, and a client questionnaire.", [
  "A reference for portrait sessions: shot lists organized by session type, overhead lighting diagrams for natural light and one or two lights, posing references, and planning pages for each client session.",
  "Print the pages you need for each session and keep them with your kit."
]);
const weddingGuide = fromFieldKit(weddingFK, "Wedding Day Guide", "A full-day shot list by phase, a timeline, a family formals grouping planner, a venue scouting worksheet, a gear checklist, a client questionnaire, and settings.", [
  "A planning and reference set for covering a wedding day from preparation to reception.",
  "Fill in the timeline, grouping planner, and venue worksheet before the day, and carry the shot list and timeline on the day itself."
]);
const bySlug = (slug) => [...part1, ...part2, ...part4].find((g) => g.slug === slug);
const BUNDLE = [weddingGuide, portraitGuide, bySlug("engagement-session-guide"), bySlug("elopement-small-wedding-guide"), bySlug("newborn-baby-session-guide"), bySlug("maternity-portrait-guide"), bySlug("large-group-reunion-guide")];

const studioSetup = (title, summary, elements, beams, tips) => setup(title, summary, elements, beams, tips);

export default [
  /* ------------------------------------------------------------------ */
  {
    slug: "brand-content-photography-guide",
    name: "Brand Content Photography Guide",
    subtitle: "Content shot lists, a content calendar, mood board and brief templates, lighting for product and lifestyle, and image usage notes for small-business brand shoots.",
    intro: [
      "Brand shoots produce a library of images a business can use for months: products, people, process, and place, all in a consistent style. The planning documents in this guide turn a client's needs into a shot list and a shoot day that covers them efficiently.",
      "Agree how and where images will be used before the shoot, and record it with the usage notes template."
    ],
    blocks: [
      shotlist("Brand content shot list", "A broad library that covers most small-business needs.", [
        { title: "People", items: ["Founder or owner portrait", "Team portraits", "Team working together", "Customer interaction (with permission)"] },
        { title: "Product", items: ["Hero product on brand background", "Product in use", "Product details and textures", "Packaging and unboxing", "Flat lay of the range"] },
        { title: "Process and place", items: ["Hands making or preparing", "Tools and materials", "Workspace or storefront", "Signage and exterior"] },
        { title: "Formats", items: ["Vertical frames for stories and reels", "Wide frames with space for text", "Square crops for grids"] }
      ], { fields: ["Client", "Shoot date"] }),
      table("Content calendar", "Map shots to planned posts and campaigns so the shoot covers real needs.", ["Week", "Channel", "Topic or campaign", "Images needed", "Format", "Shot on day?"], Array.from({ length: 12 }, (_, i) => [String(i + 1), "", "", "", "", ""]), { kicker: "Planner", widths: [0.07, 0.15, 0.27, 0.23, 0.14, 0.14] }),
      worksheet("Brand shoot brief", "Agree the brief with the client.", ["Business", "Contact", "Shoot date", "Location", "Brand colors", "Brand fonts and tone", "Image count", "Delivery date", "+Who the customers are", "+Words that describe the brand's look", "+Must-have shots", "+Usage: website, social, print, ads"]),
      setup("Product and lifestyle table setup", "One soft light from the side works for products and hands at work.", [
        el("window", "window", 46, 130, "Window or softbox", "Main light.", "Soft light from the side shows texture in products and hands."),
        el("table", "table", 180, 150, "Work surface", "Products and props.", "Use brand colors and materials in surfaces and props."),
        el("card", "card", 290, 150, "White card", "Fill.", "Opposite the light."),
        camera("Shoot overhead, at 45°, and straight-on for variety.")
      ], [beam("window", "table"), beam("card", "table", "bounce")], ["Leave negative space in some frames for text overlays."]),
      settings("Brand content settings", "Starting points.", rows([
        ["Portraits, window light", "f/2.8", "1/200", "400", "Soft background."],
        ["Product on a table", "f/5.6–f/8", "1/125", "200", "Tripod for consistency."],
        ["Hands at work", "f/4", "1/250", "800", "Fast enough for movement."],
        ["Workspace wide", "f/5.6", "1/125", "800", "Turn off mixed lights."]
      ])),
      checklist("Shoot day checklist", "Before you start.", [
        { title: "Prep", items: ["Brief and shot list printed", "Brand colors and props gathered", "Model releases for people photographed", "Space cleaned and staged"] },
        { title: "Kit", items: ["Tripod", "Reflector and cards", "Grey card", "Steamer or lint roller for textiles"] }
      ])
    ],
    addons: [
      { name: "Content calendar sheet", subtitle: "A quarter-by-quarter content plan.", blocks: [
        table("Content calendar: months 1–3", "Plan posts and the images each one needs.", ["Date", "Channel", "Topic", "Image", "Caption idea", "Posted"], Array.from({ length: 18 }, () => ["", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.1, 0.13, 0.2, 0.2, 0.27, 0.1] }),
        table("Content calendar: months 4–6", "Plan posts and the images each one needs.", ["Date", "Channel", "Topic", "Image", "Caption idea", "Posted"], Array.from({ length: 18 }, () => ["", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.1, 0.13, 0.2, 0.2, 0.27, 0.1] })
      ] },
      { name: "Product and lifestyle shot list", subtitle: "A complete product and lifestyle list per product.", blocks: [
        shotlist("Product and lifestyle shot list", "Repeat for each product.", [
          { title: "Product", items: ["Front on brand background", "Three-quarter angle", "Detail: texture or material", "Scale: in hand", "Packaging", "Range or variants together"] },
          { title: "Lifestyle", items: ["Product in use by a person", "Product in its natural setting", "Hands-only shot", "Flat lay with complementary props", "Vertical frame with text space"] }
        ], { kicker: "Add-on", fields: ["Product", "Brand"] })
      ] },
      { name: "Brand mood board template", subtitle: "Collect references for color, light, and styling.", blocks: [
        worksheet("Brand mood board", "Sketch or paste references in each area.", ["Brand", "Date", "+Color palette (swatches)", "+Light: bright, soft, moody, or high contrast", "+Props and surfaces", "+People and wardrobe", "+Composition references", "+Words to avoid"], { kicker: "Add-on" })
      ] },
      { name: "Image usage notes template", subtitle: "Record how and where images may be used.", blocks: [
        table("Image usage notes", "Agree usage with the client and record it for each image set.", ["Image set", "Where used", "Duration", "Territory", "Exclusive?", "Agreed on"], Array.from({ length: 12 }, () => ["", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.2, 0.24, 0.13, 0.13, 0.12, 0.18] })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "fashion-lookbook-guide",
    name: "Fashion & Lookbook Guide",
    subtitle: "Call sheets, garment shot lists, strobe lighting setups, posing notes, and settings for fashion and lookbook shoots.",
    intro: [
      "Lookbooks show a collection clearly and consistently, while editorial fashion tells a story. Both depend on planning: a call sheet everyone works from, a garment list so no piece is missed, and a lighting setup chosen for the look.",
      "Garments come first: check fit, steam out creases, and photograph details that customers ask about."
    ],
    blocks: [
      worksheet("Model call sheet", "Share with everyone on the shoot.", ["Shoot", "Date", "Call time", "Location address", "Photographer", "Stylist", "Hair and makeup", "Model(s) and agency", "+Schedule and looks order", "+What to bring", "+Contacts and parking"]),
      shotlist("Garment shot list", "Repeat for each look in the collection.", [
        { title: "Each look", items: ["Full length, front", "Full length, back", "Three-quarter turn", "Movement: walking or turning", "Half length"] },
        { title: "Details", items: ["Fabric texture", "Fastenings, buttons, zips", "Labels or trims", "Fit at the waist or shoulder"] }
      ], { fields: ["Look #", "Garment"] }),
      setup("Clean lookbook setup", "Even, bright light on a seamless backdrop for e-commerce and lookbooks.", [
        el("backdrop", "backdrop", 180, 44, "Seamless backdrop", "Clean background.", "Light grey or white; keep the model 2 m in front."),
        el("bgL", "flash", 90, 60, "Background light", "Even backdrop.", "One on each side for an even white."),
        el("bgR", "flash", 270, 60, "Background light", "Even backdrop.", "Match power with the left light."),
        el("key", "softbox", 120, 190, "Large key (octabox)", "Main light.", "Near the camera, slightly to one side and above, for soft, even light."),
        el("model", "subject", 180, 130, "Model", "On a marked spot.", "Tape a mark so framing stays consistent."),
        camera("Same height and focal length for every look.", 196)
      ], [beam("key", "model"), beam("bgL", "backdrop"), beam("bgR", "backdrop")], ["Keep the backdrop one stop brighter than the model for clean white."]),
      setup("Editorial strobe with hard light", "A single hard light for contrast and defined shadows.", [
        el("backdrop", "backdrop", 180, 44, "Colored backdrop", "Bold background.", "Keep the model 2 m in front so the shadow falls where you want it."),
        el("key", "flash", 90, 110, "Bare or reflector-dish strobe", "Hard key light.", "High and to the side; crisp shadows suit editorial looks."),
        el("model", "subject", 180, 140, "Model", "Posed into the light.", "Turn the face toward the light to avoid deep eye shadows."),
        el("fill", "card", 264, 160, "White card", "Subtle fill.", "Optional; remove for maximum contrast."),
        camera("Low angle elongates the figure.")
      ], [beam("key", "model"), beam("fill", "model", "bounce")], ["Watch where the shadow falls on the backdrop; it becomes part of the image."]),
      cards("Posing notes", "Fashion posing shows the garment first.", [
        { title: "Show the garment", text: "Poses should reveal shape, drape, and details. Avoid crossing arms over the front of a garment." },
        { title: "Weight shift", text: "Weight on one leg creates a natural S-curve and shows how fabric falls." },
        { title: "Movement", text: "Walking, turning, and spinning show how a garment moves. Shoot in bursts." },
        { title: "Hands", text: "Keep hands soft and busy: on a lapel, in a pocket, adjusting a cuff." },
        { title: "Angles", text: "Three-quarter turns show both front and side of a garment." },
        { title: "Consistency", text: "For lookbooks, repeat the same few poses for every look." }
      ]),
      settings("Fashion settings", "Starting points.", rows([
        ["Lookbook on seamless", "f/8", "1/160", "100", "Deep focus for full length."],
        ["Editorial hard light", "f/8–f/11", "1/160", "100", "Crisp detail."],
        ["Outdoor natural light", "f/2.8–f/4", "1/500", "200", "Movement shots."],
        ["Detail close-ups", "f/5.6", "1/160", "100", "Texture with raking light."]
      ]))
    ],
    addons: [
      { name: "Mood board template", subtitle: "Collect references for the look of the shoot.", blocks: [
        worksheet("Fashion mood board", "Sketch or paste references in each area.", ["Collection", "Season", "+Color story", "+Lighting references", "+Hair and makeup references", "+Location or set references", "+Posing and movement references", "+Notes"], { kicker: "Add-on" })
      ] },
      { name: "Model call sheet", subtitle: "A call sheet to share with the whole team.", blocks: [
        worksheet("Model call sheet", "Send the day before.", ["Shoot name", "Date", "Call time", "Wrap time", "Location address", "Parking and entrance", "+Team and contacts", "+Schedule by look", "+What to bring: undergarments, shoes, references", "+Notes"], { kicker: "Add-on" })
      ] },
      { name: "Garment shot list", subtitle: "Track every garment and angle across a collection.", blocks: [
        table("Garment shot list", "One row per look. Tick each angle when done.", ["Look", "Garment", "Front", "Back", "3/4", "Detail", "Move"], Array.from({ length: 18 }, (_, i) => [String(i + 1), "", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.08, 0.32, 0.12, 0.12, 0.12, 0.12, 0.12] })
      ] },
      { name: "Strobe lighting setup cards", subtitle: "Three strobe setups for fashion.", blocks: [
        studioSetup("Beauty light with fill from below", "A key above the camera and a reflector below for glowing, even skin.", [
          el("key", "softbox", 96, 214, "Key above camera", "Main light from above (beauty dish or softbox).", "Centered above the lens, angled down (drawn beside the camera for clarity)."),
          el("fill", "reflector", 180, 176, "Reflector below", "Fills under the chin and eyes.", "Held at chest height, angled up."),
          subject("Face toward the camera.", "Model", 180, 110),
          camera("Shoot between the key and the reflector.", 180)
        ], [beam("key", "subject"), beam("fill", "subject", "bounce")], ["Ideal for head-and-shoulders and beauty crops."]),
        studioSetup("Rim lights for silhouette", "Two strip lights behind the model outline the figure.", [
          el("rimL", "strip", 90, 80, "Strip light (left)", "Edge light.", "Behind and to the side, aimed at the model's edge."),
          el("rimR", "strip", 270, 80, "Strip light (right)", "Edge light.", "Match the left side."),
          subject("Between the two strips.", "Model", 180, 130),
          el("key", "softbox", 120, 200, "Soft front fill (optional)", "Opens the front.", "Low power for a little detail in front."),
          camera("Use grids on the strips to avoid flare.", 196)
        ], [beam("rimL", "subject"), beam("rimR", "subject")], ["A dark backdrop makes the outline strongest."])
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "studio-lighting-setups-library",
    name: "Studio Lighting Setups Library",
    subtitle: "Eight overhead studio lighting diagrams with placement notes for one to four lights, plus light ratio and modifier references.",
    intro: [
      "This library collects classic studio setups, from a single light to four, each drawn from above with notes for every light and modifier. Use it to set up quickly, reproduce a look, or plan a shoot.",
      "Distances and angles are starting points. Watch where shadows fall on the face and adjust from there."
    ],
    blocks: [
      studioSetup("Loop lighting: one light", "Key 30–45° to the side, slightly above. A small loop-shaped shadow beside the nose.", [
        el("bg", "backdrop", 180, 44, "Backdrop", "Background.", "1.5–2 m behind the subject."),
        key("30–45° from the camera axis, slightly above eye level, about 1–1.5 m away."),
        subject("Face toward the camera or slightly toward the key."),
        el("fill", "reflector", 262, 156, "Reflector", "Fill.", "Optional; softens the shadow side."),
        camera("Straight on.")
      ], [beam("key", "subject"), beam("fill", "subject", "bounce")], ["The most versatile portrait light."]),
      studioSetup("Rembrandt lighting", "Key at about 45° and high enough to make a small triangle of light on the shadow cheek.", [
        el("bg", "backdrop", 180, 44, "Dark backdrop", "Background.", "Plain backdrop 1.5–2 m behind the subject."),
        key("About 45° to the side and higher than for loop light. Adjust until a triangle of light appears under the far eye.", 96, 110),
        subject("Turned slightly away from the key."),
        camera("Straight on or slightly to the shadow side.")
      ], [beam("key", "subject")], ["Close the triangle by moving the light; open it by turning the face."]),
      studioSetup("Split lighting", "Key at 90° lights exactly half the face, for strong mood.", [
        el("bg", "backdrop", 180, 44, "Backdrop", "Background.", "Plain backdrop 1.5–2 m behind the subject."),
        key("Directly to the side at 90°, level with the face.", 70, 140),
        subject("Face toward the camera."),
        camera("Straight on.")
      ], [beam("key", "subject")], ["Add a reflector on the dark side for a softer version."]),
      studioSetup("Butterfly or clamshell lighting", "Key centered above the camera, with a reflector below. A butterfly-shaped shadow under the nose.", [
        el("bg", "backdrop", 180, 44, "Backdrop", "Background.", "Plain backdrop 1.5–2 m behind the subject."),
        key("Centered above the camera, angled down at about 45° (drawn beside the camera for clarity).", 100, 214, "softbox", "Key above camera"),
        el("fill", "reflector", 180, 176, "Reflector below", "Fill under chin and eyes.", "Chest height, angled up. Clamshell when both are close."),
        subject("Face toward the camera, chin slightly up.", "Subject", 180, 110),
        camera("Between the key and reflector.", 180)
      ], [beam("key", "subject"), beam("fill", "subject", "bounce")], ["Flattering for beauty and glamour portraits."]),
      studioSetup("Key and fill", "A soft fill near the camera controls contrast.", [
        el("bg", "backdrop", 180, 44, "Backdrop", "Background.", "Plain backdrop 1.5–2 m behind the subject."),
        key("45° to one side, slightly above."),
        el("fill", "umbrella", 250, 226, "Fill (umbrella)", "Opens shadows.", "Near the camera, 1–2 stops below the key."),
        subject("Face toward the camera."),
        camera("Straight on.")
      ], [beam("key", "subject"), beam("fill", "subject")], ["Turn the fill off and on to see its effect."]),
      studioSetup("Key and rim", "A rim light behind separates the subject from a dark background.", [
        el("bg", "backdrop", 180, 44, "Dark backdrop", "Background.", "Plain backdrop 1.5–2 m behind the subject."),
        el("rim", "strip", 284, 100, "Rim (strip box)", "Edge light.", "Behind on the opposite side to the key, gridded."),
        key("45° on the side opposite the rim."),
        subject("Turned slightly away from the rim."),
        camera("Use a lens hood.")
      ], [beam("key", "subject"), beam("rim", "subject")], ["A flag between the rim and lens prevents flare."]),
      studioSetup("Three-point lighting", "Key, fill, and a background light: the standard balanced setup.", [
        el("bg", "backdrop", 180, 44, "Backdrop", "Lit separately.", "The background light controls how bright it appears."),
        el("bglight", "flash", 230, 80, "Background light", "Glow on the backdrop.", "Behind the subject, aimed at the backdrop."),
        key("45° to one side."),
        el("fill", "reflector", 262, 168, "Fill", "Opens shadows.", "Reflector or a low-power light."),
        subject("Face toward the camera."),
        camera("Straight on.")
      ], [beam("key", "subject"), beam("fill", "subject", "bounce"), beam("bglight", "bg")], ["Adjust background light power to control backdrop brightness."]),
      studioSetup("High-key white background", "Two lights on a white backdrop make it pure white; a key lights the subject.", [
        el("bg", "backdrop", 180, 44, "White backdrop", "Lit to pure white.", "About one stop brighter than the subject."),
        el("bgL", "flash", 92, 70, "Background light (left)", "Lights the backdrop.", "Aimed across the backdrop."),
        el("bgR", "flash", 268, 70, "Background light (right)", "Lights the backdrop.", "Match the left side."),
        key("Large softbox near the camera for even light.", 124, 196),
        subject("At least 2 m in front of the backdrop."),
        camera("Check the backdrop isn't spilling onto the subject's edges.", 200)
      ], [beam("key", "subject"), beam("bgL", "bg"), beam("bgR", "bg")], ["Flags beside the backdrop reduce flare."]),
      table("Light ratio reference", "The ratio between key and fill describes contrast. Each stop doubles the difference.", ["Ratio", "Stops between key and fill", "Look"], [
        ["1:1", "0", "Flat, even light; no shadows from the key."], ["2:1", "1", "Gentle, open shadows; commercial and family portraits."], ["3:1", "About 1.5", "Soft but defined; a common portrait ratio."], ["4:1", "2", "Noticeable shape; dramatic but still detailed."], ["8:1", "3", "Strong contrast; shadows close to black."]
      ], { kicker: "Reference", widths: [0.14, 0.3, 0.56] }),
      cards("Modifier reference", "What each modifier does to the light.", [
        { title: "Softbox", text: "Soft, directional light with controlled spill. Larger and closer means softer." },
        { title: "Octabox", text: "Rounder catchlights; very soft when large." },
        { title: "Umbrella", text: "Broad, soft light with a lot of spill. Quick to set up." },
        { title: "Strip box", text: "Narrow light for rims and edges, often with a grid." },
        { title: "Beauty dish", text: "Crisp but soft light with contrast; flattering for faces." },
        { title: "Grid", text: "Narrows the beam and stops spill onto the background or lens." }
      ])
    ],
    addons: [
      { name: "Gel and color setup cards", subtitle: "Two setups using colored gels.", blocks: [
        studioSetup("Colored background gel", "A gelled light on a grey backdrop changes its color; the subject stays naturally lit.", [
          el("bg", "backdrop", 180, 44, "Grey backdrop", "Takes the gel color.", "Mid grey takes color best."),
          el("gel", "flash", 180, 82, "Gelled background light", "Colors the backdrop.", "Behind the subject, aimed at the backdrop. Saturated gels need more power."),
          key("Ungelled softbox 45° to the side."),
          subject("2 m from the backdrop so the gel doesn't spill onto skin."),
          camera("Set white balance for the key light.")
        ], [beam("key", "subject"), beam("gel", "bg")], ["Darker backdrops give deeper colors."]),
        studioSetup("Two-color rim lights", "Contrasting gels on two rim lights for a bold, graphic look.", [
          el("rimL", "strip", 90, 90, "Rim light, gel color A", "Colored edge.", "Behind and to the left."),
          el("rimR", "strip", 270, 90, "Rim light, gel color B", "Colored edge.", "Behind and to the right; contrasting color."),
          key("Low-power soft front light, ungelled, for skin.", 180, 210, "softbox", "Front key (low power)"),
          subject("Between the rims.", "Subject", 180, 130),
          camera("Dark background; grids on the rims.", 140)
        ], [beam("rimL", "subject"), beam("rimR", "subject"), beam("key", "subject")], ["Complementary colors (teal and orange, blue and magenta) look strongest."])
      ] },
      { name: "Light ratio reference sheet", subtitle: "Ratios, stops, and how to measure them.", blocks: [
        table("Light ratio reference sheet", "Measure key and fill separately with a light meter or test shots, then compare.", ["Ratio", "Stop difference", "Fill power (key at full)", "Typical use"], [
          ["1:1", "0", "Same as key", "Beauty, high key"], ["1.5:1", "About 0.5", "About 2/3 of key", "Bright commercial"], ["2:1", "1", "Half of key", "Family and corporate"], ["3:1", "About 1.5", "About 1/3 of key", "Classic portraits"], ["4:1", "2", "1/4 of key", "Dramatic portraits"], ["8:1", "3", "1/8 of key", "Low key, film-noir looks"]
        ], { kicker: "Add-on", widths: [0.12, 0.2, 0.3, 0.38] }),
        text("Measuring a ratio", "Without a meter, use test shots.", [], [
          "Turn on the key only and set exposure so skin is correct.",
          "Turn off the key and turn on the fill only; note how many stops darker the frame is.",
          "That difference in stops gives the ratio: 1 stop is 2:1, 2 stops is 4:1, 3 stops is 8:1."
        ], { kicker: "Add-on" })
      ] },
      { name: "Studio booking checklist", subtitle: "Plan and check a studio booking.", blocks: [
        checklist("Studio booking checklist", "From booking to wrap.", [
          { title: "Booking", items: ["Date, start, and end times confirmed", "Equipment included in the hire", "Backdrops and colors available", "Parking and load-in access", "Changing room and makeup space"] },
          { title: "On the day", items: ["Arrive early to set up", "Test every light and trigger", "Check backdrop condition", "Note anything damaged before starting"] },
          { title: "Wrap", items: ["Backdrops rolled and trimmed", "Lights returned to their places", "Studio left as found", "Files backed up before leaving"] }
        ], { kicker: "Add-on", fields: ["Studio", "Date", "Hours", "Contact"] })
      ] },
      { name: "Background setup diagrams", subtitle: "Ways to light a backdrop for different looks.", blocks: [
        studioSetup("Gradient backdrop", "One light low behind the subject creates a glow fading outward.", [
          el("bg", "backdrop", 180, 44, "Backdrop", "Gradient glow.", "Grey or colored."),
          el("glow", "flash", 180, 78, "Background light, low", "Creates the glow.", "On the floor behind the subject, aimed up the backdrop."),
          key("45° to the side."),
          subject("Hides the background light from the camera."),
          camera("Straight on.")
        ], [beam("glow", "bg"), beam("key", "subject")], ["Move the light closer to the backdrop for a tighter glow."]),
        studioSetup("Dark backdrop with no spill", "Keep light off the backdrop for a black background.", [
          el("bg", "backdrop", 180, 30, "Dark backdrop", "Stays black.", "As far behind the subject as space allows."),
          key("Gridded softbox, feathered toward the camera.", 100, 130),
          el("flag", "flag", 140, 90, "Flag", "Blocks spill.", "Between the key and the backdrop."),
          subject("At least 2–3 m from the backdrop.", "Subject", 180, 150),
          camera("Expose for the face; the background falls to black.")
        ], [beam("key", "subject")], ["Distance from the backdrop matters more than its color."])
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "client-workflow-kit",
    name: "Client Workflow Kit",
    subtitle: "Checklists for every stage of a client shoot, from inquiry to delivery, plus message templates and a pricing worksheet.",
    intro: [
      "A clear workflow means every client gets the same care and nothing falls through the cracks. This kit maps a typical client journey, from first inquiry to gallery delivery, with a checklist for each stage and templates for the messages along the way.",
      "Adapt the steps to your services, and keep one copy per client."
    ],
    blocks: [
      checklist("Inquiry to booking", "From first message to confirmed booking.", [
        { title: "Inquiry", items: ["Reply within one business day", "Ask about date, location, and what they need", "Send pricing or a quote"] },
        { title: "Booking", items: ["Agreement or terms sent and accepted", "Deposit or payment received", "Date added to calendar", "Booking confirmation sent"] }
      ], { fields: ["Client", "Session type"] }),
      checklist("Before the session", "In the weeks leading up to the shoot.", [
        { title: "Planning", items: ["Questionnaire sent and returned", "Location confirmed and scouted", "Shot list prepared", "Prep or what-to-wear guide sent"] },
        { title: "Final week", items: ["Reminder sent", "Weather checked; backup plan ready", "Gear charged and packed", "Directions and contact details shared"] }
      ]),
      checklist("Session day", "On the day.", [
        { title: "Before", items: ["Arrive early", "Settings and light checked", "Shot list on hand"] },
        { title: "During", items: ["Cover all must-have shots", "Check focus and exposure regularly", "Releases signed where needed"] },
        { title: "After", items: ["Cards backed up the same day", "Thank-you message sent", "Delivery timeline confirmed"] }
      ]),
      checklist("Editing and delivery", "From cull to final gallery.", [
        { title: "Editing", items: ["Cull to the best frames", "Consistent edit across the set", "Final check at full size", "Export in agreed sizes and formats"] },
        { title: "Delivery", items: ["Gallery uploaded and tested", "Delivery message sent with link and expiry", "Files backed up in two places", "Follow-up scheduled"] }
      ]),
      templates("Client message templates", "Copy and adapt for each client.", [
        { title: "Inquiry reply", text: "Hi ____,\n\nThank you for getting in touch about a ____ session. I'd love to help.\n\nCould you tell me a little more: the date you have in mind, the location, and who will be in the photos?\n\nMy ____ sessions start at ____ and include ____. I've attached more details.\n\n____" },
        { title: "Booking confirmation", text: "Hi ____,\n\nYou're booked! Your session is on ____ at ____, at ____.\n\nNext steps: I'll send a short questionnaire to plan the session, and a what-to-wear guide two weeks before.\n\n____" },
        { title: "Gallery delivery", text: "Hi ____,\n\nYour gallery is ready: ____\n\nIt will be available until ____, so please download your images to keep them safe.\n\nThank you for choosing me. It was a pleasure.\n\n____" }
      ]),
      worksheet("Pricing worksheet", "Work out what each session costs you before setting a price.", ["Session type", "Hours: planning and communication", "Hours: shooting", "Hours: travel", "Hours: editing and delivery", "Total hours", "Direct costs: travel, prints, gallery", "Share of yearly business costs", "+Notes: what's included, extras, and options", "+Price set and date reviewed"])
    ],
    addons: [
      { name: "Client message template pack", subtitle: "Eight messages for the full client journey.", blocks: [
        templates("Client message template pack: part 1", "Copy and adapt for each client.", [
          { title: "Inquiry reply", text: "Hi ____,\n\nThank you for reaching out about ____. To check availability and suggest the right option, could you share the date, location, and who will be photographed?\n\n____" },
          { title: "Quote follow-up", text: "Hi ____,\n\nI wanted to follow up on the quote I sent on ____. Happy to answer any questions or adjust the package to suit you.\n\n____" },
          { title: "Booking confirmation", text: "Hi ____,\n\nYour session on ____ at ____ is confirmed. I'll be in touch with a short questionnaire and preparation tips.\n\n____" },
          { title: "Questionnaire request", text: "Hi ____,\n\nTo plan your session, please fill in this short questionnaire by ____: ____\n\n____" }
        ]),
        templates("Client message template pack: part 2", "Copy and adapt for each client.", [
          { title: "Preparation guide", text: "Hi ____,\n\nYour session is two weeks away. A few tips: coordinate colors rather than matching, avoid large logos, and plan to arrive ____ minutes early.\n\n____" },
          { title: "Day-before reminder", text: "Hi ____,\n\nLooking forward to tomorrow at ____, at ____. My phone number is ____ if you need me on the day.\n\n____" },
          { title: "Gallery delivery", text: "Hi ____,\n\nYour gallery is ready: ____. It's available until ____.\n\n____" },
          { title: "Thank-you and feedback request", text: "Hi ____,\n\nThank you again for choosing me. If you have a moment, I'd love to hear how you found the experience: ____\n\n____" }
        ])
      ] },
      { name: "Pricing worksheet", subtitle: "Work out time and costs per session type.", blocks: [
        table("Pricing worksheet", "Fill in one row per session type.", ["Session type", "Total hours", "Direct costs", "Share of business costs", "Price", "Reviewed"], Array.from({ length: 8 }, () => ["", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.24, 0.12, 0.15, 0.2, 0.14, 0.15] }),
        worksheet("Yearly business costs", "Add up yearly costs to share across sessions.", ["Equipment and repairs", "Software and subscriptions", "Insurance", "Website and gallery hosting", "Marketing", "Studio or office", "Training", "Other", "Total yearly costs", "Sessions per year", "Business cost per session"], { kicker: "Add-on" })
      ] },
      { name: "Session booking checklist", subtitle: "A booking checklist per client.", blocks: [
        checklist("Session booking checklist", "Keep one copy per client.", [
          { title: "Booking", items: ["Inquiry answered", "Quote or pricing sent", "Agreement accepted", "Deposit received", "Calendar updated", "Confirmation sent"] },
          { title: "Planning", items: ["Questionnaire received", "Location confirmed", "Shot list prepared", "Preparation guide sent", "Reminder sent"] }
        ], { kicker: "Add-on", fields: ["Client", "Session date", "Session type", "Total"] })
      ] },
      { name: "Gallery delivery checklist", subtitle: "Check every gallery before it goes out.", blocks: [
        checklist("Gallery delivery checklist", "Before sending the link.", [
          { title: "Images", items: ["All must-have shots included", "Consistent edit", "Duplicates removed", "Checked at full size"] },
          { title: "Gallery", items: ["Uploaded in the agreed sizes", "Download and favorites tested", "Expiry date set", "Cover image chosen"] },
          { title: "After sending", items: ["Delivery message sent", "Files backed up in two places", "Follow-up date set"] }
        ], { kicker: "Add-on", fields: ["Client", "Delivered on"] })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "wedding-portrait-pro-bundle",
    name: "Wedding & Portrait Pro Bundle",
    subtitle: "Seven guides together: Wedding Day, Portrait Session, Engagement Session, Elopement & Small Wedding, Newborn & Baby, Maternity Portrait, and Large Group & Reunion.",
    intro: [],
    blocks: [],
    async render(ctx) {
      const index = `<section class="cover"><p class="brand">Novaris Photo Guides</p><h1>Wedding &amp; Portrait Pro Bundle</h1><p class="sub">Seven guides for weddings, couples, families, and portraits.</p><div class="ap">${aperture()}</div><p class="foot">Bundle contents</p></section>
<section class="page"><p class="kicker">Contents</p><h2>Included in this bundle</h2><p class="lede">Each guide is a separate PDF in the guides folder.</p><ol class="toc">${BUNDLE.map((g) => `<li><span>Guide</span>${g.name.replace(/&/g, "&amp;")}</li>`).join("")}</ol></section>`;
      await ctx.render(ctx.documentHtml("Wedding & Portrait Pro Bundle", index, "Letter", false, true), path.join(ctx.dir, "Wedding-and-Portrait-Pro-Bundle-Contents.pdf"), "Letter", false, "Wedding & Portrait Pro Bundle");
      fs.mkdirSync(path.join(ctx.dir, "guides"), { recursive: true });
      for (const g of BUNDLE) await ctx.render(ctx.documentHtml(g.name, ctx.guideHtml(g, "Letter"), "Letter", false, true), path.join(ctx.dir, "guides", `${ctx.fname(g.name)}.pdf`), "Letter", false, g.name);
      return BUNDLE.length + 1;
    },
    addons: [
      { name: "Pocket card set for every included guide", size: "pocket", subtitle: "One 4 × 6 in card per guide, with the key shots to cover.", blocks: BUNDLE.map((g) => {
        const list = g.blocks.find((b) => b.type === "shotlist" && b.kicker === "Shot list");
        const items = list.sections.flatMap((s) => s.items).slice(0, 9);
        return checklist(g.name, list.title, [{ title: "Key shots", items: items.map((i) => (Array.isArray(i) ? i[0] : i)) }], { kicker: "Pocket card", blank: 0 });
      }) },
      { name: "Client questionnaire bundle", subtitle: "Client questionnaires for portraits, weddings, engagements, maternity, and newborn sessions.", blocks: [
        ...portraitGuide.blocks.filter((b) => b.type === "questionnaire").map((b) => ({ ...b, title: "Portrait client questionnaire" })),
        ...weddingGuide.blocks.filter((b) => b.type === "questionnaire").map((b) => ({ ...b, title: "Wedding client questionnaire" })),
        ...["engagement-session-guide", "maternity-portrait-guide", "newborn-baby-session-guide"].flatMap((s) => bySlug(s).addons.flatMap((a) => a.blocks.filter((b) => b.type === "questionnaire")))
      ] },
      { name: "Yearly booking calendar", subtitle: "A month-by-month booking calendar for the year.", blocks: [calendar("Yearly booking calendar", "Record each booking's date, client, session type, and location.")] },
      { name: "A4 and US Letter print editions", subtitle: "Every guide in the bundle in both A4 and US Letter sizes.", blocks: [], async render(ctx) {
        const out = path.join(ctx.dir, "add-ons", "A4-and-US-Letter-print-editions");
        for (const size of ["A4", "Letter"]) {
          fs.mkdirSync(path.join(out, size === "A4" ? "A4" : "US-Letter"), { recursive: true });
          for (const g of BUNDLE) await ctx.render(ctx.documentHtml(g.name, ctx.guideHtml(g, size), size, false, true), path.join(out, size === "A4" ? "A4" : "US-Letter", `${ctx.fname(g.name)}-${size === "A4" ? "A4" : "Letter"}.pdf`), size, false, g.name);
        }
        return BUNDLE.length * 2;
      } }
    ]
  }
];
