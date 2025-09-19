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
  ]
};

  const routes = [
    {
      url: "/",
      // Use a timestamp so the precache manifest changes when this file is rebuilt
      revision: String(Date.now()),
    },
  ];

  // Use LANG_SLUGS keys so additional languages can be supported when present
  const langs = Object.keys(LANG_SLUGS || {});

  langs.forEach((lang) => {
    const langList = LANG_SLUGS[lang] || [];
    langList.forEach((slug) => {
      routes.push({
        url: `/${lang}/${slug}`,
        // Use a timestamp to force update when this script is regenerated
        revision: String(Date.now()),
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
  const precacheManifest = ([{"revision":"42955a9d45b2463b5762819b84a82edb","url":"css/style.css"},{"revision":"c313a1a90da0b2010235c52dbc3424d2","url":"img/en/darkness-vs-light.svg"},{"revision":"8f871ab1fb6e86951c12cb2f937a0f8d","url":"img/en/died-resurrected.svg"},{"revision":"64967b493903b7215a26c2f44dc4c536","url":"img/en/father-children.svg"},{"revision":"58216046bc6ecf15660346dc4045ef44","url":"img/en/head-body-christ-church.svg"},{"revision":"8418fc68929add7d18dce86b09cc35ad","url":"img/en/sin.svg"},{"revision":"d1aa56e4ac1574c8384500a17668f631","url":"img/en/wages-vs-gift.svg"},{"revision":"2ce897ab8147211dd71cdc44036c6dc3","url":"img/en/wall.svg"},{"revision":"097035629340546ead7a74f464d88760","url":"js/global.js"},{"revision":"965caadc55007f57fd2ba1369e8baa1e","url":"scriptures/en/_template.json"},{"revision":"c28119b474ba211df3c76de0db7e3eb2","url":"scriptures/en/1-corinthians-1-10-13.json"},{"revision":"b6b6ff28564ddeff0b6e8389e01281bb","url":"scriptures/en/1-corinthians-1-10-17.json"},{"revision":"1d3b27f027a5b5f89ffb5c0bebd586aa","url":"scriptures/en/1-corinthians-1-17.json"},{"revision":"940e1838522abce90994649a0017f6b6","url":"scriptures/en/1-corinthians-11-23-32.json"},{"revision":"752bc537fabcfe36d57d72a9e6c9fa8b","url":"scriptures/en/1-corinthians-12-12-13.json"},{"revision":"8391688d59b0c1a0caa0dc36b97f9c64","url":"scriptures/en/1-corinthians-12-14-27.json"},{"revision":"8bcdb290c73db38d749da32e303d9a7c","url":"scriptures/en/1-corinthians-12-21.json"},{"revision":"6d0b319eb6c4e1515ddb9e6e9d74a55c","url":"scriptures/en/1-corinthians-12-26.json"},{"revision":"74effd4ccdf15a8d660c4f4bf563e1d8","url":"scriptures/en/1-corinthians-12-28-30.json"},{"revision":"90b896b0108c589c90a584a82620a289","url":"scriptures/en/1-corinthians-12-8-10.json"},{"revision":"6496da399ca031e2ce2771efad34f831","url":"scriptures/en/1-corinthians-13-8-10.json"},{"revision":"091d5bf9f75f21ef873b0c03c57afd7c","url":"scriptures/en/1-corinthians-14-20-22.json"},{"revision":"8d3bcc286f31ce4ce5f5392f70610cdf","url":"scriptures/en/1-corinthians-3-11.json"},{"revision":"806f5a14097b73e5eb439b72e1833826","url":"scriptures/en/1-corinthians-7-39.json"},{"revision":"676bc6b049352fd85beb1ce42a5f792e","url":"scriptures/en/1-corinthians-ch-12.json"},{"revision":"7daea0106bc192e30b315e041af38f6b","url":"scriptures/en/1-corinthians-ch-14.json"},{"revision":"0f82e0769edb7cf320adee5d151e318e","url":"scriptures/en/1-john-1-9.json"},{"revision":"982be9edd24ae58f57cc93a314f9820b","url":"scriptures/en/1-kings-11-1-10.json"},{"revision":"e89e40ccdc206362ed3884a0f1037260","url":"scriptures/en/1-peter-1-21.json"},{"revision":"c3d5673790ff65758e52ced63f0d9af5","url":"scriptures/en/1-peter-2-9-10.json"},{"revision":"c91af4e16826f1923b4aa266c107ac2b","url":"scriptures/en/1-peter-3-1-7.json"},{"revision":"6149e0417d979e201c549c1f4f138325","url":"scriptures/en/1-peter-3-21.json"},{"revision":"3f4aa991a01efbca8ca0d8176159e0bf","url":"scriptures/en/1-peter-4-12-16.json"},{"revision":"b8449461712195e8272cf6085d55bec5","url":"scriptures/en/1-peter-4-3-4.json"},{"revision":"989fbbc98632c02b0f00c701bc30bb4c","url":"scriptures/en/1-thessalonians-5-12-14.json"},{"revision":"587859708fcf893dc7de02983ef916d1","url":"scriptures/en/1-timothy-2-3-4.json"},{"revision":"5d71c41f454b79d74f6a5bd57b6b7df7","url":"scriptures/en/1-timothy-4-16.json"},{"revision":"7f2235244326935e12e7971c1483095d","url":"scriptures/en/2-corinthians-6-14-18.json"},{"revision":"e7e91c638f250d0b805e0a57a90fe36b","url":"scriptures/en/2-corinthians-9-6-11.json"},{"revision":"74178ea23f183d43f4f0524967b3d3b5","url":"scriptures/en/2-corinthians-9-6-8.json"},{"revision":"745da6425e1a3ecd6694db9af795592c","url":"scriptures/en/2-peter-1-20-21.json"},{"revision":"f5ced75d83897184ddf46bbf6ada3ca2","url":"scriptures/en/2-thessalonians-2-9-12.json"},{"revision":"56e39f7daf3d6f97c097c08df91ed448","url":"scriptures/en/2-timothy-3-1-5.json"},{"revision":"b423ec3f54d3799e1a604973bd739a48","url":"scriptures/en/2-timothy-3-12.json"},{"revision":"d7d3ae17463f9e794c16139d5645eb6e","url":"scriptures/en/2-timothy-3-16-17.json"},{"revision":"ffab3997b06847d6df43121cb3087f1e","url":"scriptures/en/acts-1-12-14.json"},{"revision":"8c19690abc8f84083bb5d03cc5c2b64f","url":"scriptures/en/acts-1-18-19.json"},{"revision":"db3aa2ddcad7d4d9eec2ff767ac08575","url":"scriptures/en/acts-1-4-5.json"},{"revision":"6abf0b7d8706b0cd1065157fc0ad00e2","url":"scriptures/en/acts-1-8.json"},{"revision":"47ca5607f52f26e7d73f1f3ce541a283","url":"scriptures/en/acts-10-44.json"},{"revision":"0ea234b3fe6f3e157fd19823bc06c3ad","url":"scriptures/en/acts-10-48.json"},{"revision":"45de836cdffacd305bacc4aa61d9b724","url":"scriptures/en/acts-11-1-18.json"},{"revision":"64d21013669bc5a44cd54a7d3680d9da","url":"scriptures/en/acts-11-14.json"},{"revision":"89f8eb80fff88b2b92e0ce846002f543","url":"scriptures/en/acts-11-15.json"},{"revision":"fdd6e239ebb4b9cbd0abd8c8d052c2bd","url":"scriptures/en/acts-11-19-26.json"},{"revision":"eca0965d3033fef2799bc7d10e19f745","url":"scriptures/en/acts-11-21.json"},{"revision":"18c9d44240169f7864ab06f05497d40d","url":"scriptures/en/acts-11-25-26.json"},{"revision":"26e837cdbfbf590aa747881f2358fb10","url":"scriptures/en/acts-12-24.json"},{"revision":"30e9f105d680493359cc38fd39d03ac9","url":"scriptures/en/acts-13-3.json"},{"revision":"70e2cf011e649e9006f39b34350491e1","url":"scriptures/en/acts-13-49.json"},{"revision":"0133b36855cc3ea82c7cc93978302ac5","url":"scriptures/en/acts-14-1.json"},{"revision":"686350d08cf27eaf618ffb415ab69b1c","url":"scriptures/en/acts-14-21.json"},{"revision":"10b300d363f37d06ad2da503bd57a2f1","url":"scriptures/en/acts-16-22-34.json"},{"revision":"0530efea2e2674ef37fd0e69edf8f822","url":"scriptures/en/acts-16-5.json"},{"revision":"c935c46a1b9ba3bf991c292cc41e823c","url":"scriptures/en/acts-17-10-12.json"},{"revision":"f710afa7da7a1f8ffe4f3db3bcbddaa6","url":"scriptures/en/acts-17-26-28.json"},{"revision":"6448b8cc66b8c825cab651ab860bf1d6","url":"scriptures/en/acts-17-4.json"},{"revision":"82c1eceba533fe6977da331dc2e52446","url":"scriptures/en/acts-17-6-rsv.json"},{"revision":"0f003b7dfa2efd3ef15c6a0eadf2c432","url":"scriptures/en/acts-18-24-26.json"},{"revision":"2902084faf3c5308a9ccd86d9d53edf4","url":"scriptures/en/acts-19-1-5.json"},{"revision":"86a15db46176d5e9cd06d5eab8ea760d","url":"scriptures/en/acts-19-1-6.json"},{"revision":"e93a107e15e693ab204f7f38000f04cb","url":"scriptures/en/acts-19-5.json"},{"revision":"0e612abe14ae4d3660b0a45ad33981ef","url":"scriptures/en/acts-19-6.json"},{"revision":"ee3cf9285a1bd28d618f269c666fad9c","url":"scriptures/en/acts-2-1-4.json"},{"revision":"667b7716f6d0e1904bf6d024739ff672","url":"scriptures/en/acts-2-14.json"},{"revision":"ab4ac586d064694e79d3a26671fe5869","url":"scriptures/en/acts-2-17.json"},{"revision":"083a89c96bd79d757a67580ba48b3f16","url":"scriptures/en/acts-2-22-24.json"},{"revision":"85e873fd0be558931480258fac36e59e","url":"scriptures/en/acts-2-22.json"},{"revision":"ab0f315017ad7ab3abc2003e40ea8338","url":"scriptures/en/acts-2-23.json"},{"revision":"dbb4b021f5cbc9f61a3f949f54b38bd5","url":"scriptures/en/acts-2-24.json"},{"revision":"8bd72195ef87a1ae84e43ef879f0c7a2","url":"scriptures/en/acts-2-36-37.json"},{"revision":"d58b18cc205b58ab79ac208a0af8a5d3","url":"scriptures/en/acts-2-36-47.json"},{"revision":"4fbc248075e5249a74fe27f7067e5074","url":"scriptures/en/acts-2-37-38.json"},{"revision":"4275cf9913cdc730205ab012b4d47cd9","url":"scriptures/en/acts-2-37-42.json"},{"revision":"67575a8d5661411e2a7dc3a1be8a43d2","url":"scriptures/en/acts-2-38-42.json"},{"revision":"63aef12280b70363cd114fba3b7413d5","url":"scriptures/en/acts-2-38.json"},{"revision":"591f8abeed83b8886d5b0699d64047b0","url":"scriptures/en/acts-2-41.json"},{"revision":"59570d2c4499181141f5fbf68710cf23","url":"scriptures/en/acts-2-42.json"},{"revision":"071838f40dc8888d757fcbb7ef653ea7","url":"scriptures/en/acts-2-47.json"},{"revision":"a7e12307a32439f4a8ee04cb1b58e953","url":"scriptures/en/acts-2-5.json"},{"revision":"bfeb378405cc56a7a68c548b12333e62","url":"scriptures/en/acts-22-16.json"},{"revision":"04fcc61339c96c66c2942e1fe1517bea","url":"scriptures/en/acts-22-3-16.json"},{"revision":"feb75e50566e3341d120385bb2d14198","url":"scriptures/en/acts-28-21-22.json"},{"revision":"82e0c7745434a746de9ed9d5cb0c905c","url":"scriptures/en/acts-28-22.json"},{"revision":"36b356ba9b44260b48990526806c20c4","url":"scriptures/en/acts-28-30.json"},{"revision":"fae645d2276f8ef7b4b1bd3e2a5522ff","url":"scriptures/en/acts-28-5.json"},{"revision":"fdeb104b19c196e8283f892ae60c664c","url":"scriptures/en/acts-28-8.json"},{"revision":"5fdd579b4650ae103be91d6944091e52","url":"scriptures/en/acts-4-12.json"},{"revision":"305917e8f3ed691d45aca88ec38917a1","url":"scriptures/en/acts-4-4.json"},{"revision":"6485f4bc211df724da74317333236065","url":"scriptures/en/acts-5-14.json"},{"revision":"ec066adecb2dc6eb30174523dcd97af1","url":"scriptures/en/acts-5-17-18.json"},{"revision":"3a63ee6dff80c6098b0df9f7730198dc","url":"scriptures/en/acts-5-38-42.json"},{"revision":"678659c689469cf621cf31f6afea8f5c","url":"scriptures/en/acts-6-1-8.json"},{"revision":"02ebdde8e03ce033b48a63bd3c8de76f","url":"scriptures/en/acts-6-1.json"},{"revision":"6ceeda7ed7d5c6406590742050f98cba","url":"scriptures/en/acts-6-7.json"},{"revision":"d95970233ad07982c2db70854f81ce22","url":"scriptures/en/acts-6-8.json"},{"revision":"fae51abbaf3274e6cfecd123a2ec5d5d","url":"scriptures/en/acts-8-1-25.json"},{"revision":"7d4af1a7a874d555fa27bd995579f9f9","url":"scriptures/en/acts-8-12.json"},{"revision":"1a1a40de42cccf13884cdb17a171779e","url":"scriptures/en/acts-8-13.json"},{"revision":"cb4dfd60dae6099d8c2c0ef67e9af00d","url":"scriptures/en/acts-8-18.json"},{"revision":"6cd576ba4186426b3e44414def0d4bee","url":"scriptures/en/acts-8-26-39.json"},{"revision":"3266bbd536650342165e1b0267f9fedd","url":"scriptures/en/acts-8-4.json"},{"revision":"50038c016d16c175e31619c74bdf2a99","url":"scriptures/en/acts-9-1-22.json"},{"revision":"64e8866ba5a4760392549d91b15124d5","url":"scriptures/en/acts-9-17-18.json"},{"revision":"82c556accce2beaf451abe2ba88e6d6a","url":"scriptures/en/acts-9-18-25.json"},{"revision":"601b84d90a80ea5d04aadbb2eb7539f0","url":"scriptures/en/acts-9-31.json"},{"revision":"0e905bd9b93a6177cb80020b02e9ca7b","url":"scriptures/en/acts-ch-1-ch-2.json"},{"revision":"35ee4f8c8472af06e6dc1245f198de1c","url":"scriptures/en/acts-ch-10.json"},{"revision":"1fc64ea439532e1a7ce2971b40bb1107","url":"scriptures/en/acts-ch-2.json"},{"revision":"7c524130f9d3283226728b51049d2221","url":"scriptures/en/colossians-1-15-18.json"},{"revision":"e04ad28177f5ff819a05b9ed6fcecc8f","url":"scriptures/en/colossians-1-23.json"},{"revision":"54a8f94849bdfc7b6e4d1ce9f6f95d10","url":"scriptures/en/colossians-1-28-29.json"},{"revision":"a9a3ca3035cc1c4e44c3bec681a45d09","url":"scriptures/en/colossians-1-6.json"},{"revision":"5334a105f37bb07c4a2b53847f73dbc1","url":"scriptures/en/colossians-2-11-12.json"},{"revision":"b9b78e0a1e2a61e6c203c7ba102706c0","url":"scriptures/en/colossians-2-12.json"},{"revision":"81f1130a6f07a71d6e516939abf6074a","url":"scriptures/en/colossians-3-1-4.json"},{"revision":"833eada33b907f17c3b868b4a89e20cd","url":"scriptures/en/colossians-3-12-14.json"},{"revision":"e2f22c02539fd4237b5a3737ebada71c","url":"scriptures/en/colossians-3-15-16.json"},{"revision":"b85511fd83dc38737210430f81e7b54f","url":"scriptures/en/colossians-3-15.json"},{"revision":"f8228811b204832c78e38980a2f47eb1","url":"scriptures/en/colossians-3-17.json"},{"revision":"30898b11b21f07d12e2177b0348e5acc","url":"scriptures/en/colossians-3-18-21.json"},{"revision":"f273a09de26a76050b4a94fc0764e577","url":"scriptures/en/colossians-3-22.json"},{"revision":"0a6aff43ee3ba5f00229211cb7bf36b1","url":"scriptures/en/colossians-3-5-11.json"},{"revision":"a28dc57c42346e110b48f321aacd17db","url":"scriptures/en/colossians-4-1.json"},{"revision":"a78c76ce9bf61446a084f798753162f6","url":"scriptures/en/colossians-ch-3-15-ch-4-1.json"},{"revision":"5e6d92eca21af7e14ff5c9b612307d97","url":"scriptures/en/daniel-2-31-45.json"},{"revision":"54c2fcd83399417e4ea6cc28cf9a06aa","url":"scriptures/en/daniel-2-44.json"},{"revision":"9a914fdb75d00122f52f97f2bcb48989","url":"scriptures/en/ephesians-2-19-21.json"},{"revision":"8cf767541a934a11d62079a9d4392782","url":"scriptures/en/ephesians-2-8.json"},{"revision":"33e783bc7c3018ac7876a1317f2777a9","url":"scriptures/en/ephesians-3-20.json"},{"revision":"a250629a1cbd44c282662afc1b172a64","url":"scriptures/en/ephesians-4-4-6.json"},{"revision":"7827145c700a9912fc6fce0a15ed513e","url":"scriptures/en/ephesians-5-18-19.json"},{"revision":"940122b6779fdec63782b38bed746853","url":"scriptures/en/ephesians-5-19-20.json"},{"revision":"76354d44022d4d25ab11b0965a38c2c0","url":"scriptures/en/ephesians-6-10-18.json"},{"revision":"4e7ab2299e35935b46d84f6813ef1e22","url":"scriptures/en/ezekiel-18-20.json"},{"revision":"11798ea27b1ad5062677cb7c7ef0b86d","url":"scriptures/en/galatians-1-8.json"},{"revision":"aca0898cf5d6426d0a346e90eca6ae65","url":"scriptures/en/galatians-5-19-21.json"},{"revision":"1eaf9128f20bb21b4ab38032ccb74fc8","url":"scriptures/en/galatians-6-1-2.json"},{"revision":"2cc84201474ffc8727b538db1a89d5b2","url":"scriptures/en/genesis-2-19.json"},{"revision":"7565dbb2d1c2ed2640b3e1b7af4827df","url":"scriptures/en/hebrews-10-23-25.json"},{"revision":"75cdc9d26a64521471b57144f27e2275","url":"scriptures/en/hebrews-10-23.json"},{"revision":"0944bcf67cc0f8c52b8261794d53dff6","url":"scriptures/en/hebrews-10-24.json"},{"revision":"62e3246aff2c245f8baccd2acf75b866","url":"scriptures/en/hebrews-12-14-15.json"},{"revision":"9e171f5beb5e3bf43308ef400644526f","url":"scriptures/en/hebrews-12-15.json"},{"revision":"90b207136e5c24f2a0f5e21d721c0bfe","url":"scriptures/en/hebrews-13-17.json"},{"revision":"33cd6821c436da43df536ee285087db5","url":"scriptures/en/hebrews-3-12-14.json"},{"revision":"370cea30d544c427f8ef85b9b06d5ee0","url":"scriptures/en/hebrews-4-12-13.json"},{"revision":"239d2392217af70f9f02df41c5394ed7","url":"scriptures/en/hebrews-5-11-14.json"},{"revision":"23ebe70bc889bf65ea29fea62c1a9785","url":"scriptures/en/hebrews-6-1-3.json"},{"revision":"b4011495864e5dd2bad3991092052c45","url":"scriptures/en/hebrews-ch-5-11-ch-6-6.json"},{"revision":"80a845d5f0893d77c046fe9108714baa","url":"scriptures/en/isaiah-2-1-4.json"},{"revision":"87a9f5005bc2c5cb9d7f106ae3868418","url":"scriptures/en/isaiah-2-2.json"},{"revision":"bc4c8ac736e714d5e802d398e69594b7","url":"scriptures/en/isaiah-2-3.json"},{"revision":"cc336c90d96f7f4f413b46f4e8eaf33e","url":"scriptures/en/isaiah-53-4-6.json"},{"revision":"91e4c4677f2cc4b23454a0f80654eed1","url":"scriptures/en/isaiah-59-1-2.json"},{"revision":"c6fab68014bfa5a50c2c9f7534711cd9","url":"scriptures/en/james-1-22-25.json"},{"revision":"8a5f2f9ceb7286b3dcb0f72dc26fd3da","url":"scriptures/en/james-4-17.json"},{"revision":"e09d1f3d7827635fcd38823666e1a640","url":"scriptures/en/james-5-16-18.json"},{"revision":"f5ea151bb505fd6d7481cea3a3386a14","url":"scriptures/en/james-5-16.json"},{"revision":"fcc2db20253d82b108d0b410e5f93155","url":"scriptures/en/jeremiah-29-11-14.json"},{"revision":"0e8450f302efa07cc91a54fa3fdc3e6a","url":"scriptures/en/jeremiah-29-11.json"},{"revision":"bdcade7c553aeb0e9032abda4b8a9706","url":"scriptures/en/john-10-19-21.json"},{"revision":"58db56e9104ff8f825da668fdd4a29be","url":"scriptures/en/john-12-48.json"},{"revision":"80281b8b88f923fead0be997fab8ec27","url":"scriptures/en/john-13-34-35.json"},{"revision":"b239528844660e884a3cf5c09724c77d","url":"scriptures/en/john-15-1-16.json"},{"revision":"619e8f2f647a146ead2d0717d92d680a","url":"scriptures/en/john-15-16.json"},{"revision":"baca769520d9361eda5e2dfe60c0980e","url":"scriptures/en/john-15-18-20.json"},{"revision":"39b4206451a1f361c32af5bcc904cc1c","url":"scriptures/en/john-15-8.json"},{"revision":"e853e244dc455f08bc41c9445626201b","url":"scriptures/en/john-15-9-10.json"},{"revision":"ab2283c9025903c8fd2869e46ffe2f4a","url":"scriptures/en/john-16-1-4.json"},{"revision":"cde5de865b52a44b4468ef681869cb50","url":"scriptures/en/john-17-20-23.json"},{"revision":"115d56aa0f2a156aeb743a946bcb1b23","url":"scriptures/en/john-20-30-31.json"},{"revision":"ac6dc5e4fe9e6ead9ad443b893ab0111","url":"scriptures/en/john-3-1-7.json"},{"revision":"3fad57ad4d08da768ff72d3367e6ecf9","url":"scriptures/en/john-3-3.json"},{"revision":"d6f5c1c7ee83548fb064bc4c66a0c03f","url":"scriptures/en/john-3-34-36.json"},{"revision":"1c37e039ca2ee4def3b5bcb90bc7c232","url":"scriptures/en/john-3-34.json"},{"revision":"c70fc8eb52f505568b671023094d90c0","url":"scriptures/en/john-3-5.json"},{"revision":"fd2c2edb1bf1e8510c007222287170e7","url":"scriptures/en/john-3-7.json"},{"revision":"f6a087b833be6c6652fd3fd0b094c633","url":"scriptures/en/john-4-23-24.json"},{"revision":"318755b95e67e879c1fb743e077e02e1","url":"scriptures/en/john-7-12-13.json"},{"revision":"a5634385801eb8527667ad8e3ac2a930","url":"scriptures/en/john-8-31-32.json"},{"revision":"1ba505249ab5ac65008350720e889b70","url":"scriptures/en/luke-11-1-4.json"},{"revision":"740eb61f40bafdce87c9b6e6de0b4247","url":"scriptures/en/luke-12-51-53.json"},{"revision":"76486fa471eb377e45af2aa108ada13b","url":"scriptures/en/luke-14-25-33.json"},{"revision":"384187c384ea907e88ea2a09e56e13b8","url":"scriptures/en/luke-17-20-21.json"},{"revision":"7921a86638d98ced929c1686a821a467","url":"scriptures/en/luke-19-10.json"},{"revision":"929c13a5a6c067efa9d6397cba5dc0ce","url":"scriptures/en/luke-23-1-3.json"},{"revision":"92488d4962570c7f270c4d9a26e53074","url":"scriptures/en/luke-23-50-51.json"},{"revision":"56e2a88d8a2801e7fe243718ed843f7b","url":"scriptures/en/luke-24-44-49.json"},{"revision":"2f178d75395845fc935d5b9ad117c91b","url":"scriptures/en/luke-24-47.json"},{"revision":"11eef98ebe89dbc9b863841e65b71727","url":"scriptures/en/luke-9-1.json"},{"revision":"0fc6cd3a5aff506691e0b775a6bc7810","url":"scriptures/en/luke-9-23-26.json"},{"revision":"52b2f6cbbb8ce1c9252ef40acc993ec3","url":"scriptures/en/malachi-3-6-12.json"},{"revision":"6152e782fa6dd8784f1b431f3e8aac63","url":"scriptures/en/mark-1-14-18.json"},{"revision":"db1ef6efa3e926c24bc98800ded5430c","url":"scriptures/en/mark-1-17.json"},{"revision":"0bd32f91123a39906c5e8ef434955b96","url":"scriptures/en/mark-16-16-18.json"},{"revision":"e1356ee49c982b630662495f8a1d1ebf","url":"scriptures/en/mark-3-20-21.json"},{"revision":"b4db70ea4b6992b5402c83fb84cd2367","url":"scriptures/en/mark-3-31-35.json"},{"revision":"e92904ebcdb5b73756c4455f1752e735","url":"scriptures/en/mark-9-1.json"},{"revision":"2362916e6c2a8893bd0efaa43b27526f","url":"scriptures/en/matthew-15-1-9.json"},{"revision":"c867eefb962b8b41fdca3be75e406e6d","url":"scriptures/en/matthew-15-6-9.json"},{"revision":"dfce597ade33ceb90c021a242554c865","url":"scriptures/en/matthew-16-13-19.json"},{"revision":"7ac1cd1c387a22af043992b15a7ca81e","url":"scriptures/en/matthew-16-19.json"},{"revision":"3e1b7e6567aecd01a9ce8c18998aec26","url":"scriptures/en/matthew-18-15-17.json"},{"revision":"0fb6e1289368109ea5eff1a55bc007e4","url":"scriptures/en/matthew-22-37-39.json"},{"revision":"4f850f3353ecc82419e3679d0994aa29","url":"scriptures/en/matthew-26-31-35.json"},{"revision":"fb90969d36953fd3a929a3cd47ddc1f3","url":"scriptures/en/matthew-26-36-39.json"},{"revision":"967053fcd23342d85f09ef08e5bca4ef","url":"scriptures/en/matthew-26-36-46.json"},{"revision":"d34c9789bdbf01dc6ccc0456d426484c","url":"scriptures/en/matthew-26-47-56.json"},{"revision":"1b02cec7d64f0da8eb655bf0efa4618f","url":"scriptures/en/matthew-26-57-68.json"},{"revision":"02fc0db1e3f1856a04952fc71abdc558","url":"scriptures/en/matthew-26-69-75.json"},{"revision":"02adf5d0d2805e1470f1bd91232bed8b","url":"scriptures/en/matthew-27-1-10.json"},{"revision":"0816740676c7f93047e09dd6e8311d72","url":"scriptures/en/matthew-27-11-26.json"},{"revision":"04c39ee2d266da5e3f10ff68b0a63f27","url":"scriptures/en/matthew-27-27-31.json"},{"revision":"51249cef9417898a1bad48ce72884728","url":"scriptures/en/matthew-27-32-44.json"},{"revision":"c1838fb7b771b34bed835697a4301631","url":"scriptures/en/matthew-27-45-56.json"},{"revision":"8e6580143413a64afaac3c50341934cd","url":"scriptures/en/matthew-27-46.json"},{"revision":"ee68771827b45c9b5238e4345368d264","url":"scriptures/en/matthew-27-57-61.json"},{"revision":"231f41c11a6fbdba6801ca44e91ad6a9","url":"scriptures/en/matthew-27-62-66.json"},{"revision":"71482b6150f8cff63937ef2ae5139edb","url":"scriptures/en/matthew-28-1-10.json"},{"revision":"cfcbb1f9575b0598705182debef08b72","url":"scriptures/en/matthew-28-18-20.json"},{"revision":"8f822f1ef65ee3760793147f59aba3c1","url":"scriptures/en/matthew-28-19-20.json"},{"revision":"04dcb7c23acc8f0617e266c9564e75ce","url":"scriptures/en/matthew-28-19.json"},{"revision":"eaedc7f311ec84610ad743b16c585f24","url":"scriptures/en/matthew-28-20.json"},{"revision":"69f37d58e52739a1ebf5a85d20ddebfd","url":"scriptures/en/matthew-3-1-2.json"},{"revision":"932f42a74dba8acf463c229a23033ea9","url":"scriptures/en/matthew-3-1-6.json"},{"revision":"8443c8852b0c35082a529c8e9448f4d2","url":"scriptures/en/matthew-4-17.json"},{"revision":"6acb6d90ebeb4b8bdfd79a2d1be998e2","url":"scriptures/en/matthew-5-10-12.json"},{"revision":"742ac8643670e7bed43fe93df49a0ef4","url":"scriptures/en/matthew-6-25-34.json"},{"revision":"efce09dbae54905bf56a64dd9c91ea7e","url":"scriptures/en/matthew-6-33.json"},{"revision":"75af7df11168d3b3050ea7b03ecea3bd","url":"scriptures/en/matthew-7-13-14.json"},{"revision":"5cf716a7bb1f1c35e0d29afaa850943b","url":"scriptures/en/matthew-7-7-8.json"},{"revision":"c86f30292a7ab2b9e5d51fec0971fd3a","url":"scriptures/en/matthew-9-2-6.json"},{"revision":"a6e51da0c023f2d58610e1ecbc848db5","url":"scriptures/en/nehemiah-13-23-27.json"},{"revision":"85b07e046d70e0df7227c3d2ebb8a833","url":"scriptures/en/numbers-27-12-18.json"},{"revision":"5a6377f413be31321ce21d04e08b2523","url":"scriptures/en/philippians-4-13.json"},{"revision":"b198e1def376b85d3227f0f26bf684a8","url":"scriptures/en/philippians-4-4-7.json"},{"revision":"5ec234d3c6326ee3b9184370efd7ca74","url":"scriptures/en/philippians-4-4.json"},{"revision":"bb2cfa1be73a97f44d0f1bd671ac736d","url":"scriptures/en/phillipians-4-13.json"},{"revision":"f7d859358f69099bb90a666c5773b0be","url":"scriptures/en/phillipians-4-4.json"},{"revision":"c5320447f3872b23641ac5a863844905","url":"scriptures/en/proberbs-13-12.json"},{"revision":"8c270a33d976be70175d1c7e682b4149","url":"scriptures/en/psalm-119-1-2.json"},{"revision":"e5220800c93cb06d5c69335678cc586f","url":"scriptures/en/revelation-3-20.json"},{"revision":"b2d1dba6e1838db6359f60a85037fe86","url":"scriptures/en/romans-10-13.json"},{"revision":"05c2f287837c5f90cde8fcfd271ff415","url":"scriptures/en/romans-10-9.json"},{"revision":"1c27289b046480d696bf8cd718d49d61","url":"scriptures/en/romans-12-4-5.json"},{"revision":"5eb1bc5179fc818d86665873dcc7189f","url":"scriptures/en/romans-3-23-25.json"},{"revision":"f61c82939dbbf68853cc00952c56fe9f","url":"scriptures/en/romans-3-23.json"},{"revision":"b4d5c6bf00f7a9db384800f3a411bc23","url":"scriptures/en/romans-3-25.json"},{"revision":"49b56891c01d835c2965abe599f15f1b","url":"scriptures/en/romans-6-1-4.json"},{"revision":"b452a512e919db87a5a485a91e062d75","url":"scriptures/en/romans-6-2-4.json"},{"revision":"aa6a5a5df94b89a3b54d179ca6652225","url":"scriptures/en/romans-6-23.json"},{"revision":"b79a6fdce35b8891c32b50873ce4d954","url":"scriptures/en/romans-6-3-4.json"},{"revision":"eeb9066","url":"/"},{"revision":"eeb9066","url":"/en/after-baptism-now-what"},{"revision":"eeb9066","url":"/en/baptism-holy-spirit"},{"revision":"eeb9066","url":"/en/best-friends-all-time"},{"revision":"eeb9066","url":"/en/book-of-acts"},{"revision":"eeb9066","url":"/en/book-of-john"},{"revision":"eeb9066","url":"/en/christ-is-your-life"},{"revision":"eeb9066","url":"/en/church"},{"revision":"eeb9066","url":"/en/course-information"},{"revision":"eeb9066","url":"/en/cross"},{"revision":"eeb9066","url":"/en/dashboard"},{"revision":"eeb9066","url":"/en/discipleship"},{"revision":"eeb9066","url":"/en/intro-to-course"},{"revision":"eeb9066","url":"/en/introduction"},{"revision":"eeb9066","url":"/en/kingdom"},{"revision":"eeb9066","url":"/en/light-darkness"},{"revision":"eeb9066","url":"/en/medical-account"},{"revision":"eeb9066","url":"/en/memory-scriptures"},{"revision":"eeb9066","url":"/en/miraculous-gifts-holy-spirit"},{"revision":"eeb9066","url":"/en/new-testament-conversion"},{"revision":"eeb9066","url":"/en/persecution"},{"revision":"eeb9066","url":"/en/seeking-god"},{"revision":"eeb9066","url":"/en/subscribe"},{"revision":"eeb9066","url":"/en/the-mission"},{"revision":"eeb9066","url":"/en/word"}] || []).filter((entry) => {
    const url = typeof entry === "string" ? entry : entry.url;
    return !(/^\/?audio\//i.test(url) || /\.webm(\?.*)?$/i.test(url));
  });
  workbox.precaching.precacheAndRoute(precacheManifest.concat(routes), {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  });

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
