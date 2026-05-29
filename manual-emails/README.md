# 手動 Email Fixtures

此資料夾用於放置手動複製的完整 HTML emails，供
`pnpm send:email:preview --source=file` 使用。

預期可選檔案：

```txt
manual-emails/
  full-flight-established.html
  full-flight-sales.html
  full-flight-insurance.html
```

這些檔案只作為 diagnostic fixtures 使用。它們不是由 `pnpm build:emails` 產生，也不屬於正式
dist output contract。
