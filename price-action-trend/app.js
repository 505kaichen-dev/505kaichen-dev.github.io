(function () {
  "use strict";

  const data = window.PRICE_TREND_DATA;
  if (!data) throw new Error("Price trend data is missing.");

  const state = Object.fromEntries(data.products.map(product => [
    product.id,
    { visible: true, series: [product.overall] },
  ]));
  let baselineIndex = 0;
  let showAllNodeLabels = false;

  const seriesColors = {
    "Storage 公告基準": "#c65d15",
    FS5600: "#f59e0b",
    FS7600: "#ea7c14",
    FS9600: "#9a4a12",
    "Power Server 公告基準": "#2563eb",
    S1112: "#7dd3fc",
    S1122: "#60a5fa",
    S1124: "#0ea5e9",
    E1150: "#1d4ed8",
    E1180: "#172e79",
    "TAPE Library 公告基準": "#7c3aed",
  };

  function displaySeriesName(seriesName) {
    const product = data.products.find(item => item.overall === seriesName);
    return product ? `${product.label} 公告基準` : seriesName;
  }

  function displayTerminology(value) {
    return String(value ?? "")
      .replace(/公告\s*Overall/gi, "公告下限")
      .replace(/\bOverall\b/gi, "公告基準");
  }

  const selectorGrid = document.getElementById("selectorGrid");
  const svg = document.getElementById("stepChart");
  const chartWrap = document.getElementById("chartWrap");
  const legend = document.getElementById("legend");
  const exportButton = document.getElementById("exportButton");
  const nodeLabelToggle = document.getElementById("nodeLabelToggle");
  const tooltip = document.getElementById("tooltip");
  const emptyState = document.getElementById("emptyState");
  const eventDate = document.getElementById("eventDate");
  const eventCopy = document.getElementById("eventCopy");
  const announcementGrid = document.getElementById("announcementGrid");
  const detailTableBody = document.getElementById("detailTableBody");
  const detailSummaryCount = document.getElementById("detailSummaryCount");
  const baselineSlider = document.getElementById("baselineSlider");
  const baselineTicks = document.getElementById("baselineTicks");
  const baselineValue = document.getElementById("baselineValue");
  const baselineRangeText = document.getElementById("baselineRangeText");
  const baselineHeaderDate = document.getElementById("baselineHeaderDate");

  document.getElementById("sourceLabel").textContent = `資料依據：${data.meta.source}`;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(key) {
    const [year, month, day] = key.split("-").map(Number);
    return `${year}/${month}/${day}`;
  }

  function addMonthsLabel(key, months) {
    const [year, month, day] = key.split("-").map(Number);
    const future = new Date(year, month - 1 + months, day);
    const prefix = future.getFullYear() !== year ? `${String(future.getFullYear()).slice(-2)}/` : "";
    return `${prefix}${future.getMonth() + 1}/${future.getDate()}`;
  }

  function compactDateLabel(key, index) {
    const [year, month, day] = key.split("-").map(Number);
    const previousYear = index > 0 ? Number(data.dates[index - 1].slice(0, 4)) : null;
    const prefix = index === 0 || previousYear !== year ? `${String(year).slice(-2)}/` : "";
    return `${prefix}${month}/${day}`;
  }

  function formatIndex(value) {
    return Number(value).toFixed(2);
  }

  function formatNodeIndex(value, index) {
    return `${formatIndex(value)} [${index + 1}]`;
  }

  function formatPercent(value) {
    if (value === null || value === undefined || value === "") return null;
    const numeric = Number(value);
    const sign = numeric > 0 ? "+" : "";
    const rounded = Math.round((numeric * 100 + 1e-9) * 100) / 100;
    return `${sign}${rounded.toFixed(2).replace(/\.00$/, "")}%`;
  }

  function localDateStamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function selectedSeries() {
    return data.products.flatMap(product => {
      if (!state[product.id].visible) return [];
      return state[product.id].series.map((seriesName, seriesIndex) => {
        const rawValues = data.series[seriesName];
        if (!Array.isArray(rawValues)) return null;
        const startIndex = rawValues.findIndex(value => value !== null && value !== undefined && Number.isFinite(Number(value)));
        if (startIndex < 0) return null;
        const normalizationIndex = Math.max(baselineIndex, startIndex);
        const baseValue = Number(rawValues[normalizationIndex]);
        return {
          ...product,
          seriesName,
          seriesIndex,
          color: seriesColors[seriesName] || product.color,
          rawValues,
          startIndex,
          normalizationIndex,
          values: rawValues.map(value => value === null || value === undefined ? null : Number(value) / baseValue * 100),
        };
      });
    }).filter(Boolean);
  }

  function createBaselineControl() {
    baselineSlider.max = String(data.dates.length - 1);
    baselineSlider.value = String(baselineIndex);
    baselineTicks.style.setProperty("--tick-count", data.dates.length);
    baselineTicks.innerHTML = data.dates.map((dateKey, index) =>
      `<span class="baseline-tick" data-index="${index}" style="--tick-position:${data.dates.length > 1 ? index / (data.dates.length - 1) * 100 : 0}%">${compactDateLabel(dateKey, index)}</span>`
    ).join("");

    baselineSlider.addEventListener("input", () => {
      baselineIndex = Number(baselineSlider.value);
      render();
    });
  }

  function renderBaselineControl() {
    const dateLabel = formatDate(data.dates[baselineIndex]);
    const progress = data.dates.length > 1 ? baselineIndex / (data.dates.length - 1) * 100 : 0;
    const thumbOffset = 10 - progress / 5;
    baselineSlider.style.setProperty("--range-progress", `calc(${progress}% + ${thumbOffset}px)`);
    baselineValue.textContent = `${dateLabel} = 100`;
    baselineRangeText.textContent = baselineIndex === 0 ? "完整歷史" : "較早資料淡化顯示";
    baselineHeaderDate.textContent = `${dateLabel} = 100`;
    [...baselineTicks.children].forEach((tick, index) => {
      tick.classList.toggle("is-past", index < baselineIndex);
      tick.classList.toggle("is-active", index === baselineIndex);
    });
  }

  function updatePickerSummary(card, productId) {
    const product = data.products.find(item => item.id === productId);
    const selected = state[productId].series;
    const summary = card.querySelector(".picker-value");
    if (!selected.length) summary.textContent = "未選擇型號";
    else if (selected.length === 1) summary.textContent = selected[0] === product.overall ? "公告基準" : selected[0];
    else summary.textContent = `已選 ${selected.length} 項`;
  }

  function createSelectors() {
    selectorGrid.innerHTML = "";
    for (const product of data.products) {
      const card = document.createElement("article");
      card.className = "selector-card";
      card.style.setProperty("--series-color", seriesColors[product.overall] || product.color);

      const choices = [product.overall, ...product.models].map(name => `
        <label class="picker-option">
          <input type="checkbox" data-action="series" data-product="${product.id}" value="${escapeHtml(name)}" ${name === product.overall ? "checked" : ""}>
          <span class="option-check" aria-hidden="true"></span>
          <span>${name === product.overall ? "公告基準" : escapeHtml(name)}</span>
          ${name === product.overall ? '<small>原廠公告方向值</small>' : ""}
        </label>`).join("");

      card.innerHTML = `
        <label class="toggle" aria-label="顯示 ${escapeHtml(product.label)}">
          <input type="checkbox" checked data-action="toggle" data-product="${product.id}">
          <span class="toggle-track"></span>
        </label>
        <div class="selector-body">
          <div class="selector-label-row">
            <span class="selector-label">${escapeHtml(product.label)}</span>
            <span class="multi-hint">可多選</span>
          </div>
          <details class="model-picker">
            <summary><span class="picker-value">公告基準</span><span class="picker-chevron" aria-hidden="true">⌄</span></summary>
            <div class="picker-menu" role="group" aria-label="選擇 ${escapeHtml(product.label)} 型號">${choices}</div>
          </details>
        </div>`;

      selectorGrid.appendChild(card);
    }

    selectorGrid.addEventListener("change", event => {
      const control = event.target;
      const productId = control.dataset.product;
      if (!productId) return;

      if (control.dataset.action === "toggle") {
        state[productId].visible = control.checked;
        control.closest(".selector-card").classList.toggle("is-off", !control.checked);
      } else if (control.dataset.action === "series") {
        const card = control.closest(".selector-card");
        state[productId].series = [...card.querySelectorAll('input[data-action="series"]:checked')].map(input => input.value);
        updatePickerSummary(card, productId);
      }
      render();
    });
  }

  function svgEl(name, attrs = {}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    return el;
  }

  function stepPath(values, x, y) {
    return stepPathRange(values, 0, values.length - 1, x, y);
  }

  function stepPathRange(values, start, end, x, y) {
    const available = [];
    for (let index = Math.max(0, start); index <= Math.min(end, values.length - 1); index++) {
      if (values[index] !== null && values[index] !== undefined && Number.isFinite(Number(values[index]))) available.push(index);
    }
    if (!available.length) return "";
    let path = `M ${x(available[0])} ${y(values[available[0]])}`;
    for (let offset = 1; offset < available.length; offset++) {
      const index = available[offset];
      path += ` H ${x(index)} V ${y(values[index])}`;
    }
    return path;
  }

  function renderLegend(items) {
    legend.innerHTML = items.map(item => {
      const latest = item.values[item.values.length - 1];
      return `<span class="legend-item" style="--legend-color:${item.color}">
        <span class="legend-line"></span>
        <span>${escapeHtml(displaySeriesName(item.seriesName))}</span>
        <span class="legend-value">${formatIndex(latest)}</span>
      </span>`;
    }).join("");
  }

  function detailMetrics(detail) {
    if (!detail) return [];
    return [
      ["公告下限", detail.overall],
      ["TWD", detail.fx],
      ["記憶體", detail.memory],
      ["處理器", detail.processor],
      ["SSD／Flash", detail.ssd],
      ["系統／機體", detail.system],
      ["Cache", detail.cache],
      ["TAPE Library", detail.tape],
      ["其他", detail.other],
    ].filter(([, value]) => value !== null && value !== undefined)
      .map(([label, value]) => `${label} ${formatPercent(value)}`);
  }

  function detailText(item, dateKey, dateIndex, indexValue) {
    const detail = data.details[item.seriesName]?.[dateKey];
    if (!detail) return data.eventContent[dateKey] || "此節點無調價明細。";
    const causes = detailMetrics(detail);
    const isStart = dateIndex === item.startIndex;
    const change = isStart ? (item.startIndex > 0 ? "型號 GA 起點" : "歷史起點") : causes.length ? causes.join("、") : "本系列此日無調整";
    const rate = isStart ? "" : `｜當期 ${formatPercent(detail.combined) || "0%"}`;
    return `${change}${rate}｜指數 ${formatIndex(indexValue)}`;
  }

  function showPoint(item, index, event) {
    const dateKey = data.dates[index];
    const value = item.values[index];
    eventDate.textContent = `${formatDate(dateKey)} · ${displaySeriesName(item.seriesName)}`;
    eventCopy.textContent = detailText(item, dateKey, index, value);
    tooltip.innerHTML = `<strong>${escapeHtml(displaySeriesName(item.seriesName))} · ${formatNodeIndex(value, index)}</strong><span>${formatDate(dateKey)}</span>`;
    tooltip.hidden = false;

    const rect = chartWrap.getBoundingClientRect();
    const maxLeft = Math.max(8, rect.width - 308);
    const left = Math.min(Math.max(event.clientX - rect.left + 12, 8), maxLeft);
    const top = Math.max(event.clientY - rect.top - 60, 8);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function renderAnnouncements(items) {
    announcementGrid.innerHTML = data.dates.map((dateKey, index) => {
      const content = displayTerminology(data.eventContent[dateKey] || "無調價說明").split("\n");
      const source = data.eventSources?.[dateKey];
      const sourceFiles = index === 0 ? [] : [source?.excel, source?.pdf].filter(Boolean).flatMap(value => value.split("；").map(part => part.trim()).filter(Boolean));
      const availableItems = items.filter(item => item.values[index] !== null && item.values[index] !== undefined);
      const startingItems = availableItems.filter(item => item.startIndex === index && index > 0);
      const unavailable = items.length > 0 && availableItems.length === 0;
      const changed = availableItems.some(item => item.startIndex === index || (index > item.startIndex && Math.abs(item.values[index] - item.values[index - 1]) > 0.00001));
      const unchanged = index > 0 && availableItems.length > 0 && !changed;
      const badge = startingItems.length
        ? `${startingItems.map(item => item.seriesName).join("、")} GA 起點`
        : unavailable ? "所選曲線尚未 GA"
        : index === 0 ? "比較起點"
        : unchanged ? "所選曲線無變動" : "";
      return `<article class="announcement-item${unchanged || unavailable ? " is-quiet" : ""}">
        <div class="announcement-heading"><span class="announcement-index">${String(index + 1).padStart(2, "0")}</span><time datetime="${dateKey}">${formatDate(dateKey)}</time>${badge ? `<span class="announcement-badge">${badge}</span>` : ""}</div>
        ${content.slice(0, 2).map(line => `<p class="announcement-main">${escapeHtml(line)}</p>`).join("")}
        ${content.length > 2 || sourceFiles.length ? `<details class="announcement-more"><summary>適用範圍與來源</summary>
          ${content.slice(2).map(line => `<p>${escapeHtml(line)}</p>`).join("")}
          ${sourceFiles.length ? `<div class="source-ref"><span>原始公告</span>${sourceFiles.map(file => `<small>${escapeHtml(file)}</small>`).join("")}</div>` : ""}
        </details>` : ""}
      </article>`;
    }).join("");
  }

  function rateCell(detail, before, after, isBaseline, isFirst) {
    const inferred = before ? after / before - 1 : 0;
    const adopted = detail?.combined ?? inferred;
    const selectedRate = detail?.average ?? 0;
    const partRates = detail
      ? [detail.memory, detail.processor, detail.ssd, detail.system, detail.cache, detail.tape, detail.other]
        .filter(value => value !== null && value !== undefined)
      : [];
    const partAverage = partRates.length ? partRates.reduce((sum, value) => sum + Number(value), 0) / partRates.length : null;
    let selectedBasis = "產品漲幅";
    if (partAverage !== null && (detail?.overall === null || detail?.overall === undefined || partAverage > detail.overall + 0.00001)) {
      selectedBasis = "零件平均";
    } else if (detail?.overall !== null && detail?.overall !== undefined) {
      selectedBasis = "公告基準";
    }
    const lines = [];
    lines.push(`採用${selectedBasis} ${formatPercent(selectedRate) || "0%"}`);
    if (detail?.fx !== null && detail?.fx !== undefined) lines.push(`匯率 ${formatPercent(detail.fx) || "0%"}`);
    if (isBaseline) lines.push("此日設為 100");
    const mainRate = isFirst ? "—" : formatPercent(adopted) || "0%";
    return `<span class="rate-main">${mainRate}</span><small>${lines.join(" · ")}</small>`;
  }

  function renderDetailTable(items) {
    const rowCount = items.reduce((sum, item) => sum + item.values.filter(value => value !== null && value !== undefined).length, 0);
    detailSummaryCount.textContent = items.length
      ? `${items.length} 個系列 · ${rowCount} 筆節點`
      : "尚未選擇型號";
    if (!items.length) {
      detailTableBody.innerHTML = '<tr><td colspan="5" class="no-data">請先選擇至少一個型號。</td></tr>';
      return;
    }

    const rows = [];
    data.dates.forEach((dateKey, dateIndex) => {
      items.forEach(item => {
        if (item.values[dateIndex] === null || item.values[dateIndex] === undefined) return;
        const detail = data.details[item.seriesName]?.[dateKey];
        const before = dateIndex === item.startIndex ? item.values[dateIndex] : item.values[dateIndex - 1];
        const after = item.values[dateIndex];
        const metrics = detailMetrics(detail);
        const isFirst = dateIndex === item.startIndex;
        const reason = isFirst ? (item.startIndex > 0 ? "型號 GA 起點" : "歷史起點") : metrics.length ? metrics.join("、") : "本系列此日無調整";
        const explanation = displayTerminology(detail?.summary || "");
        const files = [detail?.excelSource, detail?.pdfSource].filter(Boolean).flatMap(value => value.split("；").map(part => part.trim()).filter(Boolean));
        const evidence = dateIndex > 0 && (explanation || files.length) ? `<details class="row-evidence"><summary>補充與來源</summary>${explanation ? `<p>${escapeHtml(explanation)}</p>` : ""}${files.map(file => `<small>${escapeHtml(file)}</small>`).join("")}</details>` : "";
        rows.push(`<tr class="${dateIndex < baselineIndex ? "is-prior" : ""}">
          <td><time datetime="${dateKey}">${formatDate(dateKey)}</time></td>
          <td><span class="series-name"><i style="--row-color:${item.color}"></i>${escapeHtml(displaySeriesName(item.seriesName))}</span>${detail?.mtm && !displaySeriesName(item.seriesName).includes(displayTerminology(detail.mtm)) ? `<small>${escapeHtml(displayTerminology(detail.mtm))}</small>` : ""}</td>
          <td><strong class="summary-line">${escapeHtml(reason)}</strong>${evidence}</td>
          <td>${rateCell(detail, before, after, dateIndex === item.normalizationIndex, isFirst)}</td>
          <td><strong class="index-value">${formatIndex(after)}</strong></td>
        </tr>`);
      });
    });
    detailTableBody.innerHTML = rows.join("");
  }

  function appendSvgText(parent, text, attrs) {
    const el = svgEl("text", attrs);
    el.textContent = text;
    parent.appendChild(el);
    return el;
  }

  function exportPng() {
    const items = selectedSeries();
    if (!items.length) return;

    const viewBox = svg.viewBox.baseVal;
    const width = viewBox.width || 1440;
    const chartHeight = viewBox.height || 520;
    const columns = Math.min(3, items.length);
    const legendRows = Math.ceil(items.length / columns);
    const headerHeight = 105 + legendRows * 34;
    const footerHeight = 48;
    const height = headerHeight + chartHeight + footerHeight;
    const exportSvg = svgEl("svg", { xmlns: "http://www.w3.org/2000/svg", width, height, viewBox: `0 0 ${width} ${height}` });

    exportSvg.appendChild(svgEl("rect", { width, height, fill: "#ffffff" }));
    const style = svgEl("style");
    style.textContent = `
      text { font-family: "Segoe UI", "Microsoft JhengHei", Arial, sans-serif; }
      .period-band { fill: #f6f8fc; }
      .future-band { fill: #f5f0e7; }
      .grid-line { stroke: #dce3ed; stroke-width: 1; stroke-dasharray: 3 5; }
      .axis-line { stroke: #8b99ad; stroke-width: 1; }
      .axis-label, .date-label { fill: #64748b; font: 12px Consolas, monospace; }
      .series-path { fill: none; stroke-width: 3.5; stroke-linejoin: round; stroke-linecap: round; }
      .past-series { opacity: .22; }
      .forecast-path { fill: none; stroke-width: 3; stroke-dasharray: 10 8; stroke-linecap: round; opacity: .8; }
      .forecast-point { fill: #fff; stroke-width: 2.5; }
      .future-zone-label { fill: #9a6b35; font: 700 11px "Segoe UI", sans-serif; letter-spacing: .08em; }
      .baseline-guide { stroke: #176b87; stroke-width: 1.5; stroke-dasharray: 5 4; }
      .baseline-tag { fill: #176b87; font: 800 11px "Segoe UI", sans-serif; paint-order: stroke; stroke: #fff; stroke-width: 4px; }
      .series-hit { display: none; }
      .series-point { stroke: #ffffff; stroke-width: 3; }
      .prior-point, .prior-label { opacity: .28; }
      .node-label { font: 700 11px Consolas, monospace; paint-order: stroke; stroke: #fff; stroke-width: 4px; stroke-linejoin: round; }
    `;
    exportSvg.appendChild(style);

    appendSvgText(exportSvg, "IBM 調價趨勢", { x: 62, y: 43, fill: "#172554", "font-size": 28, "font-weight": 800 });
    appendSvgText(exportSvg, `累積價格指數 · 基準 ${formatDate(data.dates[baselineIndex])} = 100`, { x: 62, y: 71, fill: "#64748b", "font-size": 14 });
    const colWidth = (width - 124) / columns;
    items.forEach((item, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = 62 + col * colWidth;
      const y = 105 + row * 34;
      const latest = item.values.at(-1);
      exportSvg.appendChild(svgEl("line", { x1: x, y1: y, x2: x + 24, y2: y, stroke: item.color, "stroke-width": 4, "stroke-linecap": "round" }));
      appendSvgText(exportSvg, `${displaySeriesName(item.seriesName)}  ${formatIndex(latest)}`, { x: x + 34, y: y + 5, fill: "#27364f", "font-size": 13, "font-weight": 700 });
    });

    const chartGroup = svgEl("g", { transform: `translate(0 ${headerHeight})` });
    for (const child of svg.children) {
      const clone = child.cloneNode(true);
      clone.removeAttribute?.("tabindex");
      chartGroup.appendChild(clone);
    }
    exportSvg.appendChild(chartGroup);
    appendSvgText(exportSvg, `資料來源：${data.meta.source}`, { x: 62, y: height - 18, fill: "#64748b", "font-size": 11 });
    appendSvgText(exportSvg, "趨勢估算，非配置報價", { x: width - 62, y: height - 18, fill: "#64748b", "font-size": 11, "text-anchor": "end" });

    const serialized = new XMLSerializer().serializeToString(exportSvg);
    const blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    exportButton.disabled = true;
    exportButton.textContent = "產生圖片中…";
    image.onload = () => {
      const scale = Math.max(2, 2400 / width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const names = items.map(item => displaySeriesName(item.seriesName).replace(/[^a-zA-Z0-9_-]+/g, "-")).join("_");
      const link = document.createElement("a");
      const baseDate = data.dates[baselineIndex].replaceAll("-", "");
      link.download = `IBM-Price-Trend_${names}_BASE-${baseDate}_${localDateStamp()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      exportButton.disabled = false;
      exportButton.innerHTML = '<span aria-hidden="true">↓</span>匯出 PNG';
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      exportButton.disabled = false;
      exportButton.innerHTML = '<span aria-hidden="true">↓</span>匯出 PNG';
      window.alert("圖片產生失敗，請重新整理後再試一次。");
    };
    image.src = url;
  }

  function renderChart(items) {
    renderLegend(items);
    svg.innerHTML = "";
    tooltip.hidden = true;
    emptyState.hidden = items.length > 0;
    exportButton.disabled = items.length === 0;
    if (!items.length) return;

    const width = Math.max(chartWrap.clientWidth, 720);
    const height = svg.clientHeight || 520;
    const margin = { top: 42, right: 28, bottom: 58, left: 64 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const allValues = items.flatMap(item => item.values).filter(value => value !== null && value !== undefined && Number.isFinite(Number(value)));
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const lower = Math.max(0, Math.floor((minValue - 15) / 25) * 25);
    const upper = Math.ceil((maxValue + 22) / 25) * 25;
    const futureIndex = data.dates.length;
    const lastActualIndex = data.dates.length - 1;
    const x = index => margin.left + plotWidth * index / futureIndex;
    const y = value => margin.top + plotHeight - (value - lower) / (upper - lower) * plotHeight;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    for (let index = 0; index < data.dates.length - 1; index += 2) {
      svg.appendChild(svgEl("rect", { x: x(index), y: margin.top, width: x(index + 1) - x(index), height: plotHeight, class: "period-band" }));
    }
    svg.appendChild(svgEl("rect", {
      x: x(lastActualIndex), y: margin.top, width: x(futureIndex) - x(lastActualIndex), height: plotHeight, class: "future-band",
    }));
    for (let tick = lower; tick <= upper; tick += 25) {
      const yy = y(tick);
      svg.appendChild(svgEl("line", { x1: margin.left, y1: yy, x2: width - margin.right, y2: yy, class: "grid-line" }));
      appendSvgText(svg, tick, { x: margin.left - 12, y: yy + 4, "text-anchor": "end", class: "axis-label" });
    }
    svg.appendChild(svgEl("line", { x1: margin.left, y1: margin.top, x2: margin.left, y2: height - margin.bottom, class: "axis-line" }));
    svg.appendChild(svgEl("line", { x1: margin.left, y1: height - margin.bottom, x2: width - margin.right, y2: height - margin.bottom, class: "axis-line" }));

    data.dates.forEach((dateKey, index) => {
      const xx = x(index);
      svg.appendChild(svgEl("line", { x1: xx, y1: margin.top, x2: xx, y2: height - margin.bottom, class: "grid-line vertical-grid" }));
      appendSvgText(svg, compactDateLabel(dateKey, index), { x: xx, y: height - 24, "text-anchor": "middle", class: "date-label" });
    });
    svg.appendChild(svgEl("line", { x1: x(futureIndex), y1: margin.top, x2: x(futureIndex), y2: height - margin.bottom, class: "grid-line vertical-grid" }));
    appendSvgText(svg, addMonthsLabel(data.dates.at(-1), 2), { x: x(futureIndex), y: height - 24, "text-anchor": "middle", class: "date-label" });
    appendSvgText(svg, "數值延伸", {
      x: (x(lastActualIndex) + x(futureIndex)) / 2, y: margin.top + 19, "text-anchor": "middle", class: "future-zone-label",
    });
    svg.appendChild(svgEl("line", {
      x1: x(baselineIndex), y1: margin.top, x2: x(baselineIndex), y2: height - margin.bottom, class: "baseline-guide",
    }));
    appendSvgText(svg, `基準 ${formatDate(data.dates[baselineIndex])}`, {
      x: x(baselineIndex) + (baselineIndex === lastActualIndex ? -7 : 7),
      y: margin.top + 19,
      "text-anchor": baselineIndex === lastActualIndex ? "end" : "start",
      class: "baseline-tag",
    });

    const labelSlots = new Map();
    items.forEach(item => {
      const fullPath = stepPath(item.values, x, y);
      if (baselineIndex > 0) {
        const pastPath = stepPathRange(item.values, 0, baselineIndex, x, y);
        if (pastPath) svg.appendChild(svgEl("path", { d: pastPath, class: "series-path past-series", stroke: item.color }));
      }
      const activePath = stepPathRange(item.values, Math.max(baselineIndex, item.startIndex), lastActualIndex, x, y);
      if (activePath) svg.appendChild(svgEl("path", { d: activePath, class: "series-path", stroke: item.color }));
      if (fullPath) svg.appendChild(svgEl("path", { d: fullPath, class: "series-hit" }));
      const lastValue = item.values.at(-1);
      svg.appendChild(svgEl("path", {
        d: `M ${x(lastActualIndex)} ${y(lastValue)} H ${x(futureIndex)}`, class: "forecast-path", stroke: item.color,
      }));
      svg.appendChild(svgEl("circle", {
        cx: x(futureIndex), cy: y(lastValue), r: 4, class: "forecast-point", stroke: item.color, "aria-hidden": "true",
      }));
      item.values.forEach((value, index) => {
        if (value === null || value === undefined) return;
        const point = svgEl("circle", {
          cx: x(index), cy: y(value), r: 5, fill: item.color, class: `series-point${index < baselineIndex ? " prior-point" : ""}`, tabindex: 0,
          "aria-label": `${displaySeriesName(item.seriesName)} ${formatDate(data.dates[index])} 節點 ${index + 1} 指數 ${formatIndex(value)}`,
        });
        point.addEventListener("pointerenter", event => showPoint(item, index, event));
        point.addEventListener("pointermove", event => showPoint(item, index, event));
        point.addEventListener("pointerleave", () => { tooltip.hidden = true; });
        point.addEventListener("click", event => showPoint(item, index, event));
        point.addEventListener("focus", event => {
          const rect = point.getBoundingClientRect();
          showPoint(item, index, { clientX: rect.left + rect.width / 2, clientY: rect.top });
        });
        svg.appendChild(point);

        if (showAllNodeLabels || index === lastActualIndex) {
          const key = `${index}-${Math.round(value / 4)}`;
          const slot = labelSlots.get(key) || 0;
          labelSlots.set(key, slot + 1);
          appendSvgText(svg, formatNodeIndex(value, index), {
            x: x(index) + 8,
            y: y(value) - 10 - slot * 15,
            fill: item.color,
            class: `node-label${index < baselineIndex ? " prior-label" : ""}`,
          });
        }
      });
    });
  }

  function render() {
    const items = selectedSeries();
    renderBaselineControl();
    renderChart(items);
    renderAnnouncements(items);
    renderDetailTable(items);
  }

  createSelectors();
  createBaselineControl();
  exportButton.addEventListener("click", exportPng);
  nodeLabelToggle.addEventListener("change", () => {
    showAllNodeLabels = nodeLabelToggle.checked;
    renderChart(selectedSeries());
  });
  render();
  window.addEventListener("resize", render);
})();
