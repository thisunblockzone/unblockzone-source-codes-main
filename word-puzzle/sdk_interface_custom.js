// GAME-SPECIFIC SETTINGS / OVERRIDES

SDK_INTERFACE_SETTINGS.GA_GAME_ID = "1fde3ba52c52d626e0f76365608be18d";
SDK_INTERFACE_SETTINGS.GA_SECRET_ID = "0a213e10da344ac6bfb66e262f43faa60aa2424c";
SDK_INTERFACE_SETTINGS.GA_BUILD = "yandex-web 1.0.0";

SDK_INTERFACE_SETTINGS.isProd = true;

if(SDK_INTERFACE_SETTINGS.isProd) {
	// PRODUCTION
	SDK_INTERFACE_SETTINGS.debugLevel = 0;
	SDK_INTERFACE_SETTINGS.forceMockObject = false;
} else {
	// TESTING
	SDK_INTERFACE_SETTINGS.debugLevel = 1;
	SDK_INTERFACE_SETTINGS.forceMockObject = true;
}

SDK_INTERFACE_SETTINGS.useSafeStorage = false; // WARNING: Activate for NEW games ONLY, otherwise existing savegames (saved in the conventional way) will be lost!

SDK_INTERFACE_SETTINGS.leaderboardLevel = true; // Set to true, if you want to track the completed levels in the leaderboard
SDK_INTERFACE_SETTINGS.showLeaderboard = false; // Set to false, if you do not want to show the leaderboard, but still want to track it
SDK_INTERFACE_SETTINGS.levelRegex = /(\d+)/; // Adjust according to the game

SDK_INTERFACE_SETTINGS.interstitial.enabled = true;
SDK_INTERFACE_SETTINGS.rewarded.enabled = true;

SDK_INTERFACE_SETTINGS.features.gameanalytics = true;

// overrides
SDK_INTERFACE_OVERRIDES.famobi_analytics.trackEvent = (event, params) => {

	return new Promise(function(resolve, reject) {

		SDK_INTERFACE.getDebugLevel() && console.log(event, params);

		switch(event) {
			case "EVENT_LEVELFAIL":
				if(params.reason !== "quit") {
					return window.famobi.showAd(function() {
						resolve();
					});
				} else {

				}
				break;
			case "EVENT_LEVELRESTART":
			case "EVENT_LEVELSTART":
				window.famobi_analytics.trackEvent("EVENT_CUSTOM", {
					eventName: "ga:progression",
					progressionStatus: "Start",
					progression01: params.levelName
				});
				break;
			case "EVENT_LEVELSUCCESS":
				return window.famobi.showAd(function() {
					window.famobi_analytics.trackEvent("EVENT_CUSTOM", {
						eventName: "ga:progression",
						progressionStatus: "Complete",
						progression01: params.levelName
					});

					if(!SDK_INTERFACE_SETTINGS.leaderboardLevel) {
						resolve();
						return;
					}

					const match = (params.levelName.toString()).match(SDK_INTERFACE_SETTINGS.levelRegex);
					if (match) {
						const levelNumber = Math.floor(parseInt(match[1]));
						SDK_INTERFACE.getDebugLevel() && console.log(`[LEVELSUCCESS]: Completed level: ${levelNumber}`);

						if(typeof(levelNumber == "number") && levelNumber >= 0) {
							return YANDEX_LEADERBOARD.showLeaderboard(() => { resolve(); }, levelNumber);
						}
					}
				});
			case "EVENT_LEVELSCORE":
				break;
			case "EVENT_LIVESCORE":
				break;
			case "EVENT_TOTALSCORE":
				
				window.famobi_analytics.trackEvent("EVENT_CUSTOM", {
					eventName: "ga:progression",
					progressionStatus: "Fail",
					progression01: params.levelName,
					value: params.totalScore
				});

				if(!SDK_INTERFACE_SETTINGS.leaderboardLevel) {
					return YANDEX_LEADERBOARD.showLeaderboard(() => { resolve(); }, params.totalScore);
				}
			case "EVENT_VOLUMECHANGE":
				break;
			case "EVENT_CUSTOM":
				if(params.eventName?.toLowerCase().startsWith("ga:") && gameanalytics !== "undefined") {

					switch(params.eventName?.toLowerCase().split(":")[1]) {

						case "business":
							gameanalytics.GameAnalytics?.addBusinessEvent(params?.cartType, params?.itemType, params?.itemId, params?.amount, params?.currency);
							break;

						case "resource":
							gameanalytics.GameAnalytics?.addResourceEvent(params?.flowType, params?.itemType, params?.itemId, params?.amount, params?.resourceCurrency);
							break;

						case "progression":
							gameanalytics.GameAnalytics?.addProgressionEvent(params?.progressionStatus, params?.progression01, params?.progression02, params?.progression03, params?.value);
							break;

						case "error":
							gameanalytics.GameAnalytics?.addErrorEvent(params?.severity, params?.message);
							break;

						case "design":
							gameanalytics.GameAnalytics?.addDesignEvent(params?.eventId, params?.value);
							break;

						case "ads":
							break;

						case "impression":
							break;

						default:
							SDK_INTERFACE_SETTINGS.debugLevel && console.log("unknown GA event type");
					}
					return;
				}
				break;
			case "EVENT_TUTORIALCOMPLETED":
				break;
			case "EVENT_TUTORIALSKIPPED":
				break;
			case "EVENT_PAUSE":
				break;
			case "EVENT_RESUME":
				break;
			default:
				// do nothing
		};

		return resolve(event, params);
	});
};

SDK_INTERFACE_OVERRIDES.famobi_analytics.trackScreen = (screen, pageTitle) => {

	return new Promise(function(resolve, reject) {

		SDK_INTERFACE.getDebugLevel() && console.log(screen, pageTitle);

		switch(screen) {
			case "SCREEN_HOME":
				// ...
				break;
			default:
				// ...
		}

		return resolve(screen, pageTitle);
	});
};