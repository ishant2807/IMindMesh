# Simple Upload Test Script
# Tests backend upload endpoint and shows detailed errors

Write-Host "`n=== MindMesh Upload Test ===" -ForegroundColor Cyan
Write-Host "Testing: http://localhost:3001/api/upload`n" -ForegroundColor Gray

# Configuration
$uri = "http://localhost:3001/api/upload"
$filePath = ".\README.md"
$title = "Test Upload from PowerShell"
$extractText = "machine learning neural networks deep learning artificial intelligence data science natural language processing computer vision"

# Check if file exists
if (-not (Test-Path $filePath)) {
    Write-Host "ERROR: File not found: $filePath" -ForegroundColor Red
    Write-Host "Please make sure README.md exists in the current directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "File to upload: $filePath" -ForegroundColor Gray
Write-Host "File size: $((Get-Item $filePath).Length) bytes`n" -ForegroundColor Gray

# Prepare multipart form data manually
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

# Build form data
$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"title`"$LF",
    $title,
    "--$boundary",
    "Content-Disposition: form-data; name=`"extractText`"$LF",
    $extractText,
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"README.md`"",
    "Content-Type: text/markdown$LF",
    [System.IO.File]::ReadAllText($filePath),
    "--$boundary--$LF"
)

$body = $bodyLines -join $LF

# Make request
try {
    Write-Host "Sending request..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $body -ContentType "multipart/form-data; boundary=$boundary" -TimeoutSec 30
    
    Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
    Write-Host "`nResponse:" -ForegroundColor Cyan
    Write-Host ($response | ConvertTo-Json -Depth 10)
    
    if ($response.keywords) {
        Write-Host "`n📝 Extracted Keywords:" -ForegroundColor Cyan
        $response.keywords | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
    }
    
    if ($response.file.url) {
        Write-Host "`n🔗 File URL:" -ForegroundColor Cyan
        Write-Host "  $($response.file.url)" -ForegroundColor White
    }
    
    Write-Host "`n✅ Next Steps:" -ForegroundColor Green
    Write-Host "  1. Check Supabase Dashboard → Table Editor → materials" -ForegroundColor White
    Write-Host "  2. Check Supabase Dashboard → Storage → materials bucket" -ForegroundColor White
    Write-Host "  3. Open http://localhost:3000 → Data tab → Load 'materials'" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ ERROR!" -ForegroundColor Red
    Write-Host "`nError Message:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "`nDetailed Error:" -ForegroundColor Yellow
        try {
            $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host ($errorJson | ConvertTo-Json -Depth 5) -ForegroundColor Red
        } catch {
            Write-Host $_.ErrorDetails.Message -ForegroundColor Red
        }
    }
    
    Write-Host "`n🔧 Troubleshooting:" -ForegroundColor Cyan
    Write-Host "  1. Check backend is running: curl http://localhost:3001/api/health" -ForegroundColor White
    Write-Host "  2. Check service role key in .env" -ForegroundColor White
    Write-Host "  3. Check materials table exists in Supabase" -ForegroundColor White
    Write-Host "  4. Check materials bucket exists in Supabase Storage" -ForegroundColor White
    Write-Host "  5. See TROUBLESHOOTING.md for detailed help" -ForegroundColor White
    
    exit 1
}
