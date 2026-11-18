import type { Bilingual } from "@/lib/types";

export type Province = {
  id: number;
  name: Bilingual;
  capital: Bilingual;
  capitalLngLat: [number, number];
  districts: Bilingual[];
};

export type Office = {
  name: Bilingual;
  area: Bilingual;
  provinceId: number;
  serviceSlugs: string[];
};

const d = (en: string, ne: string): Bilingual => ({ en, ne });

/** The 7 provinces and 77 districts of Nepal. Province ids match the boundary file. */
export const PROVINCES: Province[] = [
  {
    id: 1,
    name: d("Koshi", "कोशी"),
    capital: d("Biratnagar", "विराटनगर"),
    capitalLngLat: [87.272, 26.455],
    districts: [
      d("Bhojpur", "भोजपुर"), d("Dhankuta", "धनकुटा"), d("Ilam", "इलाम"), d("Jhapa", "झापा"),
      d("Khotang", "खोटाङ"), d("Morang", "मोरङ"), d("Okhaldhunga", "ओखलढुङ्गा"), d("Panchthar", "पाँचथर"),
      d("Sankhuwasabha", "संखुवासभा"), d("Solukhumbu", "सोलुखुम्बु"), d("Sunsari", "सुनसरी"), d("Taplejung", "ताप्लेजुङ"),
      d("Terhathum", "तेह्रथुम"), d("Udayapur", "उदयपुर"),
    ],
  },
  {
    id: 2,
    name: d("Madhesh", "मधेश"),
    capital: d("Janakpurdham", "जनकपुरधाम"),
    capitalLngLat: [85.925, 26.729],
    districts: [
      d("Bara", "बारा"), d("Dhanusha", "धनुषा"), d("Mahottari", "महोत्तरी"), d("Parsa", "पर्सा"),
      d("Rautahat", "रौतहट"), d("Saptari", "सप्तरी"), d("Sarlahi", "सर्लाही"), d("Siraha", "सिराहा"),
    ],
  },
  {
    id: 3,
    name: d("Bagmati", "बागमती"),
    capital: d("Hetauda", "हेटौंडा"),
    capitalLngLat: [85.032, 27.428],
    districts: [
      d("Bhaktapur", "भक्तपुर"), d("Chitwan", "चितवन"), d("Dhading", "धादिङ"), d("Dolakha", "दोलखा"),
      d("Kathmandu", "काठमाडौं"), d("Kavrepalanchok", "काभ्रेपलाञ्चोक"), d("Lalitpur", "ललितपुर"), d("Makwanpur", "मकवानपुर"),
      d("Nuwakot", "नुवाकोट"), d("Ramechhap", "रामेछाप"), d("Rasuwa", "रसुवा"), d("Sindhuli", "सिन्धुली"),
      d("Sindhupalchok", "सिन्धुपाल्चोक"),
    ],
  },
  {
    id: 4,
    name: d("Gandaki", "गण्डकी"),
    capital: d("Pokhara", "पोखरा"),
    capitalLngLat: [83.986, 28.209],
    districts: [
      d("Baglung", "बागलुङ"), d("Gorkha", "गोरखा"), d("Kaski", "कास्की"), d("Lamjung", "लमजुङ"),
      d("Manang", "मनाङ"), d("Mustang", "मुस्ताङ"), d("Myagdi", "म्याग्दी"), d("Nawalpur", "नवलपुर"),
      d("Parbat", "पर्वत"), d("Syangja", "स्याङ्जा"), d("Tanahun", "तनहुँ"),
    ],
  },
  {
    id: 5,
    name: d("Lumbini", "लुम्बिनी"),
    capital: d("Deukhuri (Dang)", "देउखुरी (दाङ)"),
    capitalLngLat: [82.53, 27.87],
    districts: [
      d("Arghakhanchi", "अर्घाखाँची"), d("Banke", "बाँके"), d("Bardiya", "बर्दिया"), d("Dang", "दाङ"),
      d("Gulmi", "गुल्मी"), d("Kapilvastu", "कपिलवस्तु"), d("Palpa", "पाल्पा"), d("Parasi", "परासी"),
      d("Pyuthan", "प्युठान"), d("Rolpa", "रोल्पा"), d("Rukum East", "पूर्वी रुकुम"), d("Rupandehi", "रुपन्देही"),
    ],
  },
  {
    id: 6,
    name: d("Karnali", "कर्णाली"),
    capital: d("Birendranagar", "वीरेन्द्रनगर"),
    capitalLngLat: [81.633, 28.6],
    districts: [
      d("Dailekh", "दैलेख"), d("Dolpa", "डोल्पा"), d("Humla", "हुम्ला"), d("Jajarkot", "जाजरकोट"),
      d("Jumla", "जुम्ला"), d("Kalikot", "कालिकोट"), d("Mugu", "मुगु"), d("Rukum West", "पश्चिमी रुकुम"),
      d("Salyan", "सल्यान"), d("Surkhet", "सुर्खेत"),
    ],
  },
  {
    id: 7,
    name: d("Sudurpashchim", "सुदूरपश्चिम"),
    capital: d("Godawari (Kailali)", "गोदावरी (कैलाली)"),
    capitalLngLat: [80.62, 28.88],
    districts: [
      d("Achham", "अछाम"), d("Baitadi", "बैतडी"), d("Bajhang", "बझाङ"), d("Bajura", "बाजुरा"),
      d("Dadeldhura", "डडेल्धुरा"), d("Darchula", "दार्चुला"), d("Doti", "डोटी"), d("Kailali", "कैलाली"),
      d("Kanchanpur", "कञ्चनपुर"),
    ],
  },
];

