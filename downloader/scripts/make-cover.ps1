param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.Drawing

$imageDir = Join-Path $ProjectRoot 'image'
$sourcePath = Join-Path $imageDir 'interface-amethyst.png'
$logoPath = Join-Path $imageDir 'brand-crystal.png'
$outputPath = Join-Path $imageDir 'cover.png'

$canvas = New-Object System.Drawing.Bitmap 1200, 630
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

try {
    $source = [System.Drawing.Image]::FromFile($sourcePath)
    $logo = [System.Drawing.Image]::FromFile($logoPath)
    try {
        $graphics.DrawImage($source, (New-Object System.Drawing.Rectangle 0, 0, 1200, 690), 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel)

        $overlay = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            (New-Object System.Drawing.Rectangle 0, 0, 1200, 630),
            [System.Drawing.Color]::FromArgb(235, 35, 26, 83),
            [System.Drawing.Color]::FromArgb(10, 83, 91, 209),
            0.0
        )
        $graphics.FillRectangle($overlay, 0, 0, 1200, 630)
        $overlay.Dispose()

        $glass = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(205, 255, 255, 255))
        $graphics.FillRectangle($glass, 72, 74, 604, 482)
        $glass.Dispose()

        $graphics.DrawImage($logo, 102, 100, 74, 74)

        $titleFont = New-Object System.Drawing.Font('Segoe UI', 48, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $subFont = New-Object System.Drawing.Font('Microsoft JhengHei UI', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $metaFont = New-Object System.Drawing.Font('Segoe UI', 17, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $ink = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(38, 27, 82))
        $muted = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(92, 78, 137))
        $accent = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(112, 79, 232))
        try {
            $graphics.DrawString('Downloader', $titleFont, $ink, 194, 103)
            $graphics.DrawString('貼上一個網址，收進下載佇列。', $subFont, $muted, 102, 202)
            $graphics.FillRectangle($accent, 102, 264, 464, 8)
            $graphics.DrawString('VIDEO  /  IMAGE  /  PORTABLE', $metaFont, $accent, 102, 300)
            $graphics.DrawString('從一次性工具，到有角色、有主題的桌面作品', $subFont, $ink, 102, 354)
            $graphics.DrawString('Development Story · 0.1.0-beta.7', $metaFont, $muted, 102, 476)
        }
        finally {
            $titleFont.Dispose(); $subFont.Dispose(); $metaFont.Dispose()
            $ink.Dispose(); $muted.Dispose(); $accent.Dispose()
        }
    }
    finally {
        $source.Dispose(); $logo.Dispose()
    }

    $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
}
finally {
    $graphics.Dispose()
    $canvas.Dispose()
}

Write-Output $outputPath
