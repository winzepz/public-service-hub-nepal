import type { Metadata } from "next";
import { getDictionary, REPO_URL } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export const generateMetadata = ({ params }: { params: { lang: Locale } }): Metadata => ({
  title: getDictionary(params.lang).aboutTitle,
});

const EN = () => (
  <div className="prose">
    <p className="lead">
      Getting government paperwork done in Nepal often means jumping between several websites, notice boards and
      advice from friends, and the rules change often. This site puts the essentials for common tasks in one place, in
      plain English and Nepali.
    </p>
    <h2>What you will find here</h2>
    <ul>
      <li>Step-by-step guides: where to go, which documents to bring, official fees and typical processing times.</li>
      <li>A checklist generator that combines the documents for several tasks into one printable list.</li>
      <li>A list of official portals, all on .gov.np domains, to help you avoid fake sites.</li>
      <li>A 3D map of Nepal&apos;s seven provinces with their districts and the central offices.</li>
    </ul>
    <h2>Accuracy</h2>
    <p>
      Each guide shows when it was last reviewed. Fees and procedures are set by the Government of Nepal and its
      provinces and can change at any time, especially at the start of a fiscal year (Shrawan). Always confirm on the
      official portal or at the office before paying. This is an independent project and is not affiliated with the
      Government of Nepal.
    </p>
    <h2>Accessibility</h2>
    <p>
      The site follows WCAG 2.2 AA: full keyboard navigation, visible focus, a skip link, screen reader labels,
      adjustable text size, a high-contrast option, support for reduced motion and Windows high contrast, and a text
      alternative for the 3D map.
    </p>
    <h2>Contribute</h2>
    <p>
      Guides are plain JSON files in the <code>content/services</code> folder, so anyone can correct a fee or add a
      service without writing code. The project is open source under the MIT licence.{" "}
      <a href={REPO_URL} target="_blank" rel="noopener noreferrer">Contribute on GitHub</a>.
    </p>
    <h2>Privacy</h2>
    <p>
      There are no accounts, cookies, trackers or analytics. Your checklist and display settings are stored only in
      your own browser.
    </p>
  </div>
);

const NE = () => (
  <div className="prose">
    <p className="lead">
      नेपालमा सरकारी कागजी काम गर्दा प्रायः धेरै वेबसाइट, सूचना पाटी र साथीहरूको सल्लाहमा भर पर्नुपर्छ, अनि नियम पनि
      बारम्बार परिवर्तन हुन्छन्। यस साइटले धेरै प्रयोग हुने कामका आवश्यक जानकारी सरल नेपाली र अंग्रेजीमा एकै ठाउँमा राख्छ।
    </p>
    <h2>यहाँ के पाइन्छ</h2>
    <ul>
      <li>चरणबद्ध मार्गदर्शन: कहाँ जाने, के-के कागजात लैजाने, आधिकारिक शुल्क र लाग्ने सामान्य समय।</li>
      <li>धेरै कामका कागजातलाई एउटै छाप्न मिल्ने सूचीमा मिलाउने चेकलिस्ट निर्माता।</li>
      <li>नक्कली साइटबाट बचाउन .gov.np डोमेनका आधिकारिक पोर्टलहरूको सूची।</li>
      <li>नेपालका सात प्रदेश, तिनका जिल्ला र केन्द्रीय कार्यालय देखाउने ३D नक्सा।</li>
    </ul>
    <h2>शुद्धता</h2>
    <p>
      प्रत्येक मार्गदर्शनमा अन्तिम पटक जाँचिएको मिति देखाइएको छ। शुल्क र प्रक्रिया नेपाल सरकार र प्रदेशले तोक्छन् र
      कुनै पनि बेला, विशेषगरी आर्थिक वर्षको सुरुमा (साउन), परिवर्तन हुन सक्छन्। भुक्तानी गर्नुअघि आधिकारिक पोर्टल वा
      कार्यालयमा अवश्य पुष्टि गर्नुहोस्। यो स्वतन्त्र परियोजना हो र नेपाल सरकारसँग आबद्ध छैन।
    </p>
    <h2>पहुँचयोग्यता</h2>
    <p>
      यो साइट WCAG 2.2 AA अनुरूप छ: पूरै किबोर्डबाट चलाउन मिल्ने, स्पष्ट फोकस, स्किप लिङ्क, स्क्रिन रिडर लेबल, अक्षरको
      आकार मिलाउने सुविधा, उच्च कन्ट्रास्ट, कम एनिमेसन र Windows high contrast समर्थन, तथा ३D नक्साको पाठ्य विकल्प।
    </p>
    <h2>योगदान</h2>
    <p>
      मार्गदर्शनहरू <code>content/services</code> फोल्डरमा सामान्य JSON फाइलका रूपमा छन्, त्यसैले कोड नलेखी पनि
      जो कोहीले शुल्क सच्याउन वा नयाँ सेवा थप्न सक्छन्। यो परियोजना MIT लाइसेन्स अन्तर्गत खुला स्रोत हो।{" "}
      <a href={REPO_URL} target="_blank" rel="noopener noreferrer">GitHub मा योगदान गर्नुहोस्</a>।
    </p>
    <h2>गोपनीयता</h2>
    <p>
      यहाँ कुनै खाता, कुकी, ट्र्याकर वा एनालिटिक्स छैन। तपाईंको चेकलिस्ट र सेटिङ तपाईंकै ब्राउजरमा मात्र सुरक्षित रहन्छ।
    </p>
  </div>
);

export default function AboutPage({ params }: { params: { lang: Locale } }) {
  const dict = getDictionary(params.lang);
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">{dict.nav.about}</p>
        <h1>{dict.aboutTitle}</h1>
      </header>
      <div style={{ marginTop: 16 }}>{params.lang === "ne" ? <NE /> : <EN />}</div>
    </div>
  );
}
