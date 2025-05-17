function LoadScript(e,t) {var n,a=document.createElement("script");a.setAttribute("src",e),a.onreadystatechange=a.onload=function(){n||(n=!0,t&&t())},document.getElementsByTagName("head")[0].appendChild(a)}

function JS_InviteLinkBaseUrl() {
	var toplevel;
	try {
		toplevel = document.location.ancestorOrigins[document.location.ancestorOrigins.length - 1];
	} catch (e) {
		toplevel = "https://yandex.ru";
	}
	return toplevel + '/games/play/' + YANDEX_GAME_ID;
}

function JS_ShowYandexGamesVideoAd(type, on_finish) {
	console.error('JS_ShowYandexGamesVideoAd: Yandex SDK not initialized');
	on_finish(false); // ysdk not initialized still
}

LoadScript('https://yandex.ru/games/sdk/v2', function () {
	YaGames
	.init()
	.then(ysdk => {
		console.log('Yandex SDK initialized', ysdk);
		
		if ('serviceWorker' in navigator) {
			let url = 'sw.js';
			if (ysdk.yandexApp && ysdk.yandexApp.enabled)
				url += '?disableFetch=1';
				
			navigator.serviceWorker
				.register(url)
				.then(function (reg) {
					console.log('Service worker registration succeeded. Scope is ' + reg.scope);
				})
				.catch(function (error) {
					console.error('Trouble with sw: ', error);
				});
		}
		
		document.addEventListener('pointerlockchange', function () {
			if (document.pointerLockElement === document.getElementById('canvas')) {
				console.debug('Hiding sticky banner');
				ysdk.adv.hideBannerAdv();
			} else {
				console.debug('Displaying sticky banner');
				ysdk.adv.showBannerAdv();
			}
		}, false);
	
		window.JS_ShowYandexGamesVideoAd = function (type, on_finish) {
			// https://yandex.ru/dev/games/doc/dg/sdk/sdk-adv-docpage/
			if (type === 'rewarded') {
				var reward = false;
				console.log('calling ysdk.adv.showRewardedVideo...');
				ysdk.adv.showRewardedVideo({
					callbacks: {
						onOpen: () => {
							console.log('Video ad open.');
						},
						onRewarded: () => {
							console.log('Rewarded!');
							reward = true;
						},
						onClose: () => {
							console.log('Video ad closed.');
							on_finish(reward);
						},
						onError: (e) => {
							console.log('Error while open video ad:', e);
						}
					}
				});

			} else {
				console.log('calling ysdk.adv.showFullscreenAdv...');
				ysdk.adv.showFullscreenAdv({
					callbacks: {
						onClose: function (wasShown) {
							console.log('adv call finished:', wasShown);
							on_finish(!!wasShown);
						},
						onError: function (error) {
							console.error(error);
						}
					}
				});
			}
		};
		
		LoadScript('main.js', function () {
			try {
				if (ysdk.environment.payload) {
					console.log('Environment payload encounter:', typeof ysdk.environment.payload, ysdk.environment.payload);
					window.QUERY_PARAMS.invite = ysdk.environment.payload;
				}
				
			} catch (e) {
				console.error(e);
			}
		});
	});
});		
