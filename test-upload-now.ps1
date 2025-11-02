# Quick Upload Test
Write-Host "Testing upload..." -ForegroundColor Cyan

$uri = "http://localhost:3001/api/upload"
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$fileContent = Get-Content ".\README.md" -Raw
$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"title`"$LF",
    "Test Upload",
    "--$boundary",
    "Content-Disposition: form-data; name=`"extractText`"$LF",
    "machine learning neural networks deep learning",
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"README.md`"",
    "Content-Type: text/markdown$LF",
    $fileContent,
    "--$boundary--$LF"
)

$body = $bodyLines -join $LF

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $body -ContentType "multipart/form-data; boundary=$boundary"
    Write-Host "SUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    }
}
