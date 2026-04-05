# Test Ollama HTTP API for a given model
$ErrorActionPreference = 'Stop'

$body = @'
{"model":"deepseek-coder:6.7b","prompt":"Hello from test","max_tokens":64}
'@

Write-Host "Sending request to http://127.0.0.1:11434/api/generate ..."

try {
    $resp = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/generate' -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 60
    Write-Host "Response received:" -ForegroundColor Green
    $resp | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Request failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        try { $_.Exception.Response.GetResponseStream() | %{[System.IO.StreamReader]::new($_).ReadToEnd()} | Write-Host } catch {}
    }
    exit 1
}
