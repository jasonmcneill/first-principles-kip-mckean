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
      revision: "8c82fd2",
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
        revision: "8c82fd2",
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
  const precacheManifest = ([{"revision":"42955a9d45b2463b5762819b84a82edb","url":"css/style.css"},{"revision":"c313a1a90da0b2010235c52dbc3424d2","url":"img/en/darkness-vs-light.svg"},{"revision":"8f871ab1fb6e86951c12cb2f937a0f8d","url":"img/en/died-resurrected.svg"},{"revision":"64967b493903b7215a26c2f44dc4c536","url":"img/en/father-children.svg"},{"revision":"58216046bc6ecf15660346dc4045ef44","url":"img/en/head-body-christ-church.svg"},{"revision":"8418fc68929add7d18dce86b09cc35ad","url":"img/en/sin.svg"},{"revision":"d1aa56e4ac1574c8384500a17668f631","url":"img/en/wages-vs-gift.svg"},{"revision":"2ce897ab8147211dd71cdc44036c6dc3","url":"img/en/wall.svg"},{"revision":"097035629340546ead7a74f464d88760","url":"js/global.js"},{"revision":"965caadc55007f57fd2ba1369e8baa1e","url":"scriptures/en/_template.json"},{"revision":"c28119b474ba211df3c76de0db7e3eb2","url":"scriptures/en/1-corinthians-1-10-13.json"},{"revision":"b6b6ff28564ddeff0b6e8389e01281bb","url":"scriptures/en/1-corinthians-1-10-17.json"},{"revision":"1d3b27f027a5b5f89ffb5c0bebd586aa","url":"scriptures/en/1-corinthians-1-17.json"},{"revision":"940e1838522abce90994649a0017f6b6","url":"scriptures/en/1-corinthians-11-23-32.json"},{"revision":"752bc537fabcfe36d57d72a9e6c9fa8b","url":"scriptures/en/1-corinthians-12-12-13.json"},{"revision":"8391688d59b0c1a0caa0dc36b97f9c64","url":"scriptures/en/1-corinthians-12-14-27.json"},{"revision":"8bcdb290c73db38d749da32e303d9a7c","url":"scriptures/en/1-corinthians-12-21.json"},{"revision":"6d0b319eb6c4e1515ddb9e6e9d74a55c","url":"scriptures/en/1-corinthians-12-26.json"},{"revision":"74effd4ccdf15a8d660c4f4bf563e1d8","url":"scriptures/en/1-corinthians-12-28-30.json"},{"revision":"90b896b0108c589c90a584a82620a289","url":"scriptures/en/1-corinthians-12-8-10.json"},{"revision":"6496da399ca031e2ce2771efad34f831","url":"scriptures/en/1-corinthians-13-8-10.json"},{"revision":"091d5bf9f75f21ef873b0c03c57afd7c","url":"scriptures/en/1-corinthians-14-20-22.json"},{"revision":"8d3bcc286f31ce4ce5f5392f70610cdf","url":"scriptures/en/1-corinthians-3-11.json"},{"revision":"806f5a14097b73e5eb439b72e1833826","url":"scriptures/en/1-corinthians-7-39.json"},{"revision":"676bc6b049352fd85beb1ce42a5f792e","url":"scriptures/en/1-corinthians-ch-12.json"},{"revision":"7daea0106bc192e30b315e041af38f6b","url":"scriptures/en/1-corinthians-ch-14.json"},{"revision":"0f82e0769edb7cf320adee5d151e318e","url":"scriptures/en/1-john-1-9.json"},{"revision":"982be9edd24ae58f57cc93a314f9820b","url":"scriptures/en/1-kings-11-1-10.json"},{"revision":"e89e40ccdc206362ed3884a0f1037260","url":"scriptures/en/1-peter-1-21.json"},{"revision":"c3d5673790ff65758e52ced63f0d9af5","url":"scriptures/en/1-peter-2-9-10.json"},{"revision":"c91af4e16826f1923b4aa266c107ac2b","url":"scriptures/en/1-peter-3-1-7.json"},{"revision":"6149e0417d979e201c549c1f4f138325","url":"scriptures/en/1-peter-3-21.json"},{"revision":"3f4aa991a01efbca8ca0d8176159e0bf","url":"scriptures/en/1-peter-4-12-16.json"},{"revision":"b8449461712195e8272cf6085d55bec5","url":"scriptures/en/1-peter-4-3-4.json"},{"revision":"989fbbc98632c02b0f00c701bc30bb4c","url":"scriptures/en/1-thessalonians-5-12-14.json"},{"revision":"587859708fcf893dc7de02983ef916d1","url":"scriptures/en/1-timothy-2-3-4.json"},{"revision":"5d71c41f454b79d74f6a5bd57b6b7df7","url":"scriptures/en/1-timothy-4-16.json"},{"revision":"7f2235244326935e12e7971c1483095d","url":"scriptures/en/2-corinthians-6-14-18.json"},{"revision":"e7e91c638f250d0b805e0a57a90fe36b","url":"scriptures/en/2-corinthians-9-6-11.json"},{"revision":"74178ea23f183d43f4f0524967b3d3b5","url":"scriptures/en/2-corinthians-9-6-8.json"},{"revision":"745da6425e1a3ecd6694db9af795592c","url":"scriptures/en/2-peter-1-20-21.json"},{"revision":"f5ced75d83897184ddf46bbf6ada3ca2","url":"scriptures/en/2-thessalonians-2-9-12.json"},{"revision":"56e39f7daf3d6f97c097c08df91ed448","url":"scriptures/en/2-timothy-3-1-5.json"},{"revision":"b423ec3f54d3799e1a604973bd739a48","url":"scriptures/en/2-timothy-3-12.json"},{"revision":"d7d3ae17463f9e794c16139d5645eb6e","url":"scriptures/en/2-timothy-3-16-17.json"},{"revision":"ffab3997b06847d6df43121cb3087f1e","url":"scriptures/en/acts-1-12-14.json"},{"revision":"8c19690abc8f84083bb5d03cc5c2b64f","url":"scriptures/en/acts-1-18-19.json"},{"revision":"db3aa2ddcad7d4d9eec2ff767ac08575","url":"scriptures/en/acts-1-4-5.json"},{"revision":"6abf0b7d8706b0cd1065157fc0ad00e2","url":"scriptures/en/acts-1-8.json"},{"revision":"47ca5607f52f26e7d73f1f3ce541a283","url":"scriptures/en/acts-10-44.json"},{"revision":"0ea234b3fe6f3e157fd19823bc06c3ad","url":"scriptures/en/acts-10-48.json"},{"revision":"45de836cdffacd305bacc4aa61d9b724","url":"scriptures/en/acts-11-1-18.json"},{"revision":"64d21013669bc5a44cd54a7d3680d9da","url":"scriptures/en/acts-11-14.json"},{"revision":"89f8eb80fff88b2b92e0ce846002f543","url":"scriptures/en/acts-11-15.json"},{"revision":"fdd6e239ebb4b9cbd0abd8c8d052c2bd","url":"scriptures/en/acts-11-19-26.json"},{"revision":"eca0965d3033fef2799bc7d10e19f745","url":"scriptures/en/acts-11-21.json"},{"revision":"18c9d44240169f7864ab06f05497d40d","url":"scriptures/en/acts-11-25-26.json"},{"revision":"26e837cdbfbf590aa747881f2358fb10","url":"scriptures/en/acts-12-24.json"},{"revision":"30e9f105d680493359cc38fd39d03ac9","url":"scriptures/en/acts-13-3.json"},{"revision":"70e2cf011e649e9006f39b34350491e1","url":"scriptures/en/acts-13-49.json"},{"revision":"0133b36855cc3ea82c7cc93978302ac5","url":"scriptures/en/acts-14-1.json"},{"revision":"686350d08cf27eaf618ffb415ab69b1c","url":"scriptures/en/acts-14-21.json"},{"revision":"10b300d363f37d06ad2da503bd57a2f1","url":"scriptures/en/acts-16-22-34.json"},{"revision":"0530efea2e2674ef37fd0e69edf8f822","url":"scriptures/en/acts-16-5.json"},{"revision":"c935c46a1b9ba3bf991c292cc41e823c","url":"scriptures/en/acts-17-10-12.json"},{"revision":"f710afa7da7a1f8ffe4f3db3bcbddaa6","url":"scriptures/en/acts-17-26-28.json"},{"revision":"6448b8cc66b8c825cab651ab860bf1d6","url":"scriptures/en/acts-17-4.json"},{"revision":"82c1eceba533fe6977da331dc2e52446","url":"scriptures/en/acts-17-6-rsv.json"},{"revision":"0f003b7dfa2efd3ef15c6a0eadf2c432","url":"scriptures/en/acts-18-24-26.json"},{"revision":"2902084faf3c5308a9ccd86d9d53edf4","url":"scriptures/en/acts-19-1-5.json"},{"revision":"86a15db46176d5e9cd06d5eab8ea760d","url":"scriptures/en/acts-19-1-6.json"},{"revision":"e93a107e15e693ab204f7f38000f04cb","url":"scriptures/en/acts-19-5.json"},{"revision":"0e612abe14ae4d3660b0a45ad33981ef","url":"scriptures/en/acts-19-6.json"},{"revision":"ee3cf9285a1bd28d618f269c666fad9c","url":"scriptures/en/acts-2-1-4.json"},{"revision":"667b7716f6d0e1904bf6d024739ff672","url":"scriptures/en/acts-2-14.json"},{"revision":"ab4ac586d064694e79d3a26671fe5869","url":"scriptures/en/acts-2-17.json"},{"revision":"083a89c96bd79d757a67580ba48b3f16","url":"scriptures/en/acts-2-22-24.json"},{"revision":"85e873fd0be558931480258fac36e59e","url":"scriptures/en/acts-2-22.json"},{"revision":"ab0f315017ad7ab3abc2003e40ea8338","url":"scriptures/en/acts-2-23.json"},{"revision":"dbb4b021f5cbc9f61a3f949f54b38bd5","url":"scriptures/en/acts-2-24.json"},{"revision":"8bd72195ef87a1ae84e43ef879f0c7a2","url":"scriptures/en/acts-2-36-37.json"},{"revision":"d58b18cc205b58ab79ac208a0af8a5d3","url":"scriptures/en/acts-2-36-47.json"},{"revision":"4fbc248075e5249a74fe27f7067e5074","url":"scriptures/en/acts-2-37-38.json"},{"revision":"4275cf9913cdc730205ab012b4d47cd9","url":"scriptures/en/acts-2-37-42.json"},{"revision":"67575a8d5661411e2a7dc3a1be8a43d2","url":"scriptures/en/acts-2-38-42.json"},{"revision":"63aef12280b70363cd114fba3b7413d5","url":"scriptures/en/acts-2-38.json"},{"revision":"591f8abeed83b8886d5b0699d64047b0","url":"scriptures/en/acts-2-41.json"},{"revision":"59570d2c4499181141f5fbf68710cf23","url":"scriptures/en/acts-2-42.json"},{"revision":"071838f40dc8888d757fcbb7ef653ea7","url":"scriptures/en/acts-2-47.json"},{"revision":"a7e12307a32439f4a8ee04cb1b58e953","url":"scriptures/en/acts-2-5.json"},{"revision":"bfeb378405cc56a7a68c548b12333e62","url":"scriptures/en/acts-22-16.json"},{"revision":"04fcc61339c96c66c2942e1fe1517bea","url":"scriptures/en/acts-22-3-16.json"},{"revision":"feb75e50566e3341d120385bb2d14198","url":"scriptures/en/acts-28-21-22.json"},{"revision":"82e0c7745434a746de9ed9d5cb0c905c","url":"scriptures/en/acts-28-22.json"},{"revision":"36b356ba9b44260b48990526806c20c4","url":"scriptures/en/acts-28-30.json"},{"revision":"fae645d2276f8ef7b4b1bd3e2a5522ff","url":"scriptures/en/acts-28-5.json"},{"revision":"fdeb104b19c196e8283f892ae60c664c","url":"scriptures/en/acts-28-8.json"},{"revision":"5fdd579b4650ae103be91d6944091e52","url":"scriptures/en/acts-4-12.json"},{"revision":"305917e8f3ed691d45aca88ec38917a1","url":"scriptures/en/acts-4-4.json"},{"revision":"6485f4bc211df724da74317333236065","url":"scriptures/en/acts-5-14.json"},{"revision":"ec066adecb2dc6eb30174523dcd97af1","url":"scriptures/en/acts-5-17-18.json"},{"revision":"3a63ee6dff80c6098b0df9f7730198dc","url":"scriptures/en/acts-5-38-42.json"},{"revision":"678659c689469cf621cf31f6afea8f5c","url":"scriptures/en/acts-6-1-8.json"},{"revision":"02ebdde8e03ce033b48a63bd3c8de76f","url":"scriptures/en/acts-6-1.json"},{"revision":"6ceeda7ed7d5c6406590742050f98cba","url":"scriptures/en/acts-6-7.json"},{"revision":"d95970233ad07982c2db70854f81ce22","url":"scriptures/en/acts-6-8.json"},{"revision":"fae51abbaf3274e6cfecd123a2ec5d5d","url":"scriptures/en/acts-8-1-25.json"},{"revision":"7d4af1a7a874d555fa27bd995579f9f9","url":"scriptures/en/acts-8-12.json"},{"revision":"1a1a40de42cccf13884cdb17a171779e","url":"scriptures/en/acts-8-13.json"},{"revision":"cb4dfd60dae6099d8c2c0ef67e9af00d","url":"scriptures/en/acts-8-18.json"},{"revision":"6cd576ba4186426b3e44414def0d4bee","url":"scriptures/en/acts-8-26-39.json"},{"revision":"3266bbd536650342165e1b0267f9fedd","url":"scriptures/en/acts-8-4.json"},{"revision":"50038c016d16c175e31619c74bdf2a99","url":"scriptures/en/acts-9-1-22.json"},{"revision":"64e8866ba5a4760392549d91b15124d5","url":"scriptures/en/acts-9-17-18.json"},{"revision":"82c556accce2beaf451abe2ba88e6d6a","url":"scriptures/en/acts-9-18-25.json"},{"revision":"601b84d90a80ea5d04aadbb2eb7539f0","url":"scriptures/en/acts-9-31.json"},{"revision":"0e905bd9b93a6177cb80020b02e9ca7b","url":"scriptures/en/acts-ch-1-ch-2.json"},{"revision":"35ee4f8c8472af06e6dc1245f198de1c","url":"scriptures/en/acts-ch-10.json"},{"revision":"1fc64ea439532e1a7ce2971b40bb1107","url":"scriptures/en/acts-ch-2.json"},{"revision":"7c524130f9d3283226728b51049d2221","url":"scriptures/en/colossians-1-15-18.json"},{"revision":"e04ad28177f5ff819a05b9ed6fcecc8f","url":"scriptures/en/colossians-1-23.json"},{"revision":"54a8f94849bdfc7b6e4d1ce9f6f95d10","url":"scriptures/en/colossians-1-28-29.json"},{"revision":"a9a3ca3035cc1c4e44c3bec681a45d09","url":"scriptures/en/colossians-1-6.json"},{"revision":"5334a105f37bb07c4a2b53847f73dbc1","url":"scriptures/en/colossians-2-11-12.json"},{"revision":"b9b78e0a1e2a61e6c203c7ba102706c0","url":"scriptures/en/colossians-2-12.json"},{"revision":"81f1130a6f07a71d6e516939abf6074a","url":"scriptures/en/colossians-3-1-4.json"},{"revision":"833eada33b907f17c3b868b4a89e20cd","url":"scriptures/en/colossians-3-12-14.json"},{"revision":"e2f22c02539fd4237b5a3737ebada71c","url":"scriptures/en/colossians-3-15-16.json"},{"revision":"b85511fd83dc38737210430f81e7b54f","url":"scriptures/en/colossians-3-15.json"},{"revision":"f8228811b204832c78e38980a2f47eb1","url":"scriptures/en/colossians-3-17.json"},{"revision":"30898b11b21f07d12e2177b0348e5acc","url":"scriptures/en/colossians-3-18-21.json"},{"revision":"f273a09de26a76050b4a94fc0764e577","url":"scriptures/en/colossians-3-22.json"},{"revision":"0a6aff43ee3ba5f00229211cb7bf36b1","url":"scriptures/en/colossians-3-5-11.json"},{"revision":"a28dc57c42346e110b48f321aacd17db","url":"scriptures/en/colossians-4-1.json"},{"revision":"a78c76ce9bf61446a084f798753162f6","url":"scriptures/en/colossians-ch-3-15-ch-4-1.json"},{"revision":"5e6d92eca21af7e14ff5c9b612307d97","url":"scriptures/en/daniel-2-31-45.json"},{"revision":"54c2fcd83399417e4ea6cc28cf9a06aa","url":"scriptures/en/daniel-2-44.json"},{"revision":"9a914fdb75d00122f52f97f2bcb48989","url":"scriptures/en/ephesians-2-19-21.json"},{"revision":"8cf767541a934a11d62079a9d4392782","url":"scriptures/en/ephesians-2-8.json"},{"revision":"33e783bc7c3018ac7876a1317f2777a9","url":"scriptures/en/ephesians-3-20.json"},{"revision":"a250629a1cbd44c282662afc1b172a64","url":"scriptures/en/ephesians-4-4-6.json"},{"revision":"7827145c700a9912fc6fce0a15ed513e","url":"scriptures/en/ephesians-5-18-19.json"},{"revision":"940122b6779fdec63782b38bed746853","url":"scriptures/en/ephesians-5-19-20.json"},{"revision":"76354d44022d4d25ab11b0965a38c2c0","url":"scriptures/en/ephesians-6-10-18.json"},{"revision":"4e7ab2299e35935b46d84f6813ef1e22","url":"scriptures/en/ezekiel-18-20.json"},{"revision":"11798ea27b1ad5062677cb7c7ef0b86d","url":"scriptures/en/galatians-1-8.json"},{"revision":"aca0898cf5d6426d0a346e90eca6ae65","url":"scriptures/en/galatians-5-19-21.json"},{"revision":"1eaf9128f20bb21b4ab38032ccb74fc8","url":"scriptures/en/galatians-6-1-2.json"},{"revision":"2cc84201474ffc8727b538db1a89d5b2","url":"scriptures/en/genesis-2-19.json"},{"revision":"7565dbb2d1c2ed2640b3e1b7af4827df","url":"scriptures/en/hebrews-10-23-25.json"},{"revision":"75cdc9d26a64521471b57144f27e2275","url":"scriptures/en/hebrews-10-23.json"},{"revision":"0944bcf67cc0f8c52b8261794d53dff6","url":"scriptures/en/hebrews-10-24.json"},{"revision":"62e3246aff2c245f8baccd2acf75b866","url":"scriptures/en/hebrews-12-14-15.json"},{"revision":"9e171f5beb5e3bf43308ef400644526f","url":"scriptures/en/hebrews-12-15.json"},{"revision":"90b207136e5c24f2a0f5e21d721c0bfe","url":"scriptures/en/hebrews-13-17.json"},{"revision":"33cd6821c436da43df536ee285087db5","url":"scriptures/en/hebrews-3-12-14.json"},{"revision":"370cea30d544c427f8ef85b9b06d5ee0","url":"scriptures/en/hebrews-4-12-13.json"},{"revision":"239d2392217af70f9f02df41c5394ed7","url":"scriptures/en/hebrews-5-11-14.json"},{"revision":"23ebe70bc889bf65ea29fea62c1a9785","url":"scriptures/en/hebrews-6-1-3.json"},{"revision":"b4011495864e5dd2bad3991092052c45","url":"scriptures/en/hebrews-ch-5-11-ch-6-6.json"},{"revision":"80a845d5f0893d77c046fe9108714baa","url":"scriptures/en/isaiah-2-1-4.json"},{"revision":"87a9f5005bc2c5cb9d7f106ae3868418","url":"scriptures/en/isaiah-2-2.json"},{"revision":"bc4c8ac736e714d5e802d398e69594b7","url":"scriptures/en/isaiah-2-3.json"},{"revision":"cc336c90d96f7f4f413b46f4e8eaf33e","url":"scriptures/en/isaiah-53-4-6.json"},{"revision":"91e4c4677f2cc4b23454a0f80654eed1","url":"scriptures/en/isaiah-59-1-2.json"},{"revision":"c6fab68014bfa5a50c2c9f7534711cd9","url":"scriptures/en/james-1-22-25.json"},{"revision":"8a5f2f9ceb7286b3dcb0f72dc26fd3da","url":"scriptures/en/james-4-17.json"},{"revision":"e09d1f3d7827635fcd38823666e1a640","url":"scriptures/en/james-5-16-18.json"},{"revision":"f5ea151bb505fd6d7481cea3a3386a14","url":"scriptures/en/james-5-16.json"},{"revision":"fcc2db20253d82b108d0b410e5f93155","url":"scriptures/en/jeremiah-29-11-14.json"},{"revision":"0e8450f302efa07cc91a54fa3fdc3e6a","url":"scriptures/en/jeremiah-29-11.json"},{"revision":"bdcade7c553aeb0e9032abda4b8a9706","url":"scriptures/en/john-10-19-21.json"},{"revision":"58db56e9104ff8f825da668fdd4a29be","url":"scriptures/en/john-12-48.json"},{"revision":"80281b8b88f923fead0be997fab8ec27","url":"scriptures/en/john-13-34-35.json"},{"revision":"b239528844660e884a3cf5c09724c77d","url":"scriptures/en/john-15-1-16.json"},{"revision":"619e8f2f647a146ead2d0717d92d680a","url":"scriptures/en/john-15-16.json"},{"revision":"baca769520d9361eda5e2dfe60c0980e","url":"scriptures/en/john-15-18-20.json"},{"revision":"39b4206451a1f361c32af5bcc904cc1c","url":"scriptures/en/john-15-8.json"},{"revision":"e853e244dc455f08bc41c9445626201b","url":"scriptures/en/john-15-9-10.json"},{"revision":"ab2283c9025903c8fd2869e46ffe2f4a","url":"scriptures/en/john-16-1-4.json"},{"revision":"cde5de865b52a44b4468ef681869cb50","url":"scriptures/en/john-17-20-23.json"},{"revision":"115d56aa0f2a156aeb743a946bcb1b23","url":"scriptures/en/john-20-30-31.json"},{"revision":"ac6dc5e4fe9e6ead9ad443b893ab0111","url":"scriptures/en/john-3-1-7.json"},{"revision":"3fad57ad4d08da768ff72d3367e6ecf9","url":"scriptures/en/john-3-3.json"},{"revision":"d6f5c1c7ee83548fb064bc4c66a0c03f","url":"scriptures/en/john-3-34-36.json"},{"revision":"1c37e039ca2ee4def3b5bcb90bc7c232","url":"scriptures/en/john-3-34.json"},{"revision":"c70fc8eb52f505568b671023094d90c0","url":"scriptures/en/john-3-5.json"},{"revision":"fd2c2edb1bf1e8510c007222287170e7","url":"scriptures/en/john-3-7.json"},{"revision":"f6a087b833be6c6652fd3fd0b094c633","url":"scriptures/en/john-4-23-24.json"},{"revision":"318755b95e67e879c1fb743e077e02e1","url":"scriptures/en/john-7-12-13.json"},{"revision":"a5634385801eb8527667ad8e3ac2a930","url":"scriptures/en/john-8-31-32.json"},{"revision":"1ba505249ab5ac65008350720e889b70","url":"scriptures/en/luke-11-1-4.json"},{"revision":"740eb61f40bafdce87c9b6e6de0b4247","url":"scriptures/en/luke-12-51-53.json"},{"revision":"76486fa471eb377e45af2aa108ada13b","url":"scriptures/en/luke-14-25-33.json"},{"revision":"384187c384ea907e88ea2a09e56e13b8","url":"scriptures/en/luke-17-20-21.json"},{"revision":"7921a86638d98ced929c1686a821a467","url":"scriptures/en/luke-19-10.json"},{"revision":"929c13a5a6c067efa9d6397cba5dc0ce","url":"scriptures/en/luke-23-1-3.json"},{"revision":"92488d4962570c7f270c4d9a26e53074","url":"scriptures/en/luke-23-50-51.json"},{"revision":"56e2a88d8a2801e7fe243718ed843f7b","url":"scriptures/en/luke-24-44-49.json"},{"revision":"2f178d75395845fc935d5b9ad117c91b","url":"scriptures/en/luke-24-47.json"},{"revision":"11eef98ebe89dbc9b863841e65b71727","url":"scriptures/en/luke-9-1.json"},{"revision":"0fc6cd3a5aff506691e0b775a6bc7810","url":"scriptures/en/luke-9-23-26.json"},{"revision":"52b2f6cbbb8ce1c9252ef40acc993ec3","url":"scriptures/en/malachi-3-6-12.json"},{"revision":"6152e782fa6dd8784f1b431f3e8aac63","url":"scriptures/en/mark-1-14-18.json"},{"revision":"db1ef6efa3e926c24bc98800ded5430c","url":"scriptures/en/mark-1-17.json"},{"revision":"0bd32f91123a39906c5e8ef434955b96","url":"scriptures/en/mark-16-16-18.json"},{"revision":"e1356ee49c982b630662495f8a1d1ebf","url":"scriptures/en/mark-3-20-21.json"},{"revision":"b4db70ea4b6992b5402c83fb84cd2367","url":"scriptures/en/mark-3-31-35.json"},{"revision":"e92904ebcdb5b73756c4455f1752e735","url":"scriptures/en/mark-9-1.json"},{"revision":"2362916e6c2a8893bd0efaa43b27526f","url":"scriptures/en/matthew-15-1-9.json"},{"revision":"c867eefb962b8b41fdca3be75e406e6d","url":"scriptures/en/matthew-15-6-9.json"},{"revision":"dfce597ade33ceb90c021a242554c865","url":"scriptures/en/matthew-16-13-19.json"},{"revision":"7ac1cd1c387a22af043992b15a7ca81e","url":"scriptures/en/matthew-16-19.json"},{"revision":"3e1b7e6567aecd01a9ce8c18998aec26","url":"scriptures/en/matthew-18-15-17.json"},{"revision":"0fb6e1289368109ea5eff1a55bc007e4","url":"scriptures/en/matthew-22-37-39.json"},{"revision":"4f850f3353ecc82419e3679d0994aa29","url":"scriptures/en/matthew-26-31-35.json"},{"revision":"fb90969d36953fd3a929a3cd47ddc1f3","url":"scriptures/en/matthew-26-36-39.json"},{"revision":"967053fcd23342d85f09ef08e5bca4ef","url":"scriptures/en/matthew-26-36-46.json"},{"revision":"d34c9789bdbf01dc6ccc0456d426484c","url":"scriptures/en/matthew-26-47-56.json"},{"revision":"1b02cec7d64f0da8eb655bf0efa4618f","url":"scriptures/en/matthew-26-57-68.json"},{"revision":"02fc0db1e3f1856a04952fc71abdc558","url":"scriptures/en/matthew-26-69-75.json"},{"revision":"02adf5d0d2805e1470f1bd91232bed8b","url":"scriptures/en/matthew-27-1-10.json"},{"revision":"0816740676c7f93047e09dd6e8311d72","url":"scriptures/en/matthew-27-11-26.json"},{"revision":"04c39ee2d266da5e3f10ff68b0a63f27","url":"scriptures/en/matthew-27-27-31.json"},{"revision":"51249cef9417898a1bad48ce72884728","url":"scriptures/en/matthew-27-32-44.json"},{"revision":"c1838fb7b771b34bed835697a4301631","url":"scriptures/en/matthew-27-45-56.json"},{"revision":"8e6580143413a64afaac3c50341934cd","url":"scriptures/en/matthew-27-46.json"},{"revision":"ee68771827b45c9b5238e4345368d264","url":"scriptures/en/matthew-27-57-61.json"},{"revision":"231f41c11a6fbdba6801ca44e91ad6a9","url":"scriptures/en/matthew-27-62-66.json"},{"revision":"71482b6150f8cff63937ef2ae5139edb","url":"scriptures/en/matthew-28-1-10.json"},{"revision":"cfcbb1f9575b0598705182debef08b72","url":"scriptures/en/matthew-28-18-20.json"},{"revision":"8f822f1ef65ee3760793147f59aba3c1","url":"scriptures/en/matthew-28-19-20.json"},{"revision":"04dcb7c23acc8f0617e266c9564e75ce","url":"scriptures/en/matthew-28-19.json"},{"revision":"eaedc7f311ec84610ad743b16c585f24","url":"scriptures/en/matthew-28-20.json"},{"revision":"69f37d58e52739a1ebf5a85d20ddebfd","url":"scriptures/en/matthew-3-1-2.json"},{"revision":"932f42a74dba8acf463c229a23033ea9","url":"scriptures/en/matthew-3-1-6.json"},{"revision":"8443c8852b0c35082a529c8e9448f4d2","url":"scriptures/en/matthew-4-17.json"},{"revision":"6acb6d90ebeb4b8bdfd79a2d1be998e2","url":"scriptures/en/matthew-5-10-12.json"},{"revision":"742ac8643670e7bed43fe93df49a0ef4","url":"scriptures/en/matthew-6-25-34.json"},{"revision":"efce09dbae54905bf56a64dd9c91ea7e","url":"scriptures/en/matthew-6-33.json"},{"revision":"75af7df11168d3b3050ea7b03ecea3bd","url":"scriptures/en/matthew-7-13-14.json"},{"revision":"5cf716a7bb1f1c35e0d29afaa850943b","url":"scriptures/en/matthew-7-7-8.json"},{"revision":"c86f30292a7ab2b9e5d51fec0971fd3a","url":"scriptures/en/matthew-9-2-6.json"},{"revision":"a6e51da0c023f2d58610e1ecbc848db5","url":"scriptures/en/nehemiah-13-23-27.json"},{"revision":"85b07e046d70e0df7227c3d2ebb8a833","url":"scriptures/en/numbers-27-12-18.json"},{"revision":"5a6377f413be31321ce21d04e08b2523","url":"scriptures/en/philippians-4-13.json"},{"revision":"b198e1def376b85d3227f0f26bf684a8","url":"scriptures/en/philippians-4-4-7.json"},{"revision":"5ec234d3c6326ee3b9184370efd7ca74","url":"scriptures/en/philippians-4-4.json"},{"revision":"bb2cfa1be73a97f44d0f1bd671ac736d","url":"scriptures/en/phillipians-4-13.json"},{"revision":"f7d859358f69099bb90a666c5773b0be","url":"scriptures/en/phillipians-4-4.json"},{"revision":"c5320447f3872b23641ac5a863844905","url":"scriptures/en/proberbs-13-12.json"},{"revision":"8c270a33d976be70175d1c7e682b4149","url":"scriptures/en/psalm-119-1-2.json"},{"revision":"e5220800c93cb06d5c69335678cc586f","url":"scriptures/en/revelation-3-20.json"},{"revision":"b2d1dba6e1838db6359f60a85037fe86","url":"scriptures/en/romans-10-13.json"},{"revision":"05c2f287837c5f90cde8fcfd271ff415","url":"scriptures/en/romans-10-9.json"},{"revision":"1c27289b046480d696bf8cd718d49d61","url":"scriptures/en/romans-12-4-5.json"},{"revision":"5eb1bc5179fc818d86665873dcc7189f","url":"scriptures/en/romans-3-23-25.json"},{"revision":"f61c82939dbbf68853cc00952c56fe9f","url":"scriptures/en/romans-3-23.json"},{"revision":"b4d5c6bf00f7a9db384800f3a411bc23","url":"scriptures/en/romans-3-25.json"},{"revision":"49b56891c01d835c2965abe599f15f1b","url":"scriptures/en/romans-6-1-4.json"},{"revision":"b452a512e919db87a5a485a91e062d75","url":"scriptures/en/romans-6-2-4.json"},{"revision":"aa6a5a5df94b89a3b54d179ca6652225","url":"scriptures/en/romans-6-23.json"},{"revision":"b79a6fdce35b8891c32b50873ce4d954","url":"scriptures/en/romans-6-3-4.json"},{"revision":"43baf9ccdd82c4d6d427e182acbddbf4","url":"scriptures/es/_template.json"},{"revision":"df8dde4f8c39d5e457badc8cd8974e60","url":"scriptures/es/1-corinthians-1-10-13.json"},{"revision":"d8408495e5426c9660da5477a92c77c5","url":"scriptures/es/1-corinthians-1-10-17.json"},{"revision":"ec8aeea84d9bd771973c2a5bc5a83cbf","url":"scriptures/es/1-corinthians-1-17.json"},{"revision":"7f5712076e35808c96926491fb82fd15","url":"scriptures/es/1-corinthians-11-23-32.json"},{"revision":"0ab754dc55d8b29621d7e89790173bcf","url":"scriptures/es/1-corinthians-12-12-13.json"},{"revision":"62fafe6ef822363456c146f86a5ab457","url":"scriptures/es/1-corinthians-12-14-27.json"},{"revision":"671daaee13603ebfb296ed775d00d358","url":"scriptures/es/1-corinthians-12-21.json"},{"revision":"c67c6d794f2394e1e683d3bc483e3b0f","url":"scriptures/es/1-corinthians-12-26.json"},{"revision":"092a84ec59bcf4a61a2baaa2075f1aa6","url":"scriptures/es/1-corinthians-12-28-30.json"},{"revision":"865841ac8506c848e29abba31179c1b4","url":"scriptures/es/1-corinthians-12-8-10.json"},{"revision":"50bceaf5cae81d30bc1e4a61efafe878","url":"scriptures/es/1-corinthians-13-8-10.json"},{"revision":"a33fce968f5c4f94726cf8b2c46bca44","url":"scriptures/es/1-corinthians-14-20-22.json"},{"revision":"a6363250bda56ff851a408dda149fe37","url":"scriptures/es/1-corinthians-3-11.json"},{"revision":"93d6c8dc6a7e43dfa94be2b880c5eb43","url":"scriptures/es/1-corinthians-7-39.json"},{"revision":"d9740ca299be51d3690896770fab0720","url":"scriptures/es/1-corinthians-ch-12.json"},{"revision":"51dd0e3fe1f32daf40d9bb0c793239a2","url":"scriptures/es/1-corinthians-ch-14.json"},{"revision":"24e7755f4e83deb5544c03e410958b19","url":"scriptures/es/1-john-1-9.json"},{"revision":"b7883018d4f584e48cb2ec29aa880706","url":"scriptures/es/1-kings-11-1-10.json"},{"revision":"16a1c9fb67446483f5e0617ea5b3372e","url":"scriptures/es/1-peter-1-21.json"},{"revision":"ef340e17c65f15de60d7dc9de58814ca","url":"scriptures/es/1-peter-2-9-10.json"},{"revision":"5821439917b6d439ee05fe84ac3276b9","url":"scriptures/es/1-peter-3-1-7.json"},{"revision":"a017369d7233b5989165eefe893af360","url":"scriptures/es/1-peter-3-21.json"},{"revision":"9eec2d44aacd1cdb53b35699421065cd","url":"scriptures/es/1-peter-4-12-16.json"},{"revision":"79a81e220eb70fd2530563e048099134","url":"scriptures/es/1-peter-4-3-4.json"},{"revision":"a3f8fffa7594717b7a198d6fca232e69","url":"scriptures/es/1-thessalonians-5-12-14.json"},{"revision":"87caf064772ef84dbf32f9b5a12ba78a","url":"scriptures/es/1-timothy-2-3-4.json"},{"revision":"ef0a991dee26d656bfe34218ed99517a","url":"scriptures/es/1-timothy-4-16.json"},{"revision":"c1334722272f6e9ed357dfcca3cd982f","url":"scriptures/es/2-corinthians-6-14-18.json"},{"revision":"c175ccc26c8e09523fed24f8011506a9","url":"scriptures/es/2-corinthians-9-6-11.json"},{"revision":"1664956ac75800377d4828654ab9e8aa","url":"scriptures/es/2-corinthians-9-6-8.json"},{"revision":"06f59099f80340db2785ed663f717cec","url":"scriptures/es/2-peter-1-20-21.json"},{"revision":"40e20c8e5169abbd0956698b43eb1c06","url":"scriptures/es/2-thessalonians-2-9-12.json"},{"revision":"63a41f71a84d645928722a28364e2c8b","url":"scriptures/es/2-timothy-3-1-5.json"},{"revision":"59d0cbc5ea29c574062b2b3c1f1a1315","url":"scriptures/es/2-timothy-3-12.json"},{"revision":"bdc148dfc76424d0061725ecc3b0d56a","url":"scriptures/es/2-timothy-3-16-17.json"},{"revision":"8b0df2bc509ccb42a8fd3da3689327f4","url":"scriptures/es/acts-1-12-14.json"},{"revision":"8779a9407d210afc3be97da0129dcb8d","url":"scriptures/es/acts-1-18-19.json"},{"revision":"492109bb10e3b6412add040734bba795","url":"scriptures/es/acts-1-4-5.json"},{"revision":"1fbf2e414c2e9fae2c7a7fdd8a88046b","url":"scriptures/es/acts-1-8.json"},{"revision":"929193850406bf9ae9ca0304bec94f88","url":"scriptures/es/acts-10-44.json"},{"revision":"27e3a60143c1329aacf38ea837e19bd5","url":"scriptures/es/acts-10-48.json"},{"revision":"977312b5b97946744b6d715655852e5e","url":"scriptures/es/acts-11-1-18.json"},{"revision":"676e7d6672597109e65c86615032d8de","url":"scriptures/es/acts-11-14.json"},{"revision":"315d49d8b35133730de607c124628a93","url":"scriptures/es/acts-11-15.json"},{"revision":"a96090388f8f4c035bb4eb6f83376606","url":"scriptures/es/acts-11-19-26.json"},{"revision":"d75a11a2e09203b629ecf10f9c74b9ab","url":"scriptures/es/acts-11-21.json"},{"revision":"7978336f86cf55231471a17e27ba970e","url":"scriptures/es/acts-11-25-26.json"},{"revision":"5fa8ac8d2f9df9dca0ba172d74cb87c4","url":"scriptures/es/acts-12-24.json"},{"revision":"db0081cddfa1cc71f0610c87ad2bccb5","url":"scriptures/es/acts-13-3.json"},{"revision":"084970a4c05887a2e4a683810768a7fb","url":"scriptures/es/acts-13-49.json"},{"revision":"ea1ebc90fd479d7b4529088ce4742027","url":"scriptures/es/acts-14-1.json"},{"revision":"c1083a3da3a753ddb67db4cc73063ca3","url":"scriptures/es/acts-14-21.json"},{"revision":"355c945bf7f0ee1cb459227e203dc1c7","url":"scriptures/es/acts-16-22-34.json"},{"revision":"5fc9ec935863d36b932476b399909332","url":"scriptures/es/acts-16-5.json"},{"revision":"d6626c016b0670c2ab9008dd3ca4679c","url":"scriptures/es/acts-17-10-12.json"},{"revision":"dee195c147e5fd0b9ccc969f2fe37dfe","url":"scriptures/es/acts-17-26-28.json"},{"revision":"7056d2117691e417bd8bef0c71e1ea7c","url":"scriptures/es/acts-17-4.json"},{"revision":"82c1eceba533fe6977da331dc2e52446","url":"scriptures/es/acts-17-6-rsv.json"},{"revision":"a9aa6de65f8d3dc7d7d9d7415cd785b6","url":"scriptures/es/acts-18-24-26.json"},{"revision":"4baaf2f6def9b2e2cb41ad7645217f1c","url":"scriptures/es/acts-19-1-5.json"},{"revision":"b9b66148f59e83356038af6818b90040","url":"scriptures/es/acts-19-1-6.json"},{"revision":"adabb2f034dd7bbd793c1961335400e5","url":"scriptures/es/acts-19-5.json"},{"revision":"682ec9d827bfa4e5bbc5bbbcba4f6c71","url":"scriptures/es/acts-19-6.json"},{"revision":"24e7c74e9a79950cc705edf1e6882a93","url":"scriptures/es/acts-2-1-4.json"},{"revision":"7c2117c406baf11a2ece9b00e2c1c612","url":"scriptures/es/acts-2-14.json"},{"revision":"1037e7885c439e78adf148ec5dc96d87","url":"scriptures/es/acts-2-17.json"},{"revision":"8056c07880a82ed3ea61200fb41e01ee","url":"scriptures/es/acts-2-22-24.json"},{"revision":"f34ec1b723db96b62f623b55e357860f","url":"scriptures/es/acts-2-22.json"},{"revision":"1a32919820f901e49536a53ed2382c8f","url":"scriptures/es/acts-2-23.json"},{"revision":"83811e294f77f292ad81c029cc8baffb","url":"scriptures/es/acts-2-24.json"},{"revision":"171df8ae333badb7c756065795d4ae5a","url":"scriptures/es/acts-2-36-37.json"},{"revision":"c6b69eaed7a975a2e4e89e4c1b61a1d7","url":"scriptures/es/acts-2-36-47.json"},{"revision":"db09e483e857b430900e89bf6658fd59","url":"scriptures/es/acts-2-37-38.json"},{"revision":"891d10c932eb60f297710ef8e2478f0f","url":"scriptures/es/acts-2-37-42.json"},{"revision":"e355ed11a50458529364782aed96b57b","url":"scriptures/es/acts-2-38-42.json"},{"revision":"d46216eaf9faf4967cda8a3b216b47d0","url":"scriptures/es/acts-2-38.json"},{"revision":"140961d3927c52b1f918a8b5deec9506","url":"scriptures/es/acts-2-41.json"},{"revision":"cae2c66fa5a8aa3a34031f8c1de01d42","url":"scriptures/es/acts-2-42.json"},{"revision":"83e276b232ad4040a2f09780ae4dab08","url":"scriptures/es/acts-2-47.json"},{"revision":"dd917fa96f3eb73ee4503e6e1cba043c","url":"scriptures/es/acts-2-5.json"},{"revision":"1e3f4c22a5b43d5b6b0699cc2b8f544d","url":"scriptures/es/acts-22-16.json"},{"revision":"e64aa3dcbafda296977e67099192bc76","url":"scriptures/es/acts-22-3-16.json"},{"revision":"becf5e1f30c660f5d836cbb0ea8ec393","url":"scriptures/es/acts-28-21-22.json"},{"revision":"6733766b00f8d684d624867a9fa544dd","url":"scriptures/es/acts-28-22.json"},{"revision":"2f72278dc0ae4a6ce3e45dd12dcbad03","url":"scriptures/es/acts-28-30.json"},{"revision":"f84749b42b3b6afa6e3916476747381a","url":"scriptures/es/acts-28-5.json"},{"revision":"cd50b49ee5e06ea3fd7dcb9f5cd5e287","url":"scriptures/es/acts-28-8.json"},{"revision":"12f1b472989a825a57770b9d31c222af","url":"scriptures/es/acts-4-12.json"},{"revision":"e931c74fdb030e426eb72c72118ab824","url":"scriptures/es/acts-4-4.json"},{"revision":"6f5e7ca0f3044928fa19466ce6b912fe","url":"scriptures/es/acts-5-14.json"},{"revision":"cbc7ad9f1829514be17b11781376237f","url":"scriptures/es/acts-5-17-18.json"},{"revision":"c27e1b5c0d252dd47ef684e30cdb7b76","url":"scriptures/es/acts-5-38-42.json"},{"revision":"6753f23a7f4382bd71d2edb29a118564","url":"scriptures/es/acts-6-1-8.json"},{"revision":"b94a390a3d68205c3d790eecc153f804","url":"scriptures/es/acts-6-1.json"},{"revision":"d97d0e0703307b5d86385e1b75c29c09","url":"scriptures/es/acts-6-7.json"},{"revision":"41193df622214760cc2600779ba491f8","url":"scriptures/es/acts-6-8.json"},{"revision":"c5f5287a224a92b0bde50657ed3f6404","url":"scriptures/es/acts-8-1-25.json"},{"revision":"36eab505058cf9890537a387ca66d16d","url":"scriptures/es/acts-8-12.json"},{"revision":"c1a4388126e12956f92eea89b899d81a","url":"scriptures/es/acts-8-13.json"},{"revision":"192984b6fe8a61234b07a8e024178eb9","url":"scriptures/es/acts-8-18.json"},{"revision":"c847f45175a8537d6942d7798d1a4214","url":"scriptures/es/acts-8-26-39.json"},{"revision":"d64efa9ea0f5b71719d21b455da04370","url":"scriptures/es/acts-8-4.json"},{"revision":"855caa1b1624eed3ed328f9e7d33928a","url":"scriptures/es/acts-9-1-22.json"},{"revision":"547ad8d0f57aeed15cfcfb21e3aeb9a1","url":"scriptures/es/acts-9-17-18.json"},{"revision":"080353a93ca3db085f1008d619ac5472","url":"scriptures/es/acts-9-18-25.json"},{"revision":"2400cd80caeaa46be0d31cec3cde6fc2","url":"scriptures/es/acts-9-31.json"},{"revision":"3f51073166a4587616df181bdae7df14","url":"scriptures/es/acts-ch-1-ch-2.json"},{"revision":"1c14501b3a823a80bad7937c23a8d5de","url":"scriptures/es/acts-ch-10.json"},{"revision":"83eb90b646280ea66db4a4277f6b081d","url":"scriptures/es/acts-ch-2.json"},{"revision":"b1039d63612fd895b3e868631eb03d04","url":"scriptures/es/colossians-1-15-18.json"},{"revision":"243a89704fe191f69b58dd46636e8f19","url":"scriptures/es/colossians-1-23.json"},{"revision":"f964b1c06c76044bd4d756335d1178a4","url":"scriptures/es/colossians-1-28-29.json"},{"revision":"25468353a17086f80822126be3a45e60","url":"scriptures/es/colossians-1-6.json"},{"revision":"2ac1c95568aa18320484ae6f6f274b3c","url":"scriptures/es/colossians-2-11-12.json"},{"revision":"416e70a70a82fa29cfb08ea0bf246891","url":"scriptures/es/colossians-2-12.json"},{"revision":"f7d1a6900fe4bd001a403201aa15bed8","url":"scriptures/es/colossians-3-1-4.json"},{"revision":"b2e627fbe3715db11e714245ce19dc88","url":"scriptures/es/colossians-3-12-14.json"},{"revision":"f13fe4a2993d1092d68f9082e03f1a62","url":"scriptures/es/colossians-3-15-16.json"},{"revision":"035b05c5440cd4fed42132b085e975d1","url":"scriptures/es/colossians-3-15.json"},{"revision":"ec6d875ff31d1acb73f0e530fe572654","url":"scriptures/es/colossians-3-17.json"},{"revision":"26ac27171e80a10b63bf6b74b32d6b65","url":"scriptures/es/colossians-3-18-21.json"},{"revision":"56c8c267c7ae55e27040e327e6b250ef","url":"scriptures/es/colossians-3-22.json"},{"revision":"1669e33a4f33e4fa690f22f372f3eea7","url":"scriptures/es/colossians-3-5-11.json"},{"revision":"3f4402ecd881fbd285d3afe0471f03a1","url":"scriptures/es/colossians-4-1.json"},{"revision":"420c8e0ea9ff0fd1579076783433dac9","url":"scriptures/es/colossians-ch-3-15-ch-4-1.json"},{"revision":"14d037ac626053467ce3d3fbca74a57c","url":"scriptures/es/daniel-2-31-45.json"},{"revision":"54d2ee8c9091bc6e1570907de2ee0367","url":"scriptures/es/daniel-2-44.json"},{"revision":"e6df1cd237aac5bb1dce1fa6e8a0d3f6","url":"scriptures/es/ephesians-2-19-21.json"},{"revision":"3f9995080a3ea9e5013b506c11feb47e","url":"scriptures/es/ephesians-2-8.json"},{"revision":"c1fde3ad5fc679fa8f572d1f7668fba1","url":"scriptures/es/ephesians-3-20.json"},{"revision":"d05bb5a306f2c958ab668d9483ee6d96","url":"scriptures/es/ephesians-4-4-6.json"},{"revision":"24f8d160da79fcde5c78d9a4213e1909","url":"scriptures/es/ephesians-5-18-19.json"},{"revision":"26a181cdcf2d1cd3a0767915f961c279","url":"scriptures/es/ephesians-5-19-20.json"},{"revision":"137c243b944aa666cfeef6714adb165b","url":"scriptures/es/ephesians-6-10-18.json"},{"revision":"27fcc614214fe2529016619f5862e9ab","url":"scriptures/es/ezekiel-18-20.json"},{"revision":"8e05ecd49bb458f9ea6d768045cddb83","url":"scriptures/es/galatians-1-8.json"},{"revision":"f6ee496708b58c05329547059fbe4033","url":"scriptures/es/galatians-5-19-21.json"},{"revision":"f24f389f0c6abe87c5cc10d949a5592e","url":"scriptures/es/galatians-6-1-2.json"},{"revision":"d154c9dd891cfbd8a08d26a62ea8d97c","url":"scriptures/es/genesis-2-19.json"},{"revision":"6f1c62abadf49f341eb62a53f3b00e7e","url":"scriptures/es/hebrews-10-23-25.json"},{"revision":"eb554e05b66e0ad4496390a3f3613bc1","url":"scriptures/es/hebrews-10-23.json"},{"revision":"5e6487c4764e0ff52c2f63e901487b4e","url":"scriptures/es/hebrews-10-24.json"},{"revision":"53c769d655ddf43a97405ce5a2753434","url":"scriptures/es/hebrews-12-14-15.json"},{"revision":"98c28e4a6afb0a386555559b9aea5638","url":"scriptures/es/hebrews-12-15.json"},{"revision":"30b5757e439aa239baf6c5a6483782b2","url":"scriptures/es/hebrews-13-17.json"},{"revision":"01f4d5eeb6fbf5f860dd6685130f5094","url":"scriptures/es/hebrews-3-12-14.json"},{"revision":"e0d2fc2ecdcc333e9ff44feeab1d408f","url":"scriptures/es/hebrews-4-12-13.json"},{"revision":"6cace1e8388f5e54eae8ef63b39bc096","url":"scriptures/es/hebrews-5-11-14.json"},{"revision":"48487a5a45f24805d18479750a33d63a","url":"scriptures/es/hebrews-6-1-3.json"},{"revision":"33504377ed01dc6e66e5ba6d926e3316","url":"scriptures/es/hebrews-ch-5-11-ch-6-6.json"},{"revision":"bac0f7d0bfa1babae762a6949b75f38f","url":"scriptures/es/isaiah-2-1-4.json"},{"revision":"bcde79275d39a1484175233cd66807d9","url":"scriptures/es/isaiah-2-2.json"},{"revision":"c4d4f5150eff6b82cca277e361ea7c92","url":"scriptures/es/isaiah-2-3.json"},{"revision":"257ef5c516b8df76a7971861c462c988","url":"scriptures/es/isaiah-53-4-6.json"},{"revision":"7eaaac66004984b6725e9314d87282bd","url":"scriptures/es/isaiah-59-1-2.json"},{"revision":"30485dc2f19e9419c5dbd2f33a74e337","url":"scriptures/es/james-1-22-25.json"},{"revision":"ee486055349938ce1d0a12378ac0b377","url":"scriptures/es/james-4-17.json"},{"revision":"f1d81469c155b30dd4b560e903c2b902","url":"scriptures/es/james-5-16-18.json"},{"revision":"e59d43601e80a76134eaf910801efefa","url":"scriptures/es/james-5-16.json"},{"revision":"9e30cb617fd7f487ea834c521dc1916f","url":"scriptures/es/jeremiah-29-11-14.json"},{"revision":"2580b62bb089bced688170f9cce3c1a2","url":"scriptures/es/jeremiah-29-11.json"},{"revision":"41bca4cb089bffa7fbc03744992cede1","url":"scriptures/es/john-10-19-21.json"},{"revision":"6ecda314659546bc9d30e2c9d8378ada","url":"scriptures/es/john-12-48.json"},{"revision":"df8bb1d494a05576095718b170f6415e","url":"scriptures/es/john-13-34-35.json"},{"revision":"fc77f67641ff940b6dbcfacfa0e2232d","url":"scriptures/es/john-15-1-16.json"},{"revision":"a7a4988f81c3f08728b8969d62a6598f","url":"scriptures/es/john-15-16.json"},{"revision":"a384740457d19f18056654e6e3949dd3","url":"scriptures/es/john-15-18-20.json"},{"revision":"d36b1fa95534b5618b280ad323aead67","url":"scriptures/es/john-15-8.json"},{"revision":"a26200137de0c0d3ef5459ee264866c0","url":"scriptures/es/john-15-9-10.json"},{"revision":"ac0c2759650ad0ce8dd8083cd66ead3f","url":"scriptures/es/john-16-1-4.json"},{"revision":"b0709ec4a3730749ff5dd1817f62b60b","url":"scriptures/es/john-17-20-23.json"},{"revision":"1eca8edcaa076f4dfecca5fe04a29b8f","url":"scriptures/es/john-20-30-31.json"},{"revision":"0be3f13f365fa158daeeca6a749689f0","url":"scriptures/es/john-3-1-7.json"},{"revision":"67dc4f7b3dfc0906c4a1eafe15d37fec","url":"scriptures/es/john-3-3.json"},{"revision":"a024a8c0d2cda8bdb176c0ab6ec272ac","url":"scriptures/es/john-3-34-36.json"},{"revision":"ab93165f19200563cbaffbf7e6854deb","url":"scriptures/es/john-3-34.json"},{"revision":"ccac7c9815bb7d7493e544fca576e745","url":"scriptures/es/john-3-5.json"},{"revision":"9e73a7c62d6033f69cb5b1062df46d71","url":"scriptures/es/john-3-7.json"},{"revision":"43f0b0b44fecce2a598665a5d64a1bb9","url":"scriptures/es/john-4-23-24.json"},{"revision":"f16ad6153815196b6c928b32fd252df2","url":"scriptures/es/john-7-12-13.json"},{"revision":"de440431f09ee820d2fe9901e2477694","url":"scriptures/es/john-8-31-32.json"},{"revision":"d1b52a538afbf9c42ad31a534db943db","url":"scriptures/es/luke-11-1-4.json"},{"revision":"a02cf57565ce9e9b2f41a256ff51daa3","url":"scriptures/es/luke-12-51-53.json"},{"revision":"aaa90cd667e44764e78175f6b05cb094","url":"scriptures/es/luke-14-25-33.json"},{"revision":"5c307af4fa7b68cf66ec8b04dbed4a32","url":"scriptures/es/luke-17-20-21.json"},{"revision":"35c974edef2a703790cf6f922b62f62b","url":"scriptures/es/luke-19-10.json"},{"revision":"78349f6ddcbf8dab5974e7821fdd87d0","url":"scriptures/es/luke-23-1-3.json"},{"revision":"a93300f09e9061be89eb71528b216b18","url":"scriptures/es/luke-23-50-51.json"},{"revision":"2cd135fb029c673fa1eaa4018299deea","url":"scriptures/es/luke-24-44-49.json"},{"revision":"abcc1e888308401bb402334a3ba94688","url":"scriptures/es/luke-24-47.json"},{"revision":"e33545f035428cb7c1ffdbdfdd1ddc53","url":"scriptures/es/luke-9-1.json"},{"revision":"44f20baa0af304622dbbef35ef484d4c","url":"scriptures/es/luke-9-23-26.json"},{"revision":"ed6b445890b246647a5fea885a56c720","url":"scriptures/es/malachi-3-6-12.json"},{"revision":"0810032309ce0b3f0154b35dccc798d6","url":"scriptures/es/mark-1-14-18.json"},{"revision":"f445ba49b7fb0d956c772eaf7ad52a9f","url":"scriptures/es/mark-1-17.json"},{"revision":"866a4590c7dfe81ab7022346af178732","url":"scriptures/es/mark-16-16-18.json"},{"revision":"2aa5cb1e7bf8719b074df562523aec6f","url":"scriptures/es/mark-3-20-21.json"},{"revision":"c217d1c765634cb9bef828e315b40c88","url":"scriptures/es/mark-3-31-35.json"},{"revision":"528dfd4e6f1649f50ad971650ab315b9","url":"scriptures/es/mark-9-1.json"},{"revision":"342324e50f3198fb811e0c8318030900","url":"scriptures/es/matthew-15-1-9.json"},{"revision":"71202089e80b6e88baa2e0d33238194d","url":"scriptures/es/matthew-15-6-9.json"},{"revision":"5e334c6f9891886b4a1718c19aeb3ae6","url":"scriptures/es/matthew-16-13-19.json"},{"revision":"2b91e2b0e71488a6ba809478e3edad5f","url":"scriptures/es/matthew-16-19.json"},{"revision":"a71105ad53de1bf6fe06d5e1020e04c5","url":"scriptures/es/matthew-18-15-17.json"},{"revision":"95133fb5db99c77fe4b17fe88659cab2","url":"scriptures/es/matthew-22-37-39.json"},{"revision":"433a61f4c8f440f4bf87ea428334a90a","url":"scriptures/es/matthew-26-31-35.json"},{"revision":"392c1c37edacd39a1dbf5bbba09bf1d5","url":"scriptures/es/matthew-26-36-39.json"},{"revision":"add67b3373bbe71b71c448b81e8f52d2","url":"scriptures/es/matthew-26-36-46.json"},{"revision":"62b6a3958f3f218a1ec7a6ca551184bb","url":"scriptures/es/matthew-26-47-56.json"},{"revision":"d6e52837b41c060bd52653437d7093fb","url":"scriptures/es/matthew-26-57-68.json"},{"revision":"39c939c510f1bf73194a18ae309160ec","url":"scriptures/es/matthew-26-69-75.json"},{"revision":"8448ba5d121133a0b73b54db57246ee8","url":"scriptures/es/matthew-27-1-10.json"},{"revision":"7a839544276ae92c11af553886026435","url":"scriptures/es/matthew-27-11-26.json"},{"revision":"a894f876672d12cf204c47e24b14786e","url":"scriptures/es/matthew-27-27-31.json"},{"revision":"1c9489f61e1feaa5d549e6ac23f79d6b","url":"scriptures/es/matthew-27-32-44.json"},{"revision":"736603bca0a1329faa44d407beb19d44","url":"scriptures/es/matthew-27-45-56.json"},{"revision":"651bd06c8266ebe9a195289a06a3c7ec","url":"scriptures/es/matthew-27-46.json"},{"revision":"2f2592f97a6243c6d8feab43b7a18b46","url":"scriptures/es/matthew-27-57-61.json"},{"revision":"c5f81a43df1a9a276a624089af6d13d5","url":"scriptures/es/matthew-27-62-66.json"},{"revision":"c05ba2d802dc6044d6753a7ec491f4f6","url":"scriptures/es/matthew-28-1-10.json"},{"revision":"82d520b6637dd29b1e74657a676ab126","url":"scriptures/es/matthew-28-18-20.json"},{"revision":"71a89ebe8e0d3fcad229765beb7bddba","url":"scriptures/es/matthew-28-19-20.json"},{"revision":"1d2ef8dbe3c02bac5c61aeeb7725e80b","url":"scriptures/es/matthew-28-19.json"},{"revision":"e7255abf45512808eb735d882b2ef5b9","url":"scriptures/es/matthew-28-20.json"},{"revision":"093a8f08ff5bcf8631e1c452834147e0","url":"scriptures/es/matthew-3-1-2.json"},{"revision":"65a9f2b27e19ea396cb1768f99da036c","url":"scriptures/es/matthew-3-1-6.json"},{"revision":"c6593119bffffa40845cabd85f00814a","url":"scriptures/es/matthew-4-17.json"},{"revision":"3b302073284e48be0f713820efd18b60","url":"scriptures/es/matthew-5-10-12.json"},{"revision":"9fb45945e99ba460a0b0be0dc2740f54","url":"scriptures/es/matthew-6-25-34.json"},{"revision":"9cccc3623c961bbee4591eaf405441c5","url":"scriptures/es/matthew-6-33.json"},{"revision":"77120cb36a82832e44db7a6f3008a5ec","url":"scriptures/es/matthew-7-13-14.json"},{"revision":"89224fc513e453fd09f942261b704cc3","url":"scriptures/es/matthew-7-7-8.json"},{"revision":"9db6345f47293a4df8c02363c20e1133","url":"scriptures/es/matthew-9-2-6.json"},{"revision":"c8551cb3c8845476aae81646471961e0","url":"scriptures/es/nehemiah-13-23-27.json"},{"revision":"20a92ccbf9538d3883748aca3c652f65","url":"scriptures/es/numbers-27-12-18.json"},{"revision":"e3bd94fd1ed009096f269124f49ce0bc","url":"scriptures/es/philippians-4-13.json"},{"revision":"a899ad222406777f58933bd2f0818aad","url":"scriptures/es/philippians-4-4-7.json"},{"revision":"be4ce3e953f8f205ff32f64d2f84328c","url":"scriptures/es/philippians-4-4.json"},{"revision":"2f9038384d698037474bbdd7cbf809d8","url":"scriptures/es/phillipians-4-13.json"},{"revision":"f2336873ce09a89d8513ac893b44ec1c","url":"scriptures/es/phillipians-4-4.json"},{"revision":"bdceb3f8bd656968934891eba97de22d","url":"scriptures/es/proberbs-13-12.json"},{"revision":"dfe170d9d84f5f6b892ba81d56b1b183","url":"scriptures/es/psalm-119-1-2.json"},{"revision":"45c64f89ccb472f34c678acd18d21714","url":"scriptures/es/revelation-3-20.json"},{"revision":"2812d59b196a0ec69d25d739b7001882","url":"scriptures/es/romans-10-13.json"},{"revision":"b290a59d133b9b61740d80c28831400a","url":"scriptures/es/romans-10-9.json"},{"revision":"80ae7af7457e206b7e21c02fc373bbb2","url":"scriptures/es/romans-12-4-5.json"},{"revision":"d0a8ddaf6cb78be9122204ad7fe63b3e","url":"scriptures/es/romans-3-23-25.json"},{"revision":"ccd1d3cd52122af27cb404fa2d13ede5","url":"scriptures/es/romans-3-23.json"},{"revision":"e88c2ae363e4ca11a477f81ba520d70b","url":"scriptures/es/romans-3-25.json"},{"revision":"9407b5bb19eb57e224945afd9069f7bb","url":"scriptures/es/romans-6-1-4.json"},{"revision":"7479baedc0913413f61cef91118a9493","url":"scriptures/es/romans-6-2-4.json"},{"revision":"deed55283fd4045c3a13ed0f5a443ea9","url":"scriptures/es/romans-6-23.json"},{"revision":"de155262e5bfe86fb22e57b436e72109","url":"scriptures/es/romans-6-3-4.json"},{"revision":"4532bf614581a7fff69aec01822756a6","url":"sw-en.js"},{"revision":"8deb999fb971ba6303592d904954dbe1","url":"sw.js"}] || []).filter((entry) => {
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
