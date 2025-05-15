function addGoogleAnalyticsTags() {
    var currentDomain = window.location.hostname;
    var trackingId;

    console.log("Current Domain:", currentDomain); // Log the domain to debug

    switch (currentDomain) {
        case "eaglercraftx1-8.github.io":
            console.log("Matched GitHub Pages");
            trackingId = "G-C44R8LD9MC";
            break;
        case "eaglercraftx1-8.netlify.app":
            console.log("Matched Netlify");
            trackingId = "G-0R2ZXFSYVT";
            break;
        case "eaglercraftx1-8.onrender.com":
            console.log("Matched Render");
            trackingId = "G-MND1TVBSXV";
            break;
        case "play.eaglercraft.win":
            console.log("Matched Netlify / Play");
            trackingId = "G-759HWVCM2S";
            break;
        case "fastest.eaglercraft.win":
            console.log("Matched Netlify / Fastest");
            trackingId = "G-0FMCWKD9KG";
            break;
        case "notproxiedclient.eaglercraft.win":
            console.log("Matched OnRender / NotProxiedClient");
            trackingId = "G-QWHQVSNLB6";
            break;
        case "client.eaglercraft.win":
            console.log("Matched GitHub Pages / Client 1");
            trackingId = "G-SGELV1H17J";
            break;
        case "client2.eaglercraft.win":
            console.log("Matched OnRender / Client 2");
            trackingId = "G-995EPK8DXR";
            break;
        case "client3.eaglercraft.win":
            console.log("Matched Netlify / Client3");
            trackingId = "G-3M7CR3HRJV";
            break;
        default:
            console.log("Using Fallback Analytics");
            trackingId = "G-81F615LDEZ";
    }

    if (trackingId) {
        var analyticsScript = document.createElement('script');
        analyticsScript.async = true;
        analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        document.head.appendChild(analyticsScript);

        var scriptContent = document.createElement('script');
        scriptContent.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}');
        `;
        document.head.appendChild(scriptContent);
    }
}

addGoogleAnalyticsTags();
