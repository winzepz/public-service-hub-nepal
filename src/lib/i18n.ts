import type { Bilingual, CategoryId, Locale } from "./types";
import { LOCALES } from "./types";

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

export const pick = (text: Bilingual, locale: Locale) => text[locale] || text.en;

const NE_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
export const toLocaleDigits = (value: string | number, locale: Locale) =>
  locale === "ne" ? String(value).replace(/[0-9]/g, (d) => NE_DIGITS[Number(d)]) : String(value);

const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_NE = ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"];

/** Formats a date as "18 November 2026" / "१८ नोभेम्बर २०२६" (browsers lack a reliable ne-NP locale). */
export const formatDate = (date: Date, locale: Locale) => {
  const months = locale === "ne" ? MONTHS_NE : MONTHS_EN;
  return toLocaleDigits(`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`, locale);
};

/** Formats a "YYYY-MM" string as a readable month in either language. */
export const formatMonth = (value: string, locale: Locale) => {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  return locale === "ne" ? `${MONTHS_NE[month - 1]} ${toLocaleDigits(year, "ne")}` : `${MONTHS_EN[month - 1]} ${year}`;
};

export const CATEGORIES: { id: CategoryId; label: Bilingual; description: Bilingual }[] = [
  {
    id: "identity",
    label: { en: "Identity & citizenship", ne: "परिचय र नागरिकता" },
    description: { en: "Citizenship, national ID, voter registration", ne: "नागरिकता, राष्ट्रिय परिचयपत्र, मतदाता दर्ता" },
  },
  {
    id: "travel",
    label: { en: "Travel & work abroad", ne: "यात्रा र वैदेशिक रोजगार" },
    description: { en: "Passport, police report, labour permit, study NOC", ne: "राहदानी, प्रहरी प्रतिवेदन, श्रम स्वीकृति, अध्ययन NOC" },
  },
  {
    id: "transport",
    label: { en: "Vehicles & licence", ne: "सवारी र अनुमतिपत्र" },
    description: { en: "Driving licence, bluebook, ownership transfer", ne: "सवारी चालक अनुमतिपत्र, ब्लुबुक, नामसारी" },
  },
  {
    id: "civil",
    label: { en: "Civil registration", ne: "व्यक्तिगत घटना दर्ता" },
    description: { en: "Birth, marriage, relationship verification", ne: "जन्म, विवाह, नाता प्रमाणित" },
  },
  {
    id: "tax-business",
    label: { en: "Tax & business", ne: "कर र व्यवसाय" },
    description: { en: "PAN, company and firm registration", ne: "प्यान, कम्पनी र फर्म दर्ता" },
  },
  {
    id: "land-property",
    label: { en: "Land & property", ne: "जग्गा र सम्पत्ति" },
    description: { en: "Land ownership transfer, land records", ne: "जग्गा रजिस्ट्रेसन पास, लालपुर्जा" },
  },
];

export const categoryLabel = (id: string, locale: Locale) => {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? pick(found.label, locale) : id;
};

