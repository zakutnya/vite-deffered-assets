import path from "path";
import fs from "fs";

const outDir = path.join(__dirname, "dist");
const assetsPath = path.join(outDir, "assets");
const manifest = JSON.parse(fs.readFileSync(path.join(outDir, ".vite", "manifest.json"), "utf-8"));

// Create map of original paths to hashed paths
const pathMap = new Map<string, string>();
for (const [key, entry] of Object.entries(manifest)) {
    pathMap.set(key, (entry as any).file);
    /* if ((entry as any).css) {
        (entry as any).css.forEach((cssFile: string) => pathMap.set(key, cssFile));
    } */
}

console.log(`\nReplacing map:`);
pathMap.forEach((to, from) => console.log(`${from} -> ${to}`));
console.log(``);

fs.readdir(assetsPath, function (err, files) {
    if (err) throw new Error(err.message);

    const jsFiles = files.filter((el) => path.extname(el) === ".js");

    jsFiles.forEach((file) => {
        let content = fs.readFileSync(path.join(assetsPath, file), "utf-8");

        // Replace all occurrences of original paths
        pathMap.forEach((hashedPath, originalPath) => {
            const regex = new RegExp(escapeRegExp(originalPath), "g");
            content = content.replace(regex, hashedPath);
        });

        fs.writeFileSync(path.join(assetsPath, file), content);
        console.log(`✅ ${path.join(assetsPath, file)}`);
    });

    function escapeRegExp(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
});
