## Usage
1. `vite.config.ts`'s required settings:
    ```ts
    import { defineConfig } from "vite";

    export default defineConfig({
        build: {
            manifest: true,
            cssCodeSplit: false,
            rollupOptions: {
                input: {
                    loader: path.resolve(__dirname, "index.html"),
                    main: path.resolve(__dirname, "src/main.ts"),
                    styles: path.resolve(__dirname, "src/assets/scss/main.scss"),
                },
                output: {
                    entryFileNames: "assets/[name]-[hash].js",
                    chunkFileNames: "assets/[name]-[hash].js",
                    assetFileNames: "assets/[name]-[hash].[ext]",
                },
            },
        },
    });
    ```
2. make sure that `postbuild.ts` is in your project's root (same directory as `package.json`)
2. replace
    ```html
    <script type="module" src="./src/main.ts"></script>
   ```
   with
    ```html
    <script type="module" src="./src/loader.ts"></script>
    <script type="module">
        import { loadAssets } from './src/loader.ts'
        window.addEventListener('load', async () => {
            await loadAssets()

            const loader = document.getElementById('loader') // your selectors here
            const content = document.querySelector("main") // your selectors here

            loader.addEventListener("transitionend", () => loader.remove())
            loader.classList.add('hidden')

            content.setAttribute('style', false)
            })
    </script>
   ```
3. update `package.json`'s `scripts.build` entry:
    ```json
    "build": "tsc && vite build && bun run ./postbuild.ts"
    ```