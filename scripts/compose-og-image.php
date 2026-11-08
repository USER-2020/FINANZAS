<?php

declare(strict_types=1);

$input = __DIR__.'/../public/pwa/og-image.png';
$fontBold = '/System/Library/Fonts/Supplemental/Arial Bold.ttf';
$fontRegular = '/System/Library/Fonts/Supplemental/Arial.ttf';

if (! extension_loaded('gd') || ! is_file($input) || ! is_file($fontBold)) {
    fwrite(STDERR, "GD, la imagen base o las fuentes requeridas no están disponibles.\n");
    exit(1);
}

$image = imagecreatefrompng($input);
$navy = imagecolorallocatealpha($image, 3, 12, 27, 28);
$white = imagecolorallocate($image, 244, 250, 255);
$muted = imagecolorallocate($image, 190, 216, 231);
$mint = imagecolorallocate($image, 84, 229, 209);
$cyan = imagecolorallocate($image, 37, 211, 238);

imagefilledrectangle($image, 0, 0, 700, 630, $navy);

imagettftext($image, 18, 0, 78, 92, $mint, $fontBold, 'FINANZAS OS');
imagettftext($image, 54, 0, 76, 190, $white, $fontBold, 'Tu dinero,');
imagettftext($image, 54, 0, 76, 252, $white, $fontBold, 'más claro.');
imagettftext($image, 25, 0, 80, 322, $muted, $fontRegular, 'Registra, organiza y avanza');
imagettftext($image, 25, 0, 80, 358, $muted, $fontRegular, 'con tus finanzas personales.');

imagefilledroundedrectangle($image, 80, 428, 352, 480, 22, $cyan);
imagettftext($image, 20, 0, 106, 462, imagecolorallocate($image, 3, 18, 31), $fontBold, 'Control financiero');

imagepng($image, $input, 6);
imagedestroy($image);

function imagefilledroundedrectangle(GdImage $image, int $x1, int $y1, int $x2, int $y2, int $radius, int $color): void
{
    imagefilledrectangle($image, $x1 + $radius, $y1, $x2 - $radius, $y2, $color);
    imagefilledrectangle($image, $x1, $y1 + $radius, $x2, $y2 - $radius, $color);
    imagefilledellipse($image, $x1 + $radius, $y1 + $radius, $radius * 2, $radius * 2, $color);
    imagefilledellipse($image, $x2 - $radius, $y1 + $radius, $radius * 2, $radius * 2, $color);
    imagefilledellipse($image, $x1 + $radius, $y2 - $radius, $radius * 2, $radius * 2, $color);
    imagefilledellipse($image, $x2 - $radius, $y2 - $radius, $radius * 2, $radius * 2, $color);
}
