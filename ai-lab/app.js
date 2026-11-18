const form = document.querySelector('#unlockForm');
const passwordInput = document.querySelector('#password');
const statusNode = document.querySelector('#status');
const button = form.querySelector('button');

function setStatus(message, isError = false) {
  statusNode.textContent = message;
  statusNode.classList.toggle('error', isError);
}
async function unlock(password) {
  setStatus('正在解密 AI Lab…');
  button.disabled = true;
  const response = await fetch('./payload.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('找不到 AI Lab 加密內容。');
  const payload = await KaiAiLab.decrypt(await response.json(), password, message => setStatus(message));
  sessionStorage.setItem(KaiAiLab.passwordKey, password);
  KaiAiLab.render(payload, payload.entry || 'index.html');
}
function showError(error) {
  console.error(error);
  const wrong = error.name === 'OperationError' || /密碼不正確/.test(error.message);
  setStatus(wrong ? '密碼不正確，無法解密封包。' : error.message, true);
  button.disabled = false;
  passwordInput.select();
}
form.addEventListener('submit', event => { event.preventDefault(); unlock(passwordInput.value).catch(showError); });
const remembered = sessionStorage.getItem('kaiAiLabPassword');
if (remembered) {
  passwordInput.value = remembered;
  unlock(remembered).catch(error => { sessionStorage.removeItem('kaiAiLabPassword'); showError(error); });
}
