import { categories } from "./config.js";

// Replace these four records when the real store photographs are ready.
// Coordinates keep the subject in frame on portrait and landscape screens.
export const sceneMedia = {
  ofiyat: {
    mobile: "/assets/images/ofiyat-800.webp",
    desktop: "/assets/images/ofiyat.webp",
    focusMobile: "50% 65%",
    focusDesktop: "50% 64%",
  },
  shashlik: {
    mobile: "/assets/images/shashlik-800.webp",
    desktop: "/assets/images/shashlik.webp",
    focusMobile: "48% 50%",
    focusDesktop: "50% 50%",
  },
  hardware: {
    mobile: "/assets/images/hardware-800.webp",
    desktop: "/assets/images/hardware.webp",
    focusMobile: "56% 50%",
    focusDesktop: "55% 50%",
  },
  market: {
    mobile: "/assets/images/market-800.webp",
    desktop: "/assets/images/market.webp",
    focusMobile: "50% 55%",
    focusDesktop: "50% 55%",
  },
};
export const motionSettings = {
  autoplayMs: 5000,
  crossfadeMs: 1200,
  heroScrollScreens: 1.55,
  storyScrollScreens: 3.4,
};

export const stores = [
  {
    key: "ofiyat",
    id: "ofiyat",
    number: "01",
    name: "Ofiyat milliy taomlari",
    short: "Ofiyat",
    type: "Milliy oshxona",
    group: "food",
    color: "#00b894",
    image: "ofiyat",
    width: 1000,
    height: 1500,
    headline: "Dasturxonga<br>marhamat.",
    tagline: "Tanish ta’m. O‘zgacha fayz.",
    description:
      "Oshdan issiq somsagacha, sho‘rvadan yangi salatlargacha. Milliy oshxonamizning tanish ta’mlari bilan yaqindan tanishing.",
    intro:
      "Yaxshi dasturxon — birga o‘tadigan yaxshi vaqt. Ofiyat milliy taomlari sahifasida tushlik, oilaviy dasturxon va yengil tamaddi uchun yo‘nalishlarni kashf eting.",
    occasions: [
      [
        "Oilaviy dasturxon",
        "Osh, manti va lag‘mon kabi milliy taomlar bilan dasturxonni boyiting.",
      ],
      [
        "Issiq tushlik",
        "Sho‘rva, mastava va moshxo‘rda yo‘nalishlariga ko‘z tashlang.",
      ],
      [
        "Choy yoniga",
        "Somsa, qatlama va patir — suhbatga yarashadigan tanish ta’mlar.",
      ],
    ],
    tips: [
      "Milliy taomlar — to‘yimli tushlik va oilaviy dasturxon uchun.",
      "Sho‘rvalar — issiq va yengilroq taom xohlagan paytingizga.",
      "Somsa va non — asosiy taomga qo‘shimcha yoki choy yoniga.",
      "Salatlar — dasturxonga rang-baranglik qo‘shish uchun.",
    ],
  },
  {
    key: "shashlik",
    id: "shashlik",
    number: "02",
    name: "Shashlik Marenofka",
    short: "Shashlik",
    type: "Go‘sht va marinadlar",
    group: "food",
    color: "#ff8454",
    image: "shashlik",
    width: 1500,
    height: 1001,
    headline: "Yaxshi davra.<br>Zo‘r shashlik.",
    tagline: "Davralarga yarashadigan tanlov.",
    description:
      "Mol, qo‘y va tovuq go‘shtidan shashlik va marinadlar. Dam olish kuni, oilaviy yig‘in yoki do‘stlar davrasi uchun yo‘nalishlar.",
    intro:
      "Yaxshi davraning o‘z ta’mi bor. Turli go‘sht yo‘nalishlari va to‘plamlar bilan tanishing, dasturxoningizga mos tanlovni o‘ylab ko‘ring.",
    occasions: [
      [
        "Do‘stlar davrasi",
        "Bir necha yo‘nalishni birlashtirib, hammaning didiga mos tanlov qiling.",
      ],
      [
        "Oilaviy dam olish",
        "Mol, qo‘y yoki tovuq — oila a’zolaringiz yoqtiradigan yo‘nalishni toping.",
      ],
      [
        "Piknik rejasi",
        "To‘plamlar yo‘nalishidan boshlang va dasturxonni oldindan rejalang.",
      ],
    ],
    tips: [
      "Mol go‘shti — bo‘lak shashlik, qovurg‘a va steyk yo‘nalishlari.",
      "Qo‘y go‘shti — shashlik, qovurg‘a, jigar va dumba.",
      "Tovuq — qanot, file va son kabi turli qismlar.",
      "To‘plamlar — davra uchun bir nechta tanlovni bir joyda ko‘rish.",
    ],
  },
  {
    key: "hardware",
    id: "xojalik",
    number: "03",
    name: "1005 xil mahsulot",
    short: "1005 xil",
    type: "Xo‘jalik va qurilish",
    group: "home",
    color: "#26d9d9",
    image: "hardware",
    width: 1500,
    height: 890,
    headline: "Katta rejaga<br>kerakli jihoz.",
    tagline: "Kichik yumushdan katta ta’mirgacha.",
    description:
      "Asboblar, qurilish materiallari, santexnika va uy-ro‘zg‘or buyumlari. Uyingizdagi katta-kichik ishlar uchun yo‘nalishlar.",
    intro:
      "Biror narsani tuzatish, xonani yangilash yoki uy-ro‘zg‘orni tartibga keltirish. Kerakli yo‘nalishni tanlashdan boshlang — keyingi rejangizga mos buyumlarni kashf eting.",
    occasions: [
      [
        "Uyda ta’mir",
        "Asboblar va qurilish materiallari yo‘nalishlari bilan tanishing.",
      ],
      [
        "Ro‘zg‘or yumushlari",
        "Idish-tovoq, saqlash idishlari va tozalash vositalariga ko‘z tashlang.",
      ],
      [
        "Yangilash va tuzatish",
        "Santexnika yo‘nalishidan uyga kerakli jihoz turlarini toping.",
      ],
    ],
    tips: [
      "Asbob tanlashda bajariladigan ish turidan boshlang.",
      "Qurilish mahsulotlarida qo‘llanish joyi va hajm muhim.",
      "Santexnika buyumlarida ulanish va o‘lcham mosligini tekshiring.",
      "Uy-ro‘zg‘or buyumlarini kundalik ehtiyojingizga qarab tanlang.",
    ],
  },
  {
    key: "market",
    id: "misqol",
    number: "04",
    name: "Misqol Market",
    short: "Misqol",
    type: "Kundalik oziq-ovqat",
    group: "groceries",
    color: "#b9df72",
    image: "market",
    width: 1500,
    height: 1000,
    headline: "Har kuningizga<br>yaxshi tanlov.",
    tagline: "Ro‘zg‘oringizga kundalik hamroh.",
    description:
      "Meva-sabzavot, sut mahsulotlari, ichimliklar va bakaleya. Nonushtadan kechki dasturxongacha kerakli yo‘nalishlar.",
    intro:
      "Nonushtaga sut, tushlikka sabzavot, kechki suhbatga choy. Kundalik ro‘zg‘or uchun turli mahsulot yo‘nalishlarini birma-bir ko‘rib chiqing.",
    occasions: [
      [
        "Yaxshi nonushta",
        "Sut mahsulotlari va ichimliklar yo‘nalishidan boshlang.",
      ],
      [
        "Oilaviy tushlik",
        "Sabzavot va bakaleyani birga rejalab, xarid ro‘yxatini tuzing.",
      ],
      [
        "Ro‘zg‘or zaxirasi",
        "Guruch, un, makaron va yog‘ kabi kundalik mahsulotlar bilan tanishing.",
      ],
    ],
    tips: [
      "Meva-sabzavotni tayyorlamoqchi bo‘lgan taomingizga qarab tanlang.",
      "Sut mahsulotlarida saqlash sharoiti va yaroqlilik muddatiga e’tibor bering.",
      "Bakaleya — kundalik dasturxonning asosiy mahsulotlari.",
      "Ichimliklarni oila a’zolaringizning didiga qarab rejalang.",
    ],
  },
].map((store) => ({
  ...store,
  categories: categories[store.key],
  href: `/dokonlar/${store.id}/`,
}));

export const faqs = [
  {
    group: "Sayt haqida",
    q: "Kashtan Market nima?",
    a: "Kashtan Market — milliy taomlar, go‘sht va marinadlar, xo‘jalik buyumlari hamda kundalik oziq-ovqat yo‘nalishlarini birlashtiradigan loyiha. Bu saytda to‘rtta do‘konni yaqindan tanishingiz mumkin.",
  },
  {
    group: "Sayt haqida",
    q: "Qaysi do‘konlar bor?",
    a: "Ofiyat milliy taomlari, Shashlik Marenofka, 1005 xil mahsulot va Misqol Market. Har birining alohida sahifasi va mahsulot yo‘nalishlari mavjud.",
  },
  {
    group: "Sayt haqida",
    q: "Saytdan foydalanish uchun ro‘yxatdan o‘tish kerakmi?",
    a: "Yo‘q. Do‘konlar, kategoriyalar, galereya va ilova haqidagi ma’lumotlarni hisob yaratmasdan ko‘rishingiz mumkin.",
  },
  {
    group: "Do‘konlar",
    q: "Kerakli do‘konni qanday topsam bo‘ladi?",
    a: "«Do‘konlar» sahifasida yo‘nalish bo‘yicha saralang yoki qidiruvdan foydalaning. Do‘kon kartochkasi orqali uning alohida sahifasiga o‘tasiz.",
  },
  {
    group: "Do‘konlar",
    q: "Mahsulotlar va narxlar haqiqiymi?",
    a: "Kategoriya va mahsulot nomlari do‘kon yo‘nalishlarini tanishtirish uchun berilgan. Bu saytda amaldagi narxlar, mahsulot qoldig‘i yoki real vaqt katalogi ko‘rsatilmaydi.",
  },
  {
    group: "Do‘konlar",
    q: "Sayt orqali buyurtma bersam bo‘ladimi?",
    a: "Hozircha sayt do‘konlar bilan tanishish uchun ishlaydi. Onlayn buyurtma berish imkoniyatlari mobil ilova uchun rejalashtirilgan.",
  },
  {
    group: "Do‘konlar",
    q: "Rasmlar aynan shu do‘konlarnikimi?",
    a: "Galereyadagi katta rasmlar yo‘nalishlarni ifodalash uchun ishlatilgan. Ular muayyan do‘konning haqiqiy mahsuloti yoki mavjudligini tasdiqlamaydi.",
  },
  {
    group: "Ilova",
    q: "Ilovani qayerdan yuklab olaman?",
    a: "Kashtan Market ilovasi tayyorlanmoqda. Rasmiy havolalar tayyor bo‘lgach, ilova sahifasida Google Play va App Store orqali yuklab olish imkoniyati paydo bo‘ladi.",
  },
  {
    group: "Ilova",
    q: "Ilova qachon chiqadi?",
    a: "Hozircha aniq chiqish sanasi e’lon qilinmagan. Saytdagi «Tez kunda» holati ilova hali tayyorlanayotganini bildiradi.",
  },
  {
    group: "Ilova",
    q: "Ilovada nimalar bo‘lishi rejalashtirilgan?",
    a: "Do‘konlarni bir joydan ko‘rish, har do‘konga alohida savat, video lenta va topilmagan mahsulot haqida so‘rov yuborish kabi imkoniyatlar rejalashtirilgan.",
  },
  {
    group: "Ilova",
    q: "Yetkazib berish qayerlarda ishlaydi?",
    a: "Yetkazish hududlari, narxlari va muddatlari ilova ishga tushganda e’lon qilinadi. Hozircha tasdiqlangan hudud yoki muddat ko‘rsatilmagan.",
  },
  {
    group: "Ilova",
    q: "Mahsulot topilmasa nima qilaman?",
    a: "Ilovada kerakli mahsulot haqida matn, rasm yoki ovoz orqali so‘rov qoldirish imkoniyati rejalashtirilgan. Saytdagi telefon namoyishi shu g‘oyani tanishtiradi.",
  },
];

