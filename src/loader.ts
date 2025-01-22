export async function loadAssets() {
    const loadCSS = (href: string) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    };

    const loadJS = async (src: string) => {
        const script = document.createElement("script");
        script.type = "module";
        script.src = src;
        document.body.appendChild(script);
        return new Promise((resolve) => {
            script.onload = resolve;
        });
    };

    if (import.meta.env.DEV) {
        await loadJS("/src/main.ts");
        loadCSS("/src/assets/scss/main.scss");
    } else {
        const manifest = await fetch("/manifest.json").then((r) => r.json());
        await loadJS(`/assets/${manifest["src/main.ts"].file}`);
        loadCSS(`/assets/${manifest["src/assets/scss/main.scss"].file}`);
    }
}
