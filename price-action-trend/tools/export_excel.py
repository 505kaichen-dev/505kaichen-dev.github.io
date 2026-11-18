from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from pathlib import Path
import json

import openpyxl


DEFAULT_WORKBOOK = Path(
    r"C:/Users/505ka/OneDrive - Dimerco Data System Corporation/Price Action/"
    r"IBM_Power_Storage_Tape_調價趨勢指數_2026.xlsx"
)
OUTPUT = Path(__file__).resolve().parents[1] / "data.js"


def date_key(value):
    if isinstance(value, datetime):
        return value.strftime("%Y-%m-%d")
    text = str(value).strip().replace("/", "-")
    parts = text.split("-")
    return f"{int(parts[0]):04d}-{int(parts[1]):02d}-{int(parts[2]):02d}"


def clean(value):
    if isinstance(value, float):
        return round(value, 8)
    return value


def main():
    workbook_path = DEFAULT_WORKBOOK
    wb = openpyxl.load_workbook(workbook_path, data_only=True, read_only=True)

    chart_ws = wb["圖表資料"]
    chart_rows = list(chart_ws.iter_rows(values_only=True))
    headers = [str(x).strip() if x is not None else "" for x in chart_rows[0]]
    dates = [date_key(row[0]) for row in chart_rows[1:] if row[0]]
    series = {}
    for col in range(1, len(headers)):
        name = headers[col]
        if not name:
            continue
        series[name] = [clean(row[col]) for row in chart_rows[1:] if row[0]]

    summary_ws = wb["指數總覽"]
    event_content = {}
    for col in range(2, 9):
        raw_date = summary_ws.cell(1, col).value
        if raw_date:
            event_content[date_key(raw_date)] = summary_ws.cell(2, col).value or ""

    overall_ws = wb["Overall漲價明細"]
    overall_headers = [cell.value for cell in next(overall_ws.iter_rows())]
    event_sources = {
        "2026-01-01": {
            "announcementDate": "",
            "excel": workbook_path.name,
            "pdf": "",
            "note": "基準指數",
        }
    }
    for row in overall_ws.iter_rows(min_row=2, values_only=True):
        record = dict(zip(overall_headers, row))
        effective = record.get("生效日期")
        if not effective:
            continue
        event_sources[date_key(effective)] = {
            "announcementDate": date_key(record["公告日期"]) if record.get("公告日期") else "",
            "excel": record.get("Excel 來源") or "",
            "pdf": record.get("PDF 來源") or "",
            "note": record.get("來源範圍／備註") or "",
        }

    detail_ws = wb["調價明細"]
    detail_headers = [cell.value for cell in next(detail_ws.iter_rows())]
    details = defaultdict(dict)
    for row in detail_ws.iter_rows(min_row=2, values_only=True):
        record = dict(zip(detail_headers, row))
        model = record.get("型號")
        effective = record.get("生效日期")
        if not model or not effective:
            continue
        details[str(model)][date_key(effective)] = {
            "mtm": record.get("MTM") or "",
            "overall": clean(record.get("公告 Overall")),
            "fx": clean(record.get("TWD 匯率")),
            "memory": clean(record.get("記憶體")),
            "processor": clean(record.get("處理器")),
            "ssd": clean(record.get("SSD／Flash")),
            "system": clean(record.get("系統／機體")),
            "cache": clean(record.get("Cache")),
            "tape": clean(record.get("TAPE Library")),
            "other": clean(record.get("其他")),
            "average": clean(record.get("採用平均漲幅")),
            "combined": clean(record.get("當期綜合漲幅")),
            "before": clean(record.get("調整前指數")),
            "after": clean(record.get("調整後指數")),
            "summary": record.get("漲價內容／差異") or "",
            "status": record.get("資料狀態") or "",
            "excelSource": record.get("Excel 來源") or "",
            "pdfSource": record.get("PDF 來源") or "",
        }

    products = [
        {
            "id": "storage",
            "label": "Storage",
            "color": "#ff8a3d",
            "overall": "Storage Overall",
            "models": ["FS5600", "FS7600", "FS9600"],
        },
        {
            "id": "power",
            "label": "Power Server",
            "color": "#4f8cff",
            "overall": "Power Server Overall",
            "models": ["S1122", "S1124", "E1150", "E1180"],
        },
        {
            "id": "tape",
            "label": "TAPE Library",
            "color": "#b36bff",
            "overall": "TAPE Library Overall",
            "models": [],
        },
    ]

    payload = {
        "meta": {
            "title": "IBM Power、Storage、TAPE Library 調價趨勢",
            "baseline": "2026-01-01",
            "baselineIndex": 100,
            "source": workbook_path.name,
            "generatedAt": datetime.now().astimezone().isoformat(timespec="seconds"),
            "method": "同類別多筆先平均，再將 Overall 與適用類別平均；TWD 匯率獨立累乘；各節點按生效日累乘。",
        },
        "dates": dates,
        "eventContent": event_content,
        "eventSources": event_sources,
        "products": products,
        "series": series,
        "details": details,
    }

    OUTPUT.write_text(
        "window.PRICE_TREND_DATA = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
