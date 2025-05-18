const aspectRatio = (function () {

	const aspectRatioMobile = "";
	const aspectRatioDesktop = "16/9";
	let gameCanvas = document.querySelector("#unity-canvas");
	let aspectRatio = 1;

	function parseAspectRatio(input) {
		let fractionParts = input.split('/');
		if (fractionParts.length === 2) {
			const numerator = parseFloat(fractionParts[0]);
			const denominator = parseFloat(fractionParts[1]);
			if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
				return numerator / denominator;
			}
		}
		return -1;
	}

	function centerAlignCanvas() {
		// Center the canvas.
		gameCanvas.style.margin = "auto";
		gameCanvas.style.top = "0";
		gameCanvas.style.left = "0";
		gameCanvas.style.bottom = "0";
		gameCanvas.style.right = "0";
	}

	function recalculateAspectRatio() {
		// Calculate aspect ratio.
		let windowWidth = window.innerWidth;
		let windowHeight = window.innerHeight;
		// Apply aspect ratio lock with pixel-perfect size.
		if (windowWidth / windowHeight > aspectRatio) {
			gameCanvas.style.width = Math.floor(windowHeight * aspectRatio) + "px";
			gameCanvas.style.height = "100%";
		} else {
			gameCanvas.style.width = "100%";
			gameCanvas.style.height = Math.floor(windowWidth / aspectRatio) + "px";
		}
		centerAlignCanvas();
	}

	function resetAspectRatio() {
		gameCanvas.style.width = "100%";
		gameCanvas.style.height = "100%";
		centerAlignCanvas();
	}

	function selectAspectRatio() {
		resetAspectRatio();
		// Check if aspect ratio is valid.
		if (aspectRatio > 0) {
			recalculateAspectRatio();
		}
	}

	// Public interface.
	return {

		init: function () {
			// Fetch aspect ratio by device type.
			if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
				// Mobile.
				aspectRatio = parseAspectRatio(aspectRatioMobile);
			}
			else {
				// Desktop.
				aspectRatio = parseAspectRatio(aspectRatioDesktop);
			}
			// Subscribe to window and document events.
			window.addEventListener("load", selectAspectRatio);
			window.addEventListener("resize", selectAspectRatio);
			document.addEventListener("readystatechange", selectAspectRatio);
			document.addEventListener("DOMContentLoaded", selectAspectRatio);
		}

	};

})();
