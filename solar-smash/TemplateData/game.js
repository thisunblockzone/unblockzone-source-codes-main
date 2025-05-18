const game = (function () {

    let instance;

    // ########## DOCUMENT REFERENCES ##########

    let container = document.querySelector("#unity-container");
    let canvas = document.querySelector("#unity-canvas");
    let loadingBar = document.querySelector("#unity-loading-bar");
    let progressBarFull = document.querySelector("#unity-progress-bar-full");
    let warningBanner = document.querySelector("#unity-warning");

    // ########## EXCEPTION CATCHING ##########

    // Shows a temporary message banner/ribbon for a few seconds, or
    // a permanent error message on top of the canvas if type=='error'.
    // If type=='warning', a yellow highlight color is used.
    // Modify or remove this function to customize the visually presented
    // way that non-critical warnings and error messages are presented to the
    // user.
    function unityShowBanner(msg, type) {
        function updateBannerVisibility() {
            warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        let div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') {
            div.style = 'background: red; padding: 10px;';
        }
        else {
            if (type == 'warning') {
                div.style = 'background: yellow; padding: 10px;';
            }
            setTimeout(function () {
                warningBanner.removeChild(div);
                updateBannerVisibility();
            }, 5000);
        }
        updateBannerVisibility();
    }

    // ########## URL REFERENCES ##########

	let buildUrl = "Build";
    let loaderUrl = buildUrl + "/Build.loader.js";
    let config = {
        arguments: [],
        dataUrl: buildUrl + "/Build.data.unityweb",
        frameworkUrl: buildUrl + "/Build.framework.js.unityweb",
            codeUrl: buildUrl + "/Build.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "DinoPix",
        productName: "Planets Smash",
        productVersion: "3.0",
        showBanner: unityShowBanner,
    };

    // ########## GAME INSTANCE ##########

    function createGameInstance() {
        let script = document.createElement("script");
        script.src = loaderUrl;
        script.onload = () => {
            createUnityInstance(canvas, config, (progress) => {

                progressBarFull.style.width = 100 * progress + "%";

            }).then((unityInstance) => {

                console.log("Game: Instance is ready.");
                instance = unityInstance;

                loadingBar.style.display = "none";

                // ########## DIAGNOSTICS ##########

                if (isDebugModeRequested == true) {

                    diagnosticsIcon.style.display = "block";
                    diagnosticsIcon.style.position = "fixed";
                    diagnosticsIcon.style.bottom = "10px";
                    diagnosticsIcon.style.right = "0px";
                    canvas.after(diagnosticsIcon);

                    diagnosticsIcon.onclick = () => {
                        unityDiagnostics.openDiagnosticsDiv(unityInstance.GetMetricsInfo);
                    };

                }

            }).catch((message) => {

                alert(message);

            });
        };
        document.body.appendChild(script);
    }

	// Public interface.
	return {

        getInstance: function () {
			return instance;
		},

		init: function () {
            createGameInstance();
		}

	};

})();
