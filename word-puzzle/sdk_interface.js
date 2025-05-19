/*
	SETTINGS
 */
const SDK_INTERFACE_SETTINGS = {

	isProd: true,
	debugLevel: 0,
	forceMockObject: false,

	// ads
	interstitial: {
		enabled: true, // enable/disable interstitial ads
		initial: true, // show initial ad
		preload: 250, // preload interval in ms
		retry: 2000, // timeout before retry after preload fail
		timout: 250, // timout before calling showRewarded()
		cooldown: 90, // time between ads
	},
	rewarded: {
		enabled: true, // enable/disable rewarded ads (provided that the "rewarded" feature is enabled)
		preload: 250, // preload interval in ms
		retry: 2000, // timeout before retry after preload fail
		timout: 250, // timout before calling showRewarded()
		// cooldown: 90, // time between ads
		reward: true // reward when in doubt
	},

	// files to load
	externalFiles: ["leaderboard.js", "sdk_interface_custom.js", "gameanalytics.js", "//yandex.ru/games/sdk/v2"],

	// features
	features: {
		auto_quality: false,
		copyright: false,
		credits: false,
		external_achievements: false,
		external_leaderboard: false,
		external_mute: false,
		external_pause: false,
		external_start: false,
		forced_mode: false,
		leaderboard: false,
		multiplayer: false,
		multiplayer_local: true,
		skip_title: false,
		skip_tutorial: false
	},

	// forced mode
	forced_mode: {

	},

	// misc
	aid: "A1234-5", // affiliate id
	name: "YANDEX", // name of partner/customer
	branding_url: "",
	branding_image: "logo", // "logo" = transparent
	show_splash: false,
	menuless: true,

	useSafeStorage: false
};

const SDK_INTERFACE_OVERRIDES = {
	famobi: {

		/*
		getCurrentLanguage: function() {
			return "en";
		},
		*/

		/*
		setPreloadProgress: function(progress) {

		},
		*/

		/*
		gameReady: function() {

		},

		playerReady: function(progress) {

		},
		*/
	},
	famobi_analytics: {
		trackEvent: function(event, params) {
			SDK_INTERFACE.getDebugLevel() && console.log(event, params);
			return resolve(event, params);
		}
	}
};

const SDK_INTERFACE_MOCK_OBJECT = function() {

	return new Promise(function(resolve, reject) {

		YaGames = {
			init: function() {
				return new Promise(function(resolve, reject) {

					const ysdk = {
						adv: {
							showFullscreenAdv: function(_callbacks) {

								try{
									_callbacks.callbacks.onOpen();
								} catch(e) {
									console.log(e);
								}

								alert("This is an ad");

								setTimeout(function() {
									try{
										_callbacks.callbacks.onClose();
									} catch(e) {
										console.log(e);
									}
								}, 1000);
							},
							showRewardedVideo: function(_callbacks) {

								try{
									_callbacks.callbacks.onOpen();
								} catch(e) {
									console.log(e);
								}

								if(confirm("Rewarded ad ended. Should a reward be granted?")) {
									try{
										_callbacks.callbacks.onRewarded();
										_callbacks.callbacks.onClose();
									} catch(e) {
										console.log(e);
									}
								} else {
									try{
										_callbacks.callbacks.onClose();
									} catch(e) {
										console.log(e);
									}
								}
							}
					    },

					    getStorage: function() {
					    	return Promise.resolve(window.localStorage);
					    },

					    getLeaderboards: function() {
					    	return Promise.resolve({
					    		getLeaderboardDescription: leaderboardName => {
					    			SDK_INTERFACE.getDebugLevel() && console.log("[lb.getLeaderboardDescription]", leaderboardName);
					    			return Promise.resolve({
					    				appID: "",
					    				default: true,
					    				description: {},
					    				name: "",
					    				title: {}
					    			});
					    		},
					    		setLeaderboardScore: (leaderboardName, score, extraData) => {
					    			SDK_INTERFACE.getDebugLevel() && console.log("[lb.setLeaderboardScore]", leaderboardName, score, extraData);
					    			alert("Leaderboard: " + score);
					    			return Promise.resolve({});
					    		},
					    		getLeaderboardPlayerEntry: leaderboardName => {
					    			SDK_INTERFACE.getDebugLevel() && console.log("[lb.getLeaderboardPlayerEntry]", leaderboardName);
					    			return Promise.resolve({
					    				score: 0,
					    				extraData: "",
					    				rank: 0,
					    				player: {
					    					uniqueID: "uniqueMockID1"
					    				},
					    				formattedScore: "0"
					    			});
					    		},
					    		getLeaderboardEntries: (leaderboardName, params) => {
					    			SDK_INTERFACE.getDebugLevel() && console.log("[lb.getLeaderboardEntries]", leaderboardName, params);
					    			return Promise.resolve({
					    				leaderboard: {
					    					appID: 123456,
											default: true,
											description: { invert_sort_order: false, score_format: { } },
											name: leaderboardName,
											title: { en: 'Leaderboard', ru: 'Таблица Лидеров', tr: 'Liderler Sıralaması' }
					    				},
					    				ranges: [],
					    				userRank: 0,
					    				entries: ysdk.getRandomLeaderboard()
					    			});
					    		}
					    	});
					    },

					    isAvailableMethod: () => {
					    	return Promise.resolve(true);
					    },

					    getRandomLeaderboard: () => {
					    	let leaderboard = [];

					    	let size = 15;

					    	for(let i = 0; i < size; i++) {
					    		leaderboard.push({
									score: Math.floor(Math.random() * 2000),
									extraData: "Mock user description",
									rank: 0,
									player: {
										getAvatarSrc: (size = "small") => { return "https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium"; },
										getAvatarSrcSet: (size = "small") => { return "https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium 1x, https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-200 2x"; },
										lang: "ru",
										publicName: `Mock Player #${Math.floor(1000 + Math.random() * 8999)}`,
										scopePermissions: {
											avatar: "allow",
											public_name: "allow"
										},
										uniqueID: `uniqueMockID${i}`,
									},
								    formattedScore: "-"
								});
					    	}

					    	leaderboard.sort((a, b) => b.score - a.score);

					    	for(let j = 1; j <= leaderboard.length; j++) {
					    		let entry = leaderboard[j-1];
					    		entry.formattedScore = entry.score.toString();
					    		entry.rank = j;
					    	}

					    	return leaderboard;
					    },

					    getPlayer: () => {
					    	SDK_INTERFACE.getDebugLevel() && console.log("[getPlayer] is doing something");

					    	return Promise.resolve({
					    		playerInitialized: true
					    	});
					    }
					};
					resolve(ysdk);
				});
			}
		};
		resolve();
	});
}

