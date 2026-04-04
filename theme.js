(async function pywalify() {
    // 1. Block until Spicetify loads
    if (!Spicetify.Platform) {
        setTimeout(pywalify, 10);
        return;
    }
    console.debug("[Pywalify]: Initializing...");

    // 2. Parse the Pywal generated INI file
    function parseIni(data) {
        const regex = {
            section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
            param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
            comment: /^\s*;.*$/
        };
        const value = {};
        let section = null;

        data.split(/[\r\n]+/).forEach(line => {
            if (regex.comment.test(line)) return;
            if (regex.param.test(line)) {
                const match = line.match(regex.param);
                if (match && match.length === 3 && section) {
                    value[section][match[1]] = match[2].split(";")[0].trim();
                }
            } else if (regex.section.test(line)) {
                const match = line.match(regex.section);
                if (match) {
                    value[match[1]] = {};
                    section = match[1];
                }
            }
        });
        return value;
    }

    // 3. Convert standard hex to Spicetify RGB format
    function hexToRGB(hex) {
        if (hex.length === 3) hex = hex.split("").map(char => char + char).join("");
        const aRgbHex = hex.match(/.{1,2}/g);
        return `${parseInt(aRgbHex[0], 16)},${parseInt(aRgbHex[1], 16)},${parseInt(aRgbHex[2], 16)}`;
    }

    // 4. Inject colors into the DOM dynamically
    function applyColors(scheme) {
        const existingScheme = document.querySelector("style.pywalScheme");
        existingScheme?.remove();

        const schemeTag = document.createElement("style");
        schemeTag.classList.add("pywalScheme");
        
        let injectStr = ":root {\n";
        Object.keys(scheme).forEach(key => {
            injectStr += `--spice-${key}: #${scheme[key]};\n`;
            injectStr += `--spice-rgb-${key}: ${hexToRGB(scheme[key])};\n`;
        });
        injectStr += "}";
        
        schemeTag.innerHTML = injectStr;
        document.body.appendChild(schemeTag);
        console.debug("[Pywalify]: Pywal colors successfully applied.");
    }

    // 5. Fetch and Apply
    async function updateTheme() {
        try {
            // NOTE: Change this path to point to your local Pywal color.ini 
            // or the raw GitHub URL if you are fetching it remotely.
            const response = await fetch("https://raw.githubusercontent.com/ADIOR-enigma/Pywalify/main/color.ini");
            const iniContent = await response.text();
            
            const parsedSchemes = parseIni(iniContent);
            
            // Automatically grab the first section in the ini (e.g. [Pywal] or [wal16])
            const activeSchemeName = Object.keys(parsedSchemes)[0];
            if (activeSchemeName && parsedSchemes[activeSchemeName]) {
                applyColors(parsedSchemes[activeSchemeName]);
            }
        } catch (error) {
            console.error("[Pywalify]: Failed to fetch color scheme:", error);
        }
    }

    // Run the update
    updateTheme();

    // OPTIONAL: If Pywal changes wallpapers frequently, uncomment below 
    // to silently check for new colors every 10 seconds without reloading Spotify.
    // setInterval(updateTheme, 10000); 

})();
