# Kashtan Market

O‘zbek tilidagi, mobil ekranlarni asos qilib qurilgan 10 sahifali taqdimot sayti. To‘liq ekranli fotosuratlar, tasodifiy foto almashishi, scroll bilan kollajga aylanish va to‘rtta do‘konning katta ekranli hikoyasi. Vite, oddiy HTML/CSS/JavaScript va GSAP ScrollTrigger. Backend yoki buyurtma qabul qilish tizimi yo‘q.

## Sahifalar va imkoniyatlar

- `/` — boyitilgan bosh sahifa, do‘konlar, galereya, ilova namoyishi va savol-javoblar.
- `/dokonlar/` — qidiruv va yo‘nalish bo‘yicha saralash.
- `/dokonlar/ofiyat/`, `/dokonlar/shashlik/`, `/dokonlar/xojalik/`, `/dokonlar/misqol/` — kategoriyalar, mahsulot turlari, tanlov bo‘yicha maslahatlar va boshqa do‘konlar.
- `/galereya/` — filtrlar, rasmni kattalashtirish, klaviatura va touch orqali rasmlar orasida o‘tish.
- `/ilova/` — telefon namoyishi va rejalashtirilgan imkoniyatlar.
- `/biz-haqimizda/` — loyiha g‘oyasi va yo‘nalishlari.
- `/savollar/` — qidiriladigan 12 ta savol-javob.

Telefonlarda pastki navigatsiya, 44 px yoki kattaroq boshqaruvlar, safe-area hisobga olinishi va suriladigan kategoriya qatorlari mavjud. Native scroll saqlangan. Fon animatsiyalari ko‘rinmay turganda va tab yopilganda pauzaga tushadi. `prefers-reduced-motion` bezak animatsiyalarini o‘chiradi.

## Rasmli scroll tajribasi

- Umumiy sahifalarda to‘rtta foto 5 soniyada bir, 1,2 soniyali crossfade bilan almashadi. Tasodifiy navbat har bir do‘konni bir marta ko‘rsatadi va ketma-ket takrorlamaydi.
- Bosh sahifada rasm kichrayib kollajdagi kartochkaga aylanadi; qolgan uchta rasm chetlardan kiradi. Keyin Ofiyat, Shashlik, 1005 xil va Misqol uchun joyida turadigan scroll hikoyasi boshlanadi.
- Hikoyada yon tomondan ochilish, doira orqali ochilish va zoom effektlari scrollga bog‘langan; orqaga scroll ham qo‘llab-quvvatlanadi.
- Do‘kon sahifasining fonida o‘sha do‘konga tegishli foto qoladi. Mazmun o‘qilishi qulay yuzalarda joylashgan.
- Pastki chapdagi pauza tugmasi foto almashishi va fonning sekin harakatini pauzaga qo‘yadi. Tanlov `sessionStorage` orqali boshqa sahifalarda ham saqlanadi; scroll bilan boshqariladigan sahnalar ishlashda davom etadi.
- Bir vaqtning o‘zida ikkita katta fon qatlami ishlaydi. Yangi rasm yuklanmaguncha mavjud fon saqlanadi. Dialog yoki yashirilgan tabda avtomatik harakat pauzaga tushadi.
- `prefers-reduced-motion` yoki 560 px dan qisqa ekranda joyida turadigan sahnalar odatiy oqimga qaytadi. JavaScript bo‘lmasa ham barcha matn va havolalar ochiq qoladi.

## Ishga tushirish

Node.js 22.12+ yoki 24+ bilan:

```sh
npm ci
npm run dev
```

Vite terminalda lokal manzilni chiqaradi (odatda `http://localhost:5173`). `predev` va `prebuild` buyruqlari avval barcha HTML sahifalarni generatsiya qiladi.

```sh
npm run build
npm run preview
```

`dist/` — statik hostingga joylash uchun tayyor papka. Asl Claude eksportlari sayt ishlashi uchun kerak emas va build ichiga qo‘shilmaydi. Sahifa domen ildizida joylashtirishga tayyorlangan. Hech qayerga avtomatik e’lon qilinmaydi.

## Mazmunni o‘zgartirish

- `src/data.js` — do‘konlar tavsiflari, sahifalar, galereya, savol-javoblar, `sceneMedia` rasmlari va `motionSettings` vaqt sozlamalari.
- `src/config.js` — kategoriyalar, kontaktlar va rasmiy tashqi havolalar.
- `scripts/generate-pages.mjs` — sahifalar tuzilishi; `scripts/components.mjs` — umumiy header, footer, kartochka va namoyishlar.
- `scripts/cinematic-components.mjs` — umumiy foto fon, yangi bosh ekran va do‘kon hikoyasi shablonlari.
- `src/style.css` — dastlabki dizayn poydevori; `src/premium.css` — sahifalar; `src/cinematic.css` — rasmli sahnalar va o‘qiladigan yuzalar.
- `src/motion.js` — GSAP scroll sahnalari; `src/photo-backdrop.js` — rasmlarni yuklash, almashish va pauza; `src/shuffle-bag.js` — takrorlanmaydigan tasodifiy navbat.
- `src/catalog.js`, `src/gallery.js`, `src/ui.js`, `src/phone.js` — qidiruv, tablar, galereya, menyu va telefon namoyishi.
- `public/assets/` — lokal rasmlar va shriftlar.

