# Burimet lokale të faqes

Imazhet statike ekzistuese të Unsplash dhe Googleusercontent janë kopjuar në `public/assets/images` dhe të gjitha referencat përkatëse në `src` janë zëvendësuar me rrugë lokale. Nuk u ndryshua përmbajtja e imazheve. `local-assets.json` dokumenton URL-në origjinale, rrugën lokale, madhësinë dhe SHA-256 për 45 imazhe.

Material Symbols përdor një font variabël WOFF2 lokal për peshat 100–700 dhe FILL; CSS në `src/app/material-symbols.css`. Licenca Apache 2.0 ruhet pranë fontit. U hoq si importi Google Fonts në globals.css ashtu edhe linku në root layout. Geist/Geist Mono përdorin vetë-hostimin e Next.js: shkarkohen gjatë build, pastaj shërbehen nga website, pa kërkesa të browser-it te Google Fonts.

`scripts/localize-assets.mjs` është migrim i qartë manual, jo hap runtime/build. Shkarkon vetëm URL-të statike të dy domain-eve të njohura, kontrollon tipin e imazhit/fontit dhe nuk zëvendëson referencat para suksesit të shkarkimeve. Manifesti i origjinave mbahet për auditim. Burimet totale të imazheve: 12,389,506 bytes; fonti: 1,137,516 bytes.

## Kufiri i kontrollit

Ky ndryshim përfshin faqet statike, landing pages, mockData dhe imazhet e login-it. Nuk ndryshon databazën live ose artikujt e CMS. Magazin/page dhe magazin/[slug] mund të lexojnë cover_image_url dhe HTML me media të jashtme nga databaza. Përpara publikimit, kontrollo artikujt realë dhe migro mediat e tyre; mos pretendoni se të gjithë artikujt janë kontrolluar vetëm nga testimi i faqeve statike. Për artikujt e ardhshëm përdorni uploads lokale.

Nuk u ndryshuan linket e jashtme që hapen vetëm me klikim, ose Google tag që ngarkohet pas consent-it. Ruajtja lokale nuk ndryshon të drejtat/licencat ekzistuese të imazheve.

## Verifikimi

Me serverin sintetik `node scripts/local-test-server.mjs --tracking`, ekzekuto `node scripts/check-local-assets.mjs`. Kontrolli bllokon e raporton çdo kërkesë të jashtme, ngarkon edhe imazhet lazy, kontrollon dekodimin e imazheve, fontin, gabimet JavaScript dhe servirjen e të 46 burimeve të manifestit. Nuk ka nevojë për të dhëna apo kredenciale reale.

Rezultati më 28.09.2026: 14/14 rrugë pa kërkesa të jashtme, imazhe të prishura ose gabime JavaScript; 46/46 skedarë të manifestit HTTP 200 me madhësi të sakta. 10/10 teste ekzistuese consent/lead kaluan, përfshirë ruajtjen në CRM pas refuzimit, event vetëm pas suksesit, deduplikimin dhe tërheqjen e consent-it. TypeScript, ESLint për skriptet/layout/Datenschutz dhe git diff --check kaluan. Pamja desktop/mobile u inspektua. Artikujt realë live nuk u përfshinë. Serveri sintetik u ndal pas testimit. Nuk u bë production build, deploy, commit ose push.
