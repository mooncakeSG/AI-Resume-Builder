# PowerShell script to download screenshots

# Create screenshots directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "docs/screenshots"

# Image URLs and their corresponding filenames
$images = @{
    "https://i.ibb.co/tptn1NTP/20250603-airesumebuilder-netlify-app-galaxys8s9-1.png" = "home-profiles.png"
    "https://i.ibb.co/RkWPdJdm/20250603-airesumebuilder-netlify-app-galaxys8s9-2.png" = "personal-details.png"
    "https://i.ibb.co/7NTJGQfL/20250603-airesumebuilder-netlify-app-galaxys8s9-3.png" = "professional-links.png"
    "https://i.ibb.co/YTB927Lh/20250603-airesumebuilder-netlify-app-galaxys8s9-4.png" = "experience.png"
    "https://i.ibb.co/6RYYgwCN/20250603-airesumebuilder-netlify-app-galaxys8s9-5.png" = "education.png"
    "https://i.ibb.co/S7tXvwwj/20250603-airesumebuilder-netlify-app-galaxys8s9-6.png" = "skills.png"
    "https://i.ibb.co/WW1MpJ57/20250603-airesumebuilder-netlify-app-galaxys8s9-7.png" = "references.png"
    "https://i.ibb.co/JF2P371R/20250603-airesumebuilder-netlify-app-galaxys8s9-8.png" = "ai-suggestions.png"
    "https://i.ibb.co/TMvsJvTF/20250603-airesumebuilder-netlify-app-galaxys8s9-9.png" = "ats-check.png"
    "https://i.ibb.co/0pHrmkvQ/20250603-airesumebuilder-netlify-app-galaxys8s9.png" = "cover-letter.png"
}

# Download each image
foreach ($image in $images.GetEnumerator()) {
    $url = $image.Key
    $filename = "docs/screenshots/" + $image.Value
    Write-Host "Downloading $($image.Value)..."
    Invoke-WebRequest -Uri $url -OutFile $filename
}

Write-Host "All screenshots downloaded successfully!" 