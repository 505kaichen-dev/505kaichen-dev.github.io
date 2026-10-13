'use strict';
const uiDefaults={theme:'dark',language:'zh-Hant',strutColor:'#e6bb42',stock:{rim:'#aebbc5',letter:'#ffffff',painted:false},target:{rim:'#b89058',letter:'#ffffff',painted:false}};
let uiSettings=structuredClone(uiDefaults);
try{const saved=JSON.parse(localStorage.getItem('fitment-ui-v1')||'null');if(saved){if(/^#[0-9a-f]{6}$/i.test(saved.strutColor||''))uiSettings.strutColor=saved.strutColor;if(['dark','blue','orange'].includes(saved.theme))uiSettings.theme=saved.theme;if(['zh-Hant','zh-Hans','en'].includes(saved.language))uiSettings.language=saved.language;for(const g of ['stock','target'])for(const key of ['rim','letter','painted']){const value=saved[g]?.[key];if(key==='painted'?typeof value==='boolean':/^#[0-9a-f]{6}$/i.test(value||''))uiSettings[g][key]=value;}}}catch{}
const cnConverter=OpenCC.Converter({from:'t',to:'cn'});
const textSources=new WeakMap(),attributeSources=new WeakMap();
const english={
'輪轂原點 0 mm · 左車內 / 右車外':'Hub origin 0 mm · Left inboard / Right outboard',
'以目前原廠規格重新建立葉子板基準':'Reset fender reference to current original setup',
'目前左側規格與葉子板的位置':'Current original setup vs. fender',
'；葉子板位置已鎖定，以輪轂接觸面為零點：':'; Fixed fender coordinate relative to hub origin: ',
'。重新量測後可重建此基準。':'. Reset this reference after a new measurement.',
'筒身外側相對輪轂：':'Strut outer surface relative to hub: ',
'啟用後鎖定，輪胎規格變更不會移動葉子板。':'Locked when enabled; tire setup edits do not move the fender.',
'量測目前原廠規格下，胎壁最外側與葉子板外緣的水平距離。兩組圖共用相同葉子板位置；':'Measure the original outer sidewall-to-fender gap. Both views share the same fender position; ',
'以目前原廠規格重新建立基準':'Reset reference to current original setup',
'建立基準時的間隙（使用者量測值）':'Reference gap (user measurement)',
'目前左側規格到避震筒（估算值）':'Current original setup clearance (estimated)',
'固定避震器基準：ET ':'Fixed strut reference: ET ',
'，斷面寬 ':', section width ',
'啟用時鎖定量測基準；修改原廠 ET 或尺寸不會移動避震器。重新量測後，請按重新建立基準。':'The measurement reference locks when enabled. Editing the original ET or size does not move the strut. Reset the reference after taking a new measurement.',
'此欄比較胎壁與筒身，輪緣及彈簧座需另量測。':'This compares sidewall and strut body only. Wheel flanges and spring perches require separate measurements.',
'避震器內側間隙參考':'Strut clearance reference',
'輸入目前原廠輪胎內側最寬處到避震筒身外側的實測水平距離。兩組圖共用同一個避震器位置。':'Enter the measured horizontal gap from the original tire’s widest inner sidewall to the nearest strut body surface. Both views share the same strut position.',
'目前胎壁到避震筒間隙':'Current sidewall-to-strut gap',
'避震筒身 RGB':'Strut body RGB','避震筒身顏色':'Strut body color',
'依使用者實測距離推算的靜態水平間隙，假設筒身位置固定。避震器造型與尺寸為示意，未計彈簧座、轉向、外傾、懸吊壓縮或負載變形；有間隙不代表保證不干涉。':'Static horizontal clearance estimated from your measurement, assuming a fixed strut position. Strut shape and size are illustrative. Spring perches, steering, camber, suspension travel and load deflection are excluded. Positive clearance is not a fitment guarantee. Recheck measurements after changing the original setup.',
'原廠胎壁到避震筒（使用者量測值）':'Original sidewall-to-strut gap (measured)',
'改裝後胎壁到避震筒（估算值）':'New sidewall-to-strut gap (estimated)',
'此模型下胎壁與筒身齊平':'Sidewall touches strut in this model',
'預估剩餘間隙 ':'Estimated remaining clearance: ',
'此模型下重疊 ':'Overlap in this model: ',
'；依同一水平參考位置估算，不代表實際干涉判定。':'; Estimated at the same horizontal reference, not a determination of actual interference.',
'間隙請填 0～200 mm。避震器標示暫停顯示。':'Enter a gap of 0–200 mm. Strut annotations are paused.',
'避震筒':'Strut','間隙 ':'Gap ',
'胎體及盤面造型為示意；實際胎寬與胎肩依品牌、型號、量測輪圈及胎壓而異。J 值尺寸以胎唇座為準，不含實體輪緣厚度。':'Tire and wheel-face shapes are illustrative. Actual section width and shoulders vary by brand, model, measuring rim and pressure. Rim-width dimensions use bead seats and exclude physical flange thickness.',
'安裝面 → 實體內輪緣（估算）':'Mounting plane → physical inner flange (estimated)',
'安裝面 → 實體外輪緣（估算）':'Mounting plane → physical outer flange (estimated)',
'實體外輪緣相對原廠（估算）':'Physical outer flange vs. original (estimated)',
'實體內輪緣相對原廠（估算）':'Physical inner flange vs. original (estimated)',
'使用實際總寬；假設輪緣對稱':'Uses supplied overall width; assumes symmetric flanges',
'兩組均已提供實際總寬':'Overall width supplied for both setups',
'輪胎輪圈改裝計算器 · Fitment Lab':'Tire & Wheel Fitment Calculator · Fitment Lab',
'輪胎 / 輪圈 / 偏移量':'TIRES / WHEELS / OFFSET','主題':'Theme','語言':'Language','深色實驗室':'Dark lab','藍白性能':'Blue & white','黑橘競技':'Black & orange','重設範例 ↺':'Reset example ↺','改裝前，先看見差異':'See the fit before you swap',
'輸入兩組規格，即時比較尺寸、胎壁與輪圈位置。':'Enter two setups to compare dimensions, sidewalls and wheel position live.',
'即時尺寸視覺化':'Live dimension preview','規格輸入':'Setup inputs','原廠規格':'Original setup','目標規格':'Target setup','比較基準':'Reference','複製原廠 →':'Copy original →',
'輪圈 RGB':'Wheel RGB','胎壁刻字上色':'Paint sidewall lettering','刻字 RGB':'Lettering RGB','輪圈顏色':'Wheel color','刻字顏色':'Lettering color',
'進階輪胎資料':'Advanced tire data','選填 · 提升寬度估算':'Optional · Refine width estimates','使用進階資料':'Use advanced data',
'填入同一輪胎型號、尺寸的廠商資料；實測斷面寬與量測 J 值須一起填。':'Use manufacturer data for this exact tire model and size. Enter measured section width and measuring rim width together.',
'廠商實測斷面寬':'Published section width','量測輪圈寬度':'Measuring rim width','實際胎面寬（選填）':'Tread width (optional)','輪圈實際總寬（選填）':'Overall wheel width (optional)',
'葉子板位置參考':'Fender reference','量測目前原廠規格下，胎壁最外側與葉子板外緣的水平距離。兩組圖共用相同葉子板位置。':'Measure the horizontal gap between the original tire’s widest outer sidewall and the fender edge. Both views share this fender reference.',
'目前輪胎位置':'Current tire position','內縮於葉子板':'Inside the fender','與葉子板齊平':'Flush with the fender','突出葉子板':'Beyond the fender','距離':'Distance',
'以相同車高、定位與負載條件估算。此數字為胎壁的水平位置差，不能判斷轉向或懸吊壓縮時是否磨到葉子板。':'Estimated at the same ride height, alignment and load. This horizontal sidewall gap does not predict rubbing during steering or suspension travel.',
'兩組採用相同繪圖比例':'Both setups use the same scale','目標圖疊加原廠輪廓':'Overlay original outline on target','正視圖標示開關':'Front-section annotations','正視圖標示':'Front-section annotations','ET 整體位移':'ET centerline shift','胎唇座內外位置差':'Bead-seat inner / outer positions','動態尺寸比較':'Live dimension comparison',
'正視剖面示意':'Front section','側面圖':'Side view','這次改裝，改變了什麼？':'What changes with this setup?',
'用 GPS 校正時速表':'Calibrate with GPS','先填入原廠輪胎在同一次穩定行駛時的儀表與 GPS 速度。':'Enter speedometer and GPS readings measured together at a steady speed with the original tires.',
'目前時速表':'Current speedometer','目前 GPS 速度':'Current GPS speed','換裝後儀表顯示':'New setup speedometer','目前 GPS／儀表比例':'GPS / speedometer ratio','原廠校正速度':'Calibrated original speed','換裝後估計實際速度':'Estimated new actual speed',
'預填 100／95 為示範值，請換成你的實測值。換裝後速度＝換裝後儀表速度 × GPS／目前儀表速度 × 目標外徑／原廠外徑。單點校正為估算，非換裝後 GPS 即時測量。':'100 / 95 are example readings: replace them with your measurements. New actual speed = new speedometer reading × GPS / original speedometer × target diameter / original diameter. This single-point estimate is not a live GPS measurement.',
'看懂 J 值、ET 與圖面':'Understanding rim width, ET and diagrams',
'：輸入常稱「J 值」的英吋寬度，如 8J 的寬度為 203.2 mm；J 本身是輪緣形狀代號。圖中寬度以胎唇座間距表示，未計輪緣厚度。':': Enter rim width in inches; 8J is 203.2 mm. J identifies the flange profile. Diagram dimensions measure between bead seats and exclude flange thickness.',
'ET 偏移量':'ET offset',
'：橘色虛線為固定輪轂安裝面，彩色虛線為輪圈中心線。圖面左為車內、右為車外。正 ET 使中心線位於安裝面的車內側，ET 減少時輪圈向外移。':': The warm dashed line marks the fixed hub mounting plane; the setup-colored dashed line marks the wheel centerline. Left is inboard, right is outboard. Positive ET puts the centerline inboard of the mounting plane; reducing ET moves the wheel outward.',
'進階寬度模型':'Advanced width model',
'：估算斷面寬 = 廠商實測斷面寬 +（你的 J 值 − 量測 J 值）× 10.16 mm。每差 0.5 吋約修正 5.08 mm，為經驗近似；實際胎面寬使用提供值、不套用斷面寬修正。未提供胎面寬時，胎肩外形仍為示意。外徑、胎壁高度與速度仍依標稱尺寸計算。':': Estimated section width = published section width + (your rim width − measuring rim width) × 10.16 mm. A 0.5-inch rim-width difference changes section width by approximately 5.08 mm. Supplied tread width is used directly. Without tread data, shoulders remain illustrative. Diameter, sidewall height and speed still use nominal tire dimensions.',
'輪圈總寬':'Overall wheel width',
'：選填後可估算胎壁超出實際框邊的單側距離，假設輪緣左右對稱；內外緣位移仍以 J 值的胎唇座為基準。':': Optional overall width estimates sidewall overhang beyond the physical wheel edge, assuming symmetric flanges. Inner / outer wheel shifts still use bead-seat width.',
'寬度修正依據 ↗':'Width-estimation reference ↗','輪圈剖面造型':'Wheel section styling',
'：單側盤面輪圈剖面為外觀示意，不代表特定輪圈的工程剖面。J 值尺寸線對準胎唇座，選填總寬則用於輪緣外側。胎壁刻字會隨尺寸更新；關閉上色時呈現橡膠浮雕字。':': The one-sided wheel-face section is illustrative, not a specific wheel engineering section. Rim-width dimensions align with bead seats; supplied overall width defines the outer flanges. Sidewall lettering updates with tire size and appears embossed when painting is off.',
'胎壁外形':'Sidewall shape',
'：以標稱胎寬與輪圈寬度畫出幾何示意；輪圈比胎寬更寬時呈現繃胎方向，反之呈現向外鼓出的方向。這不是輪胎廠核准配圈範圍或實際斷面預測。':': Tire and rim widths form a geometric illustration. A wider rim suggests stretched sidewalls; a narrower rim suggests bulging. This is not an approved rim-width range or an exact physical section prediction.',
'計算方式':'Formulas',
'：胎壁高度 = 胎寬 × 扁平比 ÷ 100；外徑 = 輪圈直徑 × 25.4 + 胎壁高度 × 2。外移量 = 寬度差 ÷ 2 − ET 差；內側靠近量 = 寬度差 ÷ 2 + ET 差。':': Sidewall height = tire width × aspect ratio / 100. Diameter = rim diameter × 25.4 + sidewall height × 2. Outward wheel shift = width difference / 2 − ET difference. Inward wheel shift = width difference / 2 + ET difference.',
'以標稱尺寸估算，未計胎壓、負載、胎紋磨耗與輪胎型號差異。實際安裝仍需確認輪胎廠配圈範圍、輪拱、懸吊、煞車與負載規格。':'Nominal estimates exclude pressure, load, wear and tire-model variation. Actual installation requires checking manufacturer rim-width ranges, wheel arches, suspension, brakes and load ratings.',
'ET 定義參考 ↗':'ET definition reference ↗','數字先有概念，實車再確認。':'Understand the dimensions, then check the car.',
'外徑 / 輪圈直徑 / 單側胎壁高度':'Diameter / Rim diameter / Sidewall height',
'輪轂接觸面':'Hub mounting contact','輪轂':'Hub','胎壁距離':'Sidewall gap','車身／葉子板外緣':'Body / fender edge','安裝面':'Mounting plane','中心線':'Centerline','車內':'Inboard','車外':'Outboard','單側盤面剖面示意':'One-sided wheel face',
'輪胎外徑差':'Tire diameter change','單側胎壁高度差':'Sidewall height change','外側胎唇座位移':'Outer bead-seat shift','內側胎唇座位移':'Inner bead-seat shift','胎壁變薄':'Thinner sidewall','胎壁變厚':'Taller sidewall','胎壁高度相同':'Same sidewall height','半徑':'Radius',
'估算斷面寬':'Estimated section width','標稱斷面寬':'Nominal section width','估算斷面':'Est. section','標稱胎寬':'Nominal width','胎唇座寬':'Bead-seat width','繃胎方向示意':'Stretch direction (illustration)','胎壁外鼓方向示意':'Bulge direction (illustration)','標稱寬度相同':'Equal nominal widths',
'胎面寬未提供，胎肩外形為示意':'No tread data; shoulders are illustrative','胎壁相對實際框邊（每側）':'Sidewall overhang per side','假設輪緣對稱':'Assuming symmetric flanges','輪胎外側相對原廠':'Outer tire shift vs. original','輪胎內側相對原廠':'Inner tire shift vs. original','胎壁最寬處；未計負載變形':'Widest sidewall; load deflection excluded','以修正／標稱混合斷面寬估算':'Estimated using adjusted / nominal section widths','以標稱斷面寬估算':'Estimated from nominal section widths','僅 ET 造成整體位移':'Shift caused by ET alone','不含輪圈加寬；中心線移動量':'Centerline shift, excluding wheel-width changes','原廠中心線基準':'Original centerline reference','正 ET 為安裝面向車內的距離':'Positive ET: centerline inboard of mounting plane','內側胎唇座':'Inner bead seat','外側胎唇座':'Outer bead seat','有號距離：正值向車內、負值向車外':'Signed distance: + inboard, − outboard','有號距離：正值向車外、負值向車內':'Signed distance: + outboard, − inboard','新內側胎唇座相對原廠':'New inner bead seat vs. original','新外側胎唇座相對原廠':'New outer bead seat vs. original','含輪圈寬度與 ET 的共同影響':'Includes wheel width and ET',
'目前原廠輪胎與葉子板的位置':'Original tire vs. fender','改裝後，輪胎與葉子板的位置':'New tire position vs. fender','改裝後輪胎相對原廠的移動量':'Tire shift from original','輪胎外側與葉子板齊平':'Outer sidewall is flush with fender','輪胎仍在葉子板內側 ':'Tire remains inside fender by ','輪胎超出葉子板 ':'Tire extends beyond fender by ','輪胎位置與原廠相同':'Same tire position as original','比原廠向外移 ':'Outward shift from original: ','比原廠向內移 ':'Inward shift from original: ','已使用進階修正斷面寬':'Using adjusted section width','使用標稱斷面寬':'Using nominal section width','；葉子板位置依目前原廠規格與實測距離建立，修改原廠規格後請重新確認量測值。':'; Fender reference uses the original setup and measured gap. Recheck the measurement if you change the original setup.',
'位置不變':'No change','靠近懸吊 ':'Closer to suspension by ','增加內側空間 ':'More inboard clearance: ','向外突出 ':'Outward shift: ','向內收進 ':'Inward shift: ',
'標稱模式 · 未套用進階資料':'Nominal mode · Advanced data not applied','標稱模式 · 請修正進階資料':'Nominal mode · Check advanced data','修正模式 · ':'Adjusted mode · ','標稱模式 · ':'Nominal mode · ','已套用胎面資料':'Tread data applied','未提供斷面寬校正':'No section-width adjustment supplied',
'實測斷面寬與量測 J 值須一起填寫':'Enter measured section width and measuring rim width together','修正後斷面寬必須大於 0':'Adjusted section width must be greater than 0','胎面寬不可大於估算斷面寬':'Tread width must not exceed estimated section width','輪圈總寬不可小於 J 值換算的胎唇座寬':'Overall wheel width must not be smaller than bead-seat width','。目前改用標稱模式，進階資料未套用。':'. Using nominal mode; advanced data not applied.','超出有效範圍':' is outside the valid range','J 值相差超過 1.5 吋，經驗式外推幅度較大，請核對廠商配圈範圍。':'Rim widths differ by more than 1.5 inches. This is a large extrapolation; check the manufacturer’s approved range.',
'目前儀表及 GPS 請填大於 0、最高 300；換裝後儀表請填 0～300 km/h。':'Current speedometer and GPS must be greater than 0 and no more than 300. New speedometer must be 0–300 km/h.','距離請填 0～200 mm。葉子板標示暫停顯示。':'Enter a gap of 0–200 mm. Fender annotations are paused.','。圖面保留上一組有效規格。':'. Showing the last valid setup.',' 的整數':' (whole numbers)','請填 ':'Enter ',
'胎面寬':'Tread width','胎面 ':'Tread ','（提供值）':' (supplied)','外徑':'Diameter','胎壁':'Sidewall','輪圈直徑':'Rim diameter','輪圈寬度':'Rim width','胎寬':'Tire width','扁平比':'Aspect ratio','ET 偏移':'ET offset','原廠':'Original','目標':'Target','超出':'Beyond ','收進':'Inside ','吋':'in'
};
const englishKeys=Object.keys(english).sort((a,b)=>b.length-a.length);
function translateText(source){if(uiSettings.language==='zh-Hant')return source;if(uiSettings.language==='zh-Hans')return cnConverter(source).replaceAll('吋','英寸');let result=source;for(const key of englishKeys)result=result.split(key).join(english[key]);return result.replace(/^(Original|Target)(?=[A-Z])/g,'$1 ').replace(/([^.;；]+)Enter ([0-9.-]+)～([0-9.-]+)( \(whole numbers\))?/g,(_,label,min,max,whole)=>label.trim()+': enter '+min+'–'+max+(whole||''));}
function sourceAttribute(el,attribute){let values=attributeSources.get(el);if(!values){values={};attributeSources.set(el,values);}if(!(attribute in values))values[attribute]=el.getAttribute(attribute);return values[attribute];}
function translateUI(){document.documentElement.lang=uiSettings.language;const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(node.parentElement.closest('script,style,[translate="no"]'))continue;if(!textSources.has(node))textSources.set(node,node.nodeValue);node.nodeValue=translateText(textSources.get(node));}for(const el of document.querySelectorAll('[aria-label],[title]'))for(const attr of ['aria-label','title'])if(el.hasAttribute(attr))el.setAttribute(attr,translateText(sourceAttribute(el,attr)));document.title=translateText('輪胎輪圈改裝計算器 · Fitment Lab');}
function wheelLook(group){return uiSettings[group]||uiSettings.stock;}
function shade(hex,offset){return '#'+hex.slice(1).match(/../g).map(v=>Math.max(0,Math.min(255,parseInt(v,16)+offset)).toString(16).padStart(2,'0')).join('');}
function saveUI(){try{localStorage.setItem('fitment-ui-v1',JSON.stringify(uiSettings));}catch{}}
function applyAppearance(){document.getElementById('strut-color').value=uiSettings.strutColor;document.documentElement.dataset.theme=uiSettings.theme;document.getElementById('theme-select').value=uiSettings.theme;document.getElementById('language-select').value=uiSettings.language;for(const group of ['stock','target']){document.getElementById(group+'-rim-color').value=uiSettings[group].rim;document.getElementById(group+'-letter-color').value=uiSettings[group].letter;document.getElementById(group+'-letter-painted').checked=uiSettings[group].painted;document.getElementById(group+'-letter-color').disabled=!uiSettings[group].painted;}document.querySelector('meta[name="theme-color"]').content=uiSettings.theme==='blue'?'#f0f5fb':uiSettings.theme==='orange'?'#151515':'#101719';}
applyAppearance();
document.getElementById('strut-color').addEventListener('input',e=>{uiSettings.strutColor=e.target.value;saveUI();update();});
for(const group of ['stock','target']){for(const [suffix,key] of [['rim-color','rim'],['letter-color','letter']])document.getElementById(group+'-'+suffix).addEventListener('input',e=>{uiSettings[group][key]=e.target.value;saveUI();update();});document.getElementById(group+'-letter-painted').addEventListener('change',e=>{uiSettings[group].painted=e.target.checked;applyAppearance();saveUI();update();});}
document.getElementById('theme-select').addEventListener('change',e=>{uiSettings.theme=e.target.value;applyAppearance();saveUI();update();});document.getElementById('language-select').addEventListener('change',e=>{uiSettings.language=e.target.value;saveUI();update();});
