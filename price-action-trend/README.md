# Price Action Trend

這個 repository 是網站程式碼的唯一維護來源。最新版 Excel 是資料的唯一來源；建置程序會一次產生內網版、GitHub 加密版與單檔離線版。

```powershell
.\tools\build-and-publish.ps1
```

執行時輸入密碼即可更新 `protected-data.json`，密碼不會寫入 repository。完整欄位規則、多年歷史資料加入方式與發布檢查請見 [MAINTENANCE.md](MAINTENANCE.md)；歷次功能與修正記錄請見 [RELEASE_NOTES.md](RELEASE_NOTES.md)。

GitHub Pages 是公開靜態主機，加密資料會在正確輸入密碼後於瀏覽器端解密。需要可稽核的權限控管時，應改用具備伺服器端驗證的內網服務。
