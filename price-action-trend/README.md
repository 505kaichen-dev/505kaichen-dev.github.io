# Price Action Trend

This GitHub Pages copy decrypts its chart data in the browser after the visitor enters the access password. The password is not stored in the repository.

To refresh the protected data locally, first generate `data.js` from the master workbook outside the public repository, then run:

```powershell
node tools/protect-data.mjs data.js protected-data.json
```

Enter the password when prompted, verify the site, and remove the plaintext `data.js` before committing. `data.js`, PDFs, spreadsheets, and local work logs are ignored by Git.

This is client-side encryption on a public static host. Use a private host with server-side authentication when access control must be enforceable or auditable.
