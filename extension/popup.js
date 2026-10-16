const EN = !(navigator.language || "es").toLowerCase().startsWith("es");
const T = EN ? {
  capture: "Capture links", checking: "Checking…", reset: "Reset counter",
  help: "Pass the captcha and click Download as usual: if it's a .rar, .7z, .zip, .pkg… and PS5 Directo is open, the link goes to its link box and the browser downloads nothing. If PS5 Directo is closed, the download goes ahead normally.",
  sent: "Sent", last: "last", connected: "● Connected", to: "to PS5 Directo", closed: "● PS5 Directo is not open", normal: "(downloads will work normally)"
} : {
  capture: "Capturar enlaces", checking: "Comprobando…", reset: "Poner contador a 0",
  help: null, sent: "Enviados", last: "último", connected: "● Conectado", to: "a PS5 Directo", closed: "● PS5 Directo no está abierto", normal: "(las descargas seguirán normales)"
};
if (EN) {
  document.documentElement.lang = "en";
  document.getElementById("lblEn").textContent = T.capture;
  document.getElementById("st").textContent = T.checking;
  document.getElementById("reset").textContent = T.reset;
  document.getElementById("help").textContent = T.help;
}
async function findApp() {
  for (const port of [8777, 8778, 8779]) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/api/ext/ping`, { cache: "no-store" });
      if (r.ok) { const j = await r.json(); if (j.app === "PS5 Directo") return j; }
    } catch (e) {}
  }
  return null;
}
(async () => {
  const cfg = await chrome.storage.local.get({ enabled: true, captured: 0, last: "" });
  const en = document.getElementById("en");
  en.checked = cfg.enabled;
  en.onchange = () => chrome.storage.local.set({ enabled: en.checked });
  document.getElementById("cnt").textContent =
    cfg.captured ? `${T.sent}: ${cfg.captured}${cfg.last ? " (" + T.last + ": " + cfg.last + ")" : ""}` : "";
  document.getElementById("reset").onclick = async () => {
    await chrome.storage.local.set({ captured: 0, last: "" });
    chrome.action.setBadgeText({ text: "" });
    document.getElementById("cnt").textContent = "";
  };
  const app = await findApp();
  const st = document.getElementById("st");
  if (app) { st.innerHTML = `<span class="ok">${T.connected}</span> ${T.to} v${app.version}`; chrome.action.setBadgeText({ text: "" }); }
  else st.innerHTML = `<span class="bad">${T.closed}</span> ${T.normal}`;
})();
