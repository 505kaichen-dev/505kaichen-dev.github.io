import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const files = new Map([
  ["/art/pick-detail-v001.webp", ["art/pick-detail-v001.webp", "image/webp"]],
  ["/art/scene-next-beat-v002.webp", ["art/scene-next-beat-v002.webp", "image/webp"]],
  ["/art/signal-listening-v002.webp", ["art/signal-listening-v002.webp", "image/webp"]],
  ["/art/tone-buddy-ready-v002.webp", ["art/tone-buddy-ready-v002.webp", "image/webp"]],

  ["/", ["index.html", "text/html"]],
  ["/index.html", ["index.html", "text/html"]],
  ["/lessons/00/index.html", ["lessons/00/index.html", "text/html"]],
  ["/lessons/01/index.html", ["lessons/01/index.html", "text/html"]],
  ["/lessons/02/index.html", ["lessons/02/index.html", "text/html"]],
  ["/lessons/03/index.html", ["lessons/03/index.html", "text/html"]],
  ["/lessons/04/index.html", ["lessons/04/index.html", "text/html"]],
  ["/lessons/05/index.html", ["lessons/05/index.html", "text/html"]],
  ["/lessons/06/index.html", ["lessons/06/index.html", "text/html"]],
  ["/lessons/07/index.html", ["lessons/07/index.html", "text/html"]],
  ["/lessons/08/index.html", ["lessons/08/index.html", "text/html"]],
  ["/lessons/09/index.html", ["lessons/09/index.html", "text/html"]],
  ["/lessons/10/index.html", ["lessons/10/index.html", "text/html"]],
  ["/lessons/11/index.html", ["lessons/11/index.html", "text/html"]],
  ["/labs/index.html", ["labs/index.html", "text/html"]],
  ["/labs/signal-chain/index.html", ["labs/signal-chain/index.html", "text/html"]],
  ["/style.css", ["style.css", "text/css"]],
  ["/app.js", ["app.js", "text/javascript"]],
  ["/course.js", ["course.js", "text/javascript"]],
  ["/lesson01.js", ["lesson01.js", "text/javascript"]],
  ["/lesson02.js", ["lesson02.js", "text/javascript"]],
  ["/lesson03.js", ["lesson03.js", "text/javascript"]],
  ["/lesson04.js", ["lesson04.js", "text/javascript"]],
  ["/lesson05.js", ["lesson05.js", "text/javascript"]],
  ["/lesson06.js", ["lesson06.js", "text/javascript"]],
  ["/lesson07.js", ["lesson07.js", "text/javascript"]],
  ["/lesson08.js", ["lesson08.js", "text/javascript"]],
  ["/lesson09.js", ["lesson09.js", "text/javascript"]],
  ["/lesson10.js", ["lesson10.js", "text/javascript"]],
  ["/lesson11.js", ["lesson11.js", "text/javascript"]],
  ["/chain.js", ["chain.js", "text/javascript"]],
  ["/art/tone-buddy-ready-v002.png", ["art/tone-buddy-ready-v002.png", "image/png"]],
  ["/art/tone-buddy-listen-v001.png", ["art/tone-buddy-listen-v001.png", "image/png"]],
  ["/art/tone-buddy-aha-v001.png", ["art/tone-buddy-aha-v001.png", "image/png"]],
  ["/art/amp-picking-dynamics-v001.jpg", ["art/amp-picking-dynamics-v001.jpg", "image/jpeg"]],
  ["/art/tone-buddy-tiny-turn-v001.png", ["art/tone-buddy-tiny-turn-v001.png", "image/png"]],
  ["/art/cab-mic-placement-v001.jpg", ["art/cab-mic-placement-v001.jpg", "image/jpeg"]],
  ["/art/tone-buddy-listen-close-v001.png", ["art/tone-buddy-listen-close-v001.png", "image/png"]],
  ["/art/gain-monitor-level-v001.jpg", ["art/gain-monitor-level-v001.jpg", "image/jpeg"]],
  ["/art/tone-buddy-too-hot-v001.png", ["art/tone-buddy-too-hot-v001.png", "image/png"]],
  ["/art/delay-echoes-v001.jpg", ["art/delay-echoes-v001.jpg", "image/jpeg"]],
  ["/art/tone-buddy-which-side-v001.png", ["art/tone-buddy-which-side-v001.png", "image/png"]],
  ["/art/signal-chain-rehearsal-v001.jpg", ["art/signal-chain-rehearsal-v001.jpg", "image/jpeg"]],
  ["/art/tone-buddy-swap-v001.png", ["art/tone-buddy-swap-v001.png", "image/png"]],
  ["/art/classic-rock-stage-v001.jpg", ["art/classic-rock-stage-v001.jpg", "image/jpeg"]],
  ["/art/tone-buddy-rock-lead-v001.png", ["art/tone-buddy-rock-lead-v001.png", "image/png"]],
  ["/art/metal-palm-mute-v001.jpg", ["art/metal-palm-mute-v001.jpg", "image/jpeg"]],
  ["/art/tone-buddy-metal-stop-v001.png", ["art/tone-buddy-metal-stop-v001.png", "image/png"]],
  ["/art/preset-session-notes-v001.jpg", ["art/preset-session-notes-v001.jpg", "image/jpeg"]],
  ["/art/listening-notebook-v001.jpg", ["art/listening-notebook-v001.jpg", "image/jpeg"]],
  ["/art/footswitch-pause-v002.jpg", ["art/footswitch-pause-v002.jpg", "image/jpeg"]],
  ["/art/signal-listening-v001.jpg", ["art/signal-listening-v001.jpg", "image/jpeg"]],
  ["/art/scene-next-beat-v001.jpg", ["art/scene-next-beat-v001.jpg", "image/jpeg"]],
  ["/art/tone-buddy-preset-done-v001.png", ["art/tone-buddy-preset-done-v001.png", "image/png"]],
  ["/art/diagnosis-home-pa-v001.jpg", ["art/diagnosis-home-pa-v001.jpg", "image/jpeg"]],
  ["/art/tone-buddy-diagnosis-v001.png", ["art/tone-buddy-diagnosis-v001.png", "image/png"]],
]);
const port = Number(process.env.TONE_LAB_PORT || 8765);
const root = new URL("./site/", import.meta.url);
createServer(async (request, response) => {
  const entry = files.get(request.url?.split("?")[0]);
  if (!entry || !["GET", "HEAD"].includes(request.method)) {
    response.writeHead(entry ? 405 : 404).end();
    return;
  }
  try {
    const body = await readFile(new URL(entry[0], root));
    const contentType = entry[1].startsWith("text/") ? entry[1] + "; charset=utf-8" : entry[1];
    response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(500).end();
  }
}).listen(port, "127.0.0.1", () => console.log("http://127.0.0.1:" + port + "/"));
