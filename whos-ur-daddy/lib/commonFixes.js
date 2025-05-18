// Disable unwanted page scroll.
window.addEventListener("wheel", (event) => event.preventDefault(), {
    passive: false,
});

// Disable unwanted key events.
window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", " "].includes(event.key)) {
        event.preventDefault();
    }
});

// This is a fix for handling visibility change
// on webview, it’s for an issue reported for Samsung App.
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState) {
        if (document.visibilityState === "hidden") {
            application.publishEvent("OnWebDocumentPause", "True");
        }
        else if (document.visibilityState === "visible") {
            application.publishEvent("OnWebDocumentPause", "False");
        }
    }
});