const SDK_INTERFACE_PRELOAD_AD = function(type) {

	return new Promise(function(resolve, reject) {
		resolve(); // reject()
	});
};

const SDK_INTERFACE_SHOW_AD = function() {

	return new Promise(function(resolve, reject) {

		window.ysdk.adv.showFullscreenAdv({
			callbacks: {
				onOpen: function() {
					SDK_INTERFACE.getDebugLevel() && console.log("[ysdk.adv.showFullscreenAdv] onOpen");
				},
				onClose: function(wasShown) {
					// some action after close
					SDK_INTERFACE.getDebugLevel() && console.log("[ysdk.adv.showFullscreenAdv] onClose");
					resolve();
				},
				onError: function(error) {
					// some action on error
					SDK_INTERFACE.getDebugLevel() && console.log("[ysdk.adv.showFullscreenAdv] onError");
					reject(error);
				},
				onOffline: function() {
					SDK_INTERFACE.getDebugLevel() && console.log("[ysdk.adv.showFullscreenAdv] onOffline");
				}
			}
		});
	});
};

const SDK_INTERFACE_REWARDED_AD = function() {

	return new Promise(function(resolve, reject) {

		let rewardGranted = false;

		window.ysdk.adv.showRewardedVideo({
			callbacks: {
				onOpen: function() {
					SDK_INTERFACE.getDebugLevel() && console.log("[ysdk.adv.showRewardedVideo] onOpen");
				},
				onClose: function(wasShown) {
					// some action after close
					SDK_INTERFACE.getDebugLevel() && console.log("[ysdk.adv.showRewardedVideo] onClose");
					resolve(rewardGranted);
				},
				onError: function(error) {
					// some action on error
					SDK_INTERFACE.getDebugLevel() && console.log("[ysdk.adv.showRewardedVideo] onError");
					reject(error);
				},
				onOffline: function() {
					SDK_INTERFACE.getDebugLevel() && console.log("[ysdk.adv.showRewardedVideo] onOffline");
				},
				onRewarded: function() {
					SDK_INTERFACE.getDebugLevel() && console.log("[ysdk.adv.showRewardedVideo] onRewarded");
					rewardGranted = true;
				}
			}
		});
	});
};

const SDK_INTERFACE_INIT = function() {
	return new Promise(function(resolve, reject) {

		YaGames.init().then(ysdk => {
		    SDK_INTERFACE.getDebugLevel() && console.log('Yandex SDK initialized');
		    window.ysdk = ysdk;

		    function initStorage() {
		    	return new Promise((_resolve, _reject) => {
		    		if(SDK_INTERFACE.settings.useSafeStorage) {
			   		    window.ysdk.getStorage().then((safeStorage) => {
			   		    	Object.defineProperty(window, "localStorage", {
			   		    		get: () => safeStorage
			   		    	});
			   		    }).then(() => {
			   				localStorage.setItem("key", "safe storage is working");
			   		        SDK_INTERFACE.getDebugLevel() && console.log(localStorage.getItem("key"));
			   		        _resolve();
			   		    });
				   	} else {
				   		_resolve();
				   	}
		    	});
		    }

		    function initPlayer() {
		    	return new Promise((_resolve, _reject) => {
		    		window.ysdk.getPlayer().then(_player => {
						SDK_INTERFACE.getDebugLevel() && console.log("Player initialized");
						
						_resolve();
					}).catch(err => {
						SDK_INTERFACE.getDebugLevel() && console.log("Error while initializing player");
						SDK_INTERFACE.getDebugLevel() && console.log(err);

						_resolve();
					});
		    	});
		    }

		    Promise.all([
		    	initStorage(),
		    	initPlayer()
		    ]).then(() => {
		    	resolve();
		    });
		});
	});
};

SDK_INTERFACE.init(SDK_INTERFACE_SETTINGS);