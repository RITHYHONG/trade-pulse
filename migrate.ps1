$root = "C:\Users\Tk custom\trade-pulse"
$web  = "$root\apps\web"

# Ensure target exists
New-Item -ItemType Directory -Force $web | Out-Null

# --- Directories to move ---
$dirs = @("src","public","content","config","prisma","scripts","functions","tests","docs","AGENTS")
foreach ($d in $dirs) {
    $src = "$root\$d"
    if (Test-Path $src) {
        Move-Item $src "$web\$d" -Force
        Write-Host "Moved dir  -> $d"
    } else {
        Write-Host "Skip (missing): $d"
    }
}

# --- Files to move ---
$files = @(
    "next.config.ts",
    "tailwind.config.js",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "next-env.d.ts",
    "components.json",
    "firebase.json",
    "firestore.rules",
    "firestore.indexes.json",
    "storage.rules",
    "cors.json",
    "apphosting.yaml",
    "vercel.json",
    "Dockerfile",
    "tsconfig.json",
    "test-volatility.ts",
    "build_log.txt",
    "build_output.txt"
)
foreach ($f in $files) {
    $src = "$root\$f"
    if (Test-Path $src) {
        Move-Item $src "$web\$f" -Force
        Write-Host "Moved file -> $f"
    } else {
        Write-Host "Skip (missing): $f"
    }
}

# Keep package.json at root (we'll replace it) -- don't move it
Write-Host "Migration file moves done."
