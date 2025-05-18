class AspectRatio {

	constructor(mobileAspectRatio, desktopAspectRatio) {
		// Banner advertisement fields.
		this.rightOffset = 0;
		this.bottomOffset = 0;
		// Initialize elements.
		this.unityContainer = document.querySelector("#unity-container");
		this.gameCanvas = document.querySelector("#unity-canvas");
		this.bannerElement = document.querySelector("#banner-container");
		this.aspectRatio = 1;
		// Fetch aspect ratio by device type.
		if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
			// Mobile.
			this.aspectRatio = parseFloat(mobileAspectRatio);
		}
		else {
			// Desktop.
			this.aspectRatio = parseFloat(desktopAspectRatio);
		}
		// Bind methods to the class instance.
		this.update = this.update.bind(this);
		this.resetAspectRatio = this.resetAspectRatio.bind(this);
		this.recalculateAspectRatio = this.recalculateAspectRatio.bind(this);
		// Subscribe to window and document events.
		window.addEventListener("load", this.update);
		window.addEventListener("resize", this.update);
		document.addEventListener("readystatechange", this.update);
		document.addEventListener("DOMContentLoaded", this.update);
	}

	setRightOffset(value) {
		this.rightOffset = value;
	}

	setBottomOffset(value) {
		this.bottomOffset = value;
	}

	centerAlignCanvas() {
		// Center the canvas.
		this.gameCanvas.style.margin = "auto";
		this.gameCanvas.style.top = "0";
		this.gameCanvas.style.left = "0";
		this.gameCanvas.style.bottom = "0";
		this.gameCanvas.style.right = "0";
	}

	resetAspectRatio() {
		this.gameCanvas.style.width = "100%";
		this.gameCanvas.style.height = "100%";
		this.centerAlignCanvas();
	}

	recalculateAspectRatio() {
		// Calculate aspect ratio.
		let containerWidth = this.unityContainer.clientWidth;
		let containerHeight = this.unityContainer.clientHeight;
		// Apply aspect ratio lock with pixel-perfect size.
		if (containerWidth / containerHeight > this.aspectRatio) {
			this.gameCanvas.style.width = Math.floor(
				containerHeight * this.aspectRatio) + "px";
			this.gameCanvas.style.height = "100%";
		} else {
			this.gameCanvas.style.width = "100%";
			this.gameCanvas.style.height = Math.floor(
				containerWidth / this.aspectRatio) + "px";
		}
		this.centerAlignCanvas();
	}

	update() {
		// Resize the unity container.
		if (window.innerWidth - this.rightOffset > window.innerHeight) {
			// Landscape mode.
			this.unityContainer.style.width = (window.innerWidth - this.rightOffset) + "px";
			this.unityContainer.style.height = window.innerHeight + "px";
			this.bannerElement.classList.add("landscape");
			this.bannerElement.classList.remove("portrait");
		}
		else {
			// Portrait mode.
            this.unityContainer.style.width = window.innerWidth + "px";
			this.unityContainer.style.height = (window.innerHeight - this.bottomOffset) + "px";
			this.bannerElement.classList.add("portrait");
			this.bannerElement.classList.remove("landscape");
		}
		// Reset aspect ratio.
		this.resetAspectRatio();
		// Check if aspect ratio is valid.
		if (this.aspectRatio > 0) {
			this.recalculateAspectRatio();
		}
	}

}

if (typeof window !== 'undefined') {
	window.aspectRatio = new AspectRatio(
		runtimeData.mobileAspectRatio,
		runtimeData.desktopAspectRatio
	);
}