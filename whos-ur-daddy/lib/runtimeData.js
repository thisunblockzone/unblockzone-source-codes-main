const runtimeData = (function () {

    return {

        // Basic information.
        companyName: "DefaultCompany",
        productName: "Who Your Daddy",
        productVersion: "1.0",
        sdkVersion: "3.17.18",
        productDescription: "",

        // File references.
        buildURL: "bin",
        loaderURL: "bin/Who Your Daddy_Web_YandexGames.loader.js",
        dataURL: "bin/Who Your Daddy_Web_YandexGames.data.gz",
        frameworkURL: "bin/Who Your Daddy_Web_YandexGames.framework.js.gz",
        workerURL: "",
        codeURL: "bin/Who Your Daddy_Web_YandexGames.wasm.gz",
        symbolsURL: "",
        streamingURL: "streaming",

        // Visual information.
        logoType: "ThreeJs",
        iconTextureName: "game_logo_256x256.png",
        backgroundTextureName: "background_1280x720.png",

        // Aspect ratio.
        desktopAspectRatio: -1,
        mobileAspectRatio: -1,

        // Debug mode.
        debugMode: false,

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

    }

})();