`index.html` va sahifa papkalaridagi HTML fayllar generatsiya natijasidir: ularni qo‘lda tahrirlamang. Shablon yoki ma’lumotni o‘zgartirgach `node scripts/generate-pages.mjs` bajaring; ishlayotgan Vite sahifani yangilaydi. Alohida sahifalar production buildda haqiqiy HTML fayllarga aylanadi va to‘g‘ridan-to‘g‘ri ochiladi.

Kontakt va tashqi havolalarning bo‘sh qiymatlari sahifada yashiriladi. Google Play yoki App Store uchun to‘liq `https://` havolasi kiritilganda tegishli «Tez kunda» belgisi yuklab olish havolasiga aylanadi. Ilova chiqarilganda shablonlardagi holat va savol-javob matnlarini ham yangilang.

Telefon ichidagi ko‘rinishlar — rejalashtirilgan ilovaga oid namoyish. Video boshlanmaydi, mahsulot so‘rovi yuborilmaydi. Kategoriya ro‘yxatlari do‘kon yo‘nalishlarini ko‘rsatadi; real vaqt katalogi, narx yoki mavjudlik kafolati emas.

Haqiqiy do‘kon fotolari kelganda fayllarni `public/assets/images/` ichiga joylang va `sceneMedia` dagi `mobile`, `desktop`, `focusMobile`, `focusDesktop` qiymatlarini almashtiring. `focus*` — CSS `object-position`, masalan `50% 65%`. Scroll kodini o‘zgartirish shart emas. Asosiy kartochka va galereya rasmlari alohida `stores` va `gallery` ma’lumotlarida boshqariladi.

## Tekshirish

```sh
npm test
```

Buyruq production build yaratadi va 46 ta Playwright testini bajaradi: 320–1440 px sahnalar, barcha sahifalar, rasmlar va ichki havolalar, qidiruvlar, tablar va menyu; foto almashishi, pauza va sessiya, yuklanish xatosi, kollajga aylanish va orqaga qaytish, uch xil fon o‘tishi, orientatsiya, filtrdan keyingi reveal joylashuvi, reduced motion va JavaScriptsiz mazmun.

Tizimdagi `/usr/bin/google-chrome` mavjud bo‘lsa shu ishlatiladi. Boshqa joydagi Chrome uchun `CHROME_PATH` bering. Chrome yo‘q bo‘lsa `npx playwright install chromium` orqali Playwright brauzerini o‘rnating.

## Materiallar

`Beshkashtan.dc.html`, `Kashtan Market.dc.html`, `_ds/`, eksport skriptlari, rasm holati va `uploads/` asl holida saqlangan. Telefon namoyishidagi do‘kon rasmlari va logotiplar shu eksportdan olingan.

Katta rasmlar do‘konlarning haqiqiy suratlari sifatida taqdim qilinmaydi. Ular yo‘nalishlarni ifodalovchi namunaviy rasmlar; do‘kon suratlari tayyor bo‘lganda almashtirish mumkin.

- Ofiyat / osh: [otabek xatipov — Unsplash](https://unsplash.com/photos/a85Px4ZCSK4).
- Gril go‘shti: [Unsplash](https://images.unsplash.com/photo-1544025162-d76694265947).
- Asbob: [Unsplash](https://images.unsplash.com/photo-1504148455328-c376907d081c).
- Mevalar: [Unsplash](https://images.unsplash.com/photo-1619566636858-adf3ef46400b).
- [Unsplash litsenziyasi](https://unsplash.com/license).
- Barlow va Barlow Condensed — SIL Open Font License; litsenziya `public/assets/fonts/OFL.txt` ichida.

Katta rasmlarning 420 va 800 px variantlari tayyorlangan; brauzer `srcset` orqali ekran uchun mos faylni tanlaydi. Barcha shrift va rasmlar lokal xizmat qiladi.

Yakuniy desktop va mobil ko‘rinishlar `artifacts/` ichida saqlanadi; dastlabki ko‘rinishlar ham saqlangan.

Scroll yozuvlarini qayta tayyorlash uchun dev server ishlayotgan holatda `SITE_PREVIEW_URL=http://localhost:5173 node scripts/capture-walkthrough.mjs` bajaring. Tizimda `ffmpeg` va Playwright video kodlovchisi (`npm exec playwright install ffmpeg`) kerak. Skript mobil va desktopda haqiqiy brauzer harakatlarini yozadi; mavjud videolar ustiga yozmaydi.
