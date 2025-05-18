// Import the necessary scripts for the 3D logo,
// if provided value for the logoType is ThreeJs.
if (runtimeData.logoType == "ThreeJs") {
    // Create the importmap script element.
    const importMapScript = document.createElement('script');
    importMapScript.type = 'importmap';
    importMapScript.textContent = JSON.stringify({
        imports: {
            three: './lib/threeModule.js',
            'three/addons/': './lib/'
        }
    });
    // Create the module script element.
    const moduleScript = document.createElement('script');
    moduleScript.type = 'module';
    moduleScript.src = 'lib/threeCanvas.js';
    // Append the scripts to the body.
    document.body.appendChild(importMapScript);
    document.body.appendChild(moduleScript);
}