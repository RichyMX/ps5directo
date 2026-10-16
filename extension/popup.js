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
    cfg.captured ? `Enviados: ${cfg.captured}${cfg.last ? " (último: " + cfg.last + ")" : ""}` : "";
  document.getElementById("reset").onclick = async () => {
    await chrome.storage.local.set({ captured: 0, last: "" });
    chrome.action.setBadgeText({ text: "" });
    document.getElementById("cnt").textContent = "";
  };
  const app = await findApp();
  const st = document.getElementById("st");
  if (app) { st.innerHTML = `<span class="ok">● Conectado</span> a PS5 Directo v${app.version}`; chrome.action.setBadgeText({ text: "" }); }
  else st.innerHTML = '<span class="bad">● PS5 Directo no está abierto</span> (las descargas seguirán normales)';
})();
