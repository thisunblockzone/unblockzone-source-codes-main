const yandexGamesSDK = (function () {

	let m_sdk;
	let m_payments;

	let m_bannerVisible = false;
	let m_interstitialVisible = false;
	let m_rewardedVisible = false;

	let m_cacheProductsData = "";
	let m_cachePurchasesData = "";

	let m_jsonContainers = [
		"json-data",
		"write-experiment",
		"cryptography",
	];

	let m_cacheContainers = { };

	function m_trySendMessage(eventSource, eventType) {
		let gameInstance = game.getInstance();
		if (gameInstance != null) {
			gameInstance.SendMessage("JSCallbacks", eventSource, eventType);
		}
	}

	function m_init() {
		console.log("yandexGamesSDK.m_init: called");
		return new Promise((resolve, reject) => {
			try {
				let script = document.createElement("script");
				script.src = "https://yandex.ru/games/sdk/v2";
				script.onload = () => {
					YaGames.init().then(ysdk => {
						console.log("yandexGamesSDK.m_init: sdk is ready");
						m_sdk = ysdk;
						// Cache payments.
						m_resolvePayments().then(() => {
							// Cache player and saves.
							m_resolveSaves().then(() => {
								resolve(ysdk);
							});
						});
					});
				};
				document.body.appendChild(script);
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_init: error", exception);
				reject(exception);
			}
		});
	}

	function m_refreshBannerStatus() {
		console.log("yandexGamesSDK.m_refreshBannerStatus: called");
		return new Promise((resolve, reject) => {
			try {
				m_sdk.adv.getBannerAdvStatus().then(({ stickyAdvIsShowing }) => {
					m_bannerVisible = stickyAdvIsShowing;
					resolve(stickyAdvIsShowing);
				});
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_refreshBannerStatus: error", exception);
				reject(exception);
			}
		});
	}

	function m_invokeBanner() {
		console.log("yandexGamesSDK.m_invokeBanner: called");
		return new Promise((resolve, reject) => {
			try {
				m_sdk.adv.getBannerAdvStatus().then(({ stickyAdvIsShowing, reason }) => {
					m_bannerVisible = stickyAdvIsShowing;
					if (stickyAdvIsShowing) {
						console.log("yandexGamesSDK.m_invokeBanner: already visible");
						reject(stickyAdvIsShowing);
					} else if (reason) {
						// Currently not visible, there is a reason for that.
						console.log("yandexGamesSDK.m_invokeBanner: " + reason);
						reject(reason);
					} else {
						console.log("yandexGamesSDK.m_invokeBanner: invoke banner");
						m_sdk.adv.showBannerAdv().then(() => {
							resolve(m_refreshBannerStatus());
						});
					}
				});
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_invokeBanner: error", exception);
				reject(exception);
			}
		});
	}

	function m_disableBanner() {
		console.log("yandexGamesSDK.m_disableBanner: called");
		return new Promise((resolve, reject) => {
			try {
				m_sdk.adv.getBannerAdvStatus().then(({ stickyAdvIsShowing, reason }) => {
					m_bannerVisible = stickyAdvIsShowing;
					if (stickyAdvIsShowing) {
						console.log("yandexGamesSDK.disableBanner: disable banner");
						m_sdk.adv.hideBannerAdv().then(() => {
							resolve(m_refreshBannerStatus());
						});
					} else if (reason) {
						// Currently not visible, there is a reason for that.
						console.log("yandexGamesSDK.disableBanner: " + reason);
						reject(reason);
					} else {
						console.log("yandexGamesSDK.disableBanner: not visible");
						reject(stickyAdvIsShowing);
					}
				});
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_disableBanner: error", exception);
				reject(exception);
			}
		});
	}

	function m_invokeInterstitial() {
		console.log("yandexGamesSDK.m_invokeInterstitial: called");
		return new Promise((resolve, reject) => {
			try {
				m_sdk.adv.showFullscreenAdv({
					callbacks: {
						// Called when the ad is opened successfully.
						onOpen: function () {
							console.log("yandexGamesSDK.m_invokeInterstitial: onOpen");
							m_interstitialVisible = true;
							m_trySendMessage("OnInterstitialEvent", "Begin");
						},
						// Called when the ad closes, after an error, or after an ad failed to open due to too frequent calls. 
						// It's used with the wasShown argument (boolean type), the value of which indicates whether the ad was shown or not.
						onClose: function (wasShown) {
							console.log("yandexGamesSDK.m_invokeInterstitial: onClose");
							m_interstitialVisible = false;
							m_trySendMessage("OnInterstitialEvent", "Close");
						},
						// Called when an error occurs. The error object is passed to the callback function.
						onError: function (error) {
							console.log("yandexGamesSDK.m_invokeInterstitial: onError");
							m_trySendMessage("OnInterstitialEvent", "Error");
						},
						// Called when the network connection is lost (switching to offline mode).
						onOffline: function () {
							console.log("yandexGamesSDK.m_invokeInterstitial: onOffline");
							m_trySendMessage("OnInterstitialEvent", "Offline");
						}
					}
				});
				resolve();
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_invokeInterstitial: error", exception);
				m_trySendMessage("OnInterstitialEvent", "Error");
				reject(exception);
			}
		});
	}

	function m_invokeRewarded() {
		console.log("yandexGamesSDK.m_invokeRewarded: called");
		return new Promise((resolve, reject) => {
			try {
				m_sdk.adv.showRewardedVideo({
					callbacks: {
						// Called when the video ad is shown on the screen.
						onOpen: () => {
							console.log("yandexGamesSDK.m_invokeRewarded: onOpen");
							m_rewardedVisible = true;
							m_trySendMessage("OnRewardedEvent", "Begin");
						},
						// Called when a video ad impression is counted.
						onRewarded: () => {
							console.log("yandexGamesSDK.m_invokeRewarded: onRewarded");
							m_trySendMessage("OnRewardedEvent", "Success");
						},
						// Called when the video ad closes.
						onClose: () => {
							console.log("yandexGamesSDK.m_invokeRewarded: onClose");
							m_rewardedVisible = false;
							m_trySendMessage("OnRewardedEvent", "Close");
						},
						// Called when an error occurs. The error object is passed to the callback function.
						onError: (error) => {
							console.log("yandexGamesSDK.m_invokeRewarded: onError", error);
							m_trySendMessage("OnRewardedEvent", "Error");
						}
					}
				});
				resolve();
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_invokeRewarded: error", exception);
				m_trySendMessage("OnRewardedEvent", "Error");
				reject(exception);
			}
		});
	}

	function m_resolvePayments() {
		console.log("yandexGamesSDK.m_resolvePayments: called");
		return new Promise((resolve, reject) => {
			try {
				m_sdk.getPayments().then(payments => {
					console.log("yandexGamesSDK.m_resolvePayments: payments are ready");
					m_payments = payments;
					// Cache products before game loading.
					m_cacheServerProducts().then(() => {
						// Cache purchases before game loading.
						m_cacheServerPurchases().then(() => {
							// Payments are preloaded and ready.
							resolve(payments);
						});
					});
				});
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_resolvePayments: error", exception);
				reject(exception);
			}
		});
	}

	function m_cacheServerProducts() {
		console.log("yandexGamesSDK.m_cacheServerProducts: called");
		return new Promise((resolve, reject) => {
			try {
				m_payments.getCatalog().then(products => {
					let callbackProductData = [];
					for (let x = 0; x < products.length; x++) {
						callbackProductData.push({
							"productTag": products[x].id,
							"priceValue": products[x].priceValue,
							"priceCurrency": products[x].priceCurrencyCode
						});
						console.log("yandexGamesSDK.m_cacheServerProducts:", products[x]);
					}
					m_cacheProductsData = JSON.stringify(callbackProductData);
					m_trySendMessage("OnResolveProducts", "Success");
					resolve(products);
				});
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_cacheServerProducts: error", exception);
				m_trySendMessage("OnResolveProducts", "Error");
				reject(exception);
			}
		});
	}

	function m_cacheServerPurchases() {
		console.log("yandexGamesSDK.m_cacheServerPurchases: called");
		return new Promise((resolve, reject) => {
			try {
				m_payments.getPurchases().then(purchases => {
					let callbackPurchaseData = [];
					for (let x = 0; x < purchases.length; x++) {
						callbackPurchaseData.push({
							"productTag": purchases[x].productID
						});
					}
					m_cachePurchasesData = JSON.stringify(callbackPurchaseData);
					m_trySendMessage("OnResolvePurchases", "Success");
					resolve(purchases);
				});
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_cacheServerPurchases: error", exception);
				m_trySendMessage("OnResolvePurchases", "Error");
				reject(exception);
			}
		});
	}

	function m_invokePurchase(productTag) {
		console.log("yandexGamesSDK.m_invokePurchase: called");
		return new Promise((resolve, reject) => {
			try {
				m_payments.purchase(productTag).then(() => {
					console.log("yandexGamesSDK.m_invokePurchase: purchase success");
					m_trySendMessage("OnPurchaseEvent", "Success");
					resolve(productTag);
				}).catch(exception => {
					console.error("yandexGamesSDK.m_invokePurchase: error", exception);
					m_trySendMessage("OnPurchaseEvent", "Error");
					reject(exception);
				});
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_invokePurchase: error", exception);
				m_trySendMessage("OnPurchaseEvent", "Error");
				reject(exception);
			}
		});
	}

	function m_resolvePlayer() {
		console.log("yandexGamesSDK.m_resolvePlayer: called");
		return new Promise((resolve, reject) => {
			try {
				m_sdk.getPlayer({ scopes: false }).then(player => {
					console.log("yandexGamesSDK.m_resolvePlayer: player is ready");
					resolve(player);
				});
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_resolvePlayer: error", exception);
				reject(exception);
			}
		});
	}

	function m_resolveSaves() {
		console.log("yandexGamesSDK.m_resolveSaves: called");
		return new Promise((resolve, reject) => {
			try {
				m_resolvePlayer().then(player => {
					player.getData(m_jsonContainers).then(data => {
						for (let x = 0; x < m_jsonContainers.length; x++) {
							let containerString = "";
							if (data[m_jsonContainers[x]] != null) {
								console.log("yandexGamesSDK.m_resolveSaves: " + m_jsonContainers[x] + " success");
								containerString = data[m_jsonContainers[x]];
							}
							else {
								console.log("yandexGamesSDK.m_resolveSaves: " + m_jsonContainers[x] + " is empty");
								containerString = "Empty";
							}
							m_cacheContainers[m_jsonContainers[x]] = containerString;
						}
						m_trySendMessage("OnResolveSaves", "Success");
						resolve(data);
					});
				});
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_resolveSaves: error", exception);
				m_trySendMessage("OnResolveSaves", "Error");
				reject(exception);
			}
		});
	}

	function m_writeSaves() {
		console.log("yandexGamesSDK.m_writeSaves: called");
		return new Promise((resolve, reject) => {
			try {
				m_resolvePlayer().then(player => {
					let data = {};
					let cryptography = new Uint32Array(8);
					window.crypto.getRandomValues(cryptography);
					for (let x = 0; x < m_jsonContainers.length; x++) {
						data[m_jsonContainers[x]] = m_cacheContainers[m_jsonContainers[x]];
					}
					data["cryptography"] = cryptography;
					player.setData(data, true).then(() => {
						console.log("yandexGamesSDK.m_writeSaves: success");
						m_trySendMessage("OnWriteSaves", "Success");
						resolve();
					});
				});
			}
			catch (exception) {
				console.error("yandexGamesSDK.m_writeSaves: error", exception);
				m_trySendMessage("OnWriteSaves", "Error");
				reject(exception);
			}
		});
	}

	function m_writeCacheSaves(containerTag, json) {
		console.log("yandexGamesSDK.m_writeCacheSaves: called");
		try {
			m_cacheContainers[containerTag] = json;
			console.log("yandexGamesSDK.m_writeCacheSaves: success");
		}
		catch (exception) {
			console.error("yandexGamesSDK.m_writeCacheSaves: error", exception);
		}
	}

	function m_resolveLanguage() {
		console.log("yandexGamesSDK.m_resolveLanguage: called");
		try {
			return m_sdk.environment.i18n.lang;
		}
		catch (exception) {
			console.error("yandexGamesSDK.m_resolveLanguage: error", exception);
			return "en";
		}
	}

	return {

		getSDK: function () {
			return m_sdk;
		},

		init: function () {
			return m_init();
		},

		isBannerVisible: function () {
			return m_bannerVisible;
		},

		invokeBanner: function () {
			return m_invokeBanner();
		},

		disableBanner: function () {
			return m_disableBanner();
		},

		isInterstitialVisible: function () {
			return m_interstitialVisible;
		},

		invokeInterstitial: function () {
			return m_invokeInterstitial();
		},

		isRewardedVisible: function () {
			return m_rewardedVisible;
		},

		invokeRewarded: function () {
			return m_invokeRewarded();
		},

		invokePurchase: function (productTag) {
			return m_invokePurchase(productTag);
		},

		resolveServerProducts: function () {
			return m_cacheServerProducts();
		},

		resolveServerPurchases: function () {
			return m_cacheServerPurchases();
		},

		resolveCacheProducts: function () {
			return m_cacheProductsData;
		},

		resolveCachePurchases: function () {
			return m_cachePurchasesData;
		},

		resolveSaves: function () {
			return m_resolveSaves();
		},

		writeSaves: function () {
			return m_writeSaves();
		},

		resolveCacheSaves: function (containerTag) {
			let containerJSON = m_cacheContainers[containerTag];
			if(containerJSON == null) {
				return "Empty";
			}
			return containerJSON;
		},

		writeCacheSaves: function (containerTag, json) {
			return m_writeCacheSaves(containerTag, json);
		},

		resolveLanguage: function () {
			return m_resolveLanguage();
		},

	}

})();
