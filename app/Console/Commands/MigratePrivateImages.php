<?php

namespace App\Console\Commands;

use App\Models\FinancialMovement;
use App\Models\InventoryItem;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MigratePrivateImages extends Command
{
    protected $signature = 'storage:migrate-private-images';

    protected $description = 'Mueve imágenes existentes del disco público al almacenamiento privado por usuario';

    public function handle(): int
    {
        $migrated = 0;

        FinancialMovement::query()
            ->whereNotNull('image_path')
            ->each(function (FinancialMovement $movement) use (&$migrated): void {
                if ($this->move($movement->image_path, 'financial-movements', $movement->user_id)) {
                    $migrated++;
                }
            });

        InventoryItem::query()
            ->whereNotNull('image_path')
            ->each(function (InventoryItem $item) use (&$migrated): void {
                if ($this->move($item->image_path, 'inventory-items', $item->user_id)) {
                    $migrated++;
                }
            });

        $this->info("Imágenes migradas al almacenamiento privado: {$migrated}");

        return self::SUCCESS;
    }

    private function move(string $path, string $directory, int $userId): bool
    {
        $public = Storage::disk('public');
        $private = Storage::disk('local');

        if (! $public->exists($path) || $private->exists($path)) {
            return false;
        }

        $target = $directory.'/'.$userId.'/'.basename($path);
        $private->put($target, $public->get($path));

        $model = str_starts_with($directory, 'financial-')
            ? FinancialMovement::query()->where('image_path', $path)->first()
            : InventoryItem::query()->where('image_path', $path)->first();

        if ($model) {
            $model->update(['image_path' => $target]);
        }

        $public->delete($path);

        return true;
    }
}
