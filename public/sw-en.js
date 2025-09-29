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
  const ACTIVE_LANG = "en";

  const routes = [
    {
      url: "/",
      // Use a timestamp so the precache manifest changes when this file is rebuilt
      revision: "97fb15c",
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
        revision: "97fb15c",
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
  const precacheManifest = ([{"revision":"87d45299579b841f5cb2987308853b15","url":"css/style.css"},{"revision":"c313a1a90da0b2010235c52dbc3424d2","url":"img/en/darkness-vs-light.svg"},{"revision":"8f871ab1fb6e86951c12cb2f937a0f8d","url":"img/en/died-resurrected.svg"},{"revision":"64967b493903b7215a26c2f44dc4c536","url":"img/en/father-children.svg"},{"revision":"58216046bc6ecf15660346dc4045ef44","url":"img/en/head-body-christ-church.svg"},{"revision":"dd7696ac27db84be3b28906cc9bc7e30","url":"img/en/launch/152.png"},{"revision":"47b85cdb546263348658bb55858238e9","url":"img/en/launch/167.png"},{"revision":"d482bfc7e2544ab9328c6ede9410573d","url":"img/en/launch/180.png"},{"revision":"6825d84359b1f107ac5cf85790b75d2b","url":"img/en/launch/192-maskable.png"},{"revision":"1f52ede843dde13262bf697dca9a164e","url":"img/en/launch/192.png"},{"revision":"63346cea2b9318fbdc8307c8662ac9a9","url":"img/en/launch/512-maskable.png"},{"revision":"3921a0a845aeb600eb07762d9c7241fe","url":"img/en/launch/512.png"},{"revision":"8e811820f498f14da1805cfb1e9eb38a","url":"img/en/launch/favicon.ico"},{"revision":"8418fc68929add7d18dce86b09cc35ad","url":"img/en/sin.svg"},{"revision":"d1aa56e4ac1574c8384500a17668f631","url":"img/en/wages-vs-gift.svg"},{"revision":"2ce897ab8147211dd71cdc44036c6dc3","url":"img/en/wall.svg"},{"revision":"0fa4a8ecff65a1558798802d8497e259","url":"img/es/darkness-vs-light.svg"},{"revision":"f1185d49b5f8207254efc0828c7634ea","url":"img/es/died-resurrected.svg"},{"revision":"3988b907c16fef59afdaeb9531ddc5a6","url":"img/es/father-children.svg"},{"revision":"feed85b205ce82a5fbf42dd8beb2baba","url":"img/es/head-body-christ-church.svg"},{"revision":"d6ccc54f9427be228afec49b3004ea59","url":"img/es/launch/152.png"},{"revision":"6680911b2652140a6aaf3f3ee7ffa23c","url":"img/es/launch/167.png"},{"revision":"1e615eca319f20d5582f65c04a2a37fa","url":"img/es/launch/180.png"},{"revision":"c10c00105c2ecfc36b2b266315a113c9","url":"img/es/launch/192-maskable.png"},{"revision":"ea8c8be9465a987268b245baf10087ca","url":"img/es/launch/192.png"},{"revision":"389adb6d12517ae17efbdeec2c8be4a7","url":"img/es/launch/512-maskable.png"},{"revision":"8fad1cc0da3a642a135bd5cbb20a6e24","url":"img/es/launch/512.png"},{"revision":"aa0478a74bb2e4fe3050541c600b3a84","url":"img/es/launch/favicon.ico"},{"revision":"a7362507205e65c56c95153b6dd63a32","url":"img/es/sin.svg"},{"revision":"bf55fa413d0578e3366991ca18d7fa6f","url":"img/es/wages-vs-gift.svg"},{"revision":"db70f09ddc07ccea380051ca20abd7e8","url":"img/es/wall.svg"},{"revision":"95834edd69b67fa37ea6eb161bd333f8","url":"js/global.js"},{"revision":"fbcecc6c2728aeff771594e8cc8892c0","url":"manifests/en.json"},{"revision":"599d56d854bb6ba090c60ec184ffc0b9","url":"manifests/es.json"},{"revision":"965caadc55007f57fd2ba1369e8baa1e","url":"scriptures/en/_template.json"},{"revision":"c28119b474ba211df3c76de0db7e3eb2","url":"scriptures/en/1-corinthians-1-10-13.json"},{"revision":"b6b6ff28564ddeff0b6e8389e01281bb","url":"scriptures/en/1-corinthians-1-10-17.json"},{"revision":"1d3b27f027a5b5f89ffb5c0bebd586aa","url":"scriptures/en/1-corinthians-1-17.json"},{"revision":"940e1838522abce90994649a0017f6b6","url":"scriptures/en/1-corinthians-11-23-32.json"},{"revision":"752bc537fabcfe36d57d72a9e6c9fa8b","url":"scriptures/en/1-corinthians-12-12-13.json"},{"revision":"8391688d59b0c1a0caa0dc36b97f9c64","url":"scriptures/en/1-corinthians-12-14-27.json"},{"revision":"8bcdb290c73db38d749da32e303d9a7c","url":"scriptures/en/1-corinthians-12-21.json"},{"revision":"6d0b319eb6c4e1515ddb9e6e9d74a55c","url":"scriptures/en/1-corinthians-12-26.json"},{"revision":"74effd4ccdf15a8d660c4f4bf563e1d8","url":"scriptures/en/1-corinthians-12-28-30.json"},{"revision":"90b896b0108c589c90a584a82620a289","url":"scriptures/en/1-corinthians-12-8-10.json"},{"revision":"6496da399ca031e2ce2771efad34f831","url":"scriptures/en/1-corinthians-13-8-10.json"},{"revision":"091d5bf9f75f21ef873b0c03c57afd7c","url":"scriptures/en/1-corinthians-14-20-22.json"},{"revision":"8d3bcc286f31ce4ce5f5392f70610cdf","url":"scriptures/en/1-corinthians-3-11.json"},{"revision":"806f5a14097b73e5eb439b72e1833826","url":"scriptures/en/1-corinthians-7-39.json"},{"revision":"676bc6b049352fd85beb1ce42a5f792e","url":"scriptures/en/1-corinthians-ch-12.json"},{"revision":"7daea0106bc192e30b315e041af38f6b","url":"scriptures/en/1-corinthians-ch-14.json"},{"revision":"0f82e0769edb7cf320adee5d151e318e","url":"scriptures/en/1-john-1-9.json"},{"revision":"982be9edd24ae58f57cc93a314f9820b","url":"scriptures/en/1-kings-11-1-10.json"},{"revision":"e89e40ccdc206362ed3884a0f1037260","url":"scriptures/en/1-peter-1-21.json"},{"revision":"c3d5673790ff65758e52ced63f0d9af5","url":"scriptures/en/1-peter-2-9-10.json"},{"revision":"c91af4e16826f1923b4aa266c107ac2b","url":"scriptures/en/1-peter-3-1-7.json"},{"revision":"6149e0417d979e201c549c1f4f138325","url":"scriptures/en/1-peter-3-21.json"},{"revision":"3f4aa991a01efbca8ca0d8176159e0bf","url":"scriptures/en/1-peter-4-12-16.json"},{"revision":"b8449461712195e8272cf6085d55bec5","url":"scriptures/en/1-peter-4-3-4.json"},{"revision":"989fbbc98632c02b0f00c701bc30bb4c","url":"scriptures/en/1-thessalonians-5-12-14.json"},{"revision":"587859708fcf893dc7de02983ef916d1","url":"scriptures/en/1-timothy-2-3-4.json"},{"revision":"5d71c41f454b79d74f6a5bd57b6b7df7","url":"scriptures/en/1-timothy-4-16.json"},{"revision":"7f2235244326935e12e7971c1483095d","url":"scriptures/en/2-corinthians-6-14-18.json"},{"revision":"e7e91c638f250d0b805e0a57a90fe36b","url":"scriptures/en/2-corinthians-9-6-11.json"},{"revision":"74178ea23f183d43f4f0524967b3d3b5","url":"scriptures/en/2-corinthians-9-6-8.json"},{"revision":"745da6425e1a3ecd6694db9af795592c","url":"scriptures/en/2-peter-1-20-21.json"},{"revision":"f5ced75d83897184ddf46bbf6ada3ca2","url":"scriptures/en/2-thessalonians-2-9-12.json"},{"revision":"56e39f7daf3d6f97c097c08df91ed448","url":"scriptures/en/2-timothy-3-1-5.json"},{"revision":"b423ec3f54d3799e1a604973bd739a48","url":"scriptures/en/2-timothy-3-12.json"},{"revision":"d7d3ae17463f9e794c16139d5645eb6e","url":"scriptures/en/2-timothy-3-16-17.json"},{"revision":"ffab3997b06847d6df43121cb3087f1e","url":"scriptures/en/acts-1-12-14.json"},{"revision":"8c19690abc8f84083bb5d03cc5c2b64f","url":"scriptures/en/acts-1-18-19.json"},{"revision":"db3aa2ddcad7d4d9eec2ff767ac08575","url":"scriptures/en/acts-1-4-5.json"},{"revision":"6abf0b7d8706b0cd1065157fc0ad00e2","url":"scriptures/en/acts-1-8.json"},{"revision":"47ca5607f52f26e7d73f1f3ce541a283","url":"scriptures/en/acts-10-44.json"},{"revision":"0ea234b3fe6f3e157fd19823bc06c3ad","url":"scriptures/en/acts-10-48.json"},{"revision":"45de836cdffacd305bacc4aa61d9b724","url":"scriptures/en/acts-11-1-18.json"},{"revision":"64d21013669bc5a44cd54a7d3680d9da","url":"scriptures/en/acts-11-14.json"},{"revision":"89f8eb80fff88b2b92e0ce846002f543","url":"scriptures/en/acts-11-15.json"},{"revision":"fdd6e239ebb4b9cbd0abd8c8d052c2bd","url":"scriptures/en/acts-11-19-26.json"},{"revision":"eca0965d3033fef2799bc7d10e19f745","url":"scriptures/en/acts-11-21.json"},{"revision":"18c9d44240169f7864ab06f05497d40d","url":"scriptures/en/acts-11-25-26.json"},{"revision":"26e837cdbfbf590aa747881f2358fb10","url":"scriptures/en/acts-12-24.json"},{"revision":"30e9f105d680493359cc38fd39d03ac9","url":"scriptures/en/acts-13-3.json"},{"revision":"70e2cf011e649e9006f39b34350491e1","url":"scriptures/en/acts-13-49.json"},{"revision":"0133b36855cc3ea82c7cc93978302ac5","url":"scriptures/en/acts-14-1.json"},{"revision":"686350d08cf27eaf618ffb415ab69b1c","url":"scriptures/en/acts-14-21.json"},{"revision":"10b300d363f37d06ad2da503bd57a2f1","url":"scriptures/en/acts-16-22-34.json"},{"revision":"0530efea2e2674ef37fd0e69edf8f822","url":"scriptures/en/acts-16-5.json"},{"revision":"c935c46a1b9ba3bf991c292cc41e823c","url":"scriptures/en/acts-17-10-12.json"},{"revision":"f710afa7da7a1f8ffe4f3db3bcbddaa6","url":"scriptures/en/acts-17-26-28.json"},{"revision":"6448b8cc66b8c825cab651ab860bf1d6","url":"scriptures/en/acts-17-4.json"},{"revision":"82c1eceba533fe6977da331dc2e52446","url":"scriptures/en/acts-17-6-rsv.json"},{"revision":"0f003b7dfa2efd3ef15c6a0eadf2c432","url":"scriptures/en/acts-18-24-26.json"},{"revision":"2902084faf3c5308a9ccd86d9d53edf4","url":"scriptures/en/acts-19-1-5.json"},{"revision":"86a15db46176d5e9cd06d5eab8ea760d","url":"scriptures/en/acts-19-1-6.json"},{"revision":"e93a107e15e693ab204f7f38000f04cb","url":"scriptures/en/acts-19-5.json"},{"revision":"0e612abe14ae4d3660b0a45ad33981ef","url":"scriptures/en/acts-19-6.json"},{"revision":"ee3cf9285a1bd28d618f269c666fad9c","url":"scriptures/en/acts-2-1-4.json"},{"revision":"667b7716f6d0e1904bf6d024739ff672","url":"scriptures/en/acts-2-14.json"},{"revision":"ab4ac586d064694e79d3a26671fe5869","url":"scriptures/en/acts-2-17.json"},{"revision":"083a89c96bd79d757a67580ba48b3f16","url":"scriptures/en/acts-2-22-24.json"},{"revision":"85e873fd0be558931480258fac36e59e","url":"scriptures/en/acts-2-22.json"},{"revision":"ab0f315017ad7ab3abc2003e40ea8338","url":"scriptures/en/acts-2-23.json"},{"revision":"dbb4b021f5cbc9f61a3f949f54b38bd5","url":"scriptures/en/acts-2-24.json"},{"revision":"8bd72195ef87a1ae84e43ef879f0c7a2","url":"scriptures/en/acts-2-36-37.json"},{"revision":"d58b18cc205b58ab79ac208a0af8a5d3","url":"scriptures/en/acts-2-36-47.json"},{"revision":"4fbc248075e5249a74fe27f7067e5074","url":"scriptures/en/acts-2-37-38.json"},{"revision":"4275cf9913cdc730205ab012b4d47cd9","url":"scriptures/en/acts-2-37-42.json"},{"revision":"67575a8d5661411e2a7dc3a1be8a43d2","url":"scriptures/en/acts-2-38-42.json"},{"revision":"63aef12280b70363cd114fba3b7413d5","url":"scriptures/en/acts-2-38.json"},{"revision":"591f8abeed83b8886d5b0699d64047b0","url":"scriptures/en/acts-2-41.json"},{"revision":"59570d2c4499181141f5fbf68710cf23","url":"scriptures/en/acts-2-42.json"},{"revision":"071838f40dc8888d757fcbb7ef653ea7","url":"scriptures/en/acts-2-47.json"},{"revision":"a7e12307a32439f4a8ee04cb1b58e953","url":"scriptures/en/acts-2-5.json"},{"revision":"bfeb378405cc56a7a68c548b12333e62","url":"scriptures/en/acts-22-16.json"},{"revision":"04fcc61339c96c66c2942e1fe1517bea","url":"scriptures/en/acts-22-3-16.json"},{"revision":"feb75e50566e3341d120385bb2d14198","url":"scriptures/en/acts-28-21-22.json"},{"revision":"82e0c7745434a746de9ed9d5cb0c905c","url":"scriptures/en/acts-28-22.json"},{"revision":"36b356ba9b44260b48990526806c20c4","url":"scriptures/en/acts-28-30.json"},{"revision":"fae645d2276f8ef7b4b1bd3e2a5522ff","url":"scriptures/en/acts-28-5.json"},{"revision":"fdeb104b19c196e8283f892ae60c664c","url":"scriptures/en/acts-28-8.json"},{"revision":"5fdd579b4650ae103be91d6944091e52","url":"scriptures/en/acts-4-12.json"},{"revision":"305917e8f3ed691d45aca88ec38917a1","url":"scriptures/en/acts-4-4.json"},{"revision":"6485f4bc211df724da74317333236065","url":"scriptures/en/acts-5-14.json"},{"revision":"ec066adecb2dc6eb30174523dcd97af1","url":"scriptures/en/acts-5-17-18.json"},{"revision":"3a63ee6dff80c6098b0df9f7730198dc","url":"scriptures/en/acts-5-38-42.json"},{"revision":"678659c689469cf621cf31f6afea8f5c","url":"scriptures/en/acts-6-1-8.json"},{"revision":"02ebdde8e03ce033b48a63bd3c8de76f","url":"scriptures/en/acts-6-1.json"},{"revision":"6ceeda7ed7d5c6406590742050f98cba","url":"scriptures/en/acts-6-7.json"},{"revision":"d95970233ad07982c2db70854f81ce22","url":"scriptures/en/acts-6-8.json"},{"revision":"fae51abbaf3274e6cfecd123a2ec5d5d","url":"scriptures/en/acts-8-1-25.json"},{"revision":"7d4af1a7a874d555fa27bd995579f9f9","url":"scriptures/en/acts-8-12.json"},{"revision":"1a1a40de42cccf13884cdb17a171779e","url":"scriptures/en/acts-8-13.json"},{"revision":"cb4dfd60dae6099d8c2c0ef67e9af00d","url":"scriptures/en/acts-8-18.json"},{"revision":"6cd576ba4186426b3e44414def0d4bee","url":"scriptures/en/acts-8-26-39.json"},{"revision":"3266bbd536650342165e1b0267f9fedd","url":"scriptures/en/acts-8-4.json"},{"revision":"50038c016d16c175e31619c74bdf2a99","url":"scriptures/en/acts-9-1-22.json"},{"revision":"64e8866ba5a4760392549d91b15124d5","url":"scriptures/en/acts-9-17-18.json"},{"revision":"82c556accce2beaf451abe2ba88e6d6a","url":"scriptures/en/acts-9-18-25.json"},{"revision":"601b84d90a80ea5d04aadbb2eb7539f0","url":"scriptures/en/acts-9-31.json"},{"revision":"0e905bd9b93a6177cb80020b02e9ca7b","url":"scriptures/en/acts-ch-1-ch-2.json"},{"revision":"35ee4f8c8472af06e6dc1245f198de1c","url":"scriptures/en/acts-ch-10.json"},{"revision":"1fc64ea439532e1a7ce2971b40bb1107","url":"scriptures/en/acts-ch-2.json"},{"revision":"7c524130f9d3283226728b51049d2221","url":"scriptures/en/colossians-1-15-18.json"},{"revision":"e04ad28177f5ff819a05b9ed6fcecc8f","url":"scriptures/en/colossians-1-23.json"},{"revision":"54a8f94849bdfc7b6e4d1ce9f6f95d10","url":"scriptures/en/colossians-1-28-29.json"},{"revision":"a9a3ca3035cc1c4e44c3bec681a45d09","url":"scriptures/en/colossians-1-6.json"},{"revision":"5334a105f37bb07c4a2b53847f73dbc1","url":"scriptures/en/colossians-2-11-12.json"},{"revision":"b9b78e0a1e2a61e6c203c7ba102706c0","url":"scriptures/en/colossians-2-12.json"},{"revision":"81f1130a6f07a71d6e516939abf6074a","url":"scriptures/en/colossians-3-1-4.json"},{"revision":"833eada33b907f17c3b868b4a89e20cd","url":"scriptures/en/colossians-3-12-14.json"},{"revision":"e2f22c02539fd4237b5a3737ebada71c","url":"scriptures/en/colossians-3-15-16.json"},{"revision":"b85511fd83dc38737210430f81e7b54f","url":"scriptures/en/colossians-3-15.json"},{"revision":"f8228811b204832c78e38980a2f47eb1","url":"scriptures/en/colossians-3-17.json"},{"revision":"30898b11b21f07d12e2177b0348e5acc","url":"scriptures/en/colossians-3-18-21.json"},{"revision":"f273a09de26a76050b4a94fc0764e577","url":"scriptures/en/colossians-3-22.json"},{"revision":"0a6aff43ee3ba5f00229211cb7bf36b1","url":"scriptures/en/colossians-3-5-11.json"},{"revision":"a28dc57c42346e110b48f321aacd17db","url":"scriptures/en/colossians-4-1.json"},{"revision":"a78c76ce9bf61446a084f798753162f6","url":"scriptures/en/colossians-ch-3-15-ch-4-1.json"},{"revision":"5e6d92eca21af7e14ff5c9b612307d97","url":"scriptures/en/daniel-2-31-45.json"},{"revision":"54c2fcd83399417e4ea6cc28cf9a06aa","url":"scriptures/en/daniel-2-44.json"},{"revision":"9a914fdb75d00122f52f97f2bcb48989","url":"scriptures/en/ephesians-2-19-21.json"},{"revision":"8cf767541a934a11d62079a9d4392782","url":"scriptures/en/ephesians-2-8.json"},{"revision":"33e783bc7c3018ac7876a1317f2777a9","url":"scriptures/en/ephesians-3-20.json"},{"revision":"a250629a1cbd44c282662afc1b172a64","url":"scriptures/en/ephesians-4-4-6.json"},{"revision":"7827145c700a9912fc6fce0a15ed513e","url":"scriptures/en/ephesians-5-18-19.json"},{"revision":"940122b6779fdec63782b38bed746853","url":"scriptures/en/ephesians-5-19-20.json"},{"revision":"76354d44022d4d25ab11b0965a38c2c0","url":"scriptures/en/ephesians-6-10-18.json"},{"revision":"4e7ab2299e35935b46d84f6813ef1e22","url":"scriptures/en/ezekiel-18-20.json"},{"revision":"11798ea27b1ad5062677cb7c7ef0b86d","url":"scriptures/en/galatians-1-8.json"},{"revision":"aca0898cf5d6426d0a346e90eca6ae65","url":"scriptures/en/galatians-5-19-21.json"},{"revision":"1eaf9128f20bb21b4ab38032ccb74fc8","url":"scriptures/en/galatians-6-1-2.json"},{"revision":"2cc84201474ffc8727b538db1a89d5b2","url":"scriptures/en/genesis-2-19.json"},{"revision":"7565dbb2d1c2ed2640b3e1b7af4827df","url":"scriptures/en/hebrews-10-23-25.json"},{"revision":"75cdc9d26a64521471b57144f27e2275","url":"scriptures/en/hebrews-10-23.json"},{"revision":"0944bcf67cc0f8c52b8261794d53dff6","url":"scriptures/en/hebrews-10-24.json"},{"revision":"62e3246aff2c245f8baccd2acf75b866","url":"scriptures/en/hebrews-12-14-15.json"},{"revision":"9e171f5beb5e3bf43308ef400644526f","url":"scriptures/en/hebrews-12-15.json"},{"revision":"90b207136e5c24f2a0f5e21d721c0bfe","url":"scriptures/en/hebrews-13-17.json"},{"revision":"33cd6821c436da43df536ee285087db5","url":"scriptures/en/hebrews-3-12-14.json"},{"revision":"370cea30d544c427f8ef85b9b06d5ee0","url":"scriptures/en/hebrews-4-12-13.json"},{"revision":"239d2392217af70f9f02df41c5394ed7","url":"scriptures/en/hebrews-5-11-14.json"},{"revision":"23ebe70bc889bf65ea29fea62c1a9785","url":"scriptures/en/hebrews-6-1-3.json"},{"revision":"b4011495864e5dd2bad3991092052c45","url":"scriptures/en/hebrews-ch-5-11-ch-6-6.json"},{"revision":"80a845d5f0893d77c046fe9108714baa","url":"scriptures/en/isaiah-2-1-4.json"},{"revision":"87a9f5005bc2c5cb9d7f106ae3868418","url":"scriptures/en/isaiah-2-2.json"},{"revision":"bc4c8ac736e714d5e802d398e69594b7","url":"scriptures/en/isaiah-2-3.json"},{"revision":"cc336c90d96f7f4f413b46f4e8eaf33e","url":"scriptures/en/isaiah-53-4-6.json"},{"revision":"91e4c4677f2cc4b23454a0f80654eed1","url":"scriptures/en/isaiah-59-1-2.json"},{"revision":"c6fab68014bfa5a50c2c9f7534711cd9","url":"scriptures/en/james-1-22-25.json"},{"revision":"8a5f2f9ceb7286b3dcb0f72dc26fd3da","url":"scriptures/en/james-4-17.json"},{"revision":"e09d1f3d7827635fcd38823666e1a640","url":"scriptures/en/james-5-16-18.json"},{"revision":"f5ea151bb505fd6d7481cea3a3386a14","url":"scriptures/en/james-5-16.json"},{"revision":"fcc2db20253d82b108d0b410e5f93155","url":"scriptures/en/jeremiah-29-11-14.json"},{"revision":"0e8450f302efa07cc91a54fa3fdc3e6a","url":"scriptures/en/jeremiah-29-11.json"},{"revision":"bdcade7c553aeb0e9032abda4b8a9706","url":"scriptures/en/john-10-19-21.json"},{"revision":"58db56e9104ff8f825da668fdd4a29be","url":"scriptures/en/john-12-48.json"},{"revision":"80281b8b88f923fead0be997fab8ec27","url":"scriptures/en/john-13-34-35.json"},{"revision":"b239528844660e884a3cf5c09724c77d","url":"scriptures/en/john-15-1-16.json"},{"revision":"619e8f2f647a146ead2d0717d92d680a","url":"scriptures/en/john-15-16.json"},{"revision":"baca769520d9361eda5e2dfe60c0980e","url":"scriptures/en/john-15-18-20.json"},{"revision":"39b4206451a1f361c32af5bcc904cc1c","url":"scriptures/en/john-15-8.json"},{"revision":"e853e244dc455f08bc41c9445626201b","url":"scriptures/en/john-15-9-10.json"},{"revision":"ab2283c9025903c8fd2869e46ffe2f4a","url":"scriptures/en/john-16-1-4.json"},{"revision":"cde5de865b52a44b4468ef681869cb50","url":"scriptures/en/john-17-20-23.json"},{"revision":"115d56aa0f2a156aeb743a946bcb1b23","url":"scriptures/en/john-20-30-31.json"},{"revision":"ac6dc5e4fe9e6ead9ad443b893ab0111","url":"scriptures/en/john-3-1-7.json"},{"revision":"3fad57ad4d08da768ff72d3367e6ecf9","url":"scriptures/en/john-3-3.json"},{"revision":"d6f5c1c7ee83548fb064bc4c66a0c03f","url":"scriptures/en/john-3-34-36.json"},{"revision":"1c37e039ca2ee4def3b5bcb90bc7c232","url":"scriptures/en/john-3-34.json"},{"revision":"c70fc8eb52f505568b671023094d90c0","url":"scriptures/en/john-3-5.json"},{"revision":"fd2c2edb1bf1e8510c007222287170e7","url":"scriptures/en/john-3-7.json"},{"revision":"f6a087b833be6c6652fd3fd0b094c633","url":"scriptures/en/john-4-23-24.json"},{"revision":"318755b95e67e879c1fb743e077e02e1","url":"scriptures/en/john-7-12-13.json"},{"revision":"a5634385801eb8527667ad8e3ac2a930","url":"scriptures/en/john-8-31-32.json"},{"revision":"1ba505249ab5ac65008350720e889b70","url":"scriptures/en/luke-11-1-4.json"},{"revision":"740eb61f40bafdce87c9b6e6de0b4247","url":"scriptures/en/luke-12-51-53.json"},{"revision":"76486fa471eb377e45af2aa108ada13b","url":"scriptures/en/luke-14-25-33.json"},{"revision":"384187c384ea907e88ea2a09e56e13b8","url":"scriptures/en/luke-17-20-21.json"},{"revision":"7921a86638d98ced929c1686a821a467","url":"scriptures/en/luke-19-10.json"},{"revision":"929c13a5a6c067efa9d6397cba5dc0ce","url":"scriptures/en/luke-23-1-3.json"},{"revision":"92488d4962570c7f270c4d9a26e53074","url":"scriptures/en/luke-23-50-51.json"},{"revision":"56e2a88d8a2801e7fe243718ed843f7b","url":"scriptures/en/luke-24-44-49.json"},{"revision":"2f178d75395845fc935d5b9ad117c91b","url":"scriptures/en/luke-24-47.json"},{"revision":"11eef98ebe89dbc9b863841e65b71727","url":"scriptures/en/luke-9-1.json"},{"revision":"0fc6cd3a5aff506691e0b775a6bc7810","url":"scriptures/en/luke-9-23-26.json"},{"revision":"d2c3f85eb4a2f6975337946ade3d4198","url":"scriptures/en/malachi-3-6-12.json"},{"revision":"6152e782fa6dd8784f1b431f3e8aac63","url":"scriptures/en/mark-1-14-18.json"},{"revision":"db1ef6efa3e926c24bc98800ded5430c","url":"scriptures/en/mark-1-17.json"},{"revision":"0bd32f91123a39906c5e8ef434955b96","url":"scriptures/en/mark-16-16-18.json"},{"revision":"e1356ee49c982b630662495f8a1d1ebf","url":"scriptures/en/mark-3-20-21.json"},{"revision":"b4db70ea4b6992b5402c83fb84cd2367","url":"scriptures/en/mark-3-31-35.json"},{"revision":"e92904ebcdb5b73756c4455f1752e735","url":"scriptures/en/mark-9-1.json"},{"revision":"2362916e6c2a8893bd0efaa43b27526f","url":"scriptures/en/matthew-15-1-9.json"},{"revision":"c867eefb962b8b41fdca3be75e406e6d","url":"scriptures/en/matthew-15-6-9.json"},{"revision":"dfce597ade33ceb90c021a242554c865","url":"scriptures/en/matthew-16-13-19.json"},{"revision":"7ac1cd1c387a22af043992b15a7ca81e","url":"scriptures/en/matthew-16-19.json"},{"revision":"3e1b7e6567aecd01a9ce8c18998aec26","url":"scriptures/en/matthew-18-15-17.json"},{"revision":"0fb6e1289368109ea5eff1a55bc007e4","url":"scriptures/en/matthew-22-37-39.json"},{"revision":"4f850f3353ecc82419e3679d0994aa29","url":"scriptures/en/matthew-26-31-35.json"},{"revision":"fb90969d36953fd3a929a3cd47ddc1f3","url":"scriptures/en/matthew-26-36-39.json"},{"revision":"967053fcd23342d85f09ef08e5bca4ef","url":"scriptures/en/matthew-26-36-46.json"},{"revision":"d34c9789bdbf01dc6ccc0456d426484c","url":"scriptures/en/matthew-26-47-56.json"},{"revision":"1b02cec7d64f0da8eb655bf0efa4618f","url":"scriptures/en/matthew-26-57-68.json"},{"revision":"02fc0db1e3f1856a04952fc71abdc558","url":"scriptures/en/matthew-26-69-75.json"},{"revision":"02adf5d0d2805e1470f1bd91232bed8b","url":"scriptures/en/matthew-27-1-10.json"},{"revision":"0816740676c7f93047e09dd6e8311d72","url":"scriptures/en/matthew-27-11-26.json"},{"revision":"04c39ee2d266da5e3f10ff68b0a63f27","url":"scriptures/en/matthew-27-27-31.json"},{"revision":"51249cef9417898a1bad48ce72884728","url":"scriptures/en/matthew-27-32-44.json"},{"revision":"c1838fb7b771b34bed835697a4301631","url":"scriptures/en/matthew-27-45-56.json"},{"revision":"8e6580143413a64afaac3c50341934cd","url":"scriptures/en/matthew-27-46.json"},{"revision":"ee68771827b45c9b5238e4345368d264","url":"scriptures/en/matthew-27-57-61.json"},{"revision":"231f41c11a6fbdba6801ca44e91ad6a9","url":"scriptures/en/matthew-27-62-66.json"},{"revision":"71482b6150f8cff63937ef2ae5139edb","url":"scriptures/en/matthew-28-1-10.json"},{"revision":"cfcbb1f9575b0598705182debef08b72","url":"scriptures/en/matthew-28-18-20.json"},{"revision":"8f822f1ef65ee3760793147f59aba3c1","url":"scriptures/en/matthew-28-19-20.json"},{"revision":"04dcb7c23acc8f0617e266c9564e75ce","url":"scriptures/en/matthew-28-19.json"},{"revision":"eaedc7f311ec84610ad743b16c585f24","url":"scriptures/en/matthew-28-20.json"},{"revision":"69f37d58e52739a1ebf5a85d20ddebfd","url":"scriptures/en/matthew-3-1-2.json"},{"revision":"932f42a74dba8acf463c229a23033ea9","url":"scriptures/en/matthew-3-1-6.json"},{"revision":"8443c8852b0c35082a529c8e9448f4d2","url":"scriptures/en/matthew-4-17.json"},{"revision":"6acb6d90ebeb4b8bdfd79a2d1be998e2","url":"scriptures/en/matthew-5-10-12.json"},{"revision":"742ac8643670e7bed43fe93df49a0ef4","url":"scriptures/en/matthew-6-25-34.json"},{"revision":"efce09dbae54905bf56a64dd9c91ea7e","url":"scriptures/en/matthew-6-33.json"},{"revision":"75af7df11168d3b3050ea7b03ecea3bd","url":"scriptures/en/matthew-7-13-14.json"},{"revision":"5cf716a7bb1f1c35e0d29afaa850943b","url":"scriptures/en/matthew-7-7-8.json"},{"revision":"c86f30292a7ab2b9e5d51fec0971fd3a","url":"scriptures/en/matthew-9-2-6.json"},{"revision":"a6e51da0c023f2d58610e1ecbc848db5","url":"scriptures/en/nehemiah-13-23-27.json"},{"revision":"85b07e046d70e0df7227c3d2ebb8a833","url":"scriptures/en/numbers-27-12-18.json"},{"revision":"5a6377f413be31321ce21d04e08b2523","url":"scriptures/en/philippians-4-13.json"},{"revision":"b198e1def376b85d3227f0f26bf684a8","url":"scriptures/en/philippians-4-4-7.json"},{"revision":"5ec234d3c6326ee3b9184370efd7ca74","url":"scriptures/en/philippians-4-4.json"},{"revision":"bb2cfa1be73a97f44d0f1bd671ac736d","url":"scriptures/en/phillipians-4-13.json"},{"revision":"f7d859358f69099bb90a666c5773b0be","url":"scriptures/en/phillipians-4-4.json"},{"revision":"c5320447f3872b23641ac5a863844905","url":"scriptures/en/proberbs-13-12.json"},{"revision":"8c270a33d976be70175d1c7e682b4149","url":"scriptures/en/psalm-119-1-2.json"},{"revision":"e5220800c93cb06d5c69335678cc586f","url":"scriptures/en/revelation-3-20.json"},{"revision":"b2d1dba6e1838db6359f60a85037fe86","url":"scriptures/en/romans-10-13.json"},{"revision":"05c2f287837c5f90cde8fcfd271ff415","url":"scriptures/en/romans-10-9.json"},{"revision":"1c27289b046480d696bf8cd718d49d61","url":"scriptures/en/romans-12-4-5.json"},{"revision":"5eb1bc5179fc818d86665873dcc7189f","url":"scriptures/en/romans-3-23-25.json"},{"revision":"f61c82939dbbf68853cc00952c56fe9f","url":"scriptures/en/romans-3-23.json"},{"revision":"b4d5c6bf00f7a9db384800f3a411bc23","url":"scriptures/en/romans-3-25.json"},{"revision":"49b56891c01d835c2965abe599f15f1b","url":"scriptures/en/romans-6-1-4.json"},{"revision":"b452a512e919db87a5a485a91e062d75","url":"scriptures/en/romans-6-2-4.json"},{"revision":"aa6a5a5df94b89a3b54d179ca6652225","url":"scriptures/en/romans-6-23.json"},{"revision":"b79a6fdce35b8891c32b50873ce4d954","url":"scriptures/en/romans-6-3-4.json"},{"revision":"43baf9ccdd82c4d6d427e182acbddbf4","url":"scriptures/es/_template.json"},{"revision":"df8dde4f8c39d5e457badc8cd8974e60","url":"scriptures/es/1-corinthians-1-10-13.json"},{"revision":"d8408495e5426c9660da5477a92c77c5","url":"scriptures/es/1-corinthians-1-10-17.json"},{"revision":"ec8aeea84d9bd771973c2a5bc5a83cbf","url":"scriptures/es/1-corinthians-1-17.json"},{"revision":"7f5712076e35808c96926491fb82fd15","url":"scriptures/es/1-corinthians-11-23-32.json"},{"revision":"0ab754dc55d8b29621d7e89790173bcf","url":"scriptures/es/1-corinthians-12-12-13.json"},{"revision":"62fafe6ef822363456c146f86a5ab457","url":"scriptures/es/1-corinthians-12-14-27.json"},{"revision":"671daaee13603ebfb296ed775d00d358","url":"scriptures/es/1-corinthians-12-21.json"},{"revision":"c67c6d794f2394e1e683d3bc483e3b0f","url":"scriptures/es/1-corinthians-12-26.json"},{"revision":"092a84ec59bcf4a61a2baaa2075f1aa6","url":"scriptures/es/1-corinthians-12-28-30.json"},{"revision":"865841ac8506c848e29abba31179c1b4","url":"scriptures/es/1-corinthians-12-8-10.json"},{"revision":"50bceaf5cae81d30bc1e4a61efafe878","url":"scriptures/es/1-corinthians-13-8-10.json"},{"revision":"a33fce968f5c4f94726cf8b2c46bca44","url":"scriptures/es/1-corinthians-14-20-22.json"},{"revision":"a6363250bda56ff851a408dda149fe37","url":"scriptures/es/1-corinthians-3-11.json"},{"revision":"93d6c8dc6a7e43dfa94be2b880c5eb43","url":"scriptures/es/1-corinthians-7-39.json"},{"revision":"d9740ca299be51d3690896770fab0720","url":"scriptures/es/1-corinthians-ch-12.json"},{"revision":"51dd0e3fe1f32daf40d9bb0c793239a2","url":"scriptures/es/1-corinthians-ch-14.json"},{"revision":"24e7755f4e83deb5544c03e410958b19","url":"scriptures/es/1-john-1-9.json"},{"revision":"96d49981b61f910a9584a0f57479c573","url":"scriptures/es/1-kings-11-1-10.json"},{"revision":"16a1c9fb67446483f5e0617ea5b3372e","url":"scriptures/es/1-peter-1-21.json"},{"revision":"ef340e17c65f15de60d7dc9de58814ca","url":"scriptures/es/1-peter-2-9-10.json"},{"revision":"5821439917b6d439ee05fe84ac3276b9","url":"scriptures/es/1-peter-3-1-7.json"},{"revision":"a017369d7233b5989165eefe893af360","url":"scriptures/es/1-peter-3-21.json"},{"revision":"9eec2d44aacd1cdb53b35699421065cd","url":"scriptures/es/1-peter-4-12-16.json"},{"revision":"79a81e220eb70fd2530563e048099134","url":"scriptures/es/1-peter-4-3-4.json"},{"revision":"a3f8fffa7594717b7a198d6fca232e69","url":"scriptures/es/1-thessalonians-5-12-14.json"},{"revision":"87caf064772ef84dbf32f9b5a12ba78a","url":"scriptures/es/1-timothy-2-3-4.json"},{"revision":"ef0a991dee26d656bfe34218ed99517a","url":"scriptures/es/1-timothy-4-16.json"},{"revision":"2de25bf91f9e9262342dfa9421776034","url":"scriptures/es/2-corinthians-6-14-18.json"},{"revision":"c175ccc26c8e09523fed24f8011506a9","url":"scriptures/es/2-corinthians-9-6-11.json"},{"revision":"1664956ac75800377d4828654ab9e8aa","url":"scriptures/es/2-corinthians-9-6-8.json"},{"revision":"06f59099f80340db2785ed663f717cec","url":"scriptures/es/2-peter-1-20-21.json"},{"revision":"40e20c8e5169abbd0956698b43eb1c06","url":"scriptures/es/2-thessalonians-2-9-12.json"},{"revision":"63a41f71a84d645928722a28364e2c8b","url":"scriptures/es/2-timothy-3-1-5.json"},{"revision":"59d0cbc5ea29c574062b2b3c1f1a1315","url":"scriptures/es/2-timothy-3-12.json"},{"revision":"bdc148dfc76424d0061725ecc3b0d56a","url":"scriptures/es/2-timothy-3-16-17.json"},{"revision":"1cc66e1229a0e8f14c8472f0d11fa032","url":"scriptures/es/acts-1-12-14.json"},{"revision":"8ae1c185899812ff5173fedb3e4f6805","url":"scriptures/es/acts-1-18-19.json"},{"revision":"1306786aa0b5b534b88acd8441960163","url":"scriptures/es/acts-1-4-5.json"},{"revision":"ac179547eabc4cff1cf8863b110f65a7","url":"scriptures/es/acts-1-8.json"},{"revision":"80c7616ce3e4dc1a7438bdc10d2cb67e","url":"scriptures/es/acts-10-44.json"},{"revision":"2489aad58363cba2f083d5704fa21bf2","url":"scriptures/es/acts-10-48.json"},{"revision":"86a3c8a9cf3c9913dfa7cf594316f667","url":"scriptures/es/acts-11-1-18.json"},{"revision":"88cd89a47819628b4ee4aadc68cbadb1","url":"scriptures/es/acts-11-14.json"},{"revision":"cb199890ffdedbcccde2f628ffeb7230","url":"scriptures/es/acts-11-15.json"},{"revision":"310034b06ff3d2f83ead20e16a4b4239","url":"scriptures/es/acts-11-19-26.json"},{"revision":"ff4fce8567dbfe51f5dfca162fd1bae8","url":"scriptures/es/acts-11-21.json"},{"revision":"2bbd226a58bd2ca4987b3475a2676d07","url":"scriptures/es/acts-11-25-26.json"},{"revision":"a0cd8754312f884c2791ce3977a929a5","url":"scriptures/es/acts-12-24.json"},{"revision":"b171a0152e23778697e5fef0ef6f73a2","url":"scriptures/es/acts-13-3.json"},{"revision":"66eb467a1c014e65cace0dfd968ab6bd","url":"scriptures/es/acts-13-49.json"},{"revision":"6f84146981a1825bc4ecac4c07fa2046","url":"scriptures/es/acts-14-1.json"},{"revision":"696f593c33dae3d29849c42e5a297443","url":"scriptures/es/acts-14-21.json"},{"revision":"f031d00ff47393eb01e20ea4404d7af5","url":"scriptures/es/acts-16-22-34.json"},{"revision":"7af1f38b780beba5cbf58cd675805cb6","url":"scriptures/es/acts-16-5.json"},{"revision":"457b6a64bf2fae455e6bf432c90bfaa8","url":"scriptures/es/acts-17-10-12.json"},{"revision":"e0ba8728611fdc0bb26d2a6ac6c292f5","url":"scriptures/es/acts-17-26-28.json"},{"revision":"fbf066f5b4748cc4d91aaa6ad395da73","url":"scriptures/es/acts-17-4.json"},{"revision":"e52a9538f2b7402bd9cc89f16269c68b","url":"scriptures/es/acts-17-6-rsv.json"},{"revision":"22f35c4265fc02853b4b613e3f19ef1f","url":"scriptures/es/acts-18-24-26.json"},{"revision":"c9ca3937e42a546d5b0ea24a0dc26351","url":"scriptures/es/acts-19-1-5.json"},{"revision":"a5e253bf56504d2128351a9119593c7a","url":"scriptures/es/acts-19-1-6.json"},{"revision":"6fffbecdecb39c3d15e3d038548ea985","url":"scriptures/es/acts-19-5.json"},{"revision":"53698e28b433753b9e35b43fc6c85a62","url":"scriptures/es/acts-19-6.json"},{"revision":"5ced1f4a2c032ee64c4f1e2919f9034b","url":"scriptures/es/acts-2-1-4.json"},{"revision":"ce5d1caac67bc60e3fefd41681bfaf3d","url":"scriptures/es/acts-2-14.json"},{"revision":"bad4ad48d19194d19012e5b34979772e","url":"scriptures/es/acts-2-17.json"},{"revision":"1763568e876dd1068fef89acb31a2f33","url":"scriptures/es/acts-2-22-24.json"},{"revision":"fa0cb3e23e9bd75802003c66dcee8bc7","url":"scriptures/es/acts-2-22.json"},{"revision":"e057245ebfb41c56a688873bf51cbc51","url":"scriptures/es/acts-2-23.json"},{"revision":"8e6742d02590f954e414c5eec44fa4bb","url":"scriptures/es/acts-2-24.json"},{"revision":"a86537028a3ab0390c877bda314d3865","url":"scriptures/es/acts-2-36-37.json"},{"revision":"ce953ff5e1094a03970584a1e609f964","url":"scriptures/es/acts-2-36-47.json"},{"revision":"5a96832d58e1bc874509c95a0a0a037f","url":"scriptures/es/acts-2-37-38.json"},{"revision":"fb34e7f4b22631dcaf0250b028bb273d","url":"scriptures/es/acts-2-37-42.json"},{"revision":"5eda5c328704faf084aba325cc2207aa","url":"scriptures/es/acts-2-38-42.json"},{"revision":"e2c1e6dfdfe81e10f6337083526e2bb5","url":"scriptures/es/acts-2-38.json"},{"revision":"b25bd0a127bdd4eb48c95ec7cb8c426b","url":"scriptures/es/acts-2-41.json"},{"revision":"fe21337b38a2c0ef3f171c0c7752d35d","url":"scriptures/es/acts-2-42.json"},{"revision":"60fa03f88f9fb6446d3f2fc4b85a729c","url":"scriptures/es/acts-2-47.json"},{"revision":"b496ecac1ec53041004ef47c9fe8d5b7","url":"scriptures/es/acts-2-5.json"},{"revision":"7eb3f6dab1351e5c31df0c3ae63920da","url":"scriptures/es/acts-22-16.json"},{"revision":"6e05d32f759be4c4b7afd5c3f9f37d9f","url":"scriptures/es/acts-22-3-16.json"},{"revision":"a87102216a4693a162853a8287eab475","url":"scriptures/es/acts-28-21-22.json"},{"revision":"1f9dba30253fc64ed167e39abe1c631b","url":"scriptures/es/acts-28-22.json"},{"revision":"b27a1a1e9f7845f81120790ada0e0ac2","url":"scriptures/es/acts-28-30.json"},{"revision":"5b7e69fa2a5661ea06f9ccbdc779796b","url":"scriptures/es/acts-28-5.json"},{"revision":"89a6bd334cbcf3b9637924bdd8f3eb0b","url":"scriptures/es/acts-28-8.json"},{"revision":"4b448288101f431eb9ca5ea29e329883","url":"scriptures/es/acts-4-12.json"},{"revision":"8ef42466337726fbe492825aa97a4ad2","url":"scriptures/es/acts-4-4.json"},{"revision":"1ec451f78181127dba2d7ec82b7db198","url":"scriptures/es/acts-5-14.json"},{"revision":"a97a30b1395d11df445e3052f66cdedf","url":"scriptures/es/acts-5-17-18.json"},{"revision":"c2484dd4e52c1e20b62f80b13cb80df0","url":"scriptures/es/acts-5-38-42.json"},{"revision":"bf00564aef7b810f7ab71a8595b9ccfc","url":"scriptures/es/acts-6-1-8.json"},{"revision":"2ddacad12ac0fb887fe2b12dcf9a01d4","url":"scriptures/es/acts-6-1.json"},{"revision":"2b92b22bbddcb649bf99dab4a23241a4","url":"scriptures/es/acts-6-7.json"},{"revision":"1d3abbe6c7b1f68cafdaa05f09ac595f","url":"scriptures/es/acts-6-8.json"},{"revision":"98bc3949ad6dee72eb0e008db903f164","url":"scriptures/es/acts-8-1-25.json"},{"revision":"b300b6d596019edebd9086562ba5f98c","url":"scriptures/es/acts-8-12.json"},{"revision":"bddabaca44357a7c06155905a65b1c0e","url":"scriptures/es/acts-8-13.json"},{"revision":"2d23288acfe03e042fd61667dd6408a0","url":"scriptures/es/acts-8-18.json"},{"revision":"be10e99fa313e4f52e6444998eba707e","url":"scriptures/es/acts-8-26-39.json"},{"revision":"291e8c7e813b888abf1249bbf6b33fe4","url":"scriptures/es/acts-8-4.json"},{"revision":"131dcc8c3b10c0f26880b7d13b3dc01c","url":"scriptures/es/acts-9-1-22.json"},{"revision":"49e8a28206ca0f14da26bdd71d481eb0","url":"scriptures/es/acts-9-17-18.json"},{"revision":"972ad836ab63c3af745d9675b64491e8","url":"scriptures/es/acts-9-18-25.json"},{"revision":"54fec9b2a1a24de1d883659b6ce71fb5","url":"scriptures/es/acts-9-31.json"},{"revision":"0a654085e594285e17400f18336b9d82","url":"scriptures/es/acts-ch-1-ch-2.json"},{"revision":"7b1f98699755419e6fec5cb98c5e85d5","url":"scriptures/es/acts-ch-10.json"},{"revision":"36ecf253e903a5a6e2869979881cffe0","url":"scriptures/es/acts-ch-2.json"},{"revision":"446f0b453a240c696d3209d79cd703c3","url":"scriptures/es/colossians-1-15-18.json"},{"revision":"d255e2634030e98619ec83941ff808d3","url":"scriptures/es/colossians-1-23.json"},{"revision":"3ed88645ba5dd8f5093065d1697857aa","url":"scriptures/es/colossians-1-28-29.json"},{"revision":"e21dea2cdc3359b921952db6962c2db8","url":"scriptures/es/colossians-1-6.json"},{"revision":"11325ada60a269fc9f6cca7c86e2b641","url":"scriptures/es/colossians-2-11-12.json"},{"revision":"cb65abc314c9f4c5ae6e6ae9078242a1","url":"scriptures/es/colossians-2-12.json"},{"revision":"f5f1b40581e9586df30b0a698a83f35f","url":"scriptures/es/colossians-3-1-4.json"},{"revision":"d8412d7715711b399f2ea29c3fc318f7","url":"scriptures/es/colossians-3-12-14.json"},{"revision":"e65ec95c0a4fe0a63a035a9344607e60","url":"scriptures/es/colossians-3-15-16.json"},{"revision":"ef3668cefac6d9f5e2f3007d03ff5271","url":"scriptures/es/colossians-3-15.json"},{"revision":"c9a446f28d7d416d353a005322122127","url":"scriptures/es/colossians-3-17.json"},{"revision":"cde5ad6099993ba23c57598734e5f04b","url":"scriptures/es/colossians-3-18-21.json"},{"revision":"14289d2215ee6d15b64da1957aff5877","url":"scriptures/es/colossians-3-22.json"},{"revision":"438b55247e838d7066469248743a7e07","url":"scriptures/es/colossians-3-5-11.json"},{"revision":"01984e87d03b25b3a1965bc03cf8de5f","url":"scriptures/es/colossians-4-1.json"},{"revision":"962dfe4faf09d172614c6f4b61e7524b","url":"scriptures/es/colossians-ch-3-15-ch-4-1.json"},{"revision":"991daad90a5ae346f45ce72f7de63aa2","url":"scriptures/es/daniel-2-31-45.json"},{"revision":"52cecf80cff0c77af1abd0ee7e80eafb","url":"scriptures/es/daniel-2-44.json"},{"revision":"0505395f24313dd1bcedf05f6decc727","url":"scriptures/es/ephesians-2-19-21.json"},{"revision":"05919a77c70fd982b18ec959f0695f7a","url":"scriptures/es/ephesians-2-8.json"},{"revision":"3912cb6f8ad3b514306a31aba0d27567","url":"scriptures/es/ephesians-3-20.json"},{"revision":"ee048cdd312b99965f6323dce7811640","url":"scriptures/es/ephesians-4-4-6.json"},{"revision":"c889c8f96846c44d20fa323714a707a4","url":"scriptures/es/ephesians-5-18-19.json"},{"revision":"d40056962dd457abeb664c8c9c904aa3","url":"scriptures/es/ephesians-5-19-20.json"},{"revision":"2cd77473e7a9335b9b9ef8f1b5bb9cd4","url":"scriptures/es/ephesians-6-10-18.json"},{"revision":"39dc88bf037d4213f1a69720df4964c8","url":"scriptures/es/ezekiel-18-20.json"},{"revision":"5001fb21d330f6bca8762009911f1f0b","url":"scriptures/es/galatians-1-8.json"},{"revision":"78cbdde953ae8c00fdb2da3a6460445a","url":"scriptures/es/galatians-5-19-21.json"},{"revision":"2183e0fd33a78033cc4412d06d42ef88","url":"scriptures/es/galatians-6-1-2.json"},{"revision":"78161b974a8fae1d91dfdb368460506d","url":"scriptures/es/genesis-2-19.json"},{"revision":"429675e170f3e3bd8f9e80478f9ac466","url":"scriptures/es/hebrews-10-23-25.json"},{"revision":"bc294d629f2bcef9230877be818482f1","url":"scriptures/es/hebrews-10-23.json"},{"revision":"250f4f0acd569bc50c631eae6911c0eb","url":"scriptures/es/hebrews-10-24.json"},{"revision":"e4b4cdb6d2845e2411651df5550a9cb6","url":"scriptures/es/hebrews-12-14-15.json"},{"revision":"2c8e3f46679a1b13598be81a19d8f8d9","url":"scriptures/es/hebrews-12-15.json"},{"revision":"f8aa720a8ecfdc2dea37b3c0bc418d76","url":"scriptures/es/hebrews-13-17.json"},{"revision":"85d919dadd9d77009e83089be9af63cc","url":"scriptures/es/hebrews-3-12-14.json"},{"revision":"9469cd43031f6bd87f5a1df7e3d182df","url":"scriptures/es/hebrews-4-12-13.json"},{"revision":"5f8ca176a34b3b723a9a90547f6f9c92","url":"scriptures/es/hebrews-5-11-14.json"},{"revision":"c2658b07c5dc99fde2bc29f4e160f8d9","url":"scriptures/es/hebrews-6-1-3.json"},{"revision":"43db286a2c426a8a807d10a88a3b0628","url":"scriptures/es/hebrews-ch-5-11-ch-6-6.json"},{"revision":"64ad4d52b7b79d36aa383907cee79fc6","url":"scriptures/es/isaiah-2-1-4.json"},{"revision":"166c44bdee337d3985f9dd07cb52660e","url":"scriptures/es/isaiah-2-2.json"},{"revision":"87f2b75c8bf274cf844573c09867345d","url":"scriptures/es/isaiah-2-3.json"},{"revision":"f876ba1bdc8b902f4ee6c74800e681e3","url":"scriptures/es/isaiah-53-4-6.json"},{"revision":"d66b2ef92d41390bfa3bd23bd031f8fd","url":"scriptures/es/isaiah-59-1-2.json"},{"revision":"1302c61f80f8fb7544aa0ba54251b243","url":"scriptures/es/james-1-22-25.json"},{"revision":"c2bde21d2066f57dd8ba73205d5a26b1","url":"scriptures/es/james-4-17.json"},{"revision":"0c021f9ebaa528918630447feebcb215","url":"scriptures/es/james-5-16-18.json"},{"revision":"ccd5abd5998d660624f27ef9cefe1cb7","url":"scriptures/es/james-5-16.json"},{"revision":"ae6aaf03f152644c69098ae2ee0331c1","url":"scriptures/es/jeremiah-29-11-14.json"},{"revision":"c8896a294ea4868dfe5d394170e6329d","url":"scriptures/es/jeremiah-29-11.json"},{"revision":"3a38ee84f601a58764042f298f8d3fae","url":"scriptures/es/john-10-19-21.json"},{"revision":"c2d3b4d0c172f2a13b7d04e4483504e6","url":"scriptures/es/john-12-48.json"},{"revision":"3039e13a413991d280e138190b5e8ce6","url":"scriptures/es/john-13-34-35.json"},{"revision":"b02e5b5ed1dba9aa0cf3e4c3049e597e","url":"scriptures/es/john-15-1-16.json"},{"revision":"4dcc8854d14823cb2b9630d056e74c4e","url":"scriptures/es/john-15-16.json"},{"revision":"8583e68629de5052e463032510a73bbd","url":"scriptures/es/john-15-18-20.json"},{"revision":"7635b17fdcd4c1bb9e641a9e0d9cefdd","url":"scriptures/es/john-15-8.json"},{"revision":"855ce4759f8ab3ceb475ccc02d28d6b6","url":"scriptures/es/john-15-9-10.json"},{"revision":"72bc0c6aa8084699a7264fc61852bb8b","url":"scriptures/es/john-16-1-4.json"},{"revision":"fdf62c73bc583e7bb60a4464deada1fb","url":"scriptures/es/john-17-20-23.json"},{"revision":"d9512d886cc6096380cc6334827cb3d0","url":"scriptures/es/john-20-30-31.json"},{"revision":"bda99195b3ce22820b8ad95ce64c0db7","url":"scriptures/es/john-3-1-7.json"},{"revision":"31040a87f297f0390e7b7870123eb9ee","url":"scriptures/es/john-3-3.json"},{"revision":"fa53d4bbe80423f6bfff43ba7d63e5e4","url":"scriptures/es/john-3-34-36.json"},{"revision":"75b8011123d9e128843408a5537401b0","url":"scriptures/es/john-3-34.json"},{"revision":"daad13b7c80da2830753a08fef40a67f","url":"scriptures/es/john-3-5.json"},{"revision":"2cf9bdcd6d804a489afaa60e96f334b1","url":"scriptures/es/john-3-7.json"},{"revision":"9dc63c402a27d16957c9b412b65bb2f2","url":"scriptures/es/john-4-23-24.json"},{"revision":"b9338ade4889fee60a4b8b5c0b1cbff3","url":"scriptures/es/john-7-12-13.json"},{"revision":"46835c07ac0e3fd66874914470a165be","url":"scriptures/es/john-8-31-32.json"},{"revision":"c547bb2a014469302a8ead31c972c3fd","url":"scriptures/es/luke-11-1-4.json"},{"revision":"b936ea0fd7288f732ffd96e8f823be1b","url":"scriptures/es/luke-12-51-53.json"},{"revision":"c8829632be6df91f64dcdf334298828f","url":"scriptures/es/luke-14-25-33.json"},{"revision":"e738353958c3d8b4fc32c3bf6c9f245e","url":"scriptures/es/luke-17-20-21.json"},{"revision":"d64680b78e92e339c46ab182c3580841","url":"scriptures/es/luke-19-10.json"},{"revision":"5ecd9e5767073ebb6f92975c5f708978","url":"scriptures/es/luke-23-1-3.json"},{"revision":"9255b8e2686d862bba00e98fd73f3197","url":"scriptures/es/luke-23-50-51.json"},{"revision":"13a28ee30c64f822db77599643310d54","url":"scriptures/es/luke-24-44-49.json"},{"revision":"a918dd35dbff2e887a8c23f51c4a3062","url":"scriptures/es/luke-24-47.json"},{"revision":"32990562f6065e6a2b8472a41db27460","url":"scriptures/es/luke-9-1.json"},{"revision":"11ad70e73451a8257943421bde3faef3","url":"scriptures/es/luke-9-23-26.json"},{"revision":"cc1a05d396f03a24029c6a74187c054a","url":"scriptures/es/malachi-3-6-12.json"},{"revision":"09d2688cf69b2f91f3ba48610167165f","url":"scriptures/es/mark-1-14-18.json"},{"revision":"ffa9c46476ae9e9aa5cb3ff14dab538f","url":"scriptures/es/mark-1-17.json"},{"revision":"e2e4a1cdfae6847eedce22bda1874504","url":"scriptures/es/mark-16-16-18.json"},{"revision":"0196c082241b098966156b575ecc6042","url":"scriptures/es/mark-3-20-21.json"},{"revision":"25a3753bc9de0b9e37e1baea29bbade1","url":"scriptures/es/mark-3-31-35.json"},{"revision":"e0077d25464dee4834b525c1bab71118","url":"scriptures/es/mark-9-1.json"},{"revision":"75897210268be6cc368d05c997144bdc","url":"scriptures/es/matthew-15-1-9.json"},{"revision":"16fc4ade04e68b046e88f8e66688aff1","url":"scriptures/es/matthew-15-6-9.json"},{"revision":"c460a602a591283960bafc22876ab2c9","url":"scriptures/es/matthew-16-13-19.json"},{"revision":"c9db42535c76b05bed67643aac828a9d","url":"scriptures/es/matthew-16-19.json"},{"revision":"cd10a51f5713b2a17dc3ecc3c368c4e4","url":"scriptures/es/matthew-18-15-17.json"},{"revision":"1656473f416b0d8ceebe3d2c9e05264c","url":"scriptures/es/matthew-22-37-39.json"},{"revision":"bbec848c5c89985caba8bbe33cdcc5c0","url":"scriptures/es/matthew-26-31-35.json"},{"revision":"ba946f6385434bdc4e898b8a774c2e4e","url":"scriptures/es/matthew-26-36-39.json"},{"revision":"c364fb25d3c6bf0e443ac58c57fedb8b","url":"scriptures/es/matthew-26-36-46.json"},{"revision":"29fa1cb900f1a2a0088ee6d9f24b8110","url":"scriptures/es/matthew-26-47-56.json"},{"revision":"70b71616a17873611c230da80eb9e4d1","url":"scriptures/es/matthew-26-57-68.json"},{"revision":"d98372c742ef8858560333a566d50212","url":"scriptures/es/matthew-26-69-75.json"},{"revision":"519a9f6a4d2f6c6ab42173871bd28a61","url":"scriptures/es/matthew-27-1-10.json"},{"revision":"589707e9d55b6cd5a0c9e1abcc4f3517","url":"scriptures/es/matthew-27-11-26.json"},{"revision":"a88def4b0053311fab2f5b94892d899c","url":"scriptures/es/matthew-27-27-31.json"},{"revision":"7c90bba6bbcf2a86b70713fd4141e6d4","url":"scriptures/es/matthew-27-32-44.json"},{"revision":"f8067be90381524c8cf3a672ce6df402","url":"scriptures/es/matthew-27-45-56.json"},{"revision":"d7f5bbc46e93b4a99aa970e05ac0da99","url":"scriptures/es/matthew-27-46.json"},{"revision":"fd99ae087e57a740c5b0dfddb58a3e70","url":"scriptures/es/matthew-27-57-61.json"},{"revision":"a8c9604e3353c33bdef0f246039ab206","url":"scriptures/es/matthew-27-62-66.json"},{"revision":"1235351a5c42e93739318d63d5b24591","url":"scriptures/es/matthew-28-1-10.json"},{"revision":"24913b098749354d75c154526d5185d7","url":"scriptures/es/matthew-28-18-20.json"},{"revision":"06892fe39443682139d046e5fa16f359","url":"scriptures/es/matthew-28-19-20.json"},{"revision":"b569bc832cac6dfb31f158ecbcf5794a","url":"scriptures/es/matthew-28-19.json"},{"revision":"9694661c7042f30de9722edd5309d4f3","url":"scriptures/es/matthew-28-20.json"},{"revision":"1d0aca12e6f9fe07c04c6ea22b9d9919","url":"scriptures/es/matthew-3-1-2.json"},{"revision":"63fe5811572768ea25098c3ff50a0681","url":"scriptures/es/matthew-3-1-6.json"},{"revision":"2b28abc4296da353cd9033a51167870d","url":"scriptures/es/matthew-4-17.json"},{"revision":"15d9476894b2d2683e750b4961bac62c","url":"scriptures/es/matthew-5-10-12.json"},{"revision":"359ba630abfffed5def9ae219609ae7d","url":"scriptures/es/matthew-6-25-34.json"},{"revision":"8f77f08049158e26d6f3b1aa0ac360b7","url":"scriptures/es/matthew-6-33.json"},{"revision":"40574412b467ec9aff9528c3cea25418","url":"scriptures/es/matthew-7-13-14.json"},{"revision":"50e31bbba280891d717e8643b5a6f4f5","url":"scriptures/es/matthew-7-7-8.json"},{"revision":"db651a074b95827859bcb9f1712d35af","url":"scriptures/es/matthew-9-2-6.json"},{"revision":"44cf25ecde9447a9a139dfa9dc11c990","url":"scriptures/es/nehemiah-13-23-27.json"},{"revision":"6d75974e0237c2779ccb843fa6fdfdda","url":"scriptures/es/numbers-27-12-18.json"},{"revision":"0c09c15eb038e8e3dc4e6b573357ad8d","url":"scriptures/es/philippians-4-13.json"},{"revision":"f230e857e9841590c3a3fc4d7cb94a44","url":"scriptures/es/philippians-4-4-7.json"},{"revision":"d54560d5a98a1716b0499fec5890161b","url":"scriptures/es/philippians-4-4.json"},{"revision":"3aa4c81fa1e4862011512b0ecec98bad","url":"scriptures/es/phillipians-4-13.json"},{"revision":"b0f5b24f531d4858efc02481b8c2f88c","url":"scriptures/es/phillipians-4-4.json"},{"revision":"d532e3056b5f6f30b5de60338cbec13f","url":"scriptures/es/proberbs-13-12.json"},{"revision":"d200b22fd14c8cc3dbbb1030a993c3ad","url":"scriptures/es/psalm-119-1-2.json"},{"revision":"3aec78a86425b3ce3a01b640ef73256e","url":"scriptures/es/revelation-3-20.json"},{"revision":"b0b6c56fb76424e759e29c8a935acd37","url":"scriptures/es/romans-10-13.json"},{"revision":"78399e7be81fdf387296484dff25c4cb","url":"scriptures/es/romans-10-9.json"},{"revision":"75fe6188f25df5d3147ece36498111ee","url":"scriptures/es/romans-12-4-5.json"},{"revision":"b9bdc29b770803887da391b507769ff8","url":"scriptures/es/romans-3-23-25.json"},{"revision":"c16aa5fcfdab04b947380bee1ad2c75d","url":"scriptures/es/romans-3-23.json"},{"revision":"b03d287961c35438fb826a7193b51b8b","url":"scriptures/es/romans-3-25.json"},{"revision":"de33185631e00c56d0a50c808fdcf16c","url":"scriptures/es/romans-6-1-4.json"},{"revision":"d76b9fc19d28a72acf11176b4651459f","url":"scriptures/es/romans-6-2-4.json"},{"revision":"155c7bf7baacce6006ec41eeca8f8da0","url":"scriptures/es/romans-6-23.json"},{"revision":"cee8a9a2d8720fb1f7d0b9068f82a721","url":"scriptures/es/romans-6-3-4.json"},{"revision":"f3ac6c02c55dae0ac64e559198755c72","url":"sw-es.js"},{"revision":"8deb999fb971ba6303592d904954dbe1","url":"sw.js"}] || []).filter((entry) => {
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
