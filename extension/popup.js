const $ = (id) => document.getElementById(id);

const DEFAULT_BACKEND = "http://localhost:3000";

let imageDataUrl = null;

async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      { backendUrl: DEFAULT_BACKEND, persona: "" },
      (v) => resolve(v)
    );
  });
}

async function init() {
  const { backendUrl } = await getSettings();
  $("backend").textContent = backendUrl;

  $("intensity").addEventListener("input", (e) => {
    $("intensity-val").textContent = e.target.value;
  });

  $("capture").addEventListener("click", capture);
  $("recapture").addEventListener("click", capture);
  $("generate").addEventListener("click", generate);
}

function capture() {
  $("error").classList.add("hidden");
  chrome.runtime.sendMessage({ type: "CAPTURE_TAB" }, async (res) => {
    if (!res?.ok) {
      showError(res?.error || "Could not capture this tab.");
      return;
    }
    const resized = await resizeDataUrl(res.dataUrl, 1024);
    imageDataUrl = resized;
    $("preview").src = resized;
    $("preview-wrap").classList.remove("hidden");
    $("generate").disabled = false;
  });
}

async function resizeDataUrl(dataUrl, maxDim) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return await res.blob();
}

async function generate() {
  if (!imageDataUrl) {
    showError("Capture the tab first.");
    return;
  }
  const { backendUrl, persona } = await getSettings();
  $("error").classList.add("hidden");
  $("results").classList.add("hidden");
  $("results").innerHTML = "";
  $("generate").disabled = true;
  $("generate").textContent = "Cooking...";

  try {
    const blob = await dataUrlToBlob(imageDataUrl);
    const fd = new FormData();
    fd.append("mode", "suggest");
    fd.append("image0", new File([blob], "capture.jpg", { type: "image/jpeg" }));
    fd.append("context", $("context").value);
    fd.append("moods", $("mood").value);
    fd.append("intensity", $("intensity").value);
    fd.append("userGender", $("userGender").value);
    fd.append("targetGender", $("targetGender").value);
    fd.append("language", $("language").value);
    fd.append("length", $("length").value);
    fd.append("multiMessage", "false");
    fd.append("detectFlags", "false");
    fd.append("persona", persona || "");

    const res = await fetch(backendUrl.replace(/\/$/, "") + "/api/suggest", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    renderResults(data);
  } catch (e) {
    showError(e.message || String(e));
  } finally {
    $("generate").disabled = false;
    $("generate").textContent = "✨ Generate replies";
  }
}

function renderResults(data) {
  const root = $("results");
  root.innerHTML = "";
  root.classList.remove("hidden");

  if (data.analysis) {
    const a = document.createElement("div");
    a.className = "analysis";
    a.innerHTML = `
      <div class="analysis-head">Read of the situation</div>
      <div>${escape(data.analysis.vibe || "—")}</div>
      <div class="analysis-tags">
        <span class="analysis-tag">Stage: <b>${escape(stageLabel(data.analysis.stage))}</b></span>
        <span class="analysis-tag">Risk: <b>${escape(data.analysis.recommendedRisk)}</b></span>
        ${
          data.analysis.languageDetected
            ? `<span class="analysis-tag">Lang: <b>${escape(data.analysis.languageDetected)}</b></span>`
            : ""
        }
      </div>
    `;
    root.appendChild(a);
  }

  for (const reply of data.replies || []) {
    const card = document.createElement("div");
    card.className = "reply-card";
    const messages = reply.messages || [];
    const allText = messages.join("\n\n");
    card.innerHTML = `
      <div class="reply-head">
        <span class="risk-pill risk-${escape(reply.risk)}">${escape(reply.risk)}</span>
        <button class="copy-btn">📋 Copy</button>
      </div>
      ${messages.map((m) => `<div class="reply-text" dir="auto">${escape(m)}</div>`).join("")}
      <div class="reasoning">${escape(reply.reasoning)}</div>
    `;
    card.querySelector(".copy-btn").addEventListener("click", async () => {
      await navigator.clipboard.writeText(allText);
      const btn = card.querySelector(".copy-btn");
      btn.textContent = "✓ Copied";
      setTimeout(() => (btn.textContent = "📋 Copy"), 1400);
    });
    root.appendChild(card);
  }
}

function stageLabel(s) {
  return (
    {
      opener: "First message",
      rapport: "Building rapport",
      plateau: "Plateau",
      ask_out: "Asking out",
      recovery: "Recovery",
      post_ghost: "After ghost",
      other: "Other",
    }[s] || s
  );
}

function escape(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showError(msg) {
  $("error").textContent = msg;
  $("error").classList.remove("hidden");
}

init();