export const gallery = [
  {
    id: "osh",
    store: "ofiyat",
    title: "Dasturxonning fayzi",
    label: "Milliy taomlar",
    image: "ofiyat",
    alt: "Go‘sht va bedana tuxumlari bilan tortilgan milliy osh",
    width: 1000,
    height: 1500,
  },
  {
    id: "gril",
    store: "shashlik",
    title: "Yaxshi davralar uchun",
    label: "Go‘sht va marinadlar",
    image: "shashlik",
    alt: "Sabzavotlar bilan tortilgan gril go‘shti",
    width: 1500,
    height: 1001,
  },
  {
    id: "tools",
    store: "hardware",
    title: "Yangi rejalar sari",
    label: "Asbob va jihozlar",
    image: "hardware",
    alt: "Ta’mirlash uchun elektr drel",
    width: 1500,
    height: 890,
  },
  {
    id: "fruit",
    store: "market",
    title: "Tabiatning ranglari",
    label: "Meva-sabzavot",
    image: "market",
    alt: "Yangi uzum, kivi, olma va boshqa mevalar",
    width: 1500,
    height: 1000,
  },
  {
    id: "groceries",
    store: "market",
    title: "Kundalik dasturxon",
    label: "Oziq-ovqat",
    image: "groceries-original",
    alt: "Sabzavot, non, sut va boshqa oziq-ovqat mahsulotlari",
    width: 350,
    height: 263,
  },
  {
    id: "skewers",
    store: "shashlik",
    title: "Sixdagi tanish ta’m",
    label: "Shashlik",
    image: "shashlik-original",
    alt: "Sixlarda tayyorlanayotgan shashlik",
    width: 350,
    height: 350,
  },
];

