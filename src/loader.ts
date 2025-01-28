const isDev = import.meta.env.DEV;

export async function loadAssets() {
    const loadCSS = (href: string) => {
        return new Promise<void>(async (resolve) => {
            // Load CSS file
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            document.head.appendChild(link);

            // Wait for CSS to load
            link.onload = async () => {
                // Fetch CSS content and extract background images
                const cssText = await fetch(href).then((res) => res.text());
                const imageUrls = [...[...document.images].map((i) => i.src), ...extractBackgroundImageUrls(cssText)];

                // Preload all background images
                await Promise.all(imageUrls.map(preloadImage));
                isDev && console.log(`style ${href} loaded`);
                resolve();
            };
        });
    };

    // Helper to extract background image URLs from CSS
    const extractBackgroundImageUrls = (cssText: string): string[] => {
        // Regex to match url() values, handling quotes and escaping
        const urlRegex = /url\(\s*['"]?(.*?)['"]?\s*\)/g;
        const urls: string[] = [];
        let match;

        while ((match = urlRegex.exec(cssText)) !== null) {
            const url = match[1].trim().replace(/['"\\]/g, "");
            urls.push(url);
        }

        return urls;
    };

    // Helper to preload an image
    const preloadImage = (src: string) => {
        return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                isDev && console.log(`image ${src} loaded`);
                resolve();
            };
            img.onerror = (e) => {
                console.log(`image ${src} NOT loaded;`, e);
                // TODO: Resolve even if image fails to load?
                reject();
            };
        });
    };

    const loadJS = async (src: string) => {
        const script = document.createElement("script");
        script.type = "module";
        script.src = src;
        document.body.appendChild(script);
        return new Promise((resolve) => {
            isDev && console.log(`script ${src} loaded`);
            script.onload = resolve;
        });
    };

    await loadJS("/src/main.ts");
    await loadCSS("/src/assets/scss/main.scss");
}
