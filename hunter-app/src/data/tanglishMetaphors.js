// ─── Tanglish Metaphor Database ───
// Each topic maps to a relatable village-life / everyday Tamil analogy

const TANGLISH_METAPHORS = {
  api: {
    title: "API-ன்னா என்ன?",
    metaphor: "Phone-la Swiggy order panra mathiri think pannu! 🛵",
    explanation: `Nee phone-la Swiggy open pannuva, biriyani order pannuva. Nee kitchen-ku direct-ah pogamaattey — 
Swiggy app dhan un REQUEST-ah restaurant-ku anuppum, aprom food-ah un door-la RESPONSE-ah deliver pannum.

API-yum adhe mathiri dhaan — oru software vera software-kitta "dei, idhu venum" nu kekum, 
aprom adhu response kudukum. Nee middle-la irukka Swiggy boy — adhu dhan API! 📱➡️🍛`,
    realWorld: "WhatsApp-la message anuppa — un phone WhatsApp server-kitta API call pannudhu. Nee server-ah paakkamaattey, but message poghudhu!",
    codeSnippet: `// Swiggy order mathiri API call
fetch("https://swiggy.com/order", {
  method: "POST",
  body: JSON.stringify({ item: "biriyani", qty: 1 })
})
.then(response => response.json())  // Food delivered!
.then(data => console.log(data))    // Order confirmed ✅`,
    emoji: "🛵📱🍛",
  },

  forloop: {
    title: "For Loop-ன்னா என்ன?",
    metaphor: "Tiffin carrier delivery route mathiri think pannu! 📦",
    explanation: `Oru delivery boy irukkan — avan oru area-la 10 veedu-ku tiffin deliver pannum.
Mudhal veedu-la start, kadaisi veedu-la stop. Oru-oru veedu-ku poi, tiffin kuduththu, next veedu-ku povaan.

For loop-um adhe mathiri dhaan:
- START: i = 0 (mudhal veedu)
- CONDITION: i < 10 (10 veedu varaikkum)
- STEP: i++ (next veedu-ku po)
- BODY: tiffin kudu (each veedu-la panra velai)

Loop mudinjadhum, avan veedu-ku thirumbi povaan! 🏠`,
    realWorld: "School-la attendance call panra mathiri — teacher oru-oru name solluvaanga, present/absent mark pannuvaanga, list mudiyana varaikkum.",
    codeSnippet: `// Tiffin delivery route!
for (let veedu = 1; veedu <= 10; veedu++) {
  console.log("Veedu " + veedu + " ku tiffin delivered! 📦");
}
// Output: Veedu 1 ku tiffin delivered! 📦
//         Veedu 2 ku tiffin delivered! 📦
//         ... (10 veedu varaikkum)`,
    emoji: "📦🏘️🛵",
  },

  ml: {
    title: "Machine Learning-ன்னா என்ன?",
    metaphor: "Amma sapadu panna panna, flavor guess panra mathiri! 🍳",
    explanation: `Amma daily sapadu pannuvaanga. Nee daily saaptutu irukka.
Monday — sambar, Tuesday — rasam, Wednesday — kootu...

Oru naal kitchen-la irunndhu smell varum — nee immediately solluva:
"Innikku sambar!" 🎯 Eppadi theriyum? Because nee PATTERN LEARN pannitey!

Machine Learning-um adhe dhaan:
- DATA = nee saaptu paaththa sapadu (training data)
- PATTERN = smell + day + season = which sapadu
- PREDICTION = pudhu smell vandha, guess panra
- IMPROVE = thappu guess vandha, correct pannikkuva

Computer-um data paathtu paathtu, pattern learn pannikkum! 🤖`,
    realWorld: "YouTube recommended videos — nee enna paakka, adha vachchhu next video suggest pannum. Adhu ML!",
    codeSnippet: `// Amma's cooking ML model 🍳
const trainingData = [
  { smell: "spicy", day: "Mon", dish: "sambar" },
  { smell: "tangy", day: "Tue", dish: "rasam" },
  { smell: "mild",  day: "Wed", dish: "kootu" },
];

function predict(smell, day) {
  // Pattern match pannu!
  return trainingData.find(d => d.smell === smell)?.dish;
}
predict("spicy", "Mon"); // "sambar" 🎯`,
    emoji: "🍳🤖📊",
  },

  database: {
    title: "Database-ன்னா என்ன?",
    metaphor: "Kadai-la provision notebook mathiri think pannu! 📒",
    explanation: `Unga area-la oru provision kadai irukku. Owner oru notebook vachchhiruppaaru:
- Yaar vandhaan (customer name)
- Enna vaangunnaan (items)  
- Evvalavu (price)
- Kaasu kuduthaana illa udhari-ya (paid/credit)

Oru customer details venum-na, notebook-la dheddikka vendiyadhu dhaan!

Database-um adhe mathiri dhaan:
- TABLE = notebook pages
- ROW = oru customer entry
- COLUMN = name, item, price, status
- QUERY = "Ramu udhari evvalavu?" nu search panradhu

Computer-la notebook-ah vachchhirukkaan — adhu dhaan DATABASE! 📊`,
    realWorld: "Contacts app-la phone number search panra mathiri — database-la irunndhu retrieve pannudhu.",
    codeSnippet: `// Provision kadai database 📒
SELECT * FROM customers 
WHERE name = "Ramu" 
AND status = "udhari";

// Result:
// | Name | Item    | Price | Status |
// | Ramu | Rice    | 500   | udhari |
// | Ramu | Oil     | 200   | udhari |
// Total udhari: ₹700 💰`,
    emoji: "📒🏪💰",
  },

  git: {
    title: "Git Version Control-ன்னா என்ன?",
    metaphor: "Notebook-la pencil-la ezhudhi eraser podra mathiri — but history irukkum! ✏️",
    explanation: `School-la essay ezhudhuva. Pencil-la ezhudhi, mistake vandha eraser podu.
But erase pannadhukku aprom, OLD version-ah paakka mudiyaadhu!

Git-la andha problem illai:
- COMMIT = "save" button — oru snapshot edukka
- BRANCH = vera oru page-la try pannu, original safe-ah irukkum
- MERGE = try panna version nallaa irundha, original-oda serru
- HISTORY = ezhudhu naal-la enna maaththi-na ellaam paakkalam

Team-la velai pannum bodhu, yellarum oru notebook-la ezhudhi, 
yaaru enna maathhi-naa-nnu track pannalam! 🤝`,
    realWorld: "Google Docs-la 'Version History' paakkalaam-la — adhu oru simple version control. Git is that but for code!",
    codeSnippet: `// Git = Time machine for code! ⏰
git init          // Pudhu notebook start
git add .         // Ezhudhi-na page-ah select
git commit -m "First essay"  // Save snapshot

git branch experiment  // Vera page-la try pannu
git checkout experiment
// ... edits pannu ...

git checkout main     // Original-ku vaah
git merge experiment  // Nalla-dha, serru! 🎉`,
    emoji: "✏️📖⏰",
  },
};

export default TANGLISH_METAPHORS;
