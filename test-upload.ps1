# Test upload script for PowerShell
$uri = "http://localhost:3001/api/upload"
$filePath = ".\README.md"
$title = "Test Upload"
$extractText = "machine learning neural networks deep learning artificial intelligence data science"

# Create form data
$form = @{
    file = Get-Item -Path $filePath
    title = $title
    extractText = $extractText
}

# Make request
try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Form $form
    Write-Host "Success!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host $_.ErrorDetails.Message
}
