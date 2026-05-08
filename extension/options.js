const $ = (id) => document.getElementById(id);

chrome.storage.sync.get({ backendUrl: "http://localhost:3000", persona: "" }, (v) => {
  $("backend").value = v.backendUrl;
  $("persona").value = v.persona;
});

$("save").addEventListener("click", () => {
  const backendUrl = $("backend").value.trim() || "http://localhost:3000";
  const persona = $("persona").value.trim();
  chrome.storage.sync.set({ backendUrl, persona }, () => {
    const ok = $("saved");
    ok.classList.remove("hidden");
    setTimeout(() => ok.classList.add("hidden"), 1500);
  });
});
