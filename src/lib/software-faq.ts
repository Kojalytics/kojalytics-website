import type { FaqItem } from "@/components/software/Faq";
import { TRIAL_DAYS } from "@/lib/pricing";

export const SOFTWARE_FAQ: FaqItem[] = [
  {
    q: "What do I get for €2.99 a month?",
    a: "All 13 Koja apps for Mac: photo, RAW, vector, layout, interface design, video, motion graphics, audio, word processing, spreadsheets, presentations, PDF and CAD. Every update is included while you are subscribed, on up to 3 Macs.",
  },
  {
    q: "How does the free trial work?",
    a: `Download the Kojalytics Launcher, install the apps you want and use all of them free for ${TRIAL_DAYS} days. After that, choose €2.99 a month or €79 once. If you do nothing, nothing is charged.`,
  },
  {
    q: "How do I cancel?",
    a: "With one click on kojalytics.com/cancel. There is no fee and no phone call. Your plan runs until the end of the month you already paid for, and you get a confirmation by email.",
  },
  {
    q: "Can the Koja apps replace Adobe Creative Cloud or Microsoft Office?",
    a: "For many everyday jobs, yes: they follow the workflows you know and open common files like .docx, .xlsx and .pptx. The apps are young and do not cover every advanced feature yet. Use the free trial with your own files to see if they fit your work.",
  },
  {
    q: "Which computers are supported?",
    a: "The Koja apps run on macOS. You can use one plan on up to 3 Macs.",
  },
  {
    q: "The code is open source. Why does it cost money?",
    a: "The Koja apps are built on the open-source Craft apps by the ArtCraft team. You pay us for ready-to-run, signed Mac builds, the Launcher that installs and updates them, and support from a real studio in Germany.",
  },
  {
    q: "Do I need an account or internet connection?",
    a: "No account. The apps run locally on your Mac and work offline. You only need the internet to download them and to activate your plan.",
  },
  {
    q: "Is my data private?",
    a: "Your files stay on your Mac. The apps do not upload your work, and our website only sets tracking cookies if you agree.",
  },
];
