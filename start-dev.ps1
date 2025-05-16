# Kill any running Node.js processes
try {
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
} catch {
    # It's fine if there are no processes to kill
}

Write-Host "Starting Next.js development server on port 3005..."
npx.cmd next dev -p 3005
