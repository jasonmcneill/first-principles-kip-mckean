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
    "confirm",
    "course-information",
    "cross",
    "dashboard",
    "discipleship",
    "global",
    "intro-to-course",
    "introduction",
    "kingdom",
    "light-darkness",
    "login",
    "medical-account",
    "memory-scriptures",
    "miraculous-gifts-holy-spirit",
    "new-testament-conversion",
    "pending",
    "persecution",
    "pw-forgot",
    "pw-forgot-confirm",
    "pw-forgot-new",
    "register",
    "seeking-god",
    "subscribe",
    "subscribed-thanks",
    "the-mission",
    "welcome",
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
    "confirm",
    "course-information",
    "cross",
    "dashboard",
    "discipleship",
    "global",
    "intro-to-course",
    "introduction",
    "kingdom",
    "light-darkness",
    "login",
    "medical-account",
    "memory-scriptures",
    "miraculous-gifts-holy-spirit",
    "new-testament-conversion",
    "pending",
    "persecution",
    "pw-forgot",
    "pw-forgot-confirm",
    "pw-forgot-new",
    "register",
    "seeking-god",
    "subscribe",
    "subscribed-thanks",
    "the-mission",
    "welcome",
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
      revision: "ec7910e",
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
      if (slug === "global") return;
      routes.push({
        url: `/${lang}/${slug}`,
        // Use a timestamp to force update when this script is regenerated
        revision: "ec7910e",
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
  const precacheManifest = ([{"revision":"d41d8cd98f00b204e9800998ecf8427e","url":"278f21e166b2c05e136cfaf79ca3e971.txt"},{"revision":"d41d8cd98f00b204e9800998ecf8427e","url":"a00c6fc6a345645ff70c8df186402b0d.txt"},{"revision":"279cb40a5728595d7fb0ebc2d730d577","url":"css/style.css"},{"revision":"5a14c1b8d3c4364d3d475ac24688d8ec","url":"email/pw-forgot/pw-forgot.html"},{"revision":"0a54558d8246ef2c5b987838ac506199","url":"email/pw-forgot/pw-forgot.txt"},{"revision":"5a14c1b8d3c4364d3d475ac24688d8ec","url":"email/registration/registration.html"},{"revision":"0a54558d8246ef2c5b987838ac506199","url":"email/registration/registration.txt"},{"revision":"c313a1a90da0b2010235c52dbc3424d2","url":"img/en/darkness-vs-light.svg"},{"revision":"8f871ab1fb6e86951c12cb2f937a0f8d","url":"img/en/died-resurrected.svg"},{"revision":"64967b493903b7215a26c2f44dc4c536","url":"img/en/father-children.svg"},{"revision":"58216046bc6ecf15660346dc4045ef44","url":"img/en/head-body-christ-church.svg"},{"revision":"dd7696ac27db84be3b28906cc9bc7e30","url":"img/en/launch/152.png"},{"revision":"47b85cdb546263348658bb55858238e9","url":"img/en/launch/167.png"},{"revision":"d482bfc7e2544ab9328c6ede9410573d","url":"img/en/launch/180.png"},{"revision":"6825d84359b1f107ac5cf85790b75d2b","url":"img/en/launch/192-maskable.png"},{"revision":"1f52ede843dde13262bf697dca9a164e","url":"img/en/launch/192.png"},{"revision":"63346cea2b9318fbdc8307c8662ac9a9","url":"img/en/launch/512-maskable.png"},{"revision":"3921a0a845aeb600eb07762d9c7241fe","url":"img/en/launch/512.png"},{"revision":"8e811820f498f14da1805cfb1e9eb38a","url":"img/en/launch/favicon.ico"},{"revision":"1c1e2c8290dfd36fe211fd94c2781394","url":"img/en/logo-paypal.jpg"},{"revision":"8418fc68929add7d18dce86b09cc35ad","url":"img/en/sin.svg"},{"revision":"d1aa56e4ac1574c8384500a17668f631","url":"img/en/wages-vs-gift.svg"},{"revision":"2ce897ab8147211dd71cdc44036c6dc3","url":"img/en/wall.svg"},{"revision":"0fa4a8ecff65a1558798802d8497e259","url":"img/es/darkness-vs-light.svg"},{"revision":"4709a9462a5fb3b70c6258a60c344a88","url":"img/es/died-resurrected.svg"},{"revision":"3988b907c16fef59afdaeb9531ddc5a6","url":"img/es/father-children.svg"},{"revision":"feed85b205ce82a5fbf42dd8beb2baba","url":"img/es/head-body-christ-church.svg"},{"revision":"d6ccc54f9427be228afec49b3004ea59","url":"img/es/launch/152.png"},{"revision":"6680911b2652140a6aaf3f3ee7ffa23c","url":"img/es/launch/167.png"},{"revision":"1e615eca319f20d5582f65c04a2a37fa","url":"img/es/launch/180.png"},{"revision":"c10c00105c2ecfc36b2b266315a113c9","url":"img/es/launch/192-maskable.png"},{"revision":"ea8c8be9465a987268b245baf10087ca","url":"img/es/launch/192.png"},{"revision":"389adb6d12517ae17efbdeec2c8be4a7","url":"img/es/launch/512-maskable.png"},{"revision":"8fad1cc0da3a642a135bd5cbb20a6e24","url":"img/es/launch/512.png"},{"revision":"3af5b05f325e416af9fdd136b25f09e8","url":"img/es/launch/favicon.ico"},{"revision":"b82fd6365aff7bf9e9fd81aef3f1e1dc","url":"img/es/logo-paypal.jpg"},{"revision":"a7362507205e65c56c95153b6dd63a32","url":"img/es/sin.svg"},{"revision":"bf55fa413d0578e3366991ca18d7fa6f","url":"img/es/wages-vs-gift.svg"},{"revision":"db70f09ddc07ccea380051ca20abd7e8","url":"img/es/wall.svg"},{"revision":"c12e30f8c2dc048b35bc610c1def11b0","url":"js/confirm.js"},{"revision":"ca987ea35fb021b9438a2815a122e2b3","url":"js/discipleship.js"},{"revision":"8521b9582b30085d9da48b508311e255","url":"js/enforceAccess.js"},{"revision":"da6c67fd40e819d623afb94f4805f3b6","url":"js/enforceSubscription.js"},{"revision":"9ce5b9d4557923dfb882c9b06cff8e75","url":"js/global.js"},{"revision":"03a67e55cf8ae2d2054b90ec85963b35","url":"js/load-sw.js"},{"revision":"7ab44621645745426ae83ba73401bca7","url":"js/login.js"},{"revision":"dfe7f58deb0d1cc698b81f0103700027","url":"js/pending.js"},{"revision":"71ecc0b1d07c68098e0fc3e0c1b33751","url":"js/pw-forgot-confirm.js"},{"revision":"4a079abcd3b6378045c0a68da31ad180","url":"js/pw-forgot-new.js"},{"revision":"57eb170b6652afcc34f68d16ace8e004","url":"js/pw-forgot.js"},{"revision":"d74e16de0a8d9d2a4a08917f52355a61","url":"js/register.js"},{"revision":"32094107f7c0fb1803306f65a277a97b","url":"js/subscribe.js"},{"revision":"981fc1d0f566edc993ff846c33acbb83","url":"js/subscribed-thanks.js"},{"revision":"ba372b30c2a500197fb8c2b7f00a36af","url":"manifests/en.json"},{"revision":"e26310458c673d6be7e2a649006d487d","url":"manifests/es.json"},{"revision":"396d75f027f0fdd7e513f4ff64549382","url":"scriptures/en/_template.json"},{"revision":"cdd31d3ea3411127526422986ca6db36","url":"scriptures/en/1-corinthians-1-10-13.json"},{"revision":"1d0f75294ed3b834a5333c3bcaebd437","url":"scriptures/en/1-corinthians-1-10-17.json"},{"revision":"77fdf9487035248469af3ec552d23e1b","url":"scriptures/en/1-corinthians-1-17.json"},{"revision":"63014a35ef41ec52f76c09b020671268","url":"scriptures/en/1-corinthians-11-23-32.json"},{"revision":"56595848fbd36ac3465d6641965866bd","url":"scriptures/en/1-corinthians-12-12-13.json"},{"revision":"8e5c04d6cd19ed113cdbc95881e828a6","url":"scriptures/en/1-corinthians-12-14-27.json"},{"revision":"6107a0756927d92b882d8ee9be7c5e6b","url":"scriptures/en/1-corinthians-12-21.json"},{"revision":"0c501507d9f40800a987a106d5992bc4","url":"scriptures/en/1-corinthians-12-26.json"},{"revision":"a5afa585dc5c51f6d40117781bc78f7a","url":"scriptures/en/1-corinthians-12-28-30.json"},{"revision":"da13cc8d70e7a65c828578db8ee1cafc","url":"scriptures/en/1-corinthians-12-8-10.json"},{"revision":"65aa49708b9da97c400fbc1b4b3bf76c","url":"scriptures/en/1-corinthians-13-8-10.json"},{"revision":"c11627dc514b0408e6af14c5308ce2b9","url":"scriptures/en/1-corinthians-14-20-22.json"},{"revision":"666753b484044823517dd71b45018bd5","url":"scriptures/en/1-corinthians-3-11.json"},{"revision":"6cee6001767456d09a0b29c5e120fba8","url":"scriptures/en/1-corinthians-7-39.json"},{"revision":"d45f6e9cec34a0c2e310af1c691a9239","url":"scriptures/en/1-corinthians-ch-12.json"},{"revision":"fcebdb7774495ec110ce2e198547316c","url":"scriptures/en/1-corinthians-ch-14.json"},{"revision":"ff14b0f88eddd2d47f4d6dcc6ef51621","url":"scriptures/en/1-john-1-9.json"},{"revision":"9260678df005f89309e15da8f9379b64","url":"scriptures/en/1-kings-11-1-10.json"},{"revision":"877e5fa1506ed0b7184a6bd2b98099ea","url":"scriptures/en/1-peter-1-21.json"},{"revision":"81d169affa507703c2c0e7154113600b","url":"scriptures/en/1-peter-2-9-10.json"},{"revision":"9d740083889d414ca45579c4ece9fb64","url":"scriptures/en/1-peter-3-1-7.json"},{"revision":"34eafec60260167b27884546e0263384","url":"scriptures/en/1-peter-3-21.json"},{"revision":"199d016f553d08639871176a80e7bc88","url":"scriptures/en/1-peter-4-12-16.json"},{"revision":"d9f113630a32d735746f2f279d084e49","url":"scriptures/en/1-peter-4-3-4.json"},{"revision":"365ace5662d937ed55ecc52f8a69c2ff","url":"scriptures/en/1-thessalonians-5-12-14.json"},{"revision":"552a23e4db1a0e1758e93906ffb7f776","url":"scriptures/en/1-timothy-2-3-4.json"},{"revision":"0f677fe4cda76c4226791b996a238b01","url":"scriptures/en/1-timothy-4-16.json"},{"revision":"21b2ec0dc7e02554b0563f1ae38db757","url":"scriptures/en/2-corinthians-6-14-18.json"},{"revision":"6fd88a95d05420e53b3e006a1deb96f7","url":"scriptures/en/2-corinthians-9-6-11.json"},{"revision":"097a01bd0271eebf03ac6f4f70acf454","url":"scriptures/en/2-corinthians-9-6-8.json"},{"revision":"76b63f1f2eb14022961c607ad38baad1","url":"scriptures/en/2-peter-1-20-21.json"},{"revision":"bca8686e3a3a9d12f28436693cf878d1","url":"scriptures/en/2-thessalonians-2-9-12.json"},{"revision":"ed0a09097e5d2a73634b1a46aa113f41","url":"scriptures/en/2-timothy-3-1-5.json"},{"revision":"cd33e1f82e419011396543de0bf0b114","url":"scriptures/en/2-timothy-3-12.json"},{"revision":"9daa062ca7f1bd8cb3ecc163af40f5fe","url":"scriptures/en/2-timothy-3-16-17.json"},{"revision":"d925bb5b9ec7efff54c00a33b344283c","url":"scriptures/en/acts-1-12-14.json"},{"revision":"4b7c3ce6eba94b4c1cfea72091d34ff3","url":"scriptures/en/acts-1-18-19.json"},{"revision":"a213ba4b34ae370ac6f152b499fcb1f7","url":"scriptures/en/acts-1-4-5.json"},{"revision":"ae58d50793eb66228cff289dea788513","url":"scriptures/en/acts-1-8.json"},{"revision":"63e7d3bffc039c4dd99e1d452fdafa8a","url":"scriptures/en/acts-10-44.json"},{"revision":"98c0709c2e114341e6fc8e5d6b83dbe1","url":"scriptures/en/acts-10-48.json"},{"revision":"36a17927351b6262f56ceb6ca5a9cc46","url":"scriptures/en/acts-11-1-18.json"},{"revision":"b7cb0e2295106c91672a72cf0df6e2fd","url":"scriptures/en/acts-11-14.json"},{"revision":"0c417bda12924eb3c9501047113cac0f","url":"scriptures/en/acts-11-15.json"},{"revision":"9b9a6dbc7870266ecc2c67fff2b7cbc4","url":"scriptures/en/acts-11-19-26.json"},{"revision":"1e35b33f8a370242a40ae06389a9e1f5","url":"scriptures/en/acts-11-21.json"},{"revision":"53d69e70e1075b041dc55f3a3c6a9013","url":"scriptures/en/acts-11-25-26.json"},{"revision":"db2d3e426b650a33b2a68fa7a1b8ad8f","url":"scriptures/en/acts-12-24.json"},{"revision":"fa80d2a440135d100dd1ed08ed0164d2","url":"scriptures/en/acts-13-3.json"},{"revision":"60f120ba75b3027bdcf1d25245eae27b","url":"scriptures/en/acts-13-49.json"},{"revision":"f6f9ea178d5bf6f614b4b620f2dc3ae9","url":"scriptures/en/acts-14-1.json"},{"revision":"59564fcbc811d682bbea2f541007ee0c","url":"scriptures/en/acts-14-21.json"},{"revision":"440a23dad7780f6d267ab5fc15fb93ec","url":"scriptures/en/acts-16-22-34.json"},{"revision":"e8013d793b0804c2bb0b01e580add9f2","url":"scriptures/en/acts-16-5.json"},{"revision":"33d7298ef60022eda3aff9d561048295","url":"scriptures/en/acts-17-10-12.json"},{"revision":"23187327f307bb6e5948802f72772611","url":"scriptures/en/acts-17-26-28.json"},{"revision":"4bed8ce3c98d2325a3bec6a148409ec4","url":"scriptures/en/acts-17-4.json"},{"revision":"9b431a04980f94eb1ef07cb73025a89f","url":"scriptures/en/acts-17-6-rsv.json"},{"revision":"a0dc3565d5c47e100f6f577ed92d930d","url":"scriptures/en/acts-18-24-26.json"},{"revision":"bf25b65401d5ca238a5a1ec5ad7288a6","url":"scriptures/en/acts-19-1-5.json"},{"revision":"a625a763568c2be777a7899f8eda6e08","url":"scriptures/en/acts-19-1-6.json"},{"revision":"eb1f74e6c7760d07cde350a155b921d2","url":"scriptures/en/acts-19-5.json"},{"revision":"97eab84fed8e86a6bf37b1aec97271f6","url":"scriptures/en/acts-19-6.json"},{"revision":"0f1ab86fee1708aafaac3416fdf6cae6","url":"scriptures/en/acts-2-1-4.json"},{"revision":"074690f2639ab917d38591c7b305828e","url":"scriptures/en/acts-2-14.json"},{"revision":"94e0c71b6f49db5500d415c0ff14420a","url":"scriptures/en/acts-2-17.json"},{"revision":"5784ca378d13f10ddf51d752378e3c7d","url":"scriptures/en/acts-2-22-24.json"},{"revision":"337d849a83c0e7a48fe2a5bfb585a888","url":"scriptures/en/acts-2-22.json"},{"revision":"242a1f0fcaa6c57276caeefcfc960858","url":"scriptures/en/acts-2-23.json"},{"revision":"d65d2cf16ce3c824428098520783b9ec","url":"scriptures/en/acts-2-24.json"},{"revision":"0c1e03b8609c5423ed98c0494e961d63","url":"scriptures/en/acts-2-36-37.json"},{"revision":"6c3209d9a0806b854c8af3f50f12bf34","url":"scriptures/en/acts-2-36-47.json"},{"revision":"4c36ae2c00099f63f119c82dc2f8ec94","url":"scriptures/en/acts-2-37-38.json"},{"revision":"7855232f203fe8b64491209e26a763ca","url":"scriptures/en/acts-2-37-42.json"},{"revision":"3e2e2941e8624e95508bec39ced98e29","url":"scriptures/en/acts-2-38-42.json"},{"revision":"49b750f1709b15d929b1a6651bc1faeb","url":"scriptures/en/acts-2-38.json"},{"revision":"88dfadabe844fbdecbc9f59be9e05af3","url":"scriptures/en/acts-2-41.json"},{"revision":"ce37cb4800fc9c9dacc314e6227f8f88","url":"scriptures/en/acts-2-42.json"},{"revision":"f1d50e968c71db7616afce9733871f32","url":"scriptures/en/acts-2-47.json"},{"revision":"4f30cfb38d017c9416e291967fa6c01b","url":"scriptures/en/acts-2-5.json"},{"revision":"d1ae68b20e1227e22835949a7ed6765f","url":"scriptures/en/acts-22-16.json"},{"revision":"c85293491e62ce27485aefcdca42d1e4","url":"scriptures/en/acts-22-3-16.json"},{"revision":"a240a910780bc4c225a2d7fa1e408014","url":"scriptures/en/acts-28-21-22.json"},{"revision":"66d8e00083a9384fef7378854ccb3f84","url":"scriptures/en/acts-28-22.json"},{"revision":"869d934d63526cb748fa363c6b416c42","url":"scriptures/en/acts-28-30.json"},{"revision":"3d332c4b4775fd266201035225de72e7","url":"scriptures/en/acts-28-5.json"},{"revision":"7f35e496c28cfaa9ec2188616d91feac","url":"scriptures/en/acts-28-8.json"},{"revision":"5f7afb6d0e60074df7c9a38dafc4ed27","url":"scriptures/en/acts-4-12.json"},{"revision":"2b58f28a84d29a657cbd7282751a58b5","url":"scriptures/en/acts-4-4.json"},{"revision":"c9df0e82b8a148c02b024d7c091fb06b","url":"scriptures/en/acts-5-14.json"},{"revision":"599fd14556860a2c9bf752a5e6e72adf","url":"scriptures/en/acts-5-17-18.json"},{"revision":"4830485bfaa3770985630b23b5540e5d","url":"scriptures/en/acts-5-38-42.json"},{"revision":"4534760286628a213ab35532640de68e","url":"scriptures/en/acts-6-1-8.json"},{"revision":"a1e7b35928ba2bc5c7dd5f7058d4430b","url":"scriptures/en/acts-6-1.json"},{"revision":"2610ff499277b239af063a5a92cf621d","url":"scriptures/en/acts-6-7.json"},{"revision":"93f2f1510fa46043b163b5f33c33b28f","url":"scriptures/en/acts-6-8.json"},{"revision":"2b88632b3545750b68bf484e86e18960","url":"scriptures/en/acts-8-1-25.json"},{"revision":"620325fb67f3488efba54cf90d74fe31","url":"scriptures/en/acts-8-12.json"},{"revision":"29eb5c44af68aab2bca6ae901377c90f","url":"scriptures/en/acts-8-13.json"},{"revision":"a026fc0ac782f8f8c4f772034c06a689","url":"scriptures/en/acts-8-18.json"},{"revision":"ac7485eac2b8bac5d47294201b1cc913","url":"scriptures/en/acts-8-26-39.json"},{"revision":"90c6778e9ab5c5940eea19d6ff149fe5","url":"scriptures/en/acts-8-4.json"},{"revision":"a024d2d4ee72c1393ca648e4ffe867c1","url":"scriptures/en/acts-9-1-22.json"},{"revision":"9aedc0bc3dbbe66af53a68f81f15eed6","url":"scriptures/en/acts-9-17-18.json"},{"revision":"d438ff5d41704449336db94df227e2a0","url":"scriptures/en/acts-9-18-25.json"},{"revision":"80daea5f3b4ec3ce4a66079c792039e0","url":"scriptures/en/acts-9-31.json"},{"revision":"d4c05fd779bbe34e3e1cda2b22495b30","url":"scriptures/en/acts-ch-1-ch-2.json"},{"revision":"00498c9a14dde246b712806c7eef79f8","url":"scriptures/en/acts-ch-10.json"},{"revision":"370574030272eec6c830ec4d2d3f8a4f","url":"scriptures/en/acts-ch-2.json"},{"revision":"25278c12611a4cfc8422a7b5fd93611f","url":"scriptures/en/colossians-1-15-18.json"},{"revision":"818bdbeb89e9c8f4178acb265d9f7ac1","url":"scriptures/en/colossians-1-23.json"},{"revision":"cc368c74f33cfa5ad58e058137ceaa0f","url":"scriptures/en/colossians-1-28-29.json"},{"revision":"e8589ab17abf43ff3407df4b95a07721","url":"scriptures/en/colossians-1-6.json"},{"revision":"57fd8254969027f3da240d82e6acac0c","url":"scriptures/en/colossians-2-11-12.json"},{"revision":"bfd8f919a0bfa42e6bafc3ae685686d3","url":"scriptures/en/colossians-2-12.json"},{"revision":"bf8820ea2503fbe695b42a124d065059","url":"scriptures/en/colossians-3-1-4.json"},{"revision":"ce2d7195ca2b765b47e27c4f3a00a373","url":"scriptures/en/colossians-3-12-14.json"},{"revision":"8d231daf80d9255dbd60897120db1d58","url":"scriptures/en/colossians-3-15-16.json"},{"revision":"9acef4857931720e44d57900f6fb97f9","url":"scriptures/en/colossians-3-15.json"},{"revision":"c7f1f9c4f091727949ce90dbc960b011","url":"scriptures/en/colossians-3-17.json"},{"revision":"6f67d245768f1e18c4f9033cc6ae1e53","url":"scriptures/en/colossians-3-18-21.json"},{"revision":"be148b943949074e821d9972efd777fe","url":"scriptures/en/colossians-3-22.json"},{"revision":"9e4ea122f0f5dda22b100739978e7790","url":"scriptures/en/colossians-3-5-11.json"},{"revision":"32578ccaf9f4c63bac46d67479424cc2","url":"scriptures/en/colossians-4-1.json"},{"revision":"2bec0b33a9e4aaf71ae20b215ace62cb","url":"scriptures/en/colossians-ch-3-15-ch-4-1.json"},{"revision":"550289f97c4de3a532ed218812d60f8f","url":"scriptures/en/daniel-2-31-45.json"},{"revision":"bb9ae52e945fd97d7722c1e0abaf09f5","url":"scriptures/en/daniel-2-44.json"},{"revision":"3eadb347f1a01165a66970e26e4f2333","url":"scriptures/en/ephesians-2-19-21.json"},{"revision":"e25a588a94b9e4c08ba2cb4341ac7948","url":"scriptures/en/ephesians-2-8.json"},{"revision":"66bae144c19b3f52d89c6bd57e4dc56f","url":"scriptures/en/ephesians-3-20.json"},{"revision":"3062daef7f5ce25351ce0b4ffbe38718","url":"scriptures/en/ephesians-4-4-6.json"},{"revision":"4c16a4abbec040e7ff9f46851091dd54","url":"scriptures/en/ephesians-5-18-19.json"},{"revision":"fdd1e3f15b5f66f95d5409d2fea09df4","url":"scriptures/en/ephesians-5-19-20.json"},{"revision":"c066f7b39d1f1c6b415de5c6ee74b738","url":"scriptures/en/ephesians-6-10-18.json"},{"revision":"aafeb4891059c4c8c7c0ab6b2101de9d","url":"scriptures/en/ezekiel-18-20.json"},{"revision":"dacfa06656fade4525b85541723609b5","url":"scriptures/en/galatians-1-8.json"},{"revision":"d2383c709eabf4f4a9ec123a2e9d4825","url":"scriptures/en/galatians-5-19-21.json"},{"revision":"f5cf0a64fa6285b6ea9a661f36fcbaff","url":"scriptures/en/galatians-6-1-2.json"},{"revision":"0ea1679e8392bfbb9bcb2ad4700257e0","url":"scriptures/en/genesis-2-19.json"},{"revision":"510cf67c8b0ae189dd93dace8eb4fc3d","url":"scriptures/en/hebrews-10-23-25.json"},{"revision":"745b9a2db2f2084970edc8e84169bb5e","url":"scriptures/en/hebrews-10-23.json"},{"revision":"58c54a12ad8489693133dbb2b596fdf7","url":"scriptures/en/hebrews-10-24.json"},{"revision":"11cad6eea16f26fa9984280c4376f075","url":"scriptures/en/hebrews-12-14-15.json"},{"revision":"3638af77e4862740fa2856576adc5f4a","url":"scriptures/en/hebrews-12-15.json"},{"revision":"4810a5beea505a16f5aa4bed895c18e0","url":"scriptures/en/hebrews-13-17.json"},{"revision":"64ac5f1ca4c15d01d969628abc15cf3c","url":"scriptures/en/hebrews-3-12-14.json"},{"revision":"0f051555212d1e1e30e948721bf4725a","url":"scriptures/en/hebrews-4-12-13.json"},{"revision":"11b1c9d1afef94086e75275cdd040d32","url":"scriptures/en/hebrews-5-11-14.json"},{"revision":"5ac8851ba84f2125d47b9d6ccc5081b1","url":"scriptures/en/hebrews-6-1-3.json"},{"revision":"ddb05bea3197b389d47c90f9bba876ec","url":"scriptures/en/hebrews-ch-5-11-ch-6-6.json"},{"revision":"1c53881288bacb5d8acd3fb79c0fea81","url":"scriptures/en/isaiah-2-1-4.json"},{"revision":"9d10bb382d316cae0c5f9a54a21227bf","url":"scriptures/en/isaiah-2-2.json"},{"revision":"46a27975dd6917d130dc12f94b578ac9","url":"scriptures/en/isaiah-2-3.json"},{"revision":"0a4de74548066cb0c0813b399f48c8d6","url":"scriptures/en/isaiah-53-4-6.json"},{"revision":"4f4026b44e2c01ca1c857d573e9ae54d","url":"scriptures/en/isaiah-59-1-2.json"},{"revision":"e2734b5917fba5784c03bbd87247dcfb","url":"scriptures/en/james-1-22-25.json"},{"revision":"57bf9ea3448d4ddd8ac3af06182fb1e6","url":"scriptures/en/james-4-17.json"},{"revision":"145cd268ebc6e1084efeeb133b6a1c1d","url":"scriptures/en/james-5-16-18.json"},{"revision":"7aa18b2a9ad5e9853f44adcd804d2379","url":"scriptures/en/james-5-16.json"},{"revision":"e8e66ee1e46e1d65b4c3addb544acab3","url":"scriptures/en/jeremiah-29-11-14.json"},{"revision":"944d12c93677411aa4bf6e625a41d5bd","url":"scriptures/en/jeremiah-29-11.json"},{"revision":"4207e461543921c6b9b080487fb49ea3","url":"scriptures/en/john-10-19-21.json"},{"revision":"d464463cbd7386ed571ddce1625b2698","url":"scriptures/en/john-12-48.json"},{"revision":"e6b0dbad8ec1f669b04db82b71f60044","url":"scriptures/en/john-13-34-35.json"},{"revision":"fda6d7ee294acbd476fc970aa05a72a0","url":"scriptures/en/john-15-1-16.json"},{"revision":"d2ff2e6c77a7ec27620a0510df86ff9f","url":"scriptures/en/john-15-16.json"},{"revision":"74017f447bc0cd6faff148bfb48d8531","url":"scriptures/en/john-15-18-20.json"},{"revision":"3a05b88578e0062c86a12689c34f79bc","url":"scriptures/en/john-15-8.json"},{"revision":"f6614a00933b4b300e4f907353e09f30","url":"scriptures/en/john-15-9-10.json"},{"revision":"e1a5eecaf0d69de3e1a07c7f1264b850","url":"scriptures/en/john-16-1-4.json"},{"revision":"e6261ede20d8bbc52a2a7b3803983824","url":"scriptures/en/john-17-20-23.json"},{"revision":"930e4718b67d8352b37fadbc3d632531","url":"scriptures/en/john-20-30-31.json"},{"revision":"0d66c2f9cfc3f0c1195e221fa9ac0cac","url":"scriptures/en/john-3-1-7.json"},{"revision":"adb5ad802724bcfeae139a975d5968d4","url":"scriptures/en/john-3-3.json"},{"revision":"aa2010dcc92c6ad58f27df43b005e267","url":"scriptures/en/john-3-34-36.json"},{"revision":"92fe3d811f1bb555fb93ab5739a93882","url":"scriptures/en/john-3-34.json"},{"revision":"a1547f73a655558c211004d8590583bd","url":"scriptures/en/john-3-5.json"},{"revision":"b21438d940d17a198923388bb99ad2b8","url":"scriptures/en/john-3-7.json"},{"revision":"92de191dcb6aa6c1918f0ce2c1cede74","url":"scriptures/en/john-4-23-24.json"},{"revision":"68a48973d5a05c59475c0f5ec5072842","url":"scriptures/en/john-7-12-13.json"},{"revision":"55d0d23427e4f0427e4907d3e2c97cab","url":"scriptures/en/john-8-31-32.json"},{"revision":"5caab1ef02932d741d31ee4932ce3d94","url":"scriptures/en/luke-11-1-4.json"},{"revision":"fa39d7c005c27d97e70b0227e8cabc4f","url":"scriptures/en/luke-12-51-53.json"},{"revision":"26f31fe4c3710cefe02e9176321507c6","url":"scriptures/en/luke-14-25-33.json"},{"revision":"9a750a16bf9bb76d448b206766e9f4cc","url":"scriptures/en/luke-17-20-21.json"},{"revision":"d2eda2b394a3a25b722162753bb7c20e","url":"scriptures/en/luke-19-10.json"},{"revision":"8c60e1773127a187c00c943fa9d25d81","url":"scriptures/en/luke-23-1-3.json"},{"revision":"e97283948d3997051faa6569a8077208","url":"scriptures/en/luke-23-50-51.json"},{"revision":"c7cba40e60df22fd0e0997ad05ea3bdc","url":"scriptures/en/luke-24-44-49.json"},{"revision":"99f1344c1e6a7f90ff56ffd14e12aec4","url":"scriptures/en/luke-24-47.json"},{"revision":"87381cb895a210b3f175e988a0aa6e5d","url":"scriptures/en/luke-9-1.json"},{"revision":"834e03a2de2721a2344247bbf7d6b3e7","url":"scriptures/en/luke-9-23-26.json"},{"revision":"94a210be5173f773faf496321cde9efd","url":"scriptures/en/malachi-3-6-12.json"},{"revision":"19d4e51593a2c1fda75546e800042314","url":"scriptures/en/mark-1-14-18.json"},{"revision":"54d217e79d948af4250f21bd71e76f45","url":"scriptures/en/mark-1-17.json"},{"revision":"c1f0b6f9809d9860b38b7cd9a609297c","url":"scriptures/en/mark-16-16-18.json"},{"revision":"648d72f830c6bf0d62988ce02dcd2441","url":"scriptures/en/mark-3-20-21.json"},{"revision":"510fb98db4e33950a078935d1ee9d159","url":"scriptures/en/mark-3-31-35.json"},{"revision":"0d24cab0b788f7ea0cb26f9bb2bf9b67","url":"scriptures/en/mark-9-1.json"},{"revision":"4a7b47e47dfd007a6b338c138be71f80","url":"scriptures/en/matthew-15-1-9.json"},{"revision":"03555a285ca38f2a6f0ae8b69e858d3e","url":"scriptures/en/matthew-15-6-9.json"},{"revision":"750d06ade385bd8a29b3d183e7d60472","url":"scriptures/en/matthew-16-13-19.json"},{"revision":"b5c3e651a8e8261e1b58ba4a11fdaa8b","url":"scriptures/en/matthew-16-19.json"},{"revision":"6d5e5283036c7e152173f7252917fde0","url":"scriptures/en/matthew-18-15-17.json"},{"revision":"a34ecd7794e2815704120bc63db5c967","url":"scriptures/en/matthew-22-37-39.json"},{"revision":"10f0ef9adc2977866f73cab070e696da","url":"scriptures/en/matthew-26-31-35.json"},{"revision":"7b4d66996223673cf7f490f4f7403efc","url":"scriptures/en/matthew-26-36-39.json"},{"revision":"a12dfc8466b491d2bd3acf0749bb0fb5","url":"scriptures/en/matthew-26-36-46.json"},{"revision":"61a337a618523619e16633e822607419","url":"scriptures/en/matthew-26-47-56.json"},{"revision":"1f279e1be7677352dfb0be43776a4c19","url":"scriptures/en/matthew-26-57-68.json"},{"revision":"643b47d0899c451658050b8a698f4611","url":"scriptures/en/matthew-26-69-75.json"},{"revision":"c36cfc9342b18a54aa0de38aef408d4e","url":"scriptures/en/matthew-27-1-10.json"},{"revision":"1f281ea12a95c409c927e76b50c8a274","url":"scriptures/en/matthew-27-11-26.json"},{"revision":"7d2695923b03f174476bf69af2ef5d85","url":"scriptures/en/matthew-27-27-31.json"},{"revision":"d4a319e62b2471aa630fe11d32f90e93","url":"scriptures/en/matthew-27-32-44.json"},{"revision":"00e283e92908d018ef2c91cfca80a889","url":"scriptures/en/matthew-27-45-56.json"},{"revision":"cc0814d0cb52035e5b00dfd6207d2c4b","url":"scriptures/en/matthew-27-46.json"},{"revision":"f203ddceef4947d183ea413e0eab5957","url":"scriptures/en/matthew-27-57-61.json"},{"revision":"cb0aba7249b06d735e90b88e38ac8ff0","url":"scriptures/en/matthew-27-62-66.json"},{"revision":"dc2833d4abf6864c510c62b57d34eb69","url":"scriptures/en/matthew-28-1-10.json"},{"revision":"47f4c973ff28de34a0beab6fb08d2604","url":"scriptures/en/matthew-28-18-20.json"},{"revision":"3de309c5fc7bad3b734a20a932a6d75c","url":"scriptures/en/matthew-28-19-20.json"},{"revision":"e4929b9a5e4a3e831823d1957678d54a","url":"scriptures/en/matthew-28-19.json"},{"revision":"d2a5eaf0c25ada1021ffe338725443ac","url":"scriptures/en/matthew-28-20.json"},{"revision":"a8d496ee7ad0451bf395bea44c30c92a","url":"scriptures/en/matthew-3-1-2.json"},{"revision":"b8940deef7eb48767e152575ffdab7ec","url":"scriptures/en/matthew-3-1-6.json"},{"revision":"675cf5f8b84f40119fc5015e3142ccf1","url":"scriptures/en/matthew-4-17.json"},{"revision":"653e8602aacdf0659b9d72a3f7d2b146","url":"scriptures/en/matthew-5-10-12.json"},{"revision":"5ae057342acc6f0d0a72e48344f9b7cc","url":"scriptures/en/matthew-6-25-34.json"},{"revision":"df6714537636a9f880abe8217051c789","url":"scriptures/en/matthew-6-33.json"},{"revision":"06c3dd6fd2543328c34f3a0be6668fd8","url":"scriptures/en/matthew-7-13-14.json"},{"revision":"2fe1691535c778d53b833b75883e25db","url":"scriptures/en/matthew-7-7-8.json"},{"revision":"930c66c06f8cd0212d7d45632de187c8","url":"scriptures/en/matthew-9-2-6.json"},{"revision":"62f897fc977ceb9f82467900b873cee4","url":"scriptures/en/nehemiah-13-23-27.json"},{"revision":"add963e931e8b913852a4ec2d89df1ed","url":"scriptures/en/numbers-27-12-18.json"},{"revision":"a77f94224471cee7e2ebda336f85f8bf","url":"scriptures/en/philippians-4-13.json"},{"revision":"21600e0e8d1687d261bf3c632c21b4da","url":"scriptures/en/philippians-4-4-7.json"},{"revision":"b96e36d5ab1ff0007f57815ef23874db","url":"scriptures/en/philippians-4-4.json"},{"revision":"1465b6c45acf1a57fca70c4fd5cf0f67","url":"scriptures/en/phillipians-4-13.json"},{"revision":"070ccbe37ea2eff0427994da666bc41f","url":"scriptures/en/phillipians-4-4.json"},{"revision":"94e02e8a53717c1b280fd32ae90cb6fb","url":"scriptures/en/proberbs-13-12.json"},{"revision":"e239c79fcbd216595639cae951a7fd70","url":"scriptures/en/psalm-119-1-2.json"},{"revision":"156f9d52f26c100f22fde893aaf27c95","url":"scriptures/en/revelation-3-20.json"},{"revision":"305407b802a9ee08e4094987d32529a2","url":"scriptures/en/romans-10-13.json"},{"revision":"5d4d6de0188650317367847477e8b3bf","url":"scriptures/en/romans-10-9.json"},{"revision":"ef02fa0769acad8f36fbf1ad05cec67d","url":"scriptures/en/romans-12-4-5.json"},{"revision":"736f1d6a076e2072ac37d4038c578678","url":"scriptures/en/romans-3-23-25.json"},{"revision":"5f083ce762725d27c51503c8b5475c92","url":"scriptures/en/romans-3-23.json"},{"revision":"e2ac5a8d2c1db32ef4cbb0e3ff1800a1","url":"scriptures/en/romans-3-25.json"},{"revision":"00d1deaa05db70204906ca3e01ec6523","url":"scriptures/en/romans-6-1-4.json"},{"revision":"ced63d49e3b1c17acba20e36149b1eae","url":"scriptures/en/romans-6-2-4.json"},{"revision":"f482b77d37a349c4b4c872eafdaaab5d","url":"scriptures/en/romans-6-23.json"},{"revision":"59de33bac50b41ad9d0aae0c3ed1e7e7","url":"scriptures/en/romans-6-3-4.json"},{"revision":"69ee2ab03406de8014500f3d7c4447cc","url":"scriptures/es/_template.json"},{"revision":"5d1d130167fa151f539679ae6f8f6ab3","url":"scriptures/es/1-corinthians-1-10-13.json"},{"revision":"34a9a9e8d9788ef8ccd35bc49afbc8d9","url":"scriptures/es/1-corinthians-1-10-17.json"},{"revision":"f2208d50d94a1114257a217ae1c1381f","url":"scriptures/es/1-corinthians-1-17.json"},{"revision":"9d271ead190c1321a6d491655b020070","url":"scriptures/es/1-corinthians-11-23-32.json"},{"revision":"9e0a0dbc6a2f521c2a447933e9e5d0e3","url":"scriptures/es/1-corinthians-12-12-13.json"},{"revision":"d706170ec34b269c1576af0195486020","url":"scriptures/es/1-corinthians-12-14-27.json"},{"revision":"61a9c2a3ac06438a55d184267fa47eb6","url":"scriptures/es/1-corinthians-12-21.json"},{"revision":"5b3b670d092bfaa4b9f211229b930e31","url":"scriptures/es/1-corinthians-12-26.json"},{"revision":"1a5b9a92cee5736ce9ab901681012ce3","url":"scriptures/es/1-corinthians-12-28-30.json"},{"revision":"08d9a94b41ecfa1f40241ae638ac2d54","url":"scriptures/es/1-corinthians-12-8-10.json"},{"revision":"c099c8cda0d94502dd53f6e30700e163","url":"scriptures/es/1-corinthians-13-8-10.json"},{"revision":"78c54942e10cbf585d163b3bfe88721d","url":"scriptures/es/1-corinthians-14-20-22.json"},{"revision":"d42bfb202bf4b708d2b3ae6b5c033858","url":"scriptures/es/1-corinthians-3-11.json"},{"revision":"b0ff18f82b012047249107cdf98b2202","url":"scriptures/es/1-corinthians-7-39.json"},{"revision":"51239fd3666d32b4bbc36a91523d73b7","url":"scriptures/es/1-corinthians-ch-12.json"},{"revision":"baacc6af4e22f5be3d66476cd6b27f28","url":"scriptures/es/1-corinthians-ch-14.json"},{"revision":"032ba5a01eb9dfdd195347ac82fb3789","url":"scriptures/es/1-john-1-9.json"},{"revision":"a36e33ff05b9188d6afda1e8e30b7c4b","url":"scriptures/es/1-kings-11-1-10.json"},{"revision":"1dd1e3eeac7b714d17c6b59da49d96b2","url":"scriptures/es/1-peter-1-21.json"},{"revision":"083762608be893070c1b98d7baf5e1fc","url":"scriptures/es/1-peter-2-9-10.json"},{"revision":"3a5b5f0acc2e752afc1b597ae524b7d1","url":"scriptures/es/1-peter-3-1-7.json"},{"revision":"2e22224dbb6362130d15cfc14bb01d52","url":"scriptures/es/1-peter-3-21.json"},{"revision":"226656dc90224176f0409ea4259b7464","url":"scriptures/es/1-peter-4-12-16.json"},{"revision":"6049797582fdd405514280e2ee6e9fda","url":"scriptures/es/1-peter-4-3-4.json"},{"revision":"723ed011a4d85fe85032ed0df82fa739","url":"scriptures/es/1-thessalonians-5-12-14.json"},{"revision":"63aabff00d88316465894b709a2653a0","url":"scriptures/es/1-timothy-2-3-4.json"},{"revision":"f20cf8fb05113ce0797e3ab74f6f955b","url":"scriptures/es/1-timothy-4-16.json"},{"revision":"dd8fd2d77c8118804eec762c74872516","url":"scriptures/es/2-corinthians-6-14-18.json"},{"revision":"ad08df8f9f05d281161614e3f8b22f26","url":"scriptures/es/2-corinthians-9-6-11.json"},{"revision":"acf95e704b45c34b3b2a412fa95bdd03","url":"scriptures/es/2-corinthians-9-6-8.json"},{"revision":"62ec581586b50dfbeb3e67406ee71618","url":"scriptures/es/2-peter-1-20-21.json"},{"revision":"1dc3edb97147c587689fa20a65a7f89a","url":"scriptures/es/2-thessalonians-2-9-12.json"},{"revision":"d9227ce328ce8d763a9b0668196ef710","url":"scriptures/es/2-timothy-3-1-5.json"},{"revision":"f3a22fe29a4cd069bb4409f140e3f9d5","url":"scriptures/es/2-timothy-3-12.json"},{"revision":"5b1561b8f6f20f7681c5c8c20a8b317c","url":"scriptures/es/2-timothy-3-16-17.json"},{"revision":"f6b149536fd2f5285e27cd96a3cddaed","url":"scriptures/es/acts-1-12-14.json"},{"revision":"e3806ccb62742155ca95c2574b89b33e","url":"scriptures/es/acts-1-18-19.json"},{"revision":"554bc8d398c2dd94a3ff21e4e543aa5e","url":"scriptures/es/acts-1-4-5.json"},{"revision":"5b25f1160ffa669488ba55e392689731","url":"scriptures/es/acts-1-8.json"},{"revision":"b2a6a8583b1e6dbec6cd66eb7d121b43","url":"scriptures/es/acts-10-44.json"},{"revision":"536265c588af9950d2f4a0bc3751d586","url":"scriptures/es/acts-10-48.json"},{"revision":"e50d9a851d7350dd3ea33750205fd9f7","url":"scriptures/es/acts-11-1-18.json"},{"revision":"136a3e600f0c37f0d81053a23671741d","url":"scriptures/es/acts-11-14.json"},{"revision":"14a774b94d029a518635bbb08aa9b672","url":"scriptures/es/acts-11-15.json"},{"revision":"59ad809a3cdd0f46b9819cc20b472fba","url":"scriptures/es/acts-11-19-26.json"},{"revision":"39003ebab0b22d283167fd93841924d0","url":"scriptures/es/acts-11-21.json"},{"revision":"066ddffa96926300100b760257ef47a1","url":"scriptures/es/acts-11-25-26.json"},{"revision":"c567bbe0faa43b7c02f227d7f0480536","url":"scriptures/es/acts-12-24.json"},{"revision":"5e72a99c65c968d1574627e521eec65f","url":"scriptures/es/acts-13-3.json"},{"revision":"5d1390584e9d45edb6a715e6df065e50","url":"scriptures/es/acts-13-49.json"},{"revision":"1d0b8a5b890bde749a3070950eb90dfb","url":"scriptures/es/acts-14-1.json"},{"revision":"8cf38e6b6f8ad326ec0a491585aed29f","url":"scriptures/es/acts-14-21.json"},{"revision":"3cab60c12ea044f27ec6841ac7a23a49","url":"scriptures/es/acts-16-22-34.json"},{"revision":"87c50b6a4f73312450d760ec3616708f","url":"scriptures/es/acts-16-5.json"},{"revision":"3d15cc6510f449ec135b63496c200973","url":"scriptures/es/acts-17-10-12.json"},{"revision":"80ffa42066d7830d036ee319a7196fbc","url":"scriptures/es/acts-17-26-28.json"},{"revision":"25caea7f8d4f1845d81a99417e2130b3","url":"scriptures/es/acts-17-4.json"},{"revision":"5ae1e9e3ca8f01d0f1dc17b7d000cc7a","url":"scriptures/es/acts-17-6-rsv.json"},{"revision":"76b2bfaba4d27e6d025c5bb5c4ac6499","url":"scriptures/es/acts-18-24-26.json"},{"revision":"9a065d99d7dfcaaa49c0f0e78e4d5000","url":"scriptures/es/acts-19-1-5.json"},{"revision":"0a7175e60ed1cee203347051167b7a14","url":"scriptures/es/acts-19-1-6.json"},{"revision":"a227f72925cd4b55b18e4153694bf953","url":"scriptures/es/acts-19-5.json"},{"revision":"ec5ed2e59bd747dbe1687b13e75ed630","url":"scriptures/es/acts-19-6.json"},{"revision":"a29bcc219b85926605d8d2f319f6f238","url":"scriptures/es/acts-2-1-4.json"},{"revision":"c1bfd351108cd3deedf6dcfd10e7444f","url":"scriptures/es/acts-2-14.json"},{"revision":"86e193a616f802694b3ad3d0aa4e7c82","url":"scriptures/es/acts-2-17.json"},{"revision":"bd77a1e03b51f9404fd0e69a28d1dfe7","url":"scriptures/es/acts-2-22-24.json"},{"revision":"ddf051597afa86247545c884f7032569","url":"scriptures/es/acts-2-22.json"},{"revision":"7bd6a13b51bba72ef119bb96919db13e","url":"scriptures/es/acts-2-23.json"},{"revision":"2cbfb97838a0d60813a87c7774e076c6","url":"scriptures/es/acts-2-24.json"},{"revision":"249534729a1ef14cbb85c7234189623e","url":"scriptures/es/acts-2-36-37.json"},{"revision":"fbff3f742ca1f6027e043fb2f3772b4d","url":"scriptures/es/acts-2-36-47.json"},{"revision":"d801d5a91121c944d5c24ca1dd75e7c1","url":"scriptures/es/acts-2-37-38.json"},{"revision":"c800be68bab1cba4bc3a6dda9324c289","url":"scriptures/es/acts-2-37-42.json"},{"revision":"dd4c3d57bd447b611fa82b5d08a85107","url":"scriptures/es/acts-2-38-42.json"},{"revision":"b5acfb345b519c66a084b5f7d3ca1e77","url":"scriptures/es/acts-2-38.json"},{"revision":"d298ca6b791f19a575126a2489bceff4","url":"scriptures/es/acts-2-41.json"},{"revision":"63cf38bc5035ed78c1ef9bfb301912bc","url":"scriptures/es/acts-2-42.json"},{"revision":"4682b7a69384675aad9fc52cfc42b5d0","url":"scriptures/es/acts-2-47.json"},{"revision":"6a4b2a2a3bee888f563ea58a307e9ece","url":"scriptures/es/acts-2-5.json"},{"revision":"3690db58f513a72899573fee1f987837","url":"scriptures/es/acts-22-16.json"},{"revision":"79cb824b80c84104ceb89181e395f3d7","url":"scriptures/es/acts-22-3-16.json"},{"revision":"9ab8433b3bdfec72a36afbc972afa22d","url":"scriptures/es/acts-28-21-22.json"},{"revision":"8c7507c1d0b50b15b29994dfe1b05c5d","url":"scriptures/es/acts-28-22.json"},{"revision":"6a6d816a939847d84ee0af4197b05aa7","url":"scriptures/es/acts-28-30.json"},{"revision":"e37452f1ba9c88b09d1b68e35c95f5f0","url":"scriptures/es/acts-28-5.json"},{"revision":"944977a699072e3b2fd8eeccd048ae56","url":"scriptures/es/acts-28-8.json"},{"revision":"d618342056f338d7ed2da806df7076de","url":"scriptures/es/acts-4-12.json"},{"revision":"e21fcf747e5b829205e48415e9b94ff7","url":"scriptures/es/acts-4-4.json"},{"revision":"a60fb2bc6b4772c2cbcb5f6ec9eadd60","url":"scriptures/es/acts-5-14.json"},{"revision":"326039d99999a4ddb9a9c427c890d4f3","url":"scriptures/es/acts-5-17-18.json"},{"revision":"f75058b349b0da8d8953fa0c68b136da","url":"scriptures/es/acts-5-38-42.json"},{"revision":"dd8b38f0f00f3e180b964d3e9d0710e9","url":"scriptures/es/acts-6-1-8.json"},{"revision":"3967dc6e429fcccf53ef96da1b6a4b75","url":"scriptures/es/acts-6-1.json"},{"revision":"2c6072a1377e46466f1584f5006c09ec","url":"scriptures/es/acts-6-7.json"},{"revision":"a8b954d50d2570890eccd09455d516e4","url":"scriptures/es/acts-6-8.json"},{"revision":"fae7c7f91dbcbe547618ed259b56b3f6","url":"scriptures/es/acts-8-1-25.json"},{"revision":"44d0d1a80ed57d26af6fd339713f7d1e","url":"scriptures/es/acts-8-12.json"},{"revision":"fb5cc9f5e821c9532551bd8e1e87002c","url":"scriptures/es/acts-8-13.json"},{"revision":"82915c2b70c665279650799c65b50c7e","url":"scriptures/es/acts-8-18.json"},{"revision":"99404e044818acf1ff7e934fef3747d8","url":"scriptures/es/acts-8-26-39.json"},{"revision":"7c6f2de4dfd703e67cb058192f6ecdc6","url":"scriptures/es/acts-8-4.json"},{"revision":"7aed2918331496d110cf2705d84443a4","url":"scriptures/es/acts-9-1-22.json"},{"revision":"c322e39245aa381c0d650264eaa032d9","url":"scriptures/es/acts-9-17-18.json"},{"revision":"1720e88c206f0d01e7b7dcf05fb39aa4","url":"scriptures/es/acts-9-18-25.json"},{"revision":"e030da711f53fefab92fb10dc5b4af2f","url":"scriptures/es/acts-9-31.json"},{"revision":"423be25308838f8093443160513413ab","url":"scriptures/es/acts-ch-1-ch-2.json"},{"revision":"4bf28cdc0bb95349bcbc58940266afcb","url":"scriptures/es/acts-ch-10.json"},{"revision":"4de10c9b3aa7f937534014e427617558","url":"scriptures/es/acts-ch-2.json"},{"revision":"b32faba41bfae874b356950748baba43","url":"scriptures/es/colossians-1-15-18.json"},{"revision":"1d935703a29e42e6c73c54fbe6c74a2b","url":"scriptures/es/colossians-1-23.json"},{"revision":"e9030b4b8928c2ee0e77ebb029b328d5","url":"scriptures/es/colossians-1-28-29.json"},{"revision":"a89dddfc1e464b433ac73c8696f2dce4","url":"scriptures/es/colossians-1-6.json"},{"revision":"07e6fde708bafad80d1ee04542b3e751","url":"scriptures/es/colossians-2-11-12.json"},{"revision":"fa8ac9ec369c0a259919a45fc8c23787","url":"scriptures/es/colossians-2-12.json"},{"revision":"023270f1617931932a469a409a382091","url":"scriptures/es/colossians-3-1-4.json"},{"revision":"af706161f7683e57f173aa1e5488e36f","url":"scriptures/es/colossians-3-12-14.json"},{"revision":"3b5e22300e91a6258cc09c61251b4beb","url":"scriptures/es/colossians-3-15-16.json"},{"revision":"f75776e01d673e71e063e5e594a2767f","url":"scriptures/es/colossians-3-15.json"},{"revision":"b4a45953c596df362bcd5e026916721f","url":"scriptures/es/colossians-3-17.json"},{"revision":"bca09337cb9720ef2e6fa395b5c980a5","url":"scriptures/es/colossians-3-18-21.json"},{"revision":"711b4edd39c414076fd5a5b832f734e8","url":"scriptures/es/colossians-3-22.json"},{"revision":"1d288ad30b09ffdaaff1a11ed7409186","url":"scriptures/es/colossians-3-5-11.json"},{"revision":"52191f8a5a74c99a4f65abeba89c304a","url":"scriptures/es/colossians-4-1.json"},{"revision":"6008af4ee6b0292d8fd769a59d37c1ab","url":"scriptures/es/colossians-ch-3-15-ch-4-1.json"},{"revision":"1da188b85756362fcde31d970793b5dc","url":"scriptures/es/daniel-2-31-45.json"},{"revision":"5ae5e05a55d6ea73b9a81ec1000b6173","url":"scriptures/es/daniel-2-44.json"},{"revision":"f2b700897a17178bcaf6fc90694b5c60","url":"scriptures/es/ephesians-2-19-21.json"},{"revision":"7f853b4315348bc23c534c9589269da0","url":"scriptures/es/ephesians-2-8.json"},{"revision":"0490b87b12b49eff9064ee6faf17c570","url":"scriptures/es/ephesians-3-20.json"},{"revision":"afd89c465c4732f8bc1385dcea8d9242","url":"scriptures/es/ephesians-4-4-6.json"},{"revision":"f54bcd58abaa0670ff5a21a038c5a973","url":"scriptures/es/ephesians-5-18-19.json"},{"revision":"b920d2b88246eb671d53006c6ffae555","url":"scriptures/es/ephesians-5-19-20.json"},{"revision":"393d8d8848c2f92f625156fd4356cc80","url":"scriptures/es/ephesians-6-10-18.json"},{"revision":"3f082016a3387b3c7634afc8dcedefe1","url":"scriptures/es/ezekiel-18-20.json"},{"revision":"1a5e0f65e28e7c3de61c3435be620455","url":"scriptures/es/galatians-1-8.json"},{"revision":"72d1ca74dae31de88c42ccc8640d36c4","url":"scriptures/es/galatians-5-19-21.json"},{"revision":"47fecf20bb38acb0b5529f5594f29a6f","url":"scriptures/es/galatians-6-1-2.json"},{"revision":"340e4d40e81f17b2ceaf0759b437c9b0","url":"scriptures/es/genesis-2-19.json"},{"revision":"6928800d31ecbcd9ec0651fd6c2c60e7","url":"scriptures/es/hebrews-10-23-25.json"},{"revision":"bd57a183df19cd856d6b22a5fe2c07af","url":"scriptures/es/hebrews-10-23.json"},{"revision":"04030a3f34ccd78ab9e32af400cfb254","url":"scriptures/es/hebrews-10-24.json"},{"revision":"6fb3ecb9505a0ef5f6de7147e4bc000b","url":"scriptures/es/hebrews-12-14-15.json"},{"revision":"79505e6f9fdc42326f18bcabbc5cdaa9","url":"scriptures/es/hebrews-12-15.json"},{"revision":"98718289073120789a9f71dac8ce826f","url":"scriptures/es/hebrews-13-17.json"},{"revision":"01e21523f1bc2f77fdf7099a6d3418df","url":"scriptures/es/hebrews-3-12-14.json"},{"revision":"866457fc1cdd87761f5c12c867667649","url":"scriptures/es/hebrews-4-12-13.json"},{"revision":"c4d647b08bfcdf29cf88ea7f35f6b931","url":"scriptures/es/hebrews-5-11-14.json"},{"revision":"6b994f356ec42820c46e1aab40634a34","url":"scriptures/es/hebrews-6-1-3.json"},{"revision":"f18463c3d52029e772e6a1237ff85216","url":"scriptures/es/hebrews-ch-5-11-ch-6-6.json"},{"revision":"e6c4d8d73fc260c10abf6410ab33a6ee","url":"scriptures/es/isaiah-2-1-4.json"},{"revision":"1204afcbdc136f9c262a6438e79c55d6","url":"scriptures/es/isaiah-2-2.json"},{"revision":"a2131a1d1f2a386534f28545ae0ce4d3","url":"scriptures/es/isaiah-2-3.json"},{"revision":"b854688bcfa93df0f111c1808ea21757","url":"scriptures/es/isaiah-53-4-6.json"},{"revision":"8f417d2216ba9980dc590480739f87b6","url":"scriptures/es/isaiah-59-1-2.json"},{"revision":"15a47dbda90b5dd05dbfc65a2d1cf7e9","url":"scriptures/es/james-1-22-25.json"},{"revision":"7ae144dfb3d8c4aae47a3c7c3e05c960","url":"scriptures/es/james-4-17.json"},{"revision":"427a000e32dfd43a6ecbbd76c1e2b700","url":"scriptures/es/james-5-16-18.json"},{"revision":"684847121831a275b13993e454f7714d","url":"scriptures/es/james-5-16.json"},{"revision":"a2bf326ecc52282ea2b023bd8431c5af","url":"scriptures/es/jeremiah-29-11-14.json"},{"revision":"dc19afaae19724aaf9b8aaba0d66ca3d","url":"scriptures/es/jeremiah-29-11.json"},{"revision":"d8b7422f9b51a54bb54c4070dc3cae77","url":"scriptures/es/john-10-19-21.json"},{"revision":"0f37d4e56528fe3868845a308733cbe8","url":"scriptures/es/john-12-48.json"},{"revision":"43778b10d97619b13d3823d69be63d7c","url":"scriptures/es/john-13-34-35.json"},{"revision":"e8757808858514bab9b54ee97059ea6b","url":"scriptures/es/john-15-1-16.json"},{"revision":"72b81fb9ce12cf977ba23f8d3364f93d","url":"scriptures/es/john-15-16.json"},{"revision":"3903a06c4fe3ed0e534df1ebd8dddaf5","url":"scriptures/es/john-15-18-20.json"},{"revision":"bd1e08263a067b9b0056f5e1f4a030b4","url":"scriptures/es/john-15-8.json"},{"revision":"ef1fe880b0e86a87b57a657c04582809","url":"scriptures/es/john-15-9-10.json"},{"revision":"30d7c3900f0accbcadddcfd406c3db7b","url":"scriptures/es/john-16-1-4.json"},{"revision":"56870677febe528201f0c52c3fcdc880","url":"scriptures/es/john-17-20-23.json"},{"revision":"6d7dd5eaa941014604959542cf0a12e5","url":"scriptures/es/john-20-30-31.json"},{"revision":"b3cf521b4b266a6f4630ca3807d66052","url":"scriptures/es/john-3-1-7.json"},{"revision":"72d5fd916068e1f8b97cc50fa3f1e5d5","url":"scriptures/es/john-3-3.json"},{"revision":"fcf4e2b87ec8a1fdf2e960d02d22b531","url":"scriptures/es/john-3-34-36.json"},{"revision":"ab1b739bcf36e5a97a79e5a8684d8fbe","url":"scriptures/es/john-3-34.json"},{"revision":"061c31a604dc96ed1024145601388d4f","url":"scriptures/es/john-3-5.json"},{"revision":"467ea9dcc950b5312099c18c5637ee66","url":"scriptures/es/john-3-7.json"},{"revision":"893eec80eac8d15193369448ffdd644c","url":"scriptures/es/john-4-23-24.json"},{"revision":"ec9db19bb9a7e8dc0437889d2aec5f81","url":"scriptures/es/john-7-12-13.json"},{"revision":"a4b1f1bf3043446548bf2b9ec32583f2","url":"scriptures/es/john-8-31-32.json"},{"revision":"487d20daa844662a08ed607b314a8f5f","url":"scriptures/es/luke-11-1-4.json"},{"revision":"b379bb7eb2126b1280f9d1443c5bccf8","url":"scriptures/es/luke-12-51-53.json"},{"revision":"b85bd9ebb497512bfd19787516b0ffce","url":"scriptures/es/luke-14-25-33.json"},{"revision":"a5a4da15b35c95ee7f8a70572ebf5b73","url":"scriptures/es/luke-17-20-21.json"},{"revision":"32349cb18a5ae8bae9d990111f94e88d","url":"scriptures/es/luke-19-10.json"},{"revision":"36d76a50fa50e8e1150ccf4420b794bf","url":"scriptures/es/luke-23-1-3.json"},{"revision":"31c2c24b57ab525080495d26a689d5a5","url":"scriptures/es/luke-23-50-51.json"},{"revision":"247a0a59a8a1f33f8670ccd1fc5b301e","url":"scriptures/es/luke-24-44-49.json"},{"revision":"65321a7835f6393c98df1b2d449e3f84","url":"scriptures/es/luke-24-47.json"},{"revision":"5ca65ea9e94460c8d467bb666ac06874","url":"scriptures/es/luke-9-1.json"},{"revision":"3843c8604dcf9ccab7319a49bc802002","url":"scriptures/es/luke-9-23-26.json"},{"revision":"f97859840f2023fbea7565d62dfa1d0a","url":"scriptures/es/malachi-3-6-12.json"},{"revision":"668444c7fa035a646d9ec0495719e6d5","url":"scriptures/es/mark-1-14-18.json"},{"revision":"84ec9fbe52b9cfd086fbfc7d4f61720d","url":"scriptures/es/mark-1-17.json"},{"revision":"d78c12fb9bdf2c95ff66480ae5fe4402","url":"scriptures/es/mark-16-16-18.json"},{"revision":"f7c049321c6982b891406f01d025214e","url":"scriptures/es/mark-3-20-21.json"},{"revision":"0faa7cdd9ebe4487d8c7477f19144428","url":"scriptures/es/mark-3-31-35.json"},{"revision":"f331b1f1d1dc9237b231f7d69cbf918a","url":"scriptures/es/mark-9-1.json"},{"revision":"6dbffb2c49f88729f3dac94870bbb48b","url":"scriptures/es/matthew-15-1-9.json"},{"revision":"29bd02886524ed92845dadb9243d1e3e","url":"scriptures/es/matthew-15-6-9.json"},{"revision":"7e29b00f067698aa3e8ffba60a7b17d6","url":"scriptures/es/matthew-16-13-19.json"},{"revision":"40687dfae89e33bb3dd2e7c04142c537","url":"scriptures/es/matthew-16-19.json"},{"revision":"64e0138b16f12b647baa03516ecaf636","url":"scriptures/es/matthew-18-15-17.json"},{"revision":"e8dab9efe554ec161bb80163aaae0800","url":"scriptures/es/matthew-22-37-39.json"},{"revision":"164975e2debf8a9c44df8efc44d58deb","url":"scriptures/es/matthew-26-31-35.json"},{"revision":"36e3f2e0b59bc10a182508b9908fc4bb","url":"scriptures/es/matthew-26-36-39.json"},{"revision":"3a775d729f22f40165b97b24f9e5767a","url":"scriptures/es/matthew-26-36-46.json"},{"revision":"0e90fec03c07051fa7943ed09970bc57","url":"scriptures/es/matthew-26-47-56.json"},{"revision":"a240b084d5c0d7896540193332139df0","url":"scriptures/es/matthew-26-57-68.json"},{"revision":"15d674d71c7482c3864e238dfa998b8f","url":"scriptures/es/matthew-26-69-75.json"},{"revision":"d0a4ebd839237c904a8f8b150a3c4888","url":"scriptures/es/matthew-27-1-10.json"},{"revision":"23f10c1da72edf27bf99bfa5cdfc9d6a","url":"scriptures/es/matthew-27-11-26.json"},{"revision":"8772f67b4f1b412b6b03167bf2d645cf","url":"scriptures/es/matthew-27-27-31.json"},{"revision":"d1896e88bd6eb84a42ca7869d748b946","url":"scriptures/es/matthew-27-32-44.json"},{"revision":"d1cf63606a73ef4a63f7f931d3c60162","url":"scriptures/es/matthew-27-45-56.json"},{"revision":"203518cae906943caeb285b6dd5404e6","url":"scriptures/es/matthew-27-46.json"},{"revision":"e9c74e9d28289241fa0ee6fdfa194620","url":"scriptures/es/matthew-27-57-61.json"},{"revision":"39def180e2cb970f55dcff6d0184e4c5","url":"scriptures/es/matthew-27-62-66.json"},{"revision":"e53c092ee7c7242a1844722160a16ec5","url":"scriptures/es/matthew-28-1-10.json"},{"revision":"b207ca203eca5f8cf198c4f2d8753bac","url":"scriptures/es/matthew-28-18-20.json"},{"revision":"dbae9239014b0c4ff5a4340b4fe9c04c","url":"scriptures/es/matthew-28-19-20.json"},{"revision":"4b7bf3dcaef1ceadb4f890f591aa6b00","url":"scriptures/es/matthew-28-19.json"},{"revision":"88ff99118fdac492953c6e1b9ade2ddc","url":"scriptures/es/matthew-28-20.json"},{"revision":"ac7d15b94f465917e34da6bf88cf00b2","url":"scriptures/es/matthew-3-1-2.json"},{"revision":"39f6bc0a22064d174be617ea2869d31a","url":"scriptures/es/matthew-3-1-6.json"},{"revision":"0a2ba2900627250f54e459a3710108ca","url":"scriptures/es/matthew-4-17.json"},{"revision":"057588f121b032ee1f766eac2a32bb0c","url":"scriptures/es/matthew-5-10-12.json"},{"revision":"4aefcc2f7acb6e96ece829192c2ca5ef","url":"scriptures/es/matthew-6-25-34.json"},{"revision":"c7c7b2c8289bd99681ae53a0e81db8a0","url":"scriptures/es/matthew-6-33.json"},{"revision":"92ed9cc1758de1bba82e85aa757e9148","url":"scriptures/es/matthew-7-13-14.json"},{"revision":"d1f8089e53eb5978dacbc33ddf48879f","url":"scriptures/es/matthew-7-7-8.json"},{"revision":"10f1fd6989560cb9df992e72d1dcfb17","url":"scriptures/es/matthew-9-2-6.json"},{"revision":"83ea0c856c23cdfaacf5db24bfc98f42","url":"scriptures/es/nehemiah-13-23-27.json"},{"revision":"ff472c36da95c04a8e68f8529c1a6702","url":"scriptures/es/numbers-27-12-18.json"},{"revision":"241f82edbc49f6fdd845e30f1e3ac6b7","url":"scriptures/es/philippians-4-13.json"},{"revision":"5388c53dcf4ef2bdbfd98d2d83899395","url":"scriptures/es/philippians-4-4-7.json"},{"revision":"6391f4dd5365de1d7d289795e1291cba","url":"scriptures/es/philippians-4-4.json"},{"revision":"131fb0f9744aca2b44b062fb1b85d2b4","url":"scriptures/es/phillipians-4-13.json"},{"revision":"a991b6b66c9a0784400f8c387559f77a","url":"scriptures/es/phillipians-4-4.json"},{"revision":"24dc406701b05499f0a4fdd9dc3ce8b8","url":"scriptures/es/proberbs-13-12.json"},{"revision":"e5cef231202d45fbd35c179e241e3e89","url":"scriptures/es/psalm-119-1-2.json"},{"revision":"a0291700a026ce7bb7759dde790d51b0","url":"scriptures/es/revelation-3-20.json"},{"revision":"7dea2ddabc66c9e997d6fba20d39d34f","url":"scriptures/es/romans-10-13.json"},{"revision":"6ee95345d62eb6ae81bd342afeafc380","url":"scriptures/es/romans-10-9.json"},{"revision":"5c9853d2997e83566f23978fdac2d3f6","url":"scriptures/es/romans-12-4-5.json"},{"revision":"5238835962d1c5a638d3efad009f5070","url":"scriptures/es/romans-3-23-25.json"},{"revision":"19d067b4d358ade6a0387fbe05097205","url":"scriptures/es/romans-3-23.json"},{"revision":"a1c3ab7ff533db4b2118af84b919d79c","url":"scriptures/es/romans-3-25.json"},{"revision":"0784df2cac0541e302d7f18e7bb90023","url":"scriptures/es/romans-6-1-4.json"},{"revision":"150017b3210380c51f5c48194d24707f","url":"scriptures/es/romans-6-2-4.json"},{"revision":"eb35c071c3adecaf61e98a6a8094695f","url":"scriptures/es/romans-6-23.json"},{"revision":"92b7690d788eff2c4966339b022a7e1b","url":"scriptures/es/romans-6-3-4.json"},{"revision":"3165dda3f03a64048b8f00f1e0f5b493","url":"sw-en.js"},{"revision":"8deb999fb971ba6303592d904954dbe1","url":"sw.js"}] || []).filter((entry) => {
    const url = typeof entry === "string" ? entry : entry.url;
    return !(/^\/?audio\//i.test(url) || /\.webm(\?.*)?$/i.test(url));
  });
  workbox.precaching.precacheAndRoute(precacheManifest.concat(routes), {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  });
  // Clean up caches created by older service workers when switching languages
  if (workbox.precaching && workbox.precaching.cleanupOutdatedCaches) {
    try {
      workbox.precaching.cleanupOutdatedCaches();
    } catch (_) {}
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

  // Runtime caching for audio files (e.g. .webm, .mp4, .mp3) - cache on first play
  workbox.routing.registerRoute(
    ({ request, url }) =>
      url.pathname.startsWith("/audio/") && request.destination === "audio",
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
