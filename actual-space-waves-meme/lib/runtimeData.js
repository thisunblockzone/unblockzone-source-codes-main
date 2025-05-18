const runtimeData = (function () {

    return {

        // Basic information.
        companyName: "ALXD",
        productName: "Geometry Dash Memes 2",
        productVersion: "0.0.0.4",
        sdkVersion: "3.19.13+merge4",
        productDescription: "",

        // File references.
        buildURL: "bin",
        loaderURL: "bin/0.0.0.4_Web_YandexGames.loader.js",
        dataURL: "bin/0.0.0.4_Web_YandexGames.data.br",
        frameworkURL: "bin/0.0.0.4_Web_YandexGames.framework.js.br",
        workerURL: "",
        codeURL: "bin/0.0.0.4_Web_YandexGames.wasm.br",
        symbolsURL: "",
        streamingURL: "streaming",

        // Visual information.
        logoType: "LOGO_TYPE",
        iconTextureName: "512_loading.jpg",
        backgroundTextureName: "background.jpg",

        // Aspect ratio.
        desktopAspectRatio: 1.777778,
        mobileAspectRatio: 1.777778,

        // Debug mode.
        debugMode: false,
        rotationLockType : "LandscapeOnly",

        // Prefs.
        prefsContainerTags: [ "json-data" ],

        // Platform specific scripts.
        wrapperScript: "yandexGamesWrapper.js",

        // YandexGames.
        yandexGamesSDK: "/sdk.js",

        // Yandex Ads Network.
        yandexGameId: "",
        yandexBannerId: "",
        yandexInterstitialDesktopId: "",
        yandexInterstitialMobileId: "",
        yandexRewardedDesktopId: "",
        yandexRewardedMobileId: "",

        // GameDistribution.
        gameDistributionId: "",
        gameDistributionPrefix: "mirragames_",

        // CrazyGames.
        crazyGamesXSollaProjectId: "",

        // Ads by Google.
        googleAdsClient: "",
        googleAdsChannel: "",
        googleAdsTest: true,

        // GamePush.
        gamepushProjectId: "",
        gamepushToken: "",

    }

})();