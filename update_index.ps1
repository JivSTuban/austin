$filePath = "d:\Work\AustinWebv2\austin\src\pages\Index.tsx"
$content = Get-Content $filePath -Raw

# Define the pattern to match the listing-card section
$pattern = '(?s)<div className="flex flex-wrap justify-center gap-8">.*?<div className="listing-card">.*?</div>\s*</div>'

# Replace with PropertySlider component
$replacement = '<PropertySlider />'

# Perform the replacement
$newContent = $content -replace $pattern, $replacement

# Write the updated content back to the file
Set-Content -Path $filePath -Value $newContent

Write-Host "Index.tsx updated successfully."
