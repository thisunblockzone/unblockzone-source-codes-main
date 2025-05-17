class YandexGamesWrapper {

	constructor(readyCallback) {
		this.wrapperSDK = null;
		// Advertisement fields.
		this.bannerVisible = false;
		this.interstitialVisible = false;
		this.rewardedVisible = false;
		// Payments fields.
		this.wrapperPayments = null;
		this.cacheProductsData = "";
		this.cachePaymentsData = "";
		// Prefs fields.
		this.jsonContainers = runtimeData.prefsContainerTags;
		this.cacheContainers = {};
		// Flags fields.
		this.flags = {};
		// Leaderboard fields.
		this.leaderboards = {};
		// Player fields.
		this.playerLogin = false;
		// Wrapper initialization.
		console.log("Wrapper initialization started.");
		try {
			let script = document.createElement("script");
			script.src = runtimeData.yandexGamesSDK;
			script.onload = () => {
				YaGames.init().then(ysdk => {
					console.log("SDK initialized successfully.");
					this.wrapperSDK = ysdk;
					// Cache payments.
					this.resolvePayments().then(() => {
						console.log("SDK payments resolved successfully.");
						// Cache saves.
						this.resolveSaves().then(() => {
							console.log("SDK saves resolved successfully.");
							this.resolveFlags().then(() => {
								console.log("SDK flags resolved successfully.");
								this.resolvePlayer().then(player => {
									console.log("SDK player resolved successfully.");
									if (player.getMode() === 'lite') {
										this.playerLogin = false;
									}
									else {
										this.playerLogin = true;
									}
									this.resolveLeaderboards().then(() => {
										console.log("SDK leaderboards resolved successfully.");
										// Initiate application loading.
										console.log("Wrapper initialization completed.");
										this.invokeInterstitial();
										readyCallback();
									});
								});
							});
						});
					});
				}).catch((exception) => {
					// Initiate application loading anyway.
					console.error("Wrapper initialization failed.", exception);
					readyCallback();
				});
			};
			document.body.appendChild(script);
		}
		catch (exception) {
			// Initiate application loading anyway.
			console.error("Wrapper initialization failed.", exception);
			readyCallback();
		}
	}

	// Banner advertisement methods.

	isBannerVisible() {
		return this.bannerVisible;
	}

	invokeBanner() {
		console.log("Invoke banner called.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperSDK.adv.getBannerAdvStatus().then(({ stickyAdvIsShowing, reason }) => {
					this.bannerVisible = stickyAdvIsShowing;
					if (stickyAdvIsShowing) {
						console.log("Banner is already visible.");
						reject(stickyAdvIsShowing);
					} else if (reason) {
						// Currently not visible, there is a reason for that.
						console.log("Banner is not visible." + reason);
						reject(reason);
					} else {
						console.log("Banner should be visible now.");
						this.wrapperSDK.adv.showBannerAdv().then(() => {
							resolve(refreshBannerStatus());
						});
					}
				});
			}
			catch (exception) {
				console.error("Invoke banner failed.", exception);
				reject(exception);
			}
		});
	}

	disableBanner() {
		console.log("Disable banner called.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperSDK.adv.getBannerAdvStatus().then(({ stickyAdvIsShowing, reason }) => {
					this.bannerVisible = stickyAdvIsShowing;
					if (stickyAdvIsShowing) {
						console.log("Banner should be hidden now.");
						this.wrapperSDK.adv.hideBannerAdv().then(() => {
							resolve(refreshBannerStatus());
						});
					} else if (reason) {
						// Currently not visible, there is a reason for that.
						console.log("Banner is not visible." + reason);
						reject(reason);
					} else {
						console.log("Banner is not visible already.");
						reject(stickyAdvIsShowing);
					}
				});
			}
			catch (exception) {
				console.error("Disable banner failed.", exception);
				reject(exception);
			}
		});
	}

	refreshBannerStatus() {
		console.log("Refresh banner status called.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperSDK.adv.getBannerAdvStatus().then(({ stickyAdvIsShowing }) => {
					this.bannerVisible = stickyAdvIsShowing;
					resolve(stickyAdvIsShowing);
				});
			}
			catch (exception) {
				console.error("Refresh banner status failed.", exception);
				reject(exception);
			}
		});
	}

	// Interstitial advertisement methods.

	isInterstitialVisible() {
		return this.interstitialVisible;
	}

	invokeInterstitial() {
		console.log("Invoke interstitial called.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperSDK.adv.showFullscreenAdv({
					callbacks: {
						// Called when the ad is opened successfully.
						onOpen: () => {
							console.log("Interstitial event: onOpen.");
							this.interstitialVisible = true;
							application.publishEvent("OnInterstitialEvent", "Begin");
						},
						// Called when the ad closes, after an error, or after an ad failed to open due to too frequent calls. 
						// It's used with the wasShown argument (boolean type), the value of which indicates whether the ad was shown or not.
						onClose: (wasShown) => {
							console.log("Interstitial event: onClose.");
							this.interstitialVisible = false;
							application.publishEvent("OnInterstitialEvent", "Close");
						},
						// Called when an error occurs. The error object is passed to the callback function.
						onError: (error) => {
							console.error("Interstitial event: onError.", error);
							this.interstitialVisible = false;
							application.publishEvent("OnInterstitialEvent", "Error");
						},
						// Called when the network connection is lost (switching to offline mode).
						onOffline: () => {
							console.log("Interstitial event: onOffline.");
							application.publishEvent("OnInterstitialEvent", "Offline");
						}
					}
				});
				resolve();
			}
			catch (exception) {
				console.error("Invoke interstitial failed.", error);
				application.publishEvent("OnInterstitialEvent", "Error");
				reject(exception);
			}
		});
	}

	// Rewarded advertisement methods.

	isRewardedVisible() {
		return this.rewardedVisible;
	}

	invokeRewarded() {
		console.log("Invoke rewarded called.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperSDK.adv.showRewardedVideo({
					callbacks: {
						// Called when the video ad is shown on the screen.
						onOpen: () => {
							console.log("Rewarded event: onOpen.");
							this.rewardedVisible = true;
							application.publishEvent("OnRewardedEvent", "Begin");
						},
						// Called when a video ad impression is counted.
						onRewarded: () => {
							console.log("Rewarded event: onRewarded.");
							application.publishEvent("OnRewardedEvent", "Success");
						},
						// Called when the video ad closes.
						onClose: () => {
							console.log("Rewarded event: onClose.");
							this.rewardedVisible = false;
							application.publishEvent("OnRewardedEvent", "Close");
						},
						// Called when an error occurs. The error object is passed to the callback function.
						onError: (error) => {
							console.error("Rewarded event: onError.", error);
							application.publishEvent("OnRewardedEvent", "Error");
						}
					}
				});
				resolve();
			}
			catch (exception) {
				console.error("Invoke rewarded failed.", exception);
				application.publishEvent("OnRewardedEvent", "Error");
				reject(exception);
			}
		});
	}

	// Payments methods.

	resolvePayments() {
		console.log("Payments resolving started.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperSDK.getPayments().then(payments => {
					console.log("Payments resolved successfully.");
					this.wrapperPayments = payments;
					// Cache products before game loading.
					this.resolveServerProducts().then(() => {
						// Cache purchases before game loading.
						this.resolveServerPurchases().then(() => {
							// Payments are preloaded and ready.
							resolve(payments);
						});
					});
				});
			}
			catch (exception) {
				console.error("Payments resolving failed.", exception);
				reject(exception);
			}
		});
	}

	invokePurchase(productTag) {
		console.log("Invoke purchase called.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperPayments.purchase(productTag).then(() => {
					console.log("Purchase made successfully.");
					application.publishEvent("OnPurchaseEvent", "Success");
					resolve(productTag);
				}).catch(exception => {
					console.error("Purchase failed.", exception);
					application.publishEvent("OnPurchaseEvent", "Error");
					reject(exception);
				});
			}
			catch (exception) {
				console.error("Purchase failed.", exception);
				application.publishEvent("OnPurchaseEvent", "Error");
				reject(exception);
			}
		});
	}

	resolveServerProducts() {
		console.log("Server products caching started.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperPayments.getCatalog().then(products => {
					let callbackProductData = [];
					for (let x = 0; x < products.length; x++) {
						callbackProductData.push({
							"productTag": products[x].id,
							"priceValue": products[x].priceValue,
							"priceCurrency": products[x].priceCurrencyCode
						});
						console.log("Cache server product:", products[x]);
					}
					this.cacheProductsData = JSON.stringify(callbackProductData);
					application.publishEvent("OnResolveProducts", "Success");
					resolve(products);
				});
			}
			catch (exception) {
				console.error("Server products caching failed.", exception);
				application.publishEvent("OnResolveProducts", "Error");
				reject(exception);
			}
		});
	}

	resolveServerPurchases() {
		console.log("Server purchases caching started.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperPayments.getPurchases().then(purchases => {
					let callbackPurchaseData = [];
					for (let x = 0; x < purchases.length; x++) {
						callbackPurchaseData.push({
							"productTag": purchases[x].productID
						});
					}
					this.cachePurchasesData = JSON.stringify(callbackPurchaseData);
					application.publishEvent("OnResolvePurchases", "Success");
					resolve(purchases);
				});
			}
			catch (exception) {
				console.error("Server purchases caching failed.", exception);
				application.publishEvent("OnResolvePurchases", "Error");
				reject(exception);
			}
		});
	}

	resolveCacheProducts() {
		return this.cacheProductsData;
	}

	resolveCachePurchases() {
		return this.cachePurchasesData;
	}

	// Player methods.

	resolvePlayer() {
		console.log("Player resolving started.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperSDK.getPlayer({ scopes: false }).then(player => {
					console.log("Player resolved successfully.");
					resolve(player);
				});
			}
			catch (exception) {
				console.log("Player resolve failed.", exception);
				reject(exception);
			}
		});
	}

	// Saves methods.

	resolveSaves() {
		console.log("Saves resolving started.");
		return new Promise((resolve, reject) => {
			try {
				this.resolvePlayer().then(player => {
					player.getData(this.jsonContainers).then(data => {
						for (let x = 0; x < this.jsonContainers.length; x++) {
							let containerString = "";
							if (data[this.jsonContainers[x]] != null) {
								console.log("Resolve saves for container: " + this.jsonContainers[x] + " success");
								containerString = data[this.jsonContainers[x]];
							}
							else {
								console.log("Resolve saves for container: " + this.jsonContainers[x] + " is empty");
								containerString = "Empty";
							}
							this.cacheContainers[this.jsonContainers[x]] = containerString;
						}
						console.log("Saves resolving success.");
						application.publishEvent("OnResolveSaves", "Success");
						resolve(data);
					});
				});
			}
			catch (exception) {
				console.error("Saves resolving failed.", exception);
				application.publishEvent("OnResolveSaves", "Error");
				reject(exception);
			}
		});
	}

	writeSaves() {
		console.log("Write saves called.");
		return new Promise((resolve, reject) => {
			try {
				this.resolvePlayer().then(player => {
					let data = {};
					for (let x = 0; x < this.jsonContainers.length; x++) {
						data[this.jsonContainers[x]] = this.cacheContainers[this.jsonContainers[x]];
					}
					player.setData(data, true).then(() => {
						console.log("Saves written successfully.");
						application.publishEvent("OnWriteSaves", "Success");
						resolve();
					});
				});
			}
			catch (exception) {
				console.error("Write saves failed.", exception);
				application.publishEvent("OnWriteSaves", "Error");
				reject(exception);
			}
		});
	}

	resolveCacheSaves(containerTag) {
		console.log("Resolve cache saves called.");
		let containerJSON = this.cacheContainers[containerTag];
		if (containerJSON == null) {
			return "Empty";
		}
		return containerJSON;
	}

	writeCacheSaves(containerTag, json) {
		console.log("Write cache saves called.");
		try {
			this.cacheContainers[containerTag] = json;
			console.log("Cache saves written successfully.");
		}
		catch (exception) {
			console.error("Cache saves write failed.", exception);
		}
	}

	// Language methods.

	resolveLanguage() {
		console.log("Resolve language called.");
		try {
			return this.wrapperSDK.environment.i18n.lang;
		}
		catch (exception) {
			console.error("Resolve language failed.", exception);
			return "en";
		}
	}

	// Analytics methods.

	gameIsReady() {
		console.log("Game is ready called.");
		try {
			if (this.wrapperSDK.features.LoadingAPI) {
				this.wrapperSDK.features.LoadingAPI.ready();
			}
		}
		catch (exception) {
			console.error("Game is ready report failed.", exception);
		}
	}

	gameplayStart() {
		console.log("Gameplay start report called.");
		try {
			this.wrapperSDK.features.GameplayAPI.start();
		}
		catch (exception) {
			console.error("Gameplay start report failed.", exception);
		}
	}

	gameplayStop() {
		console.log("Gameplay stop report called.");
		try {
			this.wrapperSDK.features.GameplayAPI.stop();
		}
		catch (exception) {
			console.error("Gameplay stop report failed.", exception);
		}
	}

	// Socials methods.

	resolveLeaderboards() {
		console.log("Resolve leaderboards called.");
		return new Promise((resolve, reject) => {
			this.wrapperSDK.getLeaderboards().then(leaderboards => {
				console.log("Leaderboards resolved successfully.");
				this.leaderboards = leaderboards;
				resolve(leaderboards);
			}).catch(exception => {
				console.error("Resolve leaderboards failed.", exception);
				reject(exception);
			});
		});
	}

	getScore(scoreTag) {
		console.log("Get score called.");
		try {
			this.wrapperSDK.getLeaderboards().then(leaderboards => {
				leaderboards.getLeaderboardPlayerEntry(scoreTag).then(leaderboard => {
					console.log("Get score success.", leaderboard.score);
					application.publishEvent("ScorePlatformEvent", leaderboard.score);
				}).catch(exception => {
					console.error("Get score failed.", exception);
					application.publishEvent("ScorePlatformEvent", "Error");
				});
			});
		}
		catch (exception) {
			console.error("Get score failed.", exception);
			application.publishEvent("ScorePlatformEvent", "Error");
		}
	}

	setScore(scoreTag, scoreValue) {
		console.log("Set score called.");
		try {
			this.wrapperSDK.getLeaderboards().then(leaderboards => {
				leaderboards.setLeaderboardScore(scoreTag, scoreValue).then(() => {
					console.log("Set score success.", scoreValue);
				}).catch(exception => {
					console.error("Get score failed.", exception);
					// application.publishEvent("OnScoreValueError", "Error");
				});
			});
		}
		catch (exception) {
			console.error("Get score failed.", exception);
			// application.publishEvent("OnScoreValueError", "Error");
		}
	}

	getScoreTable(scoreTag, leadingPlayers, includePlayer, playersAround) {
		console.log("Get score table called.");
		try {
			this.wrapperSDK.getLeaderboards().then(leaderboards => {
				leaderboards.getLeaderboardEntries(scoreTag, { quantityTop: leadingPlayers, includeUser: includePlayer, quantityAround: playersAround }).then(leaderboard => {
					let dataArray = [];
					for (let x = 0; x < leaderboard.entries.length; x++) {
						let entry = leaderboard.entries[x];
						let arrayData = {
							name: entry.player.publicName,
							position: entry.rank,
							score: entry.score,
							pictureURL: entry.player.getAvatarSrc("medium")
						};
						dataArray.push(arrayData);
					}
					let jsonString = JSON.stringify(dataArray);
					console.log("Get score table success.", jsonString);
					application.publishEvent("ScoreTablePlatformEvent", jsonString);
				}).catch(exception => {
					this.onScoreTableError(exception);
				});
			}).catch(exception => {
				this.onScoreTableError(exception);
			});
		} catch (exception) {
			this.onScoreTableError(exception);
		}
	}

	onScoreTableError(exception) {
		console.error("Get score table failed.", exception);
		application.publishEvent("ScoreTablePlatformEvent", "Error");
	}

	requestGameRating() {
		console.log("Request game rating called.");
		try {
			this.wrapperSDK.feedback.canReview().then(({ value, reason }) => {
				if (value) {
					this.wrapperSDK.feedback.requestReview().then(({ feedbackSent }) => {
						console.log(feedbackSent);
					});
				} else {
					console.log(reason);
				}
			});
		}
		catch (exception) {
			console.error("Request game rating failed.", exception);
		}
	}

	// Flags.

	resolveFlags() {
		console.log("Resolve flags called.");
		return new Promise((resolve, reject) => {
			try {
				this.wrapperSDK.getFlags().then(flags => {
					this.flags = flags;
					resolve(flags);
				});
			}
			catch (exception) {
				console.error("Flags resolving failed.", exception);
				reject(exception);
			}
		});
	}

	flagsGetValue(key) {
		return this.flags[key];
	}

	flagsHasKey(key) {
		try {
			return this.flags[key] != null;
		}
		catch {
			return false;
		}
	}

	// Player login methods.

	invokePlayerLogin() {
		console.log("Invoke player login called.");
		this.resolvePlayer().then(player => {
			if (player.getMode() === 'lite') {
				// Player is not authorized.
				console.log("Player is not authorized.");
				this.wrapperSDK.auth.openAuthDialog().then(() => {
					// Player is authorized.
					console.log("Player is authorized.");
					application.publishEvent("LoginPlatformEvent", "Success");
				}).catch(() => {
					// Player is not authorized.
					console.log("Player is not authorized.");
					application.publishEvent("LoginPlatformEvent", "Error");
				});
			}
			else {
				// Player is already authorized.
				console.log("Player is already authorized.");
				application.publishEvent("LoginPlatformEvent", "Success");
			}
		});
	}

}

function initializeWrapper() {
	if (typeof window !== 'undefined') {
		window.yandexGamesWrapper = new YandexGamesWrapper(() => {
			// Application initialization on wrapper ready callback.
			application.initialize();
		});
	}
}