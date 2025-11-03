# Firebase Storage CORS Fix Script for Windows PowerShell

Write-Host "Fixing Firebase Storage CORS configuration..." -ForegroundColor Green

# Check if gsutil is installed
$gsutilPath = Get-Command gsutil -ErrorAction SilentlyContinue

if (-not $gsutilPath) {
    Write-Host "gsutil is not installed. Installing Google Cloud SDK..." -ForegroundColor Yellow
    
    # Download and install Google Cloud SDK
    $downloadUrl = "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe"
    $installerPath = "$env:TEMP\GoogleCloudSDKInstaller.exe"
    
    Write-Host "Downloading Google Cloud SDK installer..." -ForegroundColor Blue
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath
    
    Write-Host "Running installer... Please complete the installation and restart PowerShell." -ForegroundColor Yellow
    Start-Process -FilePath $installerPath -Wait
    
    Write-Host "Please restart PowerShell and run this script again after installing Google Cloud SDK." -ForegroundColor Red
    exit 1
}

# Set the storage bucket name
$bucketName = "trade-pulse-b9fc4.firebasestorage.app"

Write-Host "Setting CORS configuration for bucket: $bucketName" -ForegroundColor Blue

# Apply CORS configuration
$corsResult = gsutil cors set cors.json gs://$bucketName 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "CORS configuration applied successfully!" -ForegroundColor Green
    
    # Verify CORS configuration
    Write-Host "Verifying CORS configuration..." -ForegroundColor Blue
    gsutil cors get gs://$bucketName
} else {
    Write-Host "Error applying CORS configuration:" -ForegroundColor Red
    Write-Host $corsResult -ForegroundColor Red
    
    Write-Host "`nTroubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Make sure you're authenticated with Google Cloud: gcloud auth login" -ForegroundColor White
    Write-Host "2. Set the correct project: gcloud config set project trade-pulse-b9fc4" -ForegroundColor White
    Write-Host "3. Make sure the bucket exists and you have permissions" -ForegroundColor White
}

Write-Host "`nDone!" -ForegroundColor Green
