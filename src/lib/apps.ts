// The 13 Koja apps: one source for the /software gallery, the app pages, the footer and the sitemap.
// Each Koja app is a build of an open-source Craft app by the ArtCraft team (MIT / Apache-2.0).
// Feature claims below only repeat what the upstream projects state about themselves.

export type AppGroup = "Photo & design" | "Video & audio" | "Office" | "Engineering";

export type KojaApp = {
  slug: string;
  name: string;
  upstream: string;
  group: AppGroup;
  /** Short job title shown on cards, e.g. "Photo editor". */
  kind: string;
  /** One sentence of benefit for the gallery. */
  benefit: string;
  /** The search term this page is built around. */
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  features: { title: string; text: string }[];
  forWho: string;
  /** Familiar product people search for, with its owner for the trademark note. */
  familiar?: { product: string; owner: string };
  faq: { q: string; a: string }[];
  imageAlt: string;
};

export const APPS: KojaApp[] = [
  {
    slug: "photo-koja",
    name: "PhotoKoja",
    upstream: "PhotoCraft",
    group: "Photo & design",
    kind: "Photo editor",
    benefit: "Retouch, mask and composite photos with the layer workflow your hands already know.",
    keyword: "photoshop alternative for mac",
    metaTitle: "PhotoKoja: Photo Editor for Mac without Subscription",
    metaDescription:
      "PhotoKoja is a layer-based photo editor for Mac. Masks, layer styles, type and brushes, offline and without an account. Try it free for 3 days.",
    h1: "The photo editor for Mac you already know how to use",
    lead:
      "PhotoKoja gives you layers, masks, layer styles, type and brushes in a native Mac app. If you have spent years in a layer-based editor, you are productive on day one. It runs offline, needs no account and is part of one €2.99 plan with all 13 Koja apps.",
    features: [
      { title: "Layers and masks", text: "Stack adjustments, paint masks and keep every edit non-destructive." },
      { title: "Layer styles and type", text: "Shadows, strokes and text layers for thumbnails, posters and social graphics." },
      { title: "Brushes", text: "Paint, retouch and dodge with brushes that respond to your tablet." },
      { title: "Offline by design", text: "Your images stay on your Mac. No cloud upload, no login." },
    ],
    forWho:
      "Photographers, designers and content creators who want a familiar photo editor on the Mac without paying for a creative-cloud subscription.",
    familiar: { product: "Photoshop", owner: "Adobe Inc." },
    faq: [
      {
        q: "Is PhotoKoja a Photoshop alternative?",
        a: "PhotoKoja follows the same layer-based way of working, so the core tools are where you expect them. It is a young app and does not cover every feature of Photoshop yet. Try it free for 3 days with your own files before you pay.",
      },
      {
        q: "Do I need an account or internet connection?",
        a: "No. PhotoKoja runs locally on your Mac. You only need the internet to download it and to activate your plan.",
      },
    ],
    imageAlt: "Retoucher editing a portrait with a pen tablet in a dark studio",
  },
  {
    slug: "light-koja",
    name: "LightKoja",
    upstream: "LightCraft",
    group: "Photo & design",
    kind: "Photo library & RAW",
    benefit: "Organise your photo library and develop RAW files on your own machine.",
    keyword: "lightroom alternative",
    metaTitle: "LightKoja: RAW Editor and Photo Library for Mac",
    metaDescription:
      "LightKoja is a photo library and RAW developer for Mac. No account, no cloud, no tracking, no subscription lock-in. Try it free for 3 days.",
    h1: "Your photos. Your pixels. Your Mac.",
    lead:
      "LightKoja combines a photo library with a RAW developer. Import a shoot, rate and sort it, then develop your favourites. Everything stays on your Mac: no account, no cloud and no telemetry.",
    features: [
      { title: "Photo library", text: "Import, browse, rate and filter thousands of photos." },
      { title: "RAW development", text: "Exposure, colour and tone on your camera's original files." },
      { title: "Local only", text: "No account, no cloud, no telemetry." },
      { title: "Part of the plan", text: "Comes with all 13 Koja apps for €2.99 a month or €79 once." },
    ],
    forWho: "Photographers who want to keep their archive on their own drive and stop renting their photo library.",
    familiar: { product: "Lightroom", owner: "Adobe Inc." },
    faq: [
      {
        q: "Where are my photos stored?",
        a: "In folders on your Mac or external drive that you choose. LightKoja does not upload anything.",
      },
      {
        q: "Can I edit RAW files from my camera?",
        a: "LightKoja includes a RAW developer. Camera support grows with each release, so test your own camera's files during the 3-day trial.",
      },
    ],
    imageAlt: "Photographer reviewing landscape photos on a laptop at night",
  },
  {
    slug: "vector-koja",
    name: "VectorKoja",
    upstream: "VectorCraft",
    group: "Photo & design",
    kind: "Vector illustration",
    benefit: "Draw logos, icons and illustrations that scale to any size.",
    keyword: "illustrator alternative",
    metaTitle: "VectorKoja: Vector Illustration App for Mac",
    metaDescription:
      "VectorKoja is a vector illustration app for Mac with the workflow working illustrators know. Logos, icons and illustrations, offline. Try it free.",
    h1: "Vector illustration for Mac, without the subscription",
    lead:
      "VectorKoja is built for working illustrators: paths, shapes and the tool layout you are used to. Draw a logo, an icon set or a full illustration and export it at any size.",
    features: [
      { title: "Paths and shapes", text: "Pen tool, boolean operations and precise anchor editing." },
      { title: "Familiar workflow", text: "Tools and panels where an illustrator expects them." },
      { title: "Scales to any size", text: "From a favicon to a billboard without losing sharpness." },
      { title: "Native and offline", text: "A fast Mac app that works without an internet connection." },
    ],
    forWho: "Illustrators, logo designers and anyone who needs clean vector graphics without a monthly creative bill.",
    familiar: { product: "Illustrator", owner: "Adobe Inc." },
    faq: [
      {
        q: "Can I use VectorKoja for logo design?",
        a: "Yes. Logos, icons and illustrations are exactly what it is made for.",
      },
      {
        q: "Is it included in the €2.99 plan?",
        a: "Yes. One plan unlocks all 13 Koja apps, including VectorKoja.",
      },
    ],
    imageAlt: "Bold vector poster of a mountain sunrise on a studio wall",
  },
  {
    slug: "design-koja",
    name: "DesignKoja",
    upstream: "DesignCraft",
    group: "Photo & design",
    kind: "Page layout",
    benefit: "Lay out flyers, magazines and brochures with the layout tools you know.",
    keyword: "indesign alternative",
    metaTitle: "DesignKoja: Page Layout and Publishing App for Mac",
    metaDescription:
      "DesignKoja is a page layout app for Mac for flyers, magazines and brochures. No subscription, no licence server, no telemetry. Try it free for 3 days.",
    h1: "Page layout for print and PDF, on your Mac",
    lead:
      "DesignKoja handles the jobs of a desktop publishing app: multi-page documents, text frames, images and master pages. There is no licence server and no telemetry, just a layout tool that opens when you need it.",
    features: [
      { title: "Multi-page layouts", text: "Flyers, brochures, magazines and books in one document." },
      { title: "The layout tools you know", text: "Frames, guides and pages work the way you expect." },
      { title: "No licence server", text: "No check-in with a server before you can work." },
      { title: "Print-ready", text: "Prepare documents for the printer or for PDF." },
    ],
    forWho: "Designers, small agencies, clubs and schools that produce printed material regularly.",
    familiar: { product: "InDesign", owner: "Adobe Inc." },
    faq: [
      {
        q: "Can I make print-ready files?",
        a: "Yes, DesignKoja is made for print and PDF output. Check your printer's requirements with a test file during the trial.",
      },
      {
        q: "Do I need to be online to open my documents?",
        a: "No. There is no licence server; DesignKoja works offline.",
      },
    ],
    imageAlt: "Printed magazine spreads, ruler and colour swatches on a dark desk",
  },
  {
    slug: "fig-koja",
    name: "FigKoja",
    upstream: "FigCraft",
    group: "Photo & design",
    kind: "Interface design",
    benefit: "Design app and web interfaces offline and click through prototypes.",
    keyword: "figma alternative offline",
    metaTitle: "FigKoja: Offline Interface Design App for Mac",
    metaDescription:
      "FigKoja is an interface design app for Mac that works offline. Design screens and clickable prototypes without a subscription. Try it free for 3 days.",
    h1: "Interface design that works offline",
    lead:
      "FigKoja is an interface design tool that lives on your Mac instead of in a browser tab. Design screens for apps and websites and link them into clickable prototypes, with or without a connection.",
    features: [
      { title: "Screens and components", text: "Design app and web interfaces from reusable parts." },
      { title: "Clickable prototypes", text: "Connect screens to show how the product will feel." },
      { title: "Familiar by design", text: "The canvas and panels work the way UI designers expect." },
      { title: "Offline", text: "Work on the train, on a plane or behind a strict firewall." },
    ],
    forWho: "UI and UX designers, founders and developers who want to sketch interfaces without a cloud account.",
    familiar: { product: "Figma", owner: "Figma, Inc." },
    faq: [
      {
        q: "Does FigKoja need an internet connection?",
        a: "No. Your files are stored on your Mac and the app works offline.",
      },
      {
        q: "Can I build clickable prototypes?",
        a: "Yes, you can link screens into a prototype and click through it.",
      },
    ],
    imageAlt: "Mobile app wireframes and a tablet with interface designs on a desk",
  },
  {
    slug: "film-koja",
    name: "FilmKoja",
    upstream: "FilmCraft",
    group: "Video & audio",
    kind: "Video editor",
    benefit: "Cut, colour and finish videos on a timeline you already know.",
    keyword: "premiere pro alternative",
    metaTitle: "FilmKoja: Video Editor for Mac without Subscription",
    metaDescription:
      "FilmKoja is a video editor for Mac with a familiar multi-track timeline, colour and sound. Edit offline without a subscription trap. Try it free for 3 days.",
    h1: "A video editor for Mac with a timeline you already know",
    lead:
      "FilmKoja is a professional video editor rebuilt from scratch. Cut on a multi-track timeline, correct colour and mix sound, then export your film. It runs natively on your Mac and ships with its own codecs.",
    features: [
      { title: "Multi-track timeline", text: "Cut, trim and arrange clips the way editors are used to." },
      { title: "Colour correction", text: "Balance and grade your footage inside the same app." },
      { title: "Sound", text: "Mix dialogue, music and effects on the timeline." },
      { title: "Own codecs", text: "Built-in codecs, no extra downloads to open your footage." },
    ],
    forWho: "YouTubers, freelance editors and small production teams who are tired of paying monthly for their editing software.",
    familiar: { product: "Premiere Pro", owner: "Adobe Inc." },
    faq: [
      {
        q: "Which video formats can I import?",
        a: "FilmKoja ships with its own codecs for common camera and phone formats. Import a clip from your own camera during the free trial to be sure.",
      },
      {
        q: "Is FilmKoja good for YouTube videos?",
        a: "Yes. Cutting, colour, sound and export cover a typical YouTube workflow.",
      },
    ],
    imageAlt: "Video editor at two monitors with a colourful timeline",
  },
  {
    slug: "effect-koja",
    name: "EffectKoja",
    upstream: "EffectCraft",
    group: "Video & audio",
    kind: "Motion graphics & VFX",
    benefit: "Animate titles and build visual effects with 259 effects included.",
    keyword: "after effects alternative",
    metaTitle: "EffectKoja: Motion Graphics and VFX App for Mac",
    metaDescription:
      "EffectKoja is a motion graphics and visual effects app for Mac with 259 effects. Animate titles, logos and shots offline. Try it free for 3 days.",
    h1: "Motion graphics and visual effects, built into your Mac",
    lead:
      "EffectKoja is for the moments a cut is not enough: animated titles, logo reveals, lower thirds and composited shots. It ships with 259 effects and moves fast, with new features in every release.",
    features: [
      { title: "259 effects", text: "Blurs, glows, distortions, colour and more, ready to keyframe." },
      { title: "Keyframe animation", text: "Animate position, scale, opacity and effect parameters." },
      { title: "Compositing", text: "Layer footage, graphics and text into one shot." },
      { title: "Works with FilmKoja", text: "Finish your effect shots and cut them into your edit." },
    ],
    forWho: "Motion designers, video editors and social media teams who animate titles and graphics.",
    familiar: { product: "After Effects", owner: "Adobe Inc." },
    faq: [
      {
        q: "How mature is EffectKoja?",
        a: "EffectKoja is young and moving fast, but already usable for titles and effects. Use the 3-day trial to try it on a real project.",
      },
      {
        q: "Is it included in the plan?",
        a: "Yes, all 13 Koja apps are included in €2.99 a month or €79 once.",
      },
    ],
    imageAlt: "Abstract neon motion graphics with ribbons and particles",
  },
  {
    slug: "sound-koja",
    name: "SoundKoja",
    upstream: "SoundCraft",
    group: "Video & audio",
    kind: "Audio recording & mixing",
    benefit: "Record, edit and mix music and podcasts in a native audio workstation.",
    keyword: "daw for mac",
    metaTitle: "SoundKoja: Audio Recording and Mixing App (DAW) for Mac",
    metaDescription:
      "SoundKoja is a native DAW for Mac to record, edit and mix music and podcasts. No subscription lock-in. Try it free for 3 days.",
    h1: "Record and mix audio on your Mac",
    lead:
      "SoundKoja is a digital audio workstation built from scratch. Record vocals and instruments, edit takes, and mix your song or podcast on a native Mac app.",
    features: [
      { title: "Multi-track recording", text: "Record several inputs and stack takes." },
      { title: "Editing", text: "Cut, move and fade audio clips precisely." },
      { title: "Mixing", text: "Levels, panning and effects per track." },
      { title: "Native DAW", text: "Built for macOS, not a web app in a wrapper." },
    ],
    forWho: "Musicians, podcasters and audio editors who want a capable DAW without another subscription.",
    familiar: { product: "Pro Tools", owner: "Avid Technology, Inc." },
    faq: [
      {
        q: "Can I record a podcast with SoundKoja?",
        a: "Yes. Record, cut and mix spoken word just like music.",
      },
      {
        q: "Does it work with my audio interface?",
        a: "SoundKoja uses the standard audio devices of macOS. Test your interface during the 3-day trial.",
      },
    ],
    imageAlt: "Home music studio with keyboard, speakers and mixing desk at night",
  },
  {
    slug: "word-koja",
    name: "WordKoja",
    upstream: "WordCraft",
    group: "Office",
    kind: "Word processor",
    benefit: "Write letters, reports and theses and open and save .docx files.",
    keyword: "microsoft word alternative for mac",
    metaTitle: "WordKoja: Word Processor for Mac that Opens .docx",
    metaDescription:
      "WordKoja is a fast word processor for Mac that reads and writes .docx files, with a familiar ribbon and references for academic writing. Try it free.",
    h1: "A word processor for Mac that opens your .docx files",
    lead:
      "WordKoja reads and writes .docx, so the documents your clients, school or office send you just open. The ribbon is where you expect it, and references help with academic and business writing.",
    features: [
      { title: "Opens and saves .docx", text: "Exchange documents with people who use other word processors." },
      { title: "The ribbon you know", text: "Formatting, styles and layout in a familiar place." },
      { title: "References", text: "Citations and bibliographies for academic and business documents." },
      { title: "Fast and native", text: "Starts quickly and works offline." },
    ],
    forWho: "Students, freelancers and small businesses who need to write and exchange Word documents on a Mac.",
    familiar: { product: "Microsoft Word", owner: "Microsoft Corporation" },
    faq: [
      {
        q: "Can I open Word documents in WordKoja?",
        a: "Yes, WordKoja reads and writes .docx. Complex layouts can differ slightly, so open a few of your own documents during the trial.",
      },
      {
        q: "Does WordKoja support citations?",
        a: "Yes, it includes references for academic and business writing.",
      },
    ],
    imageAlt: "Writer typing on a laptop at a wooden desk with manuscript pages",
  },
  {
    slug: "grid-koja",
    name: "GridKoja",
    upstream: "GridCraft",
    group: "Office",
    kind: "Spreadsheets",
    benefit: "Budgets, invoices and charts with 500+ functions and .xlsx support.",
    keyword: "excel alternative for mac",
    metaTitle: "GridKoja: Spreadsheet App for Mac with .xlsx Support",
    metaDescription:
      "GridKoja is a fast spreadsheet app for Mac with 500+ functions, charts, familiar shortcuts and .xlsx support. Try it free for 3 days.",
    h1: "Spreadsheets for Mac with 500+ functions",
    lead:
      "GridKoja is a native spreadsheet app with more than 500 functions, charts and the keyboard shortcuts you already use. It opens and saves .xlsx, so you can keep working with everyone else.",
    features: [
      { title: "500+ functions", text: "From SUM to lookups, text and date functions." },
      { title: ".xlsx support", text: "Open and save the spreadsheet format everyone sends." },
      { title: "Charts", text: "Turn a table into a bar, line or pie chart." },
      { title: "Familiar shortcuts", text: "Move, select and fill the way your fingers expect." },
    ],
    forWho: "Freelancers, small business owners and students who track numbers on a Mac.",
    familiar: { product: "Microsoft Excel", owner: "Microsoft Corporation" },
    faq: [
      {
        q: "Can GridKoja open Excel files?",
        a: "Yes, it opens and saves .xlsx. Test complex workbooks with macros during the trial.",
      },
      {
        q: "How many functions are supported?",
        a: "More than 500, covering maths, statistics, lookup, text and dates.",
      },
    ],
    imageAlt: "Business owner reviewing spreadsheet charts on a laptop at a cafe counter",
  },
  {
    slug: "deck-koja",
    name: "DeckKoja",
    upstream: "DeckCraft",
    group: "Office",
    kind: "Presentations",
    benefit: "Build slides, open .pptx files and present with presenter view.",
    keyword: "powerpoint alternative for mac",
    metaTitle: "DeckKoja: Presentation App for Mac with .pptx Support",
    metaDescription:
      "DeckKoja is a presentation app for Mac. Build dynamic slides, open .pptx files and present with presenter view. No subscription, no cloud. Try it free.",
    h1: "Presentations for Mac that open your .pptx files",
    lead:
      "DeckKoja builds fast, dynamic slide presentations and handles .pptx, so decks from colleagues just open. Present with presenter view, offline and without a cloud account.",
    features: [
      { title: ".pptx support", text: "Open and save presentations from other apps." },
      { title: "Presenter view", text: "See notes and the next slide while you present." },
      { title: "Dynamic slides", text: "Transitions and animations that keep attention." },
      { title: "No cloud", text: "Your decks stay on your Mac." },
    ],
    forWho: "Teachers, consultants and teams who present regularly and want to stop paying for an office subscription.",
    familiar: { product: "Microsoft PowerPoint", owner: "Microsoft Corporation" },
    faq: [
      {
        q: "Can I open PowerPoint files?",
        a: "Yes, DeckKoja opens and saves .pptx. Check a few of your own decks during the trial.",
      },
      {
        q: "Is there a presenter view?",
        a: "Yes, with notes and a preview of the next slide.",
      },
    ],
    imageAlt: "Speaker presenting a bold chart on stage in front of an audience",
  },
  {
    slug: "pdf-koja",
    name: "PdfKoja",
    upstream: "PdfCraft",
    group: "Office",
    kind: "PDF workbench",
    benefit: "Read, organise, combine, split and secure PDFs without uploading them.",
    keyword: "pdf editor for mac offline",
    metaTitle: "PdfKoja: Offline PDF Editor for Mac",
    metaDescription:
      "PdfKoja is an offline PDF workbench for Mac: read, organise, combine, split and secure PDFs. No account, no cloud upload. Try it free for 3 days.",
    h1: "The offline PDF workbench for your Mac",
    lead:
      "PdfKoja reads, organises, combines, splits and secures PDF files on your Mac. Contracts, invoices and scans never leave your computer: no account, no telemetry, no cloud upload.",
    features: [
      { title: "Combine and split", text: "Merge files into one PDF or pull pages out." },
      { title: "Organise pages", text: "Reorder, rotate and delete pages." },
      { title: "Secure", text: "Protect documents before you send them." },
      { title: "Private", text: "Nothing is uploaded. Ideal for contracts and personal documents." },
    ],
    forWho: "Anyone who handles contracts, invoices and forms and does not want to upload them to an online PDF tool.",
    familiar: { product: "Acrobat", owner: "Adobe Inc." },
    faq: [
      {
        q: "Are my PDFs uploaded anywhere?",
        a: "No. PdfKoja works entirely on your Mac.",
      },
      {
        q: "Can I merge several PDFs into one?",
        a: "Yes, combining and splitting PDFs are core features.",
      },
    ],
    imageAlt: "Signed paper contracts, fountain pen and laptop on a dark desk",
  },
  {
    slug: "cad-koja",
    name: "CADKoja",
    upstream: "CADCraft",
    group: "Engineering",
    kind: "CAD & drafting",
    benefit: "Draft floor plans and technical drawings on your Mac.",
    keyword: "autocad alternative for mac",
    metaTitle: "CADKoja: CAD and Technical Drawing App for Mac",
    metaDescription:
      "CADKoja is a CAD and drafting app for Mac for floor plans and technical drawings. Part of the Koja plan, no subscription lock-in. Try it free for 3 days.",
    h1: "CAD and technical drawing for Mac",
    lead:
      "CADKoja is a computer-aided design and drafting app. Draw floor plans, parts and technical drawings precisely, on a native Mac app that is part of the same plan as every other Koja app.",
    features: [
      { title: "Precise drafting", text: "Lines, arcs, dimensions and snapping for exact drawings." },
      { title: "Floor plans", text: "Lay out rooms, walls and openings." },
      { title: "Technical drawings", text: "Document parts and assemblies." },
      { title: "Built for people and AI agents", text: "Drawings can also be created and changed by automation." },
    ],
    forWho: "Architects, makers, engineering students and tradespeople who need CAD without an expensive seat licence.",
    familiar: { product: "AutoCAD", owner: "Autodesk, Inc." },
    faq: [
      {
        q: "Can I draw floor plans with CADKoja?",
        a: "Yes, floor plans and technical drawings are its core use.",
      },
      {
        q: "Which file formats does CADKoja support?",
        a: "Check the formats you need during the 3-day trial; support grows with each release.",
      },
    ],
    imageAlt: "Architecture office with a floor plan and a 3D wireframe house on a monitor",
  },
];

export const APP_GROUPS: AppGroup[] = ["Photo & design", "Video & audio", "Office", "Engineering"];

export function getApp(slug: string) {
  return APPS.find((a) => a.slug === slug);
}

export const appImage = (slug: string) => `/software/${slug}.webp`;
