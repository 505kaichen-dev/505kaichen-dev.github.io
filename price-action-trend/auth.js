(function () {
  "use strict";

  const form = document.getElementById("unlockForm");
  const passwordInput = document.getElementById("accessPassword");
  const unlockButton = document.getElementById("unlockButton");
  const errorBox = document.getElementById("authError");
  const authGate = document.getElementById("authGate");
  const protectedApp = document.getElementById("protectedApp");
  let encryptedPayload = null;

  function decodeBase64(value) {
    const binary = atob(value);
    return Uint8Array.from(binary, character => character.charCodeAt(0));
  }

  async function loadPayload() {
    if (encryptedPayload) return encryptedPayload;
    if (window.EMBEDDED_PROTECTED_DATA) {
      encryptedPayload = window.EMBEDDED_PROTECTED_DATA;
      return encryptedPayload;
    }
    const response = await fetch("protected-data.json?v=20260930141549", { cache: "no-store" });
    if (!response.ok) throw new Error("encrypted-data-unavailable");
    encryptedPayload = await response.json();
    return encryptedPayload;
  }

  async function decryptPayload(password, payload) {
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: decodeBase64(payload.salt),
        iterations: payload.iterations,
        hash: "SHA-256",
      },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const plainBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: decodeBase64(payload.iv), tagLength: 128 },
      key,
      decodeBase64(payload.ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(plainBuffer));
  }

  function loadApplication(data) {
    window.PRICE_TREND_DATA = data;
    authGate.hidden = true;
    protectedApp.hidden = false;
    document.body.classList.add("is-unlocked");

    const script = document.createElement("script");
    if (window.EMBEDDED_APP_SOURCE) {
      script.textContent = window.EMBEDDED_APP_SOURCE;
    } else {
      script.src = "app.js?v=20260930141549";
    }
    script.onerror = () => {
      protectedApp.hidden = true;
      authGate.hidden = false;
      errorBox.textContent = "網站程式載入失敗，請稍後再試。";
      errorBox.hidden = false;
    };
    document.body.appendChild(script);
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const password = passwordInput.value;
    if (!password) return;

    unlockButton.disabled = true;
    unlockButton.textContent = "驗證中…";
    errorBox.hidden = true;
    try {
      const payload = await loadPayload();
      const data = await decryptPayload(password, payload);
      passwordInput.value = "";
      loadApplication(data);
    } catch (error) {
      errorBox.textContent = error.message === "encrypted-data-unavailable"
        ? "加密資料暫時無法載入，請稍後再試。"
        : "密碼不正確，請重新輸入。";
      errorBox.hidden = false;
      passwordInput.select();
    } finally {
      unlockButton.disabled = false;
      unlockButton.textContent = "解鎖";
    }
  });
})();
