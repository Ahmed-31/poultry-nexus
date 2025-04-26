<?php

namespace App\Services\Products;

use App\Models\Uom;
use App\Models\UomDimension;
use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ProductExcelParser
{
    protected string $locale;

    public function __construct(string $locale = null)
    {
        $this->locale = $locale ?? app()->getLocale();
    }

    public function setLocale(string $locale)
    : void
    {
        $this->locale = $locale;
    }

    public function parse(string $filePath)
    : Collection
    {
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();
        $products = collect();
        foreach ($rows as $row) {
            [$name, $uomInput, $dimensionInput] = array_pad($row, 3, null);
            if (!filled($name)) continue;
            $uom = Uom::query()
                ->when($this->locale !== 'en', function ($query) use ($uomInput) {
                    $query->whereHas('translations', function ($q) use ($uomInput) {
                        $q->where('name', $uomInput)
                            ->where('locale', $this->locale);
                    });
                }, function ($query) use ($uomInput) {
                    $query->where('name', $uomInput);
                })
                ->first();
            if (!$uom) continue;
            $dimensionIds = [];
            if (filled($dimensionInput)) {
                $dimensionInput = trim($dimensionInput);
                $dimensionNames = array_map('trim', explode('*', $dimensionInput));
                foreach ($dimensionNames as $singleDimensionName) {
                    if ($this->locale === 'ar' && !str_starts_with($singleDimensionName, 'ال')) {
                        $singleDimensionName = 'ال' . $singleDimensionName;
                    }
                    $dimension = UomDimension::query()
                        ->when($this->locale !== 'en', function ($query) use ($singleDimensionName) {
                            $query->whereHas('translations', function ($q) use ($singleDimensionName) {
                                $q->whereRaw('LOWER(name) = ?', [strtolower($singleDimensionName)])
                                    ->where('locale', $this->locale);
                            });
                        }, function ($query) use ($singleDimensionName) {
                            $query->whereRaw('LOWER(name) = ?', [strtolower($singleDimensionName)]);
                        })
                        ->first();
                    if ($dimension) {
                        $dimensionIds[] = $dimension->id;
                    } else {
                        logger()->debug('Dimension not found', [
                            'input'  => $singleDimensionName,
                            'locale' => $this->locale,
                        ]);
                    }
                }
            }
            $products->push([
                'name'           => trim($name),
                'default_uom_id' => $uom->id,
                'uom_group_id'   => $uom->group_id,
                'price'          => 1.00,
                'type'           => 'component',
                'min_stock'      => 0,
                'category_id'    => null,
                'dimension_ids'   => $dimensionIds,
            ]);
        }
        return $products;
    }
}