const en = {
  siteName: "Public Service Hub Nepal",
  tagline: "Government paperwork in Nepal, explained step by step.",
  skip: "Skip to main content",
  nav: { home: "Home", services: "Services", checklist: "Checklist", portals: "Official portals", map: "Office map", about: "About" },
  languageSwitch: "नेपाली",
  languageLabel: "नेपालीमा हेर्नुहोस् (View in Nepali)",
  textSize: "Text size",
  smaller: "Smaller text",
  larger: "Larger text",
  contrast: "High contrast",
  menu: "Menu",
  searchLabel: "Search services",
  searchPlaceholder: "Try “passport renewal”, “licence” or “राहदानी”",
  searchHint: "Press / to search",
  noResults: "No matching service. Try a different word, or browse all services.",
  resultsCount: "results",
  heroEyebrow: "Independent guide · English & नेपाली",
  heroTitle: "Get your government paperwork right the first time.",
  heroBody:
    "Clear roadmaps for passports, national ID, licences, police reports and more: where to go, exactly what to bring, what it costs and how long it takes.",
  popular: "Most requested",
  browseByCategory: "Browse by category",
  allServices: "All services",
  viewAll: "View all services",
  servicesWord: "services",
  makeChecklist: "Make a document checklist",
  checklistPromoTitle: "Print a checklist before you queue",
  checklistPromoBody:
    "Pick one or more tasks and get a single printable list of every document to bring. Tick items off as you pack them.",
  portalPromoTitle: "Only use official portals",
  portalPromoBody:
    "Fake passport and licence sites charge extra or steal your data. Real Nepal government sites end in .gov.np.",
  seePortals: "See verified portals",
  mapPromoTitle: "Seven provinces, one map",
  mapPromoBody: "Explore Nepal in 3D, find the key central offices and see every district in each province.",
  openMap: "Open the map",
  updated: "Last reviewed",
  eligibility: "Who can apply",
  where: "Where to go",
  documents: "Documents to bring",
  steps: "Step by step",
  fees: "Official fees",
  feeItem: "Item",
  feeAmount: "Amount",
  time: "Processing time",
  officialLinks: "Official links",
  tips: "Good to know",
  authority: "Responsible office",
  printChecklist: "Print this guide",
  addToChecklist: "Make checklist",
  onThisPage: "On this page",
  feeNote:
    "Fees are set by the government and can change each fiscal year or differ by province. Always confirm on the official portal before paying.",
  disclaimerShort: "Independent, community-maintained guide. Not a government website.",
  relatedServices: "Related services",
  backToServices: "All services",
  filterBy: "Filter by category",
  all: "All",
  checklistTitle: "Document checklist generator",
  checklistIntro:
    "Select the tasks you need to do. We combine the required documents into one list you can print, save as PDF, or download as a text file.",
  chooseTasks: "Choose your tasks",
  yourChecklist: "Your checklist",
  emptyChecklist: "Select at least one task to build your checklist.",
  print: "Print or save as PDF",
  download: "Download .txt",
  clear: "Clear",
  packedOf: "of",
  packedWord: "ready",
  applicantName: "Name (optional, printed on the list)",
  generatedOn: "Generated on",
  portalsTitle: "Verified official portals",
  portalsIntro:
    "Every link here points to an official Nepal government domain ending in .gov.np. Bookmark them, and type the address yourself if someone sends you a different link.",
  phishingTitle: "How to spot a fake site",
  phishingTips: [
    "The address must end in .gov.np. Watch for look-alikes such as gov-np.com or nepalpassport.org.",
    "Government portals never ask you to pay into a personal wallet or an individual's bank account.",
    "Ignore social media ads and SMS links that promise a faster passport or licence for a fee.",
    "Check the full domain before entering your citizenship number, password or OTP.",
  ],
  visit: "Visit",
  opensNewTab: "(opens in a new tab)",
  mapTitle: "Nepal service map",
  mapIntro:
    "Drag to rotate, scroll or pinch to zoom. Select a province to see its districts and the central offices located there.",
  mapFallback: "Your browser could not start the 3D map. The province list below has the same information.",
  provinces: "Provinces",
  capital: "Capital",
  districts: "Districts",
  offices: "Key offices here",
  noOffices: "Central offices are in Bagmati Province. Use your District Administration Office or provincial Transport Management Office for most services.",
  resetView: "Reset view",
  pauseRotation: "Pause rotation",
  playRotation: "Rotate",
  keyboardMapHint: "Keyboard users: the province buttons below control the map. Arrow keys rotate it when focused.",
  mapLegendOffice: "Central office",
  mapLoading: "Loading 3D map…",
  aboutTitle: "About this project",
  notFoundTitle: "Page not found",
  notFoundBody: "The page you are looking for does not exist or has moved.",
  goHome: "Go to the home page",
  footerOpenSource: "Open source under the MIT licence. Corrections and new guides are welcome.",
  contribute: "Contribute on GitHub",
  reportIssue: "Report an error",
  emergency: "Emergency: Police 100 · Ambulance 102 · Fire 101",
  sourceAndData: "Map data: geoJSON-Nepal (MIT)",
};

export type Dictionary = typeof en;