export const pages = [
  {
    kind: "home",
    file: "index.html",
    path: "/",
    title: "Kashtan Market — to‘rt do‘kon, bir joyda",
    description:
      "Dasturxon uchun. Xonadon uchun. Siz uchun. To‘rtta do‘kon va ularning o‘ziga xos dunyosi bilan tanishing.",
  },
  {
    kind: "directory",
    file: "dokonlar/index.html",
    path: "/dokonlar/",
    title: "Do‘konlar — Kashtan Market",
    description:
      "Ofiyat, Shashlik Marenofka, 1005 xil mahsulot va Misqol Market. Yo‘nalish bo‘yicha tanlang va yaqindan tanishing.",
  },
  ...stores.map((store) => ({
    kind: "store",
    file: `dokonlar/${store.id}/index.html`,
    path: store.href,
    title: `${store.name} — Kashtan Market`,
    description: store.description,
    store,
  })),
  {
    kind: "app",
    file: "ilova/index.html",
    path: "/ilova/",
    title: "Mobil ilova — Kashtan Market",
    description:
      "Kashtan Market ilovasi, rejalashtirilgan imkoniyatlar va mobil ko‘rinish bilan tanishing. Tez kunda.",
  },
  {
    kind: "about",
    file: "biz-haqimizda/index.html",
    path: "/biz-haqimizda/",
    title: "Biz haqimizda — Kashtan Market",
    description:
      "To‘rtta yo‘nalish, bitta g‘oya: kundalik tanlovlarni sodda va tushunarli qilish. Kashtan Market bilan tanishing.",
  },
  {
    kind: "gallery",
    file: "galereya/index.html",
    path: "/galereya/",
    title: "Galereya — Kashtan Market",
    description:
      "Dasturxondan ustaxonagacha: do‘konlar yo‘nalishlarini rasmlar orqali kashf eting.",
  },
  {
    kind: "faq",
    file: "savollar/index.html",
    path: "/savollar/",
    title: "Savol-javob — Kashtan Market",
    description:
      "Do‘konlar, sayt va tayyorlanayotgan Kashtan Market ilovasi haqida ko‘p so‘raladigan savollarga javoblar.",
  },
];
