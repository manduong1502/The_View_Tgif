const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Use PowerShell via script file
const psScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('theview-deploy.zip')
Write-Host "Total entries: $($zip.Entries.Count)"
$nextEntries = $zip.Entries | Where-Object { $_.FullName -like '_next*' }
Write-Host "_next entries: $($nextEntries.Count)"
$nextEntries | Select-Object -First 10 | ForEach-Object { Write-Host $_.FullName }
$zip.Dispose()
`;

fs.writeFileSync('temp-inspect.ps1', psScript);
const output = execSync('powershell -ExecutionPolicy Bypass -File temp-inspect.ps1').toString();
console.log(output);
fs.unlinkSync('temp-inspect.ps1');
