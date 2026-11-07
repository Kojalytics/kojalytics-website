// Order of the Ratgeber articles. Each entry is one JSON file in this folder.
import adobeAboKuendigen from "./adobe-abo-kuendigen.json";
import adobeAlternativeMac from "./adobe-alternative-mac.json";
import office2021 from "./office-2021-mac-support-ende.json";
import officeOhneAbo from "./office-fuer-mac-ohne-abo.json";
import photoshopOhneAbo from "./photoshop-ohne-abo.json";
import pdfBearbeiten from "./pdf-bearbeiten-mac.json";
import pdfZusammenfuegen from "./pdf-zusammenfuegen-mac.json";
import lightroomAlternative from "./lightroom-alternative-ohne-abo.json";

export const ARTICLE_FILES: unknown[] = [
  adobeAboKuendigen,
  adobeAlternativeMac,
  office2021,
  officeOhneAbo,
  photoshopOhneAbo,
  pdfBearbeiten,
  pdfZusammenfuegen,
  lightroomAlternative,
];
