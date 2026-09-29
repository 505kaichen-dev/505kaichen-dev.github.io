import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [indexPath, stylesPath, authPath, appPath, payloadPath, outputPath] = process.argv.slice(2);
if (![indexPath, stylesPath, authPath, appPath, payloadPath, outputPath].every(Boolean)) {
  throw new Error("Usage: node build-offline.mjs index.html styles.css auth.js app.js protected-data.json output.html");
}

const [indexHtml, styles, authSource, appSource, payloadText] = await Promise.all([
  readFile(indexPath, "utf8"),
  readFile(stylesPath, "utf8"),
  readFile(authPath, "utf8"),
  readFile(appPath, "utf8"),
  readFile(payloadPath, "utf8"),
]);

const safeAppSource = JSON.stringify(appSource).replace(/<\/script/gi, "<\\/script");
const bootstrap = `<script>\nwindow.EMBEDDED_PROTECTED_DATA = ${payloadText};\nwindow.EMBEDDED_APP_SOURCE = ${safeAppSource};\n</script>\n<script>\n${authSource}\n</script>`;

let output = indexHtml
  .replace(/<link rel="stylesheet" href="styles\.css[^>]*>/, `<style>\n${styles}\n</style>`)
  .replace(/<script src="auth\.js[^>]*><\/script>/, bootstrap)
  .replace("</head>", "  <meta name=\"application-name\" content=\"IBM 調價趨勢離線版\">\n</head>");

if (/<script\s+[^>]*src=|<link\s+[^>]*rel=["']stylesheet["']/i.test(output)) {
  throw new Error("Offline build still contains an external application dependency.");
}

await mkdir(dirname(resolve(outputPath)), { recursive: true });
await writeFile(outputPath, output, "utf8");
process.stdout.write(`Offline file written to ${outputPath}\n`);
