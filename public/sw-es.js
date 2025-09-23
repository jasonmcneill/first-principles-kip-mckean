// Service worker using Workbox UMD build
importScripts(
  "https://cdn.jsdelivr.net/npm/workbox-sw@7.0.0/build/workbox-sw.js"
);

if (workbox) {
  // The `LANG_SLUGS` object is injected at build-time from the i18n folder.
  // BUILD_INJECT_LANG_SLUGS
  const LANG_SLUGS = {
  "en": [
    "after-baptism-now-what",
    "baptism-holy-spirit",
    "best-friends-all-time",
    "book-of-acts",
    "book-of-john",
    "christ-is-your-life",
    "church",
    "course-information",
    "cross",
    "dashboard",
    "discipleship",
    "intro-to-course",
    "introduction",
    "kingdom",
    "light-darkness",
    "medical-account",
    "memory-scriptures",
    "miraculous-gifts-holy-spirit",
    "new-testament-conversion",
    "persecution",
    "seeking-god",
    "subscribe",
    "the-mission",
    "word"
  ],
  "es": [
    "after-baptism-now-what",
    "baptism-holy-spirit",
    "best-friends-all-time",
    "book-of-acts",
    "book-of-john",
    "christ-is-your-life",
    "church",
    "course-information",
    "cross",
    "dashboard",
    "discipleship",
    "intro-to-course",
    "introduction",
    "kingdom",
    "light-darkness",
    "medical-account",
    "memory-scriptures",
    "miraculous-gifts-holy-spirit",
    "new-testament-conversion",
    "persecution",
    "seeking-god",
    "subscribe",
    "the-mission",
    "word"
  ]
};
  // The active language is injected per build when generating per-language SW files
  // BUILD_INJECT_ACTIVE_LANG
  const ACTIVE_LANG = "es";

  const routes = [
    {
      url: "/",
      // Use a timestamp so the precache manifest changes when this file is rebuilt
      revision: "e5f1dca",
    },
  ];

  // Restrict to a single active language when provided; otherwise include all
  const langs =
    typeof ACTIVE_LANG === "string" && ACTIVE_LANG
      ? [ACTIVE_LANG]
      : Object.keys(LANG_SLUGS || {});

  langs.forEach((lang) => {
    const langList = LANG_SLUGS[lang] || [];
    langList.forEach((slug) => {
      routes.push({
        url: `/${lang}/${slug}`,
        // Use a timestamp to force update when this script is regenerated
        revision: "e5f1dca",
      });
    });
  });

  // Ensure the service worker takes control as soon as it's installed/activated
  // This helps when a new SW is deployed so clients are claimed immediately.
  self.addEventListener("install", (event) => {
    // Activate new SW immediately, skipping waiting state
    if (self.skipWaiting) {
      try {
        self.skipWaiting();
      } catch (e) {
        /* ignore */
      }
    }
    if (event && event.waitUntil) {
      // No async work here, but keep waitUntil for future use
      event.waitUntil(Promise.resolve());
    }
  });

  self.addEventListener("activate", (event) => {
    if (self.clients && self.clients.claim) {
      try {
        self.clients.claim();
      } catch (e) {
        /* ignore */
      }
    }
    if (event && event.waitUntil) {
      event.waitUntil(Promise.resolve());
    }
  });

  // Precache static assets + generated routes (exclude audio .webm)
  const precacheManifest = ([{"revision":"8132e23e764b5122021c978390ba1406","url":"css/style.css"},{"revision":"c313a1a90da0b2010235c52dbc3424d2","url":"img/en/darkness-vs-light.svg"},{"revision":"8f871ab1fb6e86951c12cb2f937a0f8d","url":"img/en/died-resurrected.svg"},{"revision":"64967b493903b7215a26c2f44dc4c536","url":"img/en/father-children.svg"},{"revision":"58216046bc6ecf15660346dc4045ef44","url":"img/en/head-body-christ-church.svg"},{"revision":"8418fc68929add7d18dce86b09cc35ad","url":"img/en/sin.svg"},{"revision":"d1aa56e4ac1574c8384500a17668f631","url":"img/en/wages-vs-gift.svg"},{"revision":"2ce897ab8147211dd71cdc44036c6dc3","url":"img/en/wall.svg"},{"revision":"0fa4a8ecff65a1558798802d8497e259","url":"img/es/darkness-vs-light.svg"},{"revision":"231d584c8810b671fe5f703e6d256cad","url":"img/es/died-resurrected.svg"},{"revision":"3988b907c16fef59afdaeb9531ddc5a6","url":"img/es/father-children.svg"},{"revision":"feed85b205ce82a5fbf42dd8beb2baba","url":"img/es/head-body-christ-church.svg"},{"revision":"a7362507205e65c56c95153b6dd63a32","url":"img/es/sin.svg"},{"revision":"bf55fa413d0578e3366991ca18d7fa6f","url":"img/es/wages-vs-gift.svg"},{"revision":"db70f09ddc07ccea380051ca20abd7e8","url":"img/es/wall.svg"},{"revision":"82113efc76515256e86f03cd9cdc3fef","url":"js/global.js"},{"revision":"396d75f027f0fdd7e513f4ff64549382","url":"scriptures/en/_template.json"},{"revision":"cdd31d3ea3411127526422986ca6db36","url":"scriptures/en/1-corinthians-1-10-13.json"},{"revision":"1d0f75294ed3b834a5333c3bcaebd437","url":"scriptures/en/1-corinthians-1-10-17.json"},{"revision":"77fdf9487035248469af3ec552d23e1b","url":"scriptures/en/1-corinthians-1-17.json"},{"revision":"63014a35ef41ec52f76c09b020671268","url":"scriptures/en/1-corinthians-11-23-32.json"},{"revision":"56595848fbd36ac3465d6641965866bd","url":"scriptures/en/1-corinthians-12-12-13.json"},{"revision":"8e5c04d6cd19ed113cdbc95881e828a6","url":"scriptures/en/1-corinthians-12-14-27.json"},{"revision":"6107a0756927d92b882d8ee9be7c5e6b","url":"scriptures/en/1-corinthians-12-21.json"},{"revision":"0c501507d9f40800a987a106d5992bc4","url":"scriptures/en/1-corinthians-12-26.json"},{"revision":"a5afa585dc5c51f6d40117781bc78f7a","url":"scriptures/en/1-corinthians-12-28-30.json"},{"revision":"da13cc8d70e7a65c828578db8ee1cafc","url":"scriptures/en/1-corinthians-12-8-10.json"},{"revision":"65aa49708b9da97c400fbc1b4b3bf76c","url":"scriptures/en/1-corinthians-13-8-10.json"},{"revision":"c11627dc514b0408e6af14c5308ce2b9","url":"scriptures/en/1-corinthians-14-20-22.json"},{"revision":"666753b484044823517dd71b45018bd5","url":"scriptures/en/1-corinthians-3-11.json"},{"revision":"6cee6001767456d09a0b29c5e120fba8","url":"scriptures/en/1-corinthians-7-39.json"},{"revision":"d45f6e9cec34a0c2e310af1c691a9239","url":"scriptures/en/1-corinthians-ch-12.json"},{"revision":"fcebdb7774495ec110ce2e198547316c","url":"scriptures/en/1-corinthians-ch-14.json"},{"revision":"ff14b0f88eddd2d47f4d6dcc6ef51621","url":"scriptures/en/1-john-1-9.json"},{"revision":"9260678df005f89309e15da8f9379b64","url":"scriptures/en/1-kings-11-1-10.json"},{"revision":"877e5fa1506ed0b7184a6bd2b98099ea","url":"scriptures/en/1-peter-1-21.json"},{"revision":"81d169affa507703c2c0e7154113600b","url":"scriptures/en/1-peter-2-9-10.json"},{"revision":"9d740083889d414ca45579c4ece9fb64","url":"scriptures/en/1-peter-3-1-7.json"},{"revision":"34eafec60260167b27884546e0263384","url":"scriptures/en/1-peter-3-21.json"},{"revision":"199d016f553d08639871176a80e7bc88","url":"scriptures/en/1-peter-4-12-16.json"},{"revision":"d9f113630a32d735746f2f279d084e49","url":"scriptures/en/1-peter-4-3-4.json"},{"revision":"365ace5662d937ed55ecc52f8a69c2ff","url":"scriptures/en/1-thessalonians-5-12-14.json"},{"revision":"552a23e4db1a0e1758e93906ffb7f776","url":"scriptures/en/1-timothy-2-3-4.json"},{"revision":"0f677fe4cda76c4226791b996a238b01","url":"scriptures/en/1-timothy-4-16.json"},{"revision":"21b2ec0dc7e02554b0563f1ae38db757","url":"scriptures/en/2-corinthians-6-14-18.json"},{"revision":"6fd88a95d05420e53b3e006a1deb96f7","url":"scriptures/en/2-corinthians-9-6-11.json"},{"revision":"097a01bd0271eebf03ac6f4f70acf454","url":"scriptures/en/2-corinthians-9-6-8.json"},{"revision":"76b63f1f2eb14022961c607ad38baad1","url":"scriptures/en/2-peter-1-20-21.json"},{"revision":"bca8686e3a3a9d12f28436693cf878d1","url":"scriptures/en/2-thessalonians-2-9-12.json"},{"revision":"ed0a09097e5d2a73634b1a46aa113f41","url":"scriptures/en/2-timothy-3-1-5.json"},{"revision":"cd33e1f82e419011396543de0bf0b114","url":"scriptures/en/2-timothy-3-12.json"},{"revision":"9daa062ca7f1bd8cb3ecc163af40f5fe","url":"scriptures/en/2-timothy-3-16-17.json"},{"revision":"d925bb5b9ec7efff54c00a33b344283c","url":"scriptures/en/acts-1-12-14.json"},{"revision":"4b7c3ce6eba94b4c1cfea72091d34ff3","url":"scriptures/en/acts-1-18-19.json"},{"revision":"a213ba4b34ae370ac6f152b499fcb1f7","url":"scriptures/en/acts-1-4-5.json"},{"revision":"ae58d50793eb66228cff289dea788513","url":"scriptures/en/acts-1-8.json"},{"revision":"63e7d3bffc039c4dd99e1d452fdafa8a","url":"scriptures/en/acts-10-44.json"},{"revision":"98c0709c2e114341e6fc8e5d6b83dbe1","url":"scriptures/en/acts-10-48.json"},{"revision":"36a17927351b6262f56ceb6ca5a9cc46","url":"scriptures/en/acts-11-1-18.json"},{"revision":"b7cb0e2295106c91672a72cf0df6e2fd","url":"scriptures/en/acts-11-14.json"},{"revision":"0c417bda12924eb3c9501047113cac0f","url":"scriptures/en/acts-11-15.json"},{"revision":"9b9a6dbc7870266ecc2c67fff2b7cbc4","url":"scriptures/en/acts-11-19-26.json"},{"revision":"1e35b33f8a370242a40ae06389a9e1f5","url":"scriptures/en/acts-11-21.json"},{"revision":"53d69e70e1075b041dc55f3a3c6a9013","url":"scriptures/en/acts-11-25-26.json"},{"revision":"db2d3e426b650a33b2a68fa7a1b8ad8f","url":"scriptures/en/acts-12-24.json"},{"revision":"fa80d2a440135d100dd1ed08ed0164d2","url":"scriptures/en/acts-13-3.json"},{"revision":"60f120ba75b3027bdcf1d25245eae27b","url":"scriptures/en/acts-13-49.json"},{"revision":"f6f9ea178d5bf6f614b4b620f2dc3ae9","url":"scriptures/en/acts-14-1.json"},{"revision":"59564fcbc811d682bbea2f541007ee0c","url":"scriptures/en/acts-14-21.json"},{"revision":"440a23dad7780f6d267ab5fc15fb93ec","url":"scriptures/en/acts-16-22-34.json"},{"revision":"e8013d793b0804c2bb0b01e580add9f2","url":"scriptures/en/acts-16-5.json"},{"revision":"33d7298ef60022eda3aff9d561048295","url":"scriptures/en/acts-17-10-12.json"},{"revision":"23187327f307bb6e5948802f72772611","url":"scriptures/en/acts-17-26-28.json"},{"revision":"4bed8ce3c98d2325a3bec6a148409ec4","url":"scriptures/en/acts-17-4.json"},{"revision":"9b431a04980f94eb1ef07cb73025a89f","url":"scriptures/en/acts-17-6-rsv.json"},{"revision":"a0dc3565d5c47e100f6f577ed92d930d","url":"scriptures/en/acts-18-24-26.json"},{"revision":"bf25b65401d5ca238a5a1ec5ad7288a6","url":"scriptures/en/acts-19-1-5.json"},{"revision":"a625a763568c2be777a7899f8eda6e08","url":"scriptures/en/acts-19-1-6.json"},{"revision":"eb1f74e6c7760d07cde350a155b921d2","url":"scriptures/en/acts-19-5.json"},{"revision":"97eab84fed8e86a6bf37b1aec97271f6","url":"scriptures/en/acts-19-6.json"},{"revision":"0f1ab86fee1708aafaac3416fdf6cae6","url":"scriptures/en/acts-2-1-4.json"},{"revision":"074690f2639ab917d38591c7b305828e","url":"scriptures/en/acts-2-14.json"},{"revision":"94e0c71b6f49db5500d415c0ff14420a","url":"scriptures/en/acts-2-17.json"},{"revision":"5784ca378d13f10ddf51d752378e3c7d","url":"scriptures/en/acts-2-22-24.json"},{"revision":"337d849a83c0e7a48fe2a5bfb585a888","url":"scriptures/en/acts-2-22.json"},{"revision":"242a1f0fcaa6c57276caeefcfc960858","url":"scriptures/en/acts-2-23.json"},{"revision":"d65d2cf16ce3c824428098520783b9ec","url":"scriptures/en/acts-2-24.json"},{"revision":"0c1e03b8609c5423ed98c0494e961d63","url":"scriptures/en/acts-2-36-37.json"},{"revision":"6c3209d9a0806b854c8af3f50f12bf34","url":"scriptures/en/acts-2-36-47.json"},{"revision":"4c36ae2c00099f63f119c82dc2f8ec94","url":"scriptures/en/acts-2-37-38.json"},{"revision":"7855232f203fe8b64491209e26a763ca","url":"scriptures/en/acts-2-37-42.json"},{"revision":"3e2e2941e8624e95508bec39ced98e29","url":"scriptures/en/acts-2-38-42.json"},{"revision":"49b750f1709b15d929b1a6651bc1faeb","url":"scriptures/en/acts-2-38.json"},{"revision":"88dfadabe844fbdecbc9f59be9e05af3","url":"scriptures/en/acts-2-41.json"},{"revision":"ce37cb4800fc9c9dacc314e6227f8f88","url":"scriptures/en/acts-2-42.json"},{"revision":"f1d50e968c71db7616afce9733871f32","url":"scriptures/en/acts-2-47.json"},{"revision":"4f30cfb38d017c9416e291967fa6c01b","url":"scriptures/en/acts-2-5.json"},{"revision":"d1ae68b20e1227e22835949a7ed6765f","url":"scriptures/en/acts-22-16.json"},{"revision":"c85293491e62ce27485aefcdca42d1e4","url":"scriptures/en/acts-22-3-16.json"},{"revision":"a240a910780bc4c225a2d7fa1e408014","url":"scriptures/en/acts-28-21-22.json"},{"revision":"66d8e00083a9384fef7378854ccb3f84","url":"scriptures/en/acts-28-22.json"},{"revision":"869d934d63526cb748fa363c6b416c42","url":"scriptures/en/acts-28-30.json"},{"revision":"3d332c4b4775fd266201035225de72e7","url":"scriptures/en/acts-28-5.json"},{"revision":"7f35e496c28cfaa9ec2188616d91feac","url":"scriptures/en/acts-28-8.json"},{"revision":"5f7afb6d0e60074df7c9a38dafc4ed27","url":"scriptures/en/acts-4-12.json"},{"revision":"2b58f28a84d29a657cbd7282751a58b5","url":"scriptures/en/acts-4-4.json"},{"revision":"c9df0e82b8a148c02b024d7c091fb06b","url":"scriptures/en/acts-5-14.json"},{"revision":"599fd14556860a2c9bf752a5e6e72adf","url":"scriptures/en/acts-5-17-18.json"},{"revision":"4830485bfaa3770985630b23b5540e5d","url":"scriptures/en/acts-5-38-42.json"},{"revision":"4534760286628a213ab35532640de68e","url":"scriptures/en/acts-6-1-8.json"},{"revision":"a1e7b35928ba2bc5c7dd5f7058d4430b","url":"scriptures/en/acts-6-1.json"},{"revision":"2610ff499277b239af063a5a92cf621d","url":"scriptures/en/acts-6-7.json"},{"revision":"93f2f1510fa46043b163b5f33c33b28f","url":"scriptures/en/acts-6-8.json"},{"revision":"2b88632b3545750b68bf484e86e18960","url":"scriptures/en/acts-8-1-25.json"},{"revision":"620325fb67f3488efba54cf90d74fe31","url":"scriptures/en/acts-8-12.json"},{"revision":"29eb5c44af68aab2bca6ae901377c90f","url":"scriptures/en/acts-8-13.json"},{"revision":"a026fc0ac782f8f8c4f772034c06a689","url":"scriptures/en/acts-8-18.json"},{"revision":"ac7485eac2b8bac5d47294201b1cc913","url":"scriptures/en/acts-8-26-39.json"},{"revision":"90c6778e9ab5c5940eea19d6ff149fe5","url":"scriptures/en/acts-8-4.json"},{"revision":"a024d2d4ee72c1393ca648e4ffe867c1","url":"scriptures/en/acts-9-1-22.json"},{"revision":"9aedc0bc3dbbe66af53a68f81f15eed6","url":"scriptures/en/acts-9-17-18.json"},{"revision":"d438ff5d41704449336db94df227e2a0","url":"scriptures/en/acts-9-18-25.json"},{"revision":"80daea5f3b4ec3ce4a66079c792039e0","url":"scriptures/en/acts-9-31.json"},{"revision":"d4c05fd779bbe34e3e1cda2b22495b30","url":"scriptures/en/acts-ch-1-ch-2.json"},{"revision":"00498c9a14dde246b712806c7eef79f8","url":"scriptures/en/acts-ch-10.json"},{"revision":"370574030272eec6c830ec4d2d3f8a4f","url":"scriptures/en/acts-ch-2.json"},{"revision":"25278c12611a4cfc8422a7b5fd93611f","url":"scriptures/en/colossians-1-15-18.json"},{"revision":"818bdbeb89e9c8f4178acb265d9f7ac1","url":"scriptures/en/colossians-1-23.json"},{"revision":"cc368c74f33cfa5ad58e058137ceaa0f","url":"scriptures/en/colossians-1-28-29.json"},{"revision":"e8589ab17abf43ff3407df4b95a07721","url":"scriptures/en/colossians-1-6.json"},{"revision":"57fd8254969027f3da240d82e6acac0c","url":"scriptures/en/colossians-2-11-12.json"},{"revision":"bfd8f919a0bfa42e6bafc3ae685686d3","url":"scriptures/en/colossians-2-12.json"},{"revision":"bf8820ea2503fbe695b42a124d065059","url":"scriptures/en/colossians-3-1-4.json"},{"revision":"ce2d7195ca2b765b47e27c4f3a00a373","url":"scriptures/en/colossians-3-12-14.json"},{"revision":"8d231daf80d9255dbd60897120db1d58","url":"scriptures/en/colossians-3-15-16.json"},{"revision":"9acef4857931720e44d57900f6fb97f9","url":"scriptures/en/colossians-3-15.json"},{"revision":"c7f1f9c4f091727949ce90dbc960b011","url":"scriptures/en/colossians-3-17.json"},{"revision":"6f67d245768f1e18c4f9033cc6ae1e53","url":"scriptures/en/colossians-3-18-21.json"},{"revision":"be148b943949074e821d9972efd777fe","url":"scriptures/en/colossians-3-22.json"},{"revision":"9e4ea122f0f5dda22b100739978e7790","url":"scriptures/en/colossians-3-5-11.json"},{"revision":"32578ccaf9f4c63bac46d67479424cc2","url":"scriptures/en/colossians-4-1.json"},{"revision":"2bec0b33a9e4aaf71ae20b215ace62cb","url":"scriptures/en/colossians-ch-3-15-ch-4-1.json"},{"revision":"550289f97c4de3a532ed218812d60f8f","url":"scriptures/en/daniel-2-31-45.json"},{"revision":"bb9ae52e945fd97d7722c1e0abaf09f5","url":"scriptures/en/daniel-2-44.json"},{"revision":"3eadb347f1a01165a66970e26e4f2333","url":"scriptures/en/ephesians-2-19-21.json"},{"revision":"e25a588a94b9e4c08ba2cb4341ac7948","url":"scriptures/en/ephesians-2-8.json"},{"revision":"66bae144c19b3f52d89c6bd57e4dc56f","url":"scriptures/en/ephesians-3-20.json"},{"revision":"3062daef7f5ce25351ce0b4ffbe38718","url":"scriptures/en/ephesians-4-4-6.json"},{"revision":"4c16a4abbec040e7ff9f46851091dd54","url":"scriptures/en/ephesians-5-18-19.json"},{"revision":"fdd1e3f15b5f66f95d5409d2fea09df4","url":"scriptures/en/ephesians-5-19-20.json"},{"revision":"c066f7b39d1f1c6b415de5c6ee74b738","url":"scriptures/en/ephesians-6-10-18.json"},{"revision":"aafeb4891059c4c8c7c0ab6b2101de9d","url":"scriptures/en/ezekiel-18-20.json"},{"revision":"dacfa06656fade4525b85541723609b5","url":"scriptures/en/galatians-1-8.json"},{"revision":"d2383c709eabf4f4a9ec123a2e9d4825","url":"scriptures/en/galatians-5-19-21.json"},{"revision":"f5cf0a64fa6285b6ea9a661f36fcbaff","url":"scriptures/en/galatians-6-1-2.json"},{"revision":"0ea1679e8392bfbb9bcb2ad4700257e0","url":"scriptures/en/genesis-2-19.json"},{"revision":"510cf67c8b0ae189dd93dace8eb4fc3d","url":"scriptures/en/hebrews-10-23-25.json"},{"revision":"745b9a2db2f2084970edc8e84169bb5e","url":"scriptures/en/hebrews-10-23.json"},{"revision":"58c54a12ad8489693133dbb2b596fdf7","url":"scriptures/en/hebrews-10-24.json"},{"revision":"11cad6eea16f26fa9984280c4376f075","url":"scriptures/en/hebrews-12-14-15.json"},{"revision":"3638af77e4862740fa2856576adc5f4a","url":"scriptures/en/hebrews-12-15.json"},{"revision":"4810a5beea505a16f5aa4bed895c18e0","url":"scriptures/en/hebrews-13-17.json"},{"revision":"64ac5f1ca4c15d01d969628abc15cf3c","url":"scriptures/en/hebrews-3-12-14.json"},{"revision":"0f051555212d1e1e30e948721bf4725a","url":"scriptures/en/hebrews-4-12-13.json"},{"revision":"11b1c9d1afef94086e75275cdd040d32","url":"scriptures/en/hebrews-5-11-14.json"},{"revision":"5ac8851ba84f2125d47b9d6ccc5081b1","url":"scriptures/en/hebrews-6-1-3.json"},{"revision":"ddb05bea3197b389d47c90f9bba876ec","url":"scriptures/en/hebrews-ch-5-11-ch-6-6.json"},{"revision":"1c53881288bacb5d8acd3fb79c0fea81","url":"scriptures/en/isaiah-2-1-4.json"},{"revision":"9d10bb382d316cae0c5f9a54a21227bf","url":"scriptures/en/isaiah-2-2.json"},{"revision":"46a27975dd6917d130dc12f94b578ac9","url":"scriptures/en/isaiah-2-3.json"},{"revision":"0a4de74548066cb0c0813b399f48c8d6","url":"scriptures/en/isaiah-53-4-6.json"},{"revision":"4f4026b44e2c01ca1c857d573e9ae54d","url":"scriptures/en/isaiah-59-1-2.json"},{"revision":"e2734b5917fba5784c03bbd87247dcfb","url":"scriptures/en/james-1-22-25.json"},{"revision":"57bf9ea3448d4ddd8ac3af06182fb1e6","url":"scriptures/en/james-4-17.json"},{"revision":"145cd268ebc6e1084efeeb133b6a1c1d","url":"scriptures/en/james-5-16-18.json"},{"revision":"7aa18b2a9ad5e9853f44adcd804d2379","url":"scriptures/en/james-5-16.json"},{"revision":"e8e66ee1e46e1d65b4c3addb544acab3","url":"scriptures/en/jeremiah-29-11-14.json"},{"revision":"944d12c93677411aa4bf6e625a41d5bd","url":"scriptures/en/jeremiah-29-11.json"},{"revision":"4207e461543921c6b9b080487fb49ea3","url":"scriptures/en/john-10-19-21.json"},{"revision":"d464463cbd7386ed571ddce1625b2698","url":"scriptures/en/john-12-48.json"},{"revision":"e6b0dbad8ec1f669b04db82b71f60044","url":"scriptures/en/john-13-34-35.json"},{"revision":"fda6d7ee294acbd476fc970aa05a72a0","url":"scriptures/en/john-15-1-16.json"},{"revision":"d2ff2e6c77a7ec27620a0510df86ff9f","url":"scriptures/en/john-15-16.json"},{"revision":"74017f447bc0cd6faff148bfb48d8531","url":"scriptures/en/john-15-18-20.json"},{"revision":"3a05b88578e0062c86a12689c34f79bc","url":"scriptures/en/john-15-8.json"},{"revision":"f6614a00933b4b300e4f907353e09f30","url":"scriptures/en/john-15-9-10.json"},{"revision":"e1a5eecaf0d69de3e1a07c7f1264b850","url":"scriptures/en/john-16-1-4.json"},{"revision":"e6261ede20d8bbc52a2a7b3803983824","url":"scriptures/en/john-17-20-23.json"},{"revision":"930e4718b67d8352b37fadbc3d632531","url":"scriptures/en/john-20-30-31.json"},{"revision":"0d66c2f9cfc3f0c1195e221fa9ac0cac","url":"scriptures/en/john-3-1-7.json"},{"revision":"adb5ad802724bcfeae139a975d5968d4","url":"scriptures/en/john-3-3.json"},{"revision":"aa2010dcc92c6ad58f27df43b005e267","url":"scriptures/en/john-3-34-36.json"},{"revision":"92fe3d811f1bb555fb93ab5739a93882","url":"scriptures/en/john-3-34.json"},{"revision":"a1547f73a655558c211004d8590583bd","url":"scriptures/en/john-3-5.json"},{"revision":"b21438d940d17a198923388bb99ad2b8","url":"scriptures/en/john-3-7.json"},{"revision":"92de191dcb6aa6c1918f0ce2c1cede74","url":"scriptures/en/john-4-23-24.json"},{"revision":"68a48973d5a05c59475c0f5ec5072842","url":"scriptures/en/john-7-12-13.json"},{"revision":"55d0d23427e4f0427e4907d3e2c97cab","url":"scriptures/en/john-8-31-32.json"},{"revision":"5caab1ef02932d741d31ee4932ce3d94","url":"scriptures/en/luke-11-1-4.json"},{"revision":"fa39d7c005c27d97e70b0227e8cabc4f","url":"scriptures/en/luke-12-51-53.json"},{"revision":"26f31fe4c3710cefe02e9176321507c6","url":"scriptures/en/luke-14-25-33.json"},{"revision":"9a750a16bf9bb76d448b206766e9f4cc","url":"scriptures/en/luke-17-20-21.json"},{"revision":"d2eda2b394a3a25b722162753bb7c20e","url":"scriptures/en/luke-19-10.json"},{"revision":"8c60e1773127a187c00c943fa9d25d81","url":"scriptures/en/luke-23-1-3.json"},{"revision":"e97283948d3997051faa6569a8077208","url":"scriptures/en/luke-23-50-51.json"},{"revision":"c7cba40e60df22fd0e0997ad05ea3bdc","url":"scriptures/en/luke-24-44-49.json"},{"revision":"99f1344c1e6a7f90ff56ffd14e12aec4","url":"scriptures/en/luke-24-47.json"},{"revision":"87381cb895a210b3f175e988a0aa6e5d","url":"scriptures/en/luke-9-1.json"},{"revision":"834e03a2de2721a2344247bbf7d6b3e7","url":"scriptures/en/luke-9-23-26.json"},{"revision":"27e27a29673033589aa6f84fefe03e09","url":"scriptures/en/malachi-3-6-12.json"},{"revision":"19d4e51593a2c1fda75546e800042314","url":"scriptures/en/mark-1-14-18.json"},{"revision":"54d217e79d948af4250f21bd71e76f45","url":"scriptures/en/mark-1-17.json"},{"revision":"c1f0b6f9809d9860b38b7cd9a609297c","url":"scriptures/en/mark-16-16-18.json"},{"revision":"648d72f830c6bf0d62988ce02dcd2441","url":"scriptures/en/mark-3-20-21.json"},{"revision":"510fb98db4e33950a078935d1ee9d159","url":"scriptures/en/mark-3-31-35.json"},{"revision":"0d24cab0b788f7ea0cb26f9bb2bf9b67","url":"scriptures/en/mark-9-1.json"},{"revision":"4a7b47e47dfd007a6b338c138be71f80","url":"scriptures/en/matthew-15-1-9.json"},{"revision":"03555a285ca38f2a6f0ae8b69e858d3e","url":"scriptures/en/matthew-15-6-9.json"},{"revision":"750d06ade385bd8a29b3d183e7d60472","url":"scriptures/en/matthew-16-13-19.json"},{"revision":"b5c3e651a8e8261e1b58ba4a11fdaa8b","url":"scriptures/en/matthew-16-19.json"},{"revision":"6d5e5283036c7e152173f7252917fde0","url":"scriptures/en/matthew-18-15-17.json"},{"revision":"a34ecd7794e2815704120bc63db5c967","url":"scriptures/en/matthew-22-37-39.json"},{"revision":"10f0ef9adc2977866f73cab070e696da","url":"scriptures/en/matthew-26-31-35.json"},{"revision":"7b4d66996223673cf7f490f4f7403efc","url":"scriptures/en/matthew-26-36-39.json"},{"revision":"a12dfc8466b491d2bd3acf0749bb0fb5","url":"scriptures/en/matthew-26-36-46.json"},{"revision":"61a337a618523619e16633e822607419","url":"scriptures/en/matthew-26-47-56.json"},{"revision":"1f279e1be7677352dfb0be43776a4c19","url":"scriptures/en/matthew-26-57-68.json"},{"revision":"643b47d0899c451658050b8a698f4611","url":"scriptures/en/matthew-26-69-75.json"},{"revision":"c36cfc9342b18a54aa0de38aef408d4e","url":"scriptures/en/matthew-27-1-10.json"},{"revision":"1f281ea12a95c409c927e76b50c8a274","url":"scriptures/en/matthew-27-11-26.json"},{"revision":"7d2695923b03f174476bf69af2ef5d85","url":"scriptures/en/matthew-27-27-31.json"},{"revision":"d4a319e62b2471aa630fe11d32f90e93","url":"scriptures/en/matthew-27-32-44.json"},{"revision":"00e283e92908d018ef2c91cfca80a889","url":"scriptures/en/matthew-27-45-56.json"},{"revision":"cc0814d0cb52035e5b00dfd6207d2c4b","url":"scriptures/en/matthew-27-46.json"},{"revision":"f203ddceef4947d183ea413e0eab5957","url":"scriptures/en/matthew-27-57-61.json"},{"revision":"cb0aba7249b06d735e90b88e38ac8ff0","url":"scriptures/en/matthew-27-62-66.json"},{"revision":"dc2833d4abf6864c510c62b57d34eb69","url":"scriptures/en/matthew-28-1-10.json"},{"revision":"47f4c973ff28de34a0beab6fb08d2604","url":"scriptures/en/matthew-28-18-20.json"},{"revision":"3de309c5fc7bad3b734a20a932a6d75c","url":"scriptures/en/matthew-28-19-20.json"},{"revision":"e4929b9a5e4a3e831823d1957678d54a","url":"scriptures/en/matthew-28-19.json"},{"revision":"d2a5eaf0c25ada1021ffe338725443ac","url":"scriptures/en/matthew-28-20.json"},{"revision":"a8d496ee7ad0451bf395bea44c30c92a","url":"scriptures/en/matthew-3-1-2.json"},{"revision":"b8940deef7eb48767e152575ffdab7ec","url":"scriptures/en/matthew-3-1-6.json"},{"revision":"675cf5f8b84f40119fc5015e3142ccf1","url":"scriptures/en/matthew-4-17.json"},{"revision":"653e8602aacdf0659b9d72a3f7d2b146","url":"scriptures/en/matthew-5-10-12.json"},{"revision":"5ae057342acc6f0d0a72e48344f9b7cc","url":"scriptures/en/matthew-6-25-34.json"},{"revision":"df6714537636a9f880abe8217051c789","url":"scriptures/en/matthew-6-33.json"},{"revision":"06c3dd6fd2543328c34f3a0be6668fd8","url":"scriptures/en/matthew-7-13-14.json"},{"revision":"2fe1691535c778d53b833b75883e25db","url":"scriptures/en/matthew-7-7-8.json"},{"revision":"930c66c06f8cd0212d7d45632de187c8","url":"scriptures/en/matthew-9-2-6.json"},{"revision":"62f897fc977ceb9f82467900b873cee4","url":"scriptures/en/nehemiah-13-23-27.json"},{"revision":"add963e931e8b913852a4ec2d89df1ed","url":"scriptures/en/numbers-27-12-18.json"},{"revision":"a77f94224471cee7e2ebda336f85f8bf","url":"scriptures/en/philippians-4-13.json"},{"revision":"21600e0e8d1687d261bf3c632c21b4da","url":"scriptures/en/philippians-4-4-7.json"},{"revision":"b96e36d5ab1ff0007f57815ef23874db","url":"scriptures/en/philippians-4-4.json"},{"revision":"1465b6c45acf1a57fca70c4fd5cf0f67","url":"scriptures/en/phillipians-4-13.json"},{"revision":"070ccbe37ea2eff0427994da666bc41f","url":"scriptures/en/phillipians-4-4.json"},{"revision":"94e02e8a53717c1b280fd32ae90cb6fb","url":"scriptures/en/proberbs-13-12.json"},{"revision":"e239c79fcbd216595639cae951a7fd70","url":"scriptures/en/psalm-119-1-2.json"},{"revision":"156f9d52f26c100f22fde893aaf27c95","url":"scriptures/en/revelation-3-20.json"},{"revision":"305407b802a9ee08e4094987d32529a2","url":"scriptures/en/romans-10-13.json"},{"revision":"5d4d6de0188650317367847477e8b3bf","url":"scriptures/en/romans-10-9.json"},{"revision":"ef02fa0769acad8f36fbf1ad05cec67d","url":"scriptures/en/romans-12-4-5.json"},{"revision":"736f1d6a076e2072ac37d4038c578678","url":"scriptures/en/romans-3-23-25.json"},{"revision":"5f083ce762725d27c51503c8b5475c92","url":"scriptures/en/romans-3-23.json"},{"revision":"e2ac5a8d2c1db32ef4cbb0e3ff1800a1","url":"scriptures/en/romans-3-25.json"},{"revision":"00d1deaa05db70204906ca3e01ec6523","url":"scriptures/en/romans-6-1-4.json"},{"revision":"ced63d49e3b1c17acba20e36149b1eae","url":"scriptures/en/romans-6-2-4.json"},{"revision":"f482b77d37a349c4b4c872eafdaaab5d","url":"scriptures/en/romans-6-23.json"},{"revision":"59de33bac50b41ad9d0aae0c3ed1e7e7","url":"scriptures/en/romans-6-3-4.json"},{"revision":"69ee2ab03406de8014500f3d7c4447cc","url":"scriptures/es/_template.json"},{"revision":"5d1d130167fa151f539679ae6f8f6ab3","url":"scriptures/es/1-corinthians-1-10-13.json"},{"revision":"34a9a9e8d9788ef8ccd35bc49afbc8d9","url":"scriptures/es/1-corinthians-1-10-17.json"},{"revision":"f2208d50d94a1114257a217ae1c1381f","url":"scriptures/es/1-corinthians-1-17.json"},{"revision":"9d271ead190c1321a6d491655b020070","url":"scriptures/es/1-corinthians-11-23-32.json"},{"revision":"9e0a0dbc6a2f521c2a447933e9e5d0e3","url":"scriptures/es/1-corinthians-12-12-13.json"},{"revision":"d706170ec34b269c1576af0195486020","url":"scriptures/es/1-corinthians-12-14-27.json"},{"revision":"61a9c2a3ac06438a55d184267fa47eb6","url":"scriptures/es/1-corinthians-12-21.json"},{"revision":"5b3b670d092bfaa4b9f211229b930e31","url":"scriptures/es/1-corinthians-12-26.json"},{"revision":"1a5b9a92cee5736ce9ab901681012ce3","url":"scriptures/es/1-corinthians-12-28-30.json"},{"revision":"08d9a94b41ecfa1f40241ae638ac2d54","url":"scriptures/es/1-corinthians-12-8-10.json"},{"revision":"c099c8cda0d94502dd53f6e30700e163","url":"scriptures/es/1-corinthians-13-8-10.json"},{"revision":"78c54942e10cbf585d163b3bfe88721d","url":"scriptures/es/1-corinthians-14-20-22.json"},{"revision":"d42bfb202bf4b708d2b3ae6b5c033858","url":"scriptures/es/1-corinthians-3-11.json"},{"revision":"b0ff18f82b012047249107cdf98b2202","url":"scriptures/es/1-corinthians-7-39.json"},{"revision":"51239fd3666d32b4bbc36a91523d73b7","url":"scriptures/es/1-corinthians-ch-12.json"},{"revision":"baacc6af4e22f5be3d66476cd6b27f28","url":"scriptures/es/1-corinthians-ch-14.json"},{"revision":"032ba5a01eb9dfdd195347ac82fb3789","url":"scriptures/es/1-john-1-9.json"},{"revision":"b4d74cd6c8ca1260dbf42ddbe62dfd29","url":"scriptures/es/1-kings-11-1-10.json"},{"revision":"1dd1e3eeac7b714d17c6b59da49d96b2","url":"scriptures/es/1-peter-1-21.json"},{"revision":"083762608be893070c1b98d7baf5e1fc","url":"scriptures/es/1-peter-2-9-10.json"},{"revision":"3a5b5f0acc2e752afc1b597ae524b7d1","url":"scriptures/es/1-peter-3-1-7.json"},{"revision":"2e22224dbb6362130d15cfc14bb01d52","url":"scriptures/es/1-peter-3-21.json"},{"revision":"226656dc90224176f0409ea4259b7464","url":"scriptures/es/1-peter-4-12-16.json"},{"revision":"6049797582fdd405514280e2ee6e9fda","url":"scriptures/es/1-peter-4-3-4.json"},{"revision":"723ed011a4d85fe85032ed0df82fa739","url":"scriptures/es/1-thessalonians-5-12-14.json"},{"revision":"63aabff00d88316465894b709a2653a0","url":"scriptures/es/1-timothy-2-3-4.json"},{"revision":"f20cf8fb05113ce0797e3ab74f6f955b","url":"scriptures/es/1-timothy-4-16.json"},{"revision":"bae543a9f08f121b6ac8fbb2edfe31be","url":"scriptures/es/2-corinthians-6-14-18.json"},{"revision":"ad08df8f9f05d281161614e3f8b22f26","url":"scriptures/es/2-corinthians-9-6-11.json"},{"revision":"acf95e704b45c34b3b2a412fa95bdd03","url":"scriptures/es/2-corinthians-9-6-8.json"},{"revision":"62ec581586b50dfbeb3e67406ee71618","url":"scriptures/es/2-peter-1-20-21.json"},{"revision":"1dc3edb97147c587689fa20a65a7f89a","url":"scriptures/es/2-thessalonians-2-9-12.json"},{"revision":"d9227ce328ce8d763a9b0668196ef710","url":"scriptures/es/2-timothy-3-1-5.json"},{"revision":"f3a22fe29a4cd069bb4409f140e3f9d5","url":"scriptures/es/2-timothy-3-12.json"},{"revision":"5b1561b8f6f20f7681c5c8c20a8b317c","url":"scriptures/es/2-timothy-3-16-17.json"},{"revision":"9aa44cd5b641a03b2eb1274fe5cc8557","url":"scriptures/es/acts-1-12-14.json"},{"revision":"843312e61d1b8f6ef57b1f807292524f","url":"scriptures/es/acts-1-18-19.json"},{"revision":"74afe3359da08a2fe40f499b60b2b3a2","url":"scriptures/es/acts-1-4-5.json"},{"revision":"96cc3ba67245f285cb937a73ba6a1d80","url":"scriptures/es/acts-1-8.json"},{"revision":"eef228a6e618acb9890d33486366fd9f","url":"scriptures/es/acts-10-44.json"},{"revision":"12b488e57193fc7484dd85df60f236d9","url":"scriptures/es/acts-10-48.json"},{"revision":"a1c6bfdb72f6db73cc2908c393992074","url":"scriptures/es/acts-11-1-18.json"},{"revision":"aca75d9cffc5370a9a28998f8e6eddd0","url":"scriptures/es/acts-11-14.json"},{"revision":"33047f339692dc86d014053ddea47cb8","url":"scriptures/es/acts-11-15.json"},{"revision":"0d116d07e6d51dd0d9d35b0eb8819db9","url":"scriptures/es/acts-11-19-26.json"},{"revision":"04240381a986aa3479be7db127696482","url":"scriptures/es/acts-11-21.json"},{"revision":"666a9ab3b597b82b7e732dedcbbff198","url":"scriptures/es/acts-11-25-26.json"},{"revision":"1d5f2f63cc51734586f468b1213e58ea","url":"scriptures/es/acts-12-24.json"},{"revision":"8e4c99affccb892a785aed3fd2ed85d8","url":"scriptures/es/acts-13-3.json"},{"revision":"17038a2002d379b41faa103c3b69c071","url":"scriptures/es/acts-13-49.json"},{"revision":"e7777f9503be2555e05e8863f5669f68","url":"scriptures/es/acts-14-1.json"},{"revision":"53fe7bd871f6f77fb3f0098a2c0c52b4","url":"scriptures/es/acts-14-21.json"},{"revision":"c11bd7f713cd5a4028f205df48b8bce1","url":"scriptures/es/acts-16-22-34.json"},{"revision":"39435334ac830f220c22534f675345eb","url":"scriptures/es/acts-16-5.json"},{"revision":"e896d73e72b41300481ef0a37682711e","url":"scriptures/es/acts-17-10-12.json"},{"revision":"15d065125fae0f326e1a2dac226428f7","url":"scriptures/es/acts-17-26-28.json"},{"revision":"ea8ba11d137bf59f8507c189d5d30e97","url":"scriptures/es/acts-17-4.json"},{"revision":"9b431a04980f94eb1ef07cb73025a89f","url":"scriptures/es/acts-17-6-rsv.json"},{"revision":"f2296073a6b08b1d0c1c78f3877aeb9e","url":"scriptures/es/acts-18-24-26.json"},{"revision":"e2d888fe129fa5eba30b06ed9125c749","url":"scriptures/es/acts-19-1-5.json"},{"revision":"5d9b642b02a13227885ae0bed3a0ed6c","url":"scriptures/es/acts-19-1-6.json"},{"revision":"b4038d9ce78a336392c2736b901e49b9","url":"scriptures/es/acts-19-5.json"},{"revision":"91bf15e5d2c9ac62848ea122c987557a","url":"scriptures/es/acts-19-6.json"},{"revision":"2cd8e16a1ac7a49cdc710c94a2ea523a","url":"scriptures/es/acts-2-1-4.json"},{"revision":"fb517556da0f05e867e35dbe42c157bb","url":"scriptures/es/acts-2-14.json"},{"revision":"6cdb610d7bb12ec27eaacb97c73be5d4","url":"scriptures/es/acts-2-17.json"},{"revision":"04b11cc844a836ace1b4c2937cf23c84","url":"scriptures/es/acts-2-22-24.json"},{"revision":"bc031f58d086e9907ac0bd00ed0154f2","url":"scriptures/es/acts-2-22.json"},{"revision":"d2bfe085e4e476f2c194bbb9493e2897","url":"scriptures/es/acts-2-23.json"},{"revision":"567af2622bcc6ab628d3415490e4f0cc","url":"scriptures/es/acts-2-24.json"},{"revision":"7acf3147d5b6cd7a2123cae04ef516f6","url":"scriptures/es/acts-2-36-37.json"},{"revision":"9e0f08bf20c4adf53059f196747285f2","url":"scriptures/es/acts-2-36-47.json"},{"revision":"aeb4a79661a9fa601aabb7a28cd0e87c","url":"scriptures/es/acts-2-37-38.json"},{"revision":"888dc3b7d1508e28d2ac626f0aa4231e","url":"scriptures/es/acts-2-37-42.json"},{"revision":"5be9f8307500a99f5628567855805517","url":"scriptures/es/acts-2-38-42.json"},{"revision":"41c78e5a8bc37f01410a083a4fd8e6e5","url":"scriptures/es/acts-2-38.json"},{"revision":"df4b22b0fb758151630b00dbb1e9f3e8","url":"scriptures/es/acts-2-41.json"},{"revision":"67e7cf121aa413a786d141fd10a6061e","url":"scriptures/es/acts-2-42.json"},{"revision":"98e0bc54c85b9c069744477dc8ce560d","url":"scriptures/es/acts-2-47.json"},{"revision":"92c73810bae855e851a0b2145a7ae5c6","url":"scriptures/es/acts-2-5.json"},{"revision":"b8af59d163b9f3f29cea3d13623b94a1","url":"scriptures/es/acts-22-16.json"},{"revision":"2223b49e73b0ebf9e484518923451f30","url":"scriptures/es/acts-22-3-16.json"},{"revision":"f0a35c46ce92c27f3ab10d3f1679bf32","url":"scriptures/es/acts-28-21-22.json"},{"revision":"1e46ea219c3b8c0f53e0f59e7f3d31ad","url":"scriptures/es/acts-28-22.json"},{"revision":"94507413fb9d42d8a4a42401146eeb15","url":"scriptures/es/acts-28-30.json"},{"revision":"62321c84b86eb6b8cb6b186190c5ee87","url":"scriptures/es/acts-28-5.json"},{"revision":"154a9f6ffe8f614fa13ae3f130bd2ccb","url":"scriptures/es/acts-28-8.json"},{"revision":"3c2bdd858c7a89369a14cb9eb7ecb062","url":"scriptures/es/acts-4-12.json"},{"revision":"848247e9a2f7c436cda4608114a38444","url":"scriptures/es/acts-4-4.json"},{"revision":"38a69e57fec623d07127c022938cf40e","url":"scriptures/es/acts-5-14.json"},{"revision":"526a0fed25edb40668807358ddfae734","url":"scriptures/es/acts-5-17-18.json"},{"revision":"669afb4a826f16fc2346f9c84365c2a7","url":"scriptures/es/acts-5-38-42.json"},{"revision":"2722deddcb7d9461395e6489e65fa6a5","url":"scriptures/es/acts-6-1-8.json"},{"revision":"486b874ed189e5517507865dcb4c0051","url":"scriptures/es/acts-6-1.json"},{"revision":"60a962c26ec6aabd0276cb617d16418f","url":"scriptures/es/acts-6-7.json"},{"revision":"ae78c25707ed12b6a87a288111a07659","url":"scriptures/es/acts-6-8.json"},{"revision":"042fd5e1e2ea657e2eacff4539f502bc","url":"scriptures/es/acts-8-1-25.json"},{"revision":"aff82521485330b0b8bb1b14277292d4","url":"scriptures/es/acts-8-12.json"},{"revision":"55377e295ec0595163cd510056803646","url":"scriptures/es/acts-8-13.json"},{"revision":"e85b0901ab4521778667a0ee77f99302","url":"scriptures/es/acts-8-18.json"},{"revision":"5a918ea4ec387fa81f628fbef1bf1aa8","url":"scriptures/es/acts-8-26-39.json"},{"revision":"6499ed49361bb43ced1b29486f1f9506","url":"scriptures/es/acts-8-4.json"},{"revision":"87c6949639e6a45dc4d66207b511fd09","url":"scriptures/es/acts-9-1-22.json"},{"revision":"fec3fa9b7cfe59410b9087f6d8a4355c","url":"scriptures/es/acts-9-17-18.json"},{"revision":"20c1d4285b989638380804bbc5a3a135","url":"scriptures/es/acts-9-18-25.json"},{"revision":"ba59f0b5a1e8a38a48c7ecf53ab09fe3","url":"scriptures/es/acts-9-31.json"},{"revision":"78408146596966967610bd75f87f4ead","url":"scriptures/es/acts-ch-1-ch-2.json"},{"revision":"87fe35b98fb15d6d3643abf008a0d5d3","url":"scriptures/es/acts-ch-10.json"},{"revision":"5021b26dde192922858f5e902c8ad9ec","url":"scriptures/es/acts-ch-2.json"},{"revision":"39d0d583fb9ce7b4226c7647a06284ae","url":"scriptures/es/colossians-1-15-18.json"},{"revision":"10c3e40837f7c86d65a1deeb0d49385d","url":"scriptures/es/colossians-1-23.json"},{"revision":"8356e0c026cbc4a33335bb7c1ec00fd4","url":"scriptures/es/colossians-1-28-29.json"},{"revision":"08c5e4302ecdafdf93154d38dec283e9","url":"scriptures/es/colossians-1-6.json"},{"revision":"fd62df0643e1524438803b80479298b9","url":"scriptures/es/colossians-2-11-12.json"},{"revision":"38fcf79ac37b8e99359500ed04ddcdc6","url":"scriptures/es/colossians-2-12.json"},{"revision":"63cb38e73303e01759ecd4c33bd1ba60","url":"scriptures/es/colossians-3-1-4.json"},{"revision":"fa4ac718982ca383f9dd8a62416881ba","url":"scriptures/es/colossians-3-12-14.json"},{"revision":"f78a738bc5a5f18b4a7950059d7a934f","url":"scriptures/es/colossians-3-15-16.json"},{"revision":"d6be3355fdf9be023894d1e54f538e88","url":"scriptures/es/colossians-3-15.json"},{"revision":"9d402f898c8cab598bb5a8425cda15fd","url":"scriptures/es/colossians-3-17.json"},{"revision":"71b1749f80488aa9f5162364e5f7c727","url":"scriptures/es/colossians-3-18-21.json"},{"revision":"8c0052595cd4ddd71b69276849df70b7","url":"scriptures/es/colossians-3-22.json"},{"revision":"1eedd052a31f23a459d8900c04bbd959","url":"scriptures/es/colossians-3-5-11.json"},{"revision":"51f0518b3ff34bf9f6be4dcdf9f6f4d6","url":"scriptures/es/colossians-4-1.json"},{"revision":"0c7941283a20c60b1b5b3d8f8a3fbc4b","url":"scriptures/es/colossians-ch-3-15-ch-4-1.json"},{"revision":"7114e4a7b1d3614f12eb2e2dc3e0813d","url":"scriptures/es/daniel-2-31-45.json"},{"revision":"e661449387609c14a25cabbc057f78c3","url":"scriptures/es/daniel-2-44.json"},{"revision":"7402ffe89b51c28c68269af237d83592","url":"scriptures/es/ephesians-2-19-21.json"},{"revision":"b1a29d017ca88273fa9eb78c435e8d16","url":"scriptures/es/ephesians-2-8.json"},{"revision":"79f48fb3e65766a05caa3f2568b2d6a8","url":"scriptures/es/ephesians-3-20.json"},{"revision":"e50b90dc1ced6c65a4834775421628af","url":"scriptures/es/ephesians-4-4-6.json"},{"revision":"6dd13beaf51f106e502beb4030d60373","url":"scriptures/es/ephesians-5-18-19.json"},{"revision":"53c81db21f8e12d2c17e4fee1d3d7ff2","url":"scriptures/es/ephesians-5-19-20.json"},{"revision":"eeaada90664b24d4b31630af68c20e36","url":"scriptures/es/ephesians-6-10-18.json"},{"revision":"904b2c07c85b4834f296fdb4c70dfbc1","url":"scriptures/es/ezekiel-18-20.json"},{"revision":"a178e2fb0844c8166027a79985885564","url":"scriptures/es/galatians-1-8.json"},{"revision":"b3f3ac0608a0698f75e939a9fa9b3fb6","url":"scriptures/es/galatians-5-19-21.json"},{"revision":"e6a6e2ae5d87a3452e493d92345b96e0","url":"scriptures/es/galatians-6-1-2.json"},{"revision":"5eed896abf937f9e6f2f1c7af4db64e5","url":"scriptures/es/genesis-2-19.json"},{"revision":"7c452d140e574423d577b5eb804596ca","url":"scriptures/es/hebrews-10-23-25.json"},{"revision":"7ce270490aa535a44704077266cadd94","url":"scriptures/es/hebrews-10-23.json"},{"revision":"e236b23b56e5d1a183805ab922910463","url":"scriptures/es/hebrews-10-24.json"},{"revision":"1fbf3098de0a66c5f98aa312f7b525c4","url":"scriptures/es/hebrews-12-14-15.json"},{"revision":"d7fbbe188ca90b42154aa7ac6a6b0d0c","url":"scriptures/es/hebrews-12-15.json"},{"revision":"ca49e4141ba0ca5724a7532e8eadfb3a","url":"scriptures/es/hebrews-13-17.json"},{"revision":"ea20c8957db54032e044d8ad8f36adda","url":"scriptures/es/hebrews-3-12-14.json"},{"revision":"7c16b5c6384c62adb737acbb5a450a04","url":"scriptures/es/hebrews-4-12-13.json"},{"revision":"f5a507addcb4ddeaae221c9550ba7911","url":"scriptures/es/hebrews-5-11-14.json"},{"revision":"850750f8d6266076e4825869310448f1","url":"scriptures/es/hebrews-6-1-3.json"},{"revision":"f3a36f916e30995244ff34c900d4e431","url":"scriptures/es/hebrews-ch-5-11-ch-6-6.json"},{"revision":"f7f8f1a51cd968aa0f01ad634a86a1a5","url":"scriptures/es/isaiah-2-1-4.json"},{"revision":"fff0d3643f7b282cb82ad84404a860ab","url":"scriptures/es/isaiah-2-2.json"},{"revision":"94148df481c028e9d7f3f09400207eb2","url":"scriptures/es/isaiah-2-3.json"},{"revision":"d5d005391afdc96875d66eda1d1a40b2","url":"scriptures/es/isaiah-53-4-6.json"},{"revision":"0a41bdecc43261c50262dde4e4578933","url":"scriptures/es/isaiah-59-1-2.json"},{"revision":"8a40a1533bf7152312cc044c48df3822","url":"scriptures/es/james-1-22-25.json"},{"revision":"aa875d5b62816b285441438ee8be22a1","url":"scriptures/es/james-4-17.json"},{"revision":"b452d4bd25b731bae69dc1c8c98dae0d","url":"scriptures/es/james-5-16-18.json"},{"revision":"05a6b0f6e3b78203a7b4226f2f4b36e6","url":"scriptures/es/james-5-16.json"},{"revision":"28bd7470141f4d2186f79f5a24f91b7d","url":"scriptures/es/jeremiah-29-11-14.json"},{"revision":"a2cd21ef66210e6d3602f0bb2f4aab2a","url":"scriptures/es/jeremiah-29-11.json"},{"revision":"9f574ca224c8e20b148ee8007a9f216f","url":"scriptures/es/john-10-19-21.json"},{"revision":"2fda7b3d84b53a7c83f4a9f9961713fc","url":"scriptures/es/john-12-48.json"},{"revision":"4b1e114e7cc131df76884b6fa4934071","url":"scriptures/es/john-13-34-35.json"},{"revision":"bc090376910fd665690259920617d7fb","url":"scriptures/es/john-15-1-16.json"},{"revision":"4e4747c584e3d68a7892e1f83dab7f7e","url":"scriptures/es/john-15-16.json"},{"revision":"ef21463d1b089c204318d0ef719cba55","url":"scriptures/es/john-15-18-20.json"},{"revision":"afa28d45f1ab4c0ddfd3202978bac567","url":"scriptures/es/john-15-8.json"},{"revision":"dc5321e2e01d729cf1f20609f232b552","url":"scriptures/es/john-15-9-10.json"},{"revision":"2c1084a4b17db4cab739926aeb090691","url":"scriptures/es/john-16-1-4.json"},{"revision":"238e16172a60994b60d8d049758a5309","url":"scriptures/es/john-17-20-23.json"},{"revision":"bd158f18b2cf0e8da4a8fd719c5ae896","url":"scriptures/es/john-20-30-31.json"},{"revision":"c37a28305974896eeb18e8b6a3344e8a","url":"scriptures/es/john-3-1-7.json"},{"revision":"f9b8e0699f375d6137b36c988caf6e6d","url":"scriptures/es/john-3-3.json"},{"revision":"8919c894af8e44dcffa481fdec038ef6","url":"scriptures/es/john-3-34-36.json"},{"revision":"62d4bd0dde2363e5a6aaae294f975ae8","url":"scriptures/es/john-3-34.json"},{"revision":"a9d956c8d9966418ca5d6edd12912753","url":"scriptures/es/john-3-5.json"},{"revision":"5a10616d4e5a9e235efa88226ed88865","url":"scriptures/es/john-3-7.json"},{"revision":"306925d5519547150506a5c7a6abd9b8","url":"scriptures/es/john-4-23-24.json"},{"revision":"c62a0238213f65a3d076425514254c48","url":"scriptures/es/john-7-12-13.json"},{"revision":"9be1888b7b5609d53c0ae4f2bfc26be2","url":"scriptures/es/john-8-31-32.json"},{"revision":"cee37f2ce6e070ad58d6c45307c8303f","url":"scriptures/es/luke-11-1-4.json"},{"revision":"d03a7407c1a4b99f6ac9dcdd4cd0fa18","url":"scriptures/es/luke-12-51-53.json"},{"revision":"0dc55708dd3b6446ba788a677bd61a02","url":"scriptures/es/luke-14-25-33.json"},{"revision":"1988edb875ac3098bd2b23fbe7ba1c09","url":"scriptures/es/luke-17-20-21.json"},{"revision":"8b34b7a5d15982c9fe174b32124ddda0","url":"scriptures/es/luke-19-10.json"},{"revision":"b06ee00cda89bc22d53c06d8bcee1773","url":"scriptures/es/luke-23-1-3.json"},{"revision":"0348c5f8f67cc74d85f84fb100472bd4","url":"scriptures/es/luke-23-50-51.json"},{"revision":"98a6d49df20201fe67acf7c7443d1a0a","url":"scriptures/es/luke-24-44-49.json"},{"revision":"1974877947109ad03cc6287fc2610c79","url":"scriptures/es/luke-24-47.json"},{"revision":"5025f11c44002ac5af268a8e7ccdd84f","url":"scriptures/es/luke-9-1.json"},{"revision":"a220e38f0aad283059bc95f9d8167e88","url":"scriptures/es/luke-9-23-26.json"},{"revision":"eefb9b1fcb02c23a2061e5c878ac7f0f","url":"scriptures/es/malachi-3-6-12.json"},{"revision":"18c1a326a66b3a198ecfb65931b689dc","url":"scriptures/es/mark-1-14-18.json"},{"revision":"d97470f9dc694a77edbd28706d959586","url":"scriptures/es/mark-1-17.json"},{"revision":"9d2fd56950233686589fd94f2159f890","url":"scriptures/es/mark-16-16-18.json"},{"revision":"26485c323f9c49828e43c21d7f1dbcda","url":"scriptures/es/mark-3-20-21.json"},{"revision":"2fb74dc2042f814b3e4590183c73bbb5","url":"scriptures/es/mark-3-31-35.json"},{"revision":"d906f9953d9777e5d82f9754f398dd0e","url":"scriptures/es/mark-9-1.json"},{"revision":"3b0727aa81d13f9cb4ebf04e32bfc434","url":"scriptures/es/matthew-15-1-9.json"},{"revision":"5ac84d01f885f5f27e92e56d7e0e5ecb","url":"scriptures/es/matthew-15-6-9.json"},{"revision":"ad09d0f1e72b0f9dbaad4ec953b9ad64","url":"scriptures/es/matthew-16-13-19.json"},{"revision":"d0effcda873657560d864711ec412891","url":"scriptures/es/matthew-16-19.json"},{"revision":"1d8c4aa8145e014086f45cfb869fb5bb","url":"scriptures/es/matthew-18-15-17.json"},{"revision":"df0a75e911fa8ce2a98c66ab31274c3b","url":"scriptures/es/matthew-22-37-39.json"},{"revision":"2e31e0f89eac871d90f72fbcaeb85d42","url":"scriptures/es/matthew-26-31-35.json"},{"revision":"71846f9f47841cc06aa87d8021b47947","url":"scriptures/es/matthew-26-36-39.json"},{"revision":"1ce000e8600122cbc7fab7b88f191c7d","url":"scriptures/es/matthew-26-36-46.json"},{"revision":"901591bbf34ea8bff0063205b19b0420","url":"scriptures/es/matthew-26-47-56.json"},{"revision":"cb62e38e2639d3c9a69eeb04baaabf39","url":"scriptures/es/matthew-26-57-68.json"},{"revision":"1f61011cae66d8ceb0fbeae8f7458707","url":"scriptures/es/matthew-26-69-75.json"},{"revision":"afd9828606e03ed72885b7dbe7a6573d","url":"scriptures/es/matthew-27-1-10.json"},{"revision":"21e52ecc870645257f95e8a0eccd1f99","url":"scriptures/es/matthew-27-11-26.json"},{"revision":"607735f86cda8474f3ee75136793f642","url":"scriptures/es/matthew-27-27-31.json"},{"revision":"8130d5a41019e9c3eb1024119e0ac3b6","url":"scriptures/es/matthew-27-32-44.json"},{"revision":"7cbcdbebd413ce87c5dbfcd7ea77335e","url":"scriptures/es/matthew-27-45-56.json"},{"revision":"7a7f27c42ecd1dd8184327781f87eef9","url":"scriptures/es/matthew-27-46.json"},{"revision":"3df3a658bba805057e700e7e8fd36b2f","url":"scriptures/es/matthew-27-57-61.json"},{"revision":"c1bffe3000da81d6e39a459f34ee5d41","url":"scriptures/es/matthew-27-62-66.json"},{"revision":"5991367dc424a646a8c9c4913e1ac2ea","url":"scriptures/es/matthew-28-1-10.json"},{"revision":"2e70d28e64930b444e12a6511a8d37ea","url":"scriptures/es/matthew-28-18-20.json"},{"revision":"ddc6a173cb3a2959aeed887b51aa3407","url":"scriptures/es/matthew-28-19-20.json"},{"revision":"0ac5deb4884369b7f2ee199792eec7e6","url":"scriptures/es/matthew-28-19.json"},{"revision":"563f9923b10df03e1d4aaae0d7719187","url":"scriptures/es/matthew-28-20.json"},{"revision":"ddeeaad0ab2b863f32da339c7ac11994","url":"scriptures/es/matthew-3-1-2.json"},{"revision":"83099858b8ab38d608922e5b0b9b0832","url":"scriptures/es/matthew-3-1-6.json"},{"revision":"50e57fa83ef5811d5671c0f989c2d41e","url":"scriptures/es/matthew-4-17.json"},{"revision":"55532eb70f36ab7bf4b1b876357b63b4","url":"scriptures/es/matthew-5-10-12.json"},{"revision":"615cc3fcf7228a526677e0dc5fbf50e2","url":"scriptures/es/matthew-6-25-34.json"},{"revision":"b30ff51d5669d81160e2247663d340e8","url":"scriptures/es/matthew-6-33.json"},{"revision":"e38084f42dacce0b933af6d8e080240d","url":"scriptures/es/matthew-7-13-14.json"},{"revision":"e4c0ef4a8c73df7d1bbb0b93349402de","url":"scriptures/es/matthew-7-7-8.json"},{"revision":"978b912738d7314fad70b87cea7d89ff","url":"scriptures/es/matthew-9-2-6.json"},{"revision":"1378b6e44f7f3264a868504626406e24","url":"scriptures/es/nehemiah-13-23-27.json"},{"revision":"55c32f4ad1716b98b79df4abd7b034ea","url":"scriptures/es/numbers-27-12-18.json"},{"revision":"a430f5911cfef2926756d2eac2f53cb3","url":"scriptures/es/philippians-4-13.json"},{"revision":"b80f552c2349eb1380ab2a1dae47df71","url":"scriptures/es/philippians-4-4-7.json"},{"revision":"9c3c373376e7f980d366d23ce8582ae2","url":"scriptures/es/philippians-4-4.json"},{"revision":"fde0825da47cdf9a1334d9a5bf2d1f06","url":"scriptures/es/phillipians-4-13.json"},{"revision":"82f568d41f1f7bf85398aadec3330e35","url":"scriptures/es/phillipians-4-4.json"},{"revision":"89de25e542f57ffa2fddc714fa41dfef","url":"scriptures/es/proberbs-13-12.json"},{"revision":"0875d8cb702fe6e728faf00eed46d7af","url":"scriptures/es/psalm-119-1-2.json"},{"revision":"bd1456659c691e9409223e4fa4ba850f","url":"scriptures/es/revelation-3-20.json"},{"revision":"3b75ee539500665e45755d50a356127d","url":"scriptures/es/romans-10-13.json"},{"revision":"ccee9695f36cc13bc3eb2720c7cfa07d","url":"scriptures/es/romans-10-9.json"},{"revision":"597d3570f28dd979a9995686190cfaa8","url":"scriptures/es/romans-12-4-5.json"},{"revision":"b99c8920fa92144f53e18715aac2e0ae","url":"scriptures/es/romans-3-23-25.json"},{"revision":"47757073cb702fcf9968d8b90cbb303d","url":"scriptures/es/romans-3-23.json"},{"revision":"80d0f6f555908a3d3af945133718b983","url":"scriptures/es/romans-3-25.json"},{"revision":"55229d1484ded92ae10beddd225e0f58","url":"scriptures/es/romans-6-1-4.json"},{"revision":"6f5a945eb4226eabc366aa670d43cc89","url":"scriptures/es/romans-6-2-4.json"},{"revision":"e51f6beaa4910a0c7675f053861a2ace","url":"scriptures/es/romans-6-23.json"},{"revision":"872ccb600179a7e3cb1c0c3e7679691d","url":"scriptures/es/romans-6-3-4.json"},{"revision":"ff528894c4c93bbef82e86e7e8eeda45","url":"sw-en.js"},{"revision":"8deb999fb971ba6303592d904954dbe1","url":"sw.js"}] || []).filter((entry) => {
    const url = typeof entry === "string" ? entry : entry.url;
    return !(/^\/?audio\//i.test(url) || /\.webm(\?.*)?$/i.test(url));
  });
  workbox.precaching.precacheAndRoute(precacheManifest.concat(routes), {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  });
  // Clean up caches created by older service workers when switching languages
  if (workbox.precaching && workbox.precaching.cleanupOutdatedCaches) {
    try { workbox.precaching.cleanupOutdatedCaches(); } catch (_) {}
  }

  // Prefetch helper: fetch full .webm under /audio/ and cache
  async function prefetchAudio(urlString) {
    const result = { ok: false, url: urlString };
    try {
      const url = new URL(urlString, self.location.origin);
      result.url = url.href;
      if (
        !url.pathname.startsWith("/audio/") ||
        !/\.webm$/i.test(url.pathname)
      ) {
        result.error = "URL not allowed";
        return result;
      }

      const cache = await caches.open("audio-cache");
      const existing = await cache.match(url.href);
      if (existing) {
        result.ok = true;
        result.cached = true;
        result.from = "cache";
        return result;
      }

      const req = new Request(url.href, {
        method: "GET",
        credentials: "same-origin",
        mode: "cors",
        redirect: "follow",
        referrer: "about:client",
        referrerPolicy: "strict-origin-when-cross-origin",
      });

      const resp = await fetch(req);
      if (resp && (resp.status === 200 || resp.type === "opaque")) {
        await cache.put(url.href, resp.clone());
        result.ok = true;
        result.cached = true;
        result.from = "network";
        result.status = resp.status || 0;
        return result;
      }

      result.error = `Unexpected response: ${
        resp ? resp.status : "no response"
      }`;
      return result;
    } catch (err) {
      result.error = (err && err.message) || String(err);
      return result;
    }
  }

  // Allow the page to proactively prefetch audio
  self.addEventListener("message", (event) => {
    const data = event && event.data;
    if (!data) return;
    if (data.type === "PREFETCH_AUDIO" && typeof data.url === "string") {
      const respond = (payload) => {
        const message = {
          type: "PREFETCH_AUDIO_RESULT",
          ...payload,
          requestId: data.requestId,
        };
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage(message);
        } else if (event.source && event.source.postMessage) {
          event.source.postMessage(message);
        }
      };

      const p = (async () => {
        const result = await prefetchAudio(data.url);
        respond(result);
      })();

      if (event.waitUntil) event.waitUntil(p);
    }
  });

  // Helper to notify the initiating client for fetch-driven background work
  async function postToClient(event, payload) {
    try {
      if (event && event.clientId) {
        const client = await self.clients.get(event.clientId);
        if (client && client.postMessage) {
          client.postMessage(payload);
          return;
        }
      }
      // Fallback: first available window client
      const clientsList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      if (clientsList && clientsList.length && clientsList[0].postMessage) {
        clientsList[0].postMessage(payload);
      }
    } catch (_) {
      // ignore notification errors
    }
  }

  // Plugin: when first request is a Range (206), fetch full file in background and cache it
  const backgroundFullFetchPlugin = {
    handlerDidRespond: async ({ event, request, response }) => {
      try {
        if (!request || request.method !== "GET") return;
        // Only act on range requests that yielded a 206
        const rangeHeader =
          request.headers && request.headers.get
            ? request.headers.get("range")
            : null;
        if (!rangeHeader) return;
        if (!response || response.status !== 206) return;

        const url = new URL(request.url);
        // Constrain to our audio path and .webm
        if (
          !url.pathname.startsWith("/audio/") ||
          !url.pathname.endsWith(".webm")
        )
          return;

        const cache = await caches.open("audio-cache");
        const already = await cache.match(url.href);
        if (already) {
          // Already cached; acknowledge immediately
          postToClient(event, {
            type: "AUDIO_FULL_FETCH_RESULT",
            url: url.href,
            ok: true,
            cached: true,
            from: "cache",
          });
          return;
        }

        // Create a full (non-range) request mirroring key fetch options
        const fullRequest = new Request(url.href, {
          method: "GET",
          credentials: request.credentials || "same-origin",
          mode: request.mode || "cors",
          redirect: request.redirect || "follow",
          referrer: request.referrer || "about:client",
          referrerPolicy:
            request.referrerPolicy || "strict-origin-when-cross-origin",
          integrity: request.integrity || "",
        });

        const startedAt = Date.now();
        const doFetchAndCache = (async () => {
          let ok = false;
          let status = 0;
          let opaque = false;
          let error;
          try {
            const fullResponse = await fetch(fullRequest);
            status = fullResponse ? fullResponse.status || 0 : 0;
            opaque = !!(fullResponse && fullResponse.type === "opaque");
            // Cache successful 200 or opaque responses
            if (fullResponse && (status === 200 || opaque)) {
              await cache.put(url.href, fullResponse.clone());
              ok = true;
            } else {
              error = `Unexpected status ${status}`;
            }
          } catch (err) {
            error = (err && err.message) || String(err);
          } finally {
            const durationMs = Date.now() - startedAt;
            postToClient(event, {
              type: "AUDIO_FULL_FETCH_RESULT",
              url: url.href,
              ok,
              cached: ok,
              from: ok ? "network" : undefined,
              status,
              opaque,
              durationMs,
              error,
            });
          }
        })();

        if (event && event.waitUntil) {
          event.waitUntil(doFetchAndCache);
        } else {
          await doFetchAndCache;
        }
      } catch (_) {
        // fail silently
      }
    },
  };

  // Runtime caching for audio files (.webm) - cache on first play
  workbox.routing.registerRoute(
    ({ request, url }) =>
      url.pathname.startsWith("/audio/") &&
      (request.destination === "audio" || url.pathname.endsWith(".webm")),
    new workbox.strategies.CacheFirst({
      cacheName: "audio-cache",
      plugins: [
        // Support HTTP Range requests used by <audio> streaming
        new workbox.rangeRequests.RangeRequestsPlugin(),
        // Limit cache size and age
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
          purgeOnQuotaError: true,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        backgroundFullFetchPlugin,
      ],
    })
  );
} else {
  console.error("Workbox failed to load 😢");
}