export const KATHMANDU: [number, number] = [85.324, 27.708];

/** Central (federal) offices. All are in Kathmandu, Bagmati Province. */
export const CENTRAL_OFFICES: Office[] = [
  { name: d("Department of Passports", "राहदानी विभाग"), area: d("Tripureshwor, Kathmandu", "त्रिपुरेश्वर, काठमाडौं"), provinceId: 3, serviceSlugs: ["passport-new", "passport-renewal"] },
  { name: d("Department of Consular Services", "कन्सुलर सेवा विभाग"), area: d("Tripureshwor, Kathmandu", "त्रिपुरेश्वर, काठमाडौं"), provinceId: 3, serviceSlugs: ["police-clearance", "relationship-verification"] },
  { name: d("Office of the Company Registrar", "कम्पनी रजिस्ट्रारको कार्यालय"), area: d("Tripureshwor, Kathmandu", "त्रिपुरेश्वर, काठमाडौं"), provinceId: 3, serviceSlugs: ["company-registration"] },
  { name: d("Department of Transport Management", "यातायात व्यवस्था विभाग"), area: d("Minbhawan, Kathmandu", "मीनभवन, काठमाडौं"), provinceId: 3, serviceSlugs: ["driving-licence-new", "driving-licence-renewal", "vehicle-ownership-transfer", "bluebook-renewal"] },
  { name: d("Nepal Police Headquarters", "प्रहरी प्रधान कार्यालय"), area: d("Naxal, Kathmandu", "नक्साल, काठमाडौं"), provinceId: 3, serviceSlugs: ["police-clearance"] },
  { name: d("Inland Revenue Department", "आन्तरिक राजस्व विभाग"), area: d("Lazimpat, Kathmandu", "लाजिम्पाट, काठमाडौं"), provinceId: 3, serviceSlugs: ["pan-registration"] },
  { name: d("Department of National ID and Civil Registration", "राष्ट्रिय परिचयपत्र तथा पञ्जीकरण विभाग"), area: d("Kathmandu", "काठमाडौं"), provinceId: 3, serviceSlugs: ["national-id-card", "birth-registration", "marriage-registration"] },
  { name: d("Department of Foreign Employment", "वैदेशिक रोजगार विभाग"), area: d("Kathmandu", "काठमाडौं"), provinceId: 3, serviceSlugs: ["labour-permit"] },
  { name: d("Election Commission", "निर्वाचन आयोग"), area: d("Kantipath, Kathmandu", "कान्तिपथ, काठमाडौं"), provinceId: 3, serviceSlugs: ["voter-registration"] },
];

/** Services every district handles locally (DAO, ward, transport and land offices). */
export const LOCAL_SERVICES: { office: Bilingual; serviceSlugs: string[] }[] = [
  { office: d("District Administration Office", "जिल्ला प्रशासन कार्यालय"), serviceSlugs: ["citizenship-by-descent", "passport-new", "national-id-card"] },
  { office: d("Ward office", "वडा कार्यालय"), serviceSlugs: ["birth-registration", "marriage-registration", "relationship-verification"] },
  { office: d("Transport Management Office", "यातायात व्यवस्था कार्यालय"), serviceSlugs: ["driving-licence-new", "bluebook-renewal", "vehicle-ownership-transfer"] },
  { office: d("Land Revenue Office (Malpot)", "मालपोत कार्यालय"), serviceSlugs: ["land-ownership-transfer"] },
];