const ne: Dictionary = {
  siteName: "सार्वजनिक सेवा हब नेपाल",
  tagline: "नेपालका सरकारी कागजी प्रक्रिया, चरणबद्ध रूपमा।",
  skip: "मुख्य सामग्रीमा जानुहोस्",
  nav: { home: "गृहपृष्ठ", services: "सेवाहरू", checklist: "चेकलिस्ट", portals: "आधिकारिक पोर्टल", map: "कार्यालय नक्सा", about: "परिचय" },
  languageSwitch: "English",
  languageLabel: "View in English (अंग्रेजीमा हेर्नुहोस्)",
  textSize: "अक्षरको आकार",
  smaller: "सानो अक्षर",
  larger: "ठूलो अक्षर",
  contrast: "उच्च कन्ट्रास्ट",
  menu: "मेनु",
  searchLabel: "सेवा खोज्नुहोस्",
  searchPlaceholder: "जस्तै “राहदानी नवीकरण”, “लाइसेन्स” वा “passport”",
  searchHint: "खोज्न / थिच्नुहोस्",
  noResults: "मिल्दो सेवा भेटिएन। अर्को शब्द प्रयोग गर्नुहोस् वा सबै सेवा हेर्नुहोस्।",
  resultsCount: "नतिजा",
  heroEyebrow: "स्वतन्त्र मार्गदर्शन · नेपाली र English",
  heroTitle: "सरकारी कागजपत्र पहिलो पटकमै सही तरिकाले बनाउनुहोस्।",
  heroBody:
    "राहदानी, राष्ट्रिय परिचयपत्र, लाइसेन्स, प्रहरी प्रतिवेदनलगायत सेवाको स्पष्ट मार्गदर्शन: कहाँ जाने, के-के कागजात लैजाने, कति शुल्क लाग्छ र कति समय लाग्छ।",
  popular: "धेरै खोजिएका",
  browseByCategory: "वर्ग अनुसार हेर्नुहोस्",
  allServices: "सबै सेवाहरू",
  viewAll: "सबै सेवा हेर्नुहोस्",
  servicesWord: "सेवा",
  makeChecklist: "कागजात चेकलिस्ट बनाउनुहोस्",
  checklistPromoTitle: "लाइनमा बस्नुअघि चेकलिस्ट छाप्नुहोस्",
  checklistPromoBody:
    "एक वा बढी काम छान्नुहोस् र लैजानुपर्ने सबै कागजातको एउटै छाप्न मिल्ने सूची पाउनुहोस्। तयार भएका कागजातमा चिनो लगाउँदै जानुहोस्।",
  portalPromoTitle: "आधिकारिक पोर्टल मात्र प्रयोग गर्नुहोस्",
  portalPromoBody:
    "नक्कली राहदानी र लाइसेन्स साइटले थप पैसा लिन्छन् वा तपाईंको विवरण चोर्छन्। नेपाल सरकारका साइट .gov.np मा अन्त्य हुन्छन्।",
  seePortals: "प्रमाणित पोर्टल हेर्नुहोस्",
  mapPromoTitle: "सात प्रदेश, एउटै नक्सा",
  mapPromoBody: "नेपाललाई ३D मा हेर्नुहोस्, मुख्य केन्द्रीय कार्यालय पत्ता लगाउनुहोस् र प्रत्येक प्रदेशका जिल्लाहरू हेर्नुहोस्।",
  openMap: "नक्सा खोल्नुहोस्",
  updated: "अन्तिम पटक जाँचिएको",
  eligibility: "को-को आवेदन दिन सक्छन्",
  where: "कहाँ जाने",
  documents: "लैजानुपर्ने कागजात",
  steps: "चरणबद्ध प्रक्रिया",
  fees: "आधिकारिक शुल्क",
  feeItem: "विवरण",
  feeAmount: "रकम",
  time: "लाग्ने समय",
  officialLinks: "आधिकारिक लिङ्क",
  tips: "जान्नैपर्ने कुरा",
  authority: "जिम्मेवार कार्यालय",
  printChecklist: "यो मार्गदर्शन छाप्नुहोस्",
  addToChecklist: "चेकलिस्ट बनाउनुहोस्",
  onThisPage: "यस पृष्ठमा",
  feeNote:
    "शुल्क सरकारले तोक्छ; प्रत्येक आर्थिक वर्षमा परिवर्तन हुन वा प्रदेश अनुसार फरक हुन सक्छ। भुक्तानी गर्नुअघि आधिकारिक पोर्टलमा अवश्य जाँच गर्नुहोस्।",
  disclaimerShort: "समुदायद्वारा सञ्चालित स्वतन्त्र मार्गदर्शन। यो सरकारी वेबसाइट होइन।",
  relatedServices: "सम्बन्धित सेवाहरू",
  backToServices: "सबै सेवाहरू",
  filterBy: "वर्ग अनुसार छान्नुहोस्",
  all: "सबै",
  checklistTitle: "कागजात चेकलिस्ट निर्माता",
  checklistIntro:
    "तपाईंले गर्नुपर्ने काम छान्नुहोस्। आवश्यक सबै कागजातलाई एउटै सूचीमा मिलाइन्छ, जुन तपाईं छाप्न, PDF बनाउन वा टेक्स्ट फाइलको रूपमा डाउनलोड गर्न सक्नुहुन्छ।",
  chooseTasks: "काम छान्नुहोस्",
  yourChecklist: "तपाईंको चेकलिस्ट",
  emptyChecklist: "चेकलिस्ट बनाउन कम्तीमा एउटा काम छान्नुहोस्।",
  print: "छाप्नुहोस् वा PDF बनाउनुहोस्",
  download: ".txt डाउनलोड",
  clear: "हटाउनुहोस्",
  packedOf: "मध्ये",
  packedWord: "तयार",
  applicantName: "नाम (ऐच्छिक, सूचीमा छापिन्छ)",
  generatedOn: "तयार गरिएको मिति",
  portalsTitle: "प्रमाणित आधिकारिक पोर्टलहरू",
  portalsIntro:
    "यहाँका सबै लिङ्क .gov.np मा अन्त्य हुने नेपाल सरकारका आधिकारिक डोमेन हुन्। यिनलाई बुकमार्क गर्नुहोस्, र कसैले फरक लिङ्क पठाए ठेगाना आफैं टाइप गर्नुहोस्।",
  phishingTitle: "नक्कली साइट कसरी चिन्ने",
  phishingTips: [
    "ठेगाना .gov.np मै अन्त्य हुनुपर्छ। gov-np.com वा nepalpassport.org जस्ता मिल्दाजुल्दा नामबाट सावधान रहनुहोस्।",
    "सरकारी पोर्टलले व्यक्तिगत वालेट वा कुनै व्यक्तिको बैंक खातामा पैसा तिर्न भन्दैन।",
    "पैसा तिरे छिटो राहदानी वा लाइसेन्स दिने भन्ने सामाजिक सञ्जालका विज्ञापन र SMS लिङ्कलाई बेवास्ता गर्नुहोस्।",
    "नागरिकता नम्बर, पासवर्ड वा OTP हाल्नुअघि पूरा डोमेन जाँच गर्नुहोस्।",
  ],
  visit: "जानुहोस्",
  opensNewTab: "(नयाँ ट्याबमा खुल्छ)",
  mapTitle: "नेपाल सेवा नक्सा",
  mapIntro: "घुमाउन तान्नुहोस्, जुम गर्न स्क्रोल वा पिन्च गर्नुहोस्। प्रदेश छान्दा त्यहाँका जिल्ला र केन्द्रीय कार्यालयहरू देखिन्छन्।",
  mapFallback: "तपाईंको ब्राउजरमा ३D नक्सा खुल्न सकेन। तलको प्रदेश सूचीमा उही जानकारी छ।",
  provinces: "प्रदेशहरू",
  capital: "राजधानी",
  districts: "जिल्लाहरू",
  offices: "यहाँका मुख्य कार्यालय",
  noOffices: "केन्द्रीय कार्यालयहरू बागमती प्रदेशमा छन्। धेरैजसो सेवाका लागि आफ्नो जिल्ला प्रशासन कार्यालय वा प्रदेशको यातायात व्यवस्था कार्यालय जानुहोस्।",
  resetView: "दृश्य पहिलेजस्तै",
  pauseRotation: "घुमाउन रोक्नुहोस्",
  playRotation: "घुमाउनुहोस्",
  keyboardMapHint: "किबोर्ड प्रयोगकर्ता: तलका प्रदेश बटनले नक्सा चलाउँछन्। नक्सा फोकसमा हुँदा एरो कीले घुमाउँछ।",
  mapLegendOffice: "केन्द्रीय कार्यालय",
  mapLoading: "३D नक्सा लोड हुँदैछ…",
  aboutTitle: "यस परियोजनाको बारेमा",
  notFoundTitle: "पृष्ठ भेटिएन",
  notFoundBody: "तपाईंले खोज्नुभएको पृष्ठ छैन वा सारिएको छ।",
  goHome: "गृहपृष्ठमा जानुहोस्",
  footerOpenSource: "MIT लाइसेन्स अन्तर्गत खुला स्रोत। सुधार र नयाँ मार्गदर्शन स्वागतयोग्य छन्।",
  contribute: "GitHub मा योगदान गर्नुहोस्",
  reportIssue: "त्रुटि जानकारी दिनुहोस्",
  emergency: "आपतकालीन: प्रहरी १०० · एम्बुलेन्स १०२ · दमकल १०१",
  sourceAndData: "नक्सा डेटा: geoJSON-Nepal (MIT)",
};

export const getDictionary = (locale: Locale): Dictionary => (locale === "ne" ? ne : en);

export const REPO_URL = "https://github.com/winzepz/public-service-hub-nepal";
