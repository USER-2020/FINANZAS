<?php

declare(strict_types=1);

if (! extension_loaded('gd')) {
    fwrite(STDERR, "La extensión GD de PHP es necesaria.\n");
    exit(1);
}

$root = dirname(__DIR__);
$directory = $root.'/public/pwa';
if (! is_dir($directory)) mkdir($directory, 0755, true);

function roundedRectangle(GdImage $image, int $x1, int $y1, int $x2, int $y2, int $radius, int $color): void
{
    imagefilledrectangle($image, $x1 + $radius, $y1, $x2 - $radius, $y2, $color);
    imagefilledrectangle($image, $x1, $y1 + $radius, $x2, $y2 - $radius, $color);
    imagefilledellipse($image, $x1 + $radius, $y1 + $radius, $radius * 2, $radius * 2, $color);
    imagefilledellipse($image, $x2 - $radius, $y1 + $radius, $radius * 2, $radius * 2, $color);
    imagefilledellipse($image, $x1 + $radius, $y2 - $radius, $radius * 2, $radius * 2, $color);
    imagefilledellipse($image, $x2 - $radius, $y2 - $radius, $radius * 2, $radius * 2, $color);
}

function createIcon(string $path, int $size, bool $maskable = false): void
{
    $image = imagecreatetruecolor($size, $size);
    imagealphablending($image, true);
    imagesavealpha($image, true);

    $navy = imagecolorallocate($image, 6, 17, 31);
    $panel = imagecolorallocate($image, 11, 36, 51);
    $cyan = imagecolorallocate($image, 37, 211, 238);
    $mint = imagecolorallocate($image, 25, 207, 174);
    $white = imagecolorallocate($image, 185, 255, 242);
    $glow = imagecolorallocatealpha($image, 25, 207, 174, 105);

    imagefill($image, 0, 0, $navy);
    $pad = $maskable ? (int) ($size * .1) : (int) ($size * .047);
    $radius = (int) ($size * ($maskable ? .24 : .21));
    roundedRectangle($image, $pad, $pad, $size - $pad, $size - $pad, $radius, $panel);
    imagefilledellipse($image, (int) ($size * .79), (int) ($size * .19), (int) ($size * .12), (int) ($size * .12), $glow);

    $left = (int) ($size * .25);
    $top = (int) ($size * .34);
    $right = (int) ($size * .75);
    $bottom = (int) ($size * .75);
    $walletRadius = (int) ($size * .045);
    roundedRectangle($image, $left, $top, $right, $bottom, $walletRadius, $white);
    roundedRectangle($image, $left + (int) ($size * .025), $top + (int) ($size * .025), $right - (int) ($size * .025), $bottom - (int) ($size * .025), $walletRadius, $panel);
    imagefilledrectangle($image, $left, $top + (int) ($size * .11), $right, $top + (int) ($size * .15), $cyan);

    $slotLeft = (int) ($size * .55);
    $slotTop = (int) ($size * .49);
    roundedRectangle($image, $slotLeft, $slotTop, $right, $slotTop + (int) ($size * .12), (int) ($size * .025), $mint);
    imagefilledellipse($image, $slotLeft + (int) ($size * .05), $slotTop + (int) ($size * .06), (int) ($size * .025), (int) ($size * .025), $navy);

    imagesetthickness($image, max(2, (int) ($size * .035)));
    imageline($image, (int) ($size * .35), $top, (int) ($size * .35), (int) ($size * .27), $cyan);
    imageline($image, (int) ($size * .35), (int) ($size * .27), (int) ($size * .65), (int) ($size * .27), $cyan);

    imagepng($image, $path, 6);
    imagedestroy($image);
}

createIcon($directory.'/icon-192.png', 192);
createIcon($directory.'/icon-512.png', 512);
createIcon($directory.'/icon-maskable.png', 512, true);
createIcon($directory.'/apple-touch-icon.png', 180);
createIcon($root.'/public/favicon.png', 64);

echo "Brand PNG assets generated.\n";
