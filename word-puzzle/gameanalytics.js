const GAME_ANALYTICS = (

	function () {

		const VERSION = "v1.0.0";
		const IS_DEBUG = !!SDK_INTERFACE.getDebugLevel();
		let promise = null;

		const URL = "//download.gameanalytics.com/js/GameAnalytics-4.4.5.min.js";
		const BUILD = SDK_INTERFACE_SETTINGS.GA_BUILD || "famobi-web 1.0.0";

		const GAME_KEY = SDK_INTERFACE_SETTINGS.GA_GAME_ID || "";
		const SECRET_KEY = SDK_INTERFACE_SETTINGS.GA_SECRET_ID || "";

		function init() {

			if (promise) {
				return promise;
			}

			promise = new Promise((resolve, reject) => {

				IS_DEBUG && console.log("[GameAnalytics] init...");

				if(!SDK_INTERFACE_SETTINGS.features.gameanalytics) {
					return reject("[GameAnalytics] GA is not supported (feature 'gameanalytics' is disabled)");
				}

				const game_key = GAME_KEY;
				const secret_key = SECRET_KEY;

				if(!(typeof game_key === "string" && game_key.length && typeof secret_key === "string" && secret_key.length)) {
					return reject("[GameAnalytics] GA is not supported (missing or invalid keys)");
				}

				const build = BUILD;

				const setEnabledInfoLog = IS_DEBUG;
				const setEnabledEventSubmission = true;

				// available items
				const resource_currencies = null; // []
				const resource_item_types = null; // []
				const custom_01 = null; // []
				const custom_02 = null; // []
				const custom_03 = null; // []


				const onScriptLoaded = () => {

					if(typeof GameAnalytics !== "undefined") {

						IS_DEBUG && console.log(
							"[GameAnalytics] Initializing...",
							{
								game_key: GAME_KEY,
								build,
								setEnabledInfoLog,
								setEnabledEventSubmission,
								resource_currencies,
								resource_item_types,
								custom_01,
								custom_02,
								custom_03
							}
						);
						
						GameAnalytics("setEnabledInfoLog", setEnabledInfoLog);
						GameAnalytics("setEnabledEventSubmission", setEnabledEventSubmission);
						GameAnalytics("configureBuild", BUILD);

						resource_currencies && GameAnalytics("configureAvailableResourceCurrencies", resource_currencies);
						resource_item_types && GameAnalytics("configureAvailableResourceItemTypes", resource_item_types);
						custom_01 && GameAnalytics("configureAvailableCustomDimensions01", custom_01);
						custom_02 && GameAnalytics("configureAvailableCustomDimensions02", custom_02);
						custom_03 && GameAnalytics("configureAvailableCustomDimensions03", custom_03);

						GameAnalytics("initialize", game_key, secret_key)

						resolve();
					}

					reject("[GameAnalytics] GA is not ready");
				};

				SDK_INTERFACE.loadFile(URL).then(onScriptLoaded).catch(e => {IS_DEBUG && console.log(e)});
			});

			return promise;
		};

		init().catch(e => {IS_DEBUG && console.log(e)});

		return {
			init: init,
		};
	}
)();