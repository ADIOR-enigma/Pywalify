(async function wal() {
	if (!(Spicetify.React && Spicetify.ReactDOM && Spicetify.Config)) {
		setTimeout(wal, 10);
		return;
	}

	const home = process.env.HOME || process.env.USERPROFILE;

	fetch(`file://${home}/.cache/wal/colors.json`)
		.then(response => response.json())
		.then(({ colors }) => {
			const scheme = {
				"text":               colors.color15,
				"subtext":            colors.color7,
				"main":               colors.color0,
				"main-elevated":      colors.color1,
				"main-transition":    colors.color0,
				"highlight":          colors.color5,
				"highlight-elevated": colors.color13,
				"sidebar":            colors.color0,
				"player":             colors.color0,
				"card":               colors.color0,
				"shadow":             colors.color8,
				"selected-row":       colors.color15,
				"button":             colors.color6,
				"button-active":      colors.color14,
				"button-disabled":    colors.color8,
				"tab-active":         colors.color0,
				"notification":       "#101010",
				"notification-error": "#B54548",
				"misc":               colors.color0,
				"play-button":        colors.color3,
				"play-button-active": colors.color11,
				"progress-fg":        colors.color10,
				"progress-bg":        colors.color0,
				"heart":              colors.color12,
				"pagelink-active":    colors.color3,
				"radio-btn-active":   colors.color3
			};

			document.querySelector("style.walScheme")?.remove();

			const schemeTag = document.createElement("style");
			schemeTag.classList.add("walScheme");

			let injectStr = ":root {";
			Object.entries(scheme).forEach(([key, val]) => {
				const hex = val.replace("#", "");
				injectStr += `--spice-${key}: ${val};`;
				injectStr += `--spice-rgb-${key}: ${hexToRGB(hex)};`;
			});
			injectStr += "}";

			schemeTag.innerHTML = injectStr;
			document.body.appendChild(schemeTag);
		})
		.catch(error => {
			console.warn("[wal-Warning]: Failed to load pywal colors:", error);
		});

	function hexToRGB(hex) {
		if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
		const m = hex.match(/.{1,2}/g);
		return [parseInt(m[0], 16), parseInt(m[1], 16), parseInt(m[2], 16)];
	}
})();