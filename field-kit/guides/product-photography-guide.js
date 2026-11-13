/* Product Photography Guide — content for the Novaris Field Kit. */
export default {
  slug: "product-photography-guide",
  name: "Product Photography Guide",
  tabs: ["shotlists", "lighting", "settings"],

  shotlists: [
    {
      id: "ecommerce",
      title: "Standard e-commerce angles",
      description: "A consistent set of catalogue angles for each product.",
      sections: [
        { title: "Main angles", items: [
          { text: "Front, centered", note: "Usually the listing's main image." },
          { text: "Three-quarter left" },
          { text: "Three-quarter right" },
          { text: "Side profile" },
          { text: "Back" },
          { text: "Top-down" }
        ] },
        { title: "Supporting frames", items: [
          { text: "Material or texture detail, close" },
          { text: "Label, logo, or controls, close" },
          { text: "Scale reference (in hand or beside a known object)" },
          { text: "Packaging" },
          { text: "All color or size variants together" },
          { text: "In use (optional lifestyle frame)" }
        ] }
      ]
    },
    {
      id: "setup-check",
      title: "Pre-shoot setup check",
      description: "Run through before the first product so the whole set matches.",
      sections: [
        { title: "Consistency", items: [
          { text: "Camera height and distance marked on the floor" },
          { text: "Same focal length for every product" },
          { text: "Product position marked on the surface" },
          { text: "White balance set from a grey or white card" },
          { text: "Exposure locked in manual" }
        ] },
        { title: "Product prep", items: [
          { text: "Dust, fingerprints, and stickers removed" },
          { text: "Labels straight and facing camera" },
          { text: "Stray threads or packaging fibres removed" }
        ] }
      ]
    }
  ],

  lighting: [
    {
      id: "soft-side",
      title: "Soft side light with bounce card",
      summary: "A single soft light from the side and a white card opposite. Shape with gentle shadows.",
      elements: [
        { id: "sweep", type: "backdrop", x: 180, y: 46, label: "Sweep", role: "Seamless curved background.", notes: "Keep the product well forward of the curve so the background stays even and the shadow falls softly." },
        { id: "key", type: "softbox", x: 70, y: 138, rot: 90, label: "Softbox", role: "Main light: shape and highlights.", notes: "Level with the product or slightly above, a little behind it so the light wraps toward the camera. Closer gives softer light with faster falloff." },
        { id: "product", type: "product", x: 180, y: 140, label: "Product", role: "Centre of the set.", notes: "Turn the product a few degrees at a time and watch how highlights move across curved surfaces." },
        { id: "card", type: "card", x: 262, y: 140, rot: 90, label: "Bounce card (white)", role: "Fill: lifts the shadow side.", notes: "Move it closer for less contrast. A black card instead deepens shadows and adds definition." },
        { id: "camera", type: "camera", x: 180, y: 262, label: "Camera on tripod", role: "Fixed position for every product.", notes: "Mark the tripod legs and camera height so later products match." }
      ],
      beams: [{ from: "key", to: "product" }, { from: "card", to: "product", kind: "bounce" }],
      tips: ["Turn off room lights to keep color consistent.", "Tether or check at full size for dust."]
    },
    {
      id: "flat-lay",
      title: "Overhead flat lay",
      summary: "Even light from above for products laid flat, with cards around the edges.",
      elements: [
        { id: "overhead", type: "softbox", x: 180, y: 70, rot: 180, label: "Overhead softbox", role: "Even, top-down light.", notes: "Position it above and slightly behind the layout, angled down, so its reflection doesn't fall on glossy items. A large source keeps shadows soft across the whole layout." },
        { id: "surface", type: "table", x: 180, y: 150, label: "Surface", role: "Background for the layout.", notes: "Matte surfaces avoid reflections. Keep the surface clean between setups." },
        { id: "card-left", type: "card", x: 82, y: 154, rot: 90, label: "White card", role: "Fill from the side.", notes: "Evens out the side of the layout away from the light." },
        { id: "card-right", type: "card", x: 278, y: 154, rot: 90, label: "White card", role: "Fill from the other side.", notes: "Use only if the layout still looks uneven." },
        { id: "camera", type: "camera", x: 180, y: 250, label: "Camera overhead", role: "Pointing straight down.", notes: "Use a level on the camera so the layout stays square. Here the camera is drawn at the front; in practice it sits above the surface." }
      ],
      beams: [{ from: "overhead", to: "surface" }],
      tips: ["Arrange items with consistent spacing and alignment.", "Shoot a frame with nothing on the surface for easy clean-up of the background later."]
    },
    {
      id: "white-background",
      title: "Pure white background",
      summary: "A separate light on the background so it renders clean white with the product correctly exposed.",
      elements: [
        { id: "bg", type: "backdrop", x: 180, y: 40, label: "White background", role: "Lit separately to white.", notes: "Expose the background about one stop brighter than the product. More than that wraps light around edges and lowers contrast." },
        { id: "bglight", type: "flash", x: 180, y: 76, rot: 180, label: "Background light", role: "Lights only the background.", notes: "Place it behind the product, aimed at the background. Check that it doesn't spill onto the product's edges." },
        { id: "key", type: "softbox", x: 92, y: 172, rot: 60, label: "Key light", role: "Lights the product.", notes: "Front and to one side for shape. Move it until highlights describe the product's form." },
        { id: "product", type: "product", x: 180, y: 140, label: "Product", role: "On a white surface, away from the background.", notes: "At least 1 m in front of the background so the background light doesn't reach it." },
        { id: "camera", type: "camera", x: 180, y: 262, label: "Camera", role: "Straight on.", notes: "Check the histogram: the background should sit just at the right edge, not far beyond it." }
      ],
      beams: [{ from: "bglight", to: "bg" }, { from: "key", to: "product" }],
      tips: ["Use flags beside the background to reduce flare.", "A white acrylic sheet under the product gives a soft reflection."]
    },
    {
      id: "reflective",
      title: "Reflective products",
      summary: "Large diffused light and black cards to control reflections on shiny surfaces.",
      elements: [
        { id: "diffusion", type: "diffusion", x: 84, y: 140, rot: 90, label: "Diffusion panel", role: "A large, even source that reflects as a clean gradient.", notes: "Light it from behind with a flash or continuous light. Shiny products reflect their surroundings, so a large panel gives a smooth highlight instead of a hot spot." },
        { id: "light", type: "flash", x: 34, y: 140, rot: 90, label: "Light behind panel", role: "Illuminates the diffusion panel.", notes: "Move it further back to light the panel more evenly." },
        { id: "product", type: "product", x: 180, y: 140, label: "Product", role: "Reflective object.", notes: "Turn the product until the panel's reflection runs along the edge you want to define." },
        { id: "flag", type: "flag", x: 270, y: 140, rot: 90, label: "Black card", role: "Adds dark edge reflections for definition.", notes: "Black cards reflect as dark lines that outline glossy edges. Move them closer or further to change line thickness." },
        { id: "camera", type: "camera", x: 180, y: 262, label: "Camera", role: "Through a hole in a black card, if needed.", notes: "If the camera appears in the reflection, shoot from further back with a longer lens or hide it behind black card." }
      ],
      beams: [{ from: "light", to: "diffusion" }, { from: "diffusion", to: "product" }],
      tips: ["Wear dark clothing so you don't appear in reflections.", "A polariser can reduce some reflections on non-metallic surfaces."]
    },
    {
      id: "backlit-glass",
      title: "Backlit glass and liquids",
      summary: "Light from behind through a diffuser to show transparency and outline glass.",
      elements: [
        { id: "diffuser", type: "diffusion", x: 180, y: 56, rot: 0, label: "Diffuser behind", role: "Glowing background that shines through the glass.", notes: "A bright, even background shows liquid color and clarity. Leave space between product and diffuser." },
        { id: "light", type: "flash", x: 180, y: 22, rot: 180, label: "Light behind diffuser", role: "Lights the diffuser.", notes: "Aim at the center of the diffuser; a gradient from center to edge often looks good behind glass." },
        { id: "flag-l", type: "flag", x: 120, y: 120, rot: 75, label: "Black card", role: "Defines the left edge of the glass.", notes: "Black cards just outside the frame create dark outlines along the glass edges." },
        { id: "flag-r", type: "flag", x: 240, y: 120, rot: 105, label: "Black card", role: "Defines the right edge.", notes: "Keep both cards at equal distance for symmetrical edges." },
        { id: "product", type: "product", x: 180, y: 150, label: "Glass product", role: "Transparent object.", notes: "Clean glass with a lint-free cloth and wear gloves to avoid fingerprints." },
        { id: "camera", type: "camera", x: 180, y: 262, label: "Camera", role: "Level with the product.", notes: "A slightly higher camera shows the liquid surface; level keeps edges straight." }
      ],
      beams: [{ from: "light", to: "diffuser" }, { from: "diffuser", to: "product" }],
      tips: ["Use a small mirror or card to add a highlight on labels if needed.", "Condensation can be applied with a spray of water and glycerine mixture."]
    }
  ],

  references: {
    title: "Backgrounds and surfaces",
    items: [
      { title: "White seamless sweep", text: "Clean, distraction-free look for catalogues. Needs separate background light for pure white. Shows dust and scuffs; replace or trim used sections." },
      { title: "Black acrylic", text: "Gives a glossy reflection under the product for a premium look. Reflects everything, so keep the set dark and wipe away fingerprints." },
      { title: "White acrylic", text: "A soft reflection on a bright base. Works well with backlighting for a glowing surface." },
      { title: "Textured boards", text: "Wood-effect, stone-effect, or concrete-effect boards add context without clutter. Side light brings out texture; front light flattens it." },
      { title: "Fabric and linen", text: "Soft, warm context for handmade or textile products. Iron or steam first; creases read strongly in side light." },
      { title: "Colored paper", text: "Bold, simple backgrounds for social images. Color bounces onto the product, so watch for casts on white or pale products." }
    ]
  },

  settings: {
    tables: [
      { title: "Tabletop starting points", rows: [
        { situation: "White sweep, flash", aperture: "f/8–f/11", shutter: "1/125", iso: "100", notes: "Background about 1 stop brighter than product." },
        { situation: "Reflective item, flash", aperture: "f/8", shutter: "1/125", iso: "100", notes: "Large diffusion, black cards for edges." },
        { situation: "Flat lay, overhead", aperture: "f/5.6–f/8", shutter: "1/125", iso: "100", notes: "Level the camera over the layout." },
        { situation: "Small detail or jewelry", aperture: "f/11–f/16", shutter: "1/125", iso: "100–200", notes: "Consider focus stacking for full depth." },
        { situation: "Continuous light, tripod", aperture: "f/8", shutter: "1/30", iso: "200", notes: "Use a remote or timer to avoid shake." },
        { situation: "Dark product on dark set", aperture: "f/8", shutter: "1/125", iso: "100", notes: "Rim or edge light to separate it." }
      ] }
    ],
    rules: [
      "Lock exposure, white balance, and focal length for a whole product set.",
      "Smaller apertures than f/16 can soften detail through diffraction; consider focus stacking instead.",
      "Settings are starting points. Adjust for your lights, distance, and lens."
    ],
    nd: false
  },

  planning: [],

  previews: [
    { view: "lighting", item: "reflective" },
    { view: "shotlists", item: "ecommerce" },
    { view: "settings" }
  ]
};
