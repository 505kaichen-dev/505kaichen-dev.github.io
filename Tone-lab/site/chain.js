export const blocks = {
  gate: ["Gate", "DYNAMICS"], comp: ["Compressor", "DYNAMICS"],
  od: ["Overdrive", "DRIVE"], eq: ["EQ", "FILTER"],
  amp: ["AMP", "AMPLIFIER"], cab: ["CAB / IR", "SPEAKER"],
  delay: ["Delay", "TIME"], reverb: ["Reverb", "SPACE"],
};

export const initialChain = () => ["od", "amp", "cab", "reverb"].map(id => ({ id, on: true }));

export function orderExerciseChain(order) {
  if (order !== "eq-first" && order !== "drive-first") return null;
  const pair = order === "eq-first" ? ["eq", "od"] : ["od", "eq"];
  return [...pair, "amp", "cab"].map(id => ({ id, on: true }));
}

export function eqDriveObservation(eqFirst, ampAfterEq = true) {
  return eqFirst
    ? "EQ 在 Drive 前。先削掉低頻，進 Drive 的低頻就比較少，可能減輕破音裡的混濁。"
    : "EQ 在 Drive 後。你改的是 Drive 已產生的頻譜。" +
      (ampAfterEq ? "後方的 AMP 若也會失真，這個 EQ 還會改變送進 AMP 的訊號。" : "");
}

export function validChain(value) {
  if (!Array.isArray(value) || value.length > Object.keys(blocks).length) return false;
  return value.every(item => item && Object.hasOwn(blocks, item.id) && typeof item.on === "boolean")
    && new Set(value.map(item => item.id)).size === value.length;
}
export function chainObservations(chain) {
  const active = chain.filter(item => item.on).map(item => item.id);
  const has = id => active.includes(id);
  const before = (first, second) => active.indexOf(first) < active.indexOf(second);
  const notes = [];
  if (has("eq") && has("od")) notes.push(eqDriveObservation(before("eq", "od"), has("amp") && before("eq", "amp")));
  if (has("amp") && has("od")) notes.push(before("od", "amp")
    ? "Overdrive 在 AMP 前。若 AMP 已接近失真，送入它的電平與頻譜可能改變破音量和動態。"
    : "Overdrive 在 AMP 後。它接受已經過 AMP 的訊號，可能為原先的破音再加入非線性處理。");
  if (has("amp") && has("eq")) notes.push(before("eq", "amp")
    ? "EQ 在 AMP 前。被加強的頻段可能更容易推動 AMP 進入非線性區。"
    : "EQ 在 AMP 後。主要調整 AMP 輸出的頻譜，後續若還有非線性級，仍可能影響該級的反應。");
  if (has("amp") && has("cab") && before("cab", "amp")) notes.push("CAB / IR 在 AMP 前。濾波先作用在 AMP 的輸入，與常見的 AMP 後模擬喇叭收音不同。");
  for (const effect of ["delay", "reverb"]) {
    if (!has(effect)) continue;
    const name = blocks[effect][0];
    if (has("amp") && before(effect, "amp")) notes.push(name + " 在 AMP 前。尾音和乾聲一起進入 AMP；失真與壓縮可能改變尾音輪廓。");
    else if (has("cab")) notes.push(before(effect, "cab")
      ? name + " 在 CAB / IR 前。若後面的 IR 是線性的，效果訊號也會通過該濾波；不能單靠這個順序預測差異一定可聞。"
      : name + " 在 CAB / IR 後。空間處理接受經過喇叭濾波的訊號，可作為錄音後製的思考起點。");
  }
  if (has("gate")) notes.push("Gate 的判斷取決於它所在位置的訊號大小。試著換位置，並觀察弱音和延音是否更容易被切掉。");
  if (has("comp")) notes.push("Compressor 會影響動態。若它位於失真級前，改變的起音與輸出電平也可能影響後級的失真反應。");
  if (has("amp") && !has("cab")) notes.push("目前 AMP 後沒有啟用 CAB / IR。請依監聽路徑判斷是否還會經過實體吉他喇叭或其他箱體模擬。");
  if (has("amp") && has("cab") && before("amp", "cab") && !notes.length) {
    notes.push("AMP 先塑造增益與動態，CAB / IR 再套用箱體與收音的響應。可加入 EQ 並比較放在 AMP 前後的差別。");
  }
  if (!notes.length) notes.push("試著讓 AMP 和 Overdrive 或 EQ 同時啟用，再對調順序，觀察假設如何改變。");
  return notes;
}
