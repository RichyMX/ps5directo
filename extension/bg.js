const EN = !(navigator.language || "es").toLowerCase().startsWith("es");
// PS5 Directo - captura de enlaces.
// Cuando el navegador empieza a descargar un archivo comprimido o paquete (.rar, .7z, .zip, .pkg...),
// manda el enlace FINAL (despues de redirecciones) a PS5 Directo y cancela la descarga.
// Si PS5 Directo no esta abierto, no toca nada: la descarga sigue normal.

const WANTED_FILE = /\.(part\d+\.rar|rar|r\d{2,3}|7z(\.\d{3})?|zip|z\d{2}|\d{3}|pkg|exfat|ffpkg|ffpfsc?|ufs)$/i;
const PORTS = [8777, 8778, 8779];

async function settings() {
  return chrome.storage.local.get({ enabled: true, captured: 0 });
}

async function findApp() {
  for (const port of PORTS) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/api/ext/ping`, { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        if (j.app === "PS5 Directo") return { port, version: j.version };
      }
    } catch (e) { /* no esta en ese puerto */ }
  }
  return null;
}

function fileName(item) {
  const f = (item.filename || "").split(/[\\/]/).pop();
  if (f) return f;
  try { return decodeURIComponent(new URL(item.finalUrl || item.url).pathname.split("/").pop()); }
  catch (e) { return ""; }
}

async function handle(item) {
  const cfg = await settings();
  if (!cfg.enabled) return;
  const url = item.finalUrl || item.url;
  if (!/^https?:/i.test(url)) return;
  const name = fileName(item);
  const path = url.split("?")[0];
  if (!WANTED_FILE.test(name) && !WANTED_FILE.test(path)) return;     // no es un archivo que nos interese
  const app = await findApp();
  if (!app) {                                                     // PS5 Directo cerrado: no tocar
    chrome.action.setBadgeText({ text: "off" });
    return;
  }
  // Como los gestores de descargas: pasamos las cookies de ese alojamiento (sesion, cuenta
  // premium), el navegador y la pagina de origen, para que el servidor nos trate igual.
  // Solo van a PS5 Directo en este PC (127.0.0.1), a ningun otro sitio.
  const cookies = {};
  for (const u of [url, item.url]) {
    try {
      const host = new URL(u).host.toLowerCase();
      if (host in cookies) continue;
      const list = await chrome.cookies.getAll({ url: u });
      cookies[host] = list.map(c => `${c.name}=${c.value}`).join("; ");
    } catch (e) { /* sin permiso o enlace raro: sin cookies */ }
  }
  try {
    const r = await fetch(`http://127.0.0.1:${app.port}/api/ext/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, original: item.url, name, cookies,
                             ua: navigator.userAgent, referrer: item.referrer || "" })
    });
    if (!r.ok) return;
  } catch (e) { return; }
  try { await chrome.downloads.cancel(item.id); } catch (e) {}
  try { await chrome.downloads.erase({ id: item.id }); } catch (e) {}
  const n = (cfg.captured || 0) + 1;
  await chrome.storage.local.set({ captured: n, last: name });
  chrome.action.setBadgeBackgroundColor({ color: "#2563eb" });
  chrome.action.setBadgeText({ text: String(n % 1000) });
  chrome.notifications.create({
    type: "basic", iconUrl: "icon128.png", title: EN ? "Sent to PS5 Directo" : "Enviado a PS5 Directo",
    message: (name || (EN ? "Link" : "Enlace")) + (EN ? " — not downloaded to the PC." : " — no se descarga en el PC.")
  });
}

// Cuando ya se sabe el nombre del archivo y el enlace final (tras las redirecciones)
chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  suggest();                // no cambiamos el nombre
  handle(item);
});
