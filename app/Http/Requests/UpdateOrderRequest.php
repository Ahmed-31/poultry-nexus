<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    : bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    : array
    {
        $orderId = $this->route('id');
        return [
            'customer_id'                             => 'required|integer|exists:customers,id',
            'ordered_at'                              => 'required|date',
            'order_number'                            => "required|string|unique:orders,order_number,{$orderId}",
            'notes'                                   => 'nullable|string',
            'order_bundles'                           => 'nullable|array',
            'order_bundles.*.product_bundle_id'       => 'required|integer|exists:product_bundles,id',
            'order_bundles.*.poultry_house_count'     => 'required|integer|min:1',
            'order_bundles.*.height'                  => 'required|integer|min:1',
            'order_bundles.*.belt_width'              => 'required|integer|min:1',
            'order_bundles.*.lines_number'            => 'required|integer|min:1',
            'order_bundles.*.units_per_line'          => 'required|integer|min:1',
            'order_bundles.*.levels'                  => 'required|integer|min:1',
            'order_items'                             => 'nullable|array',
            'order_items.*.product_id'                => 'required|integer|exists:products,id',
            'order_items.*.quantity'                  => 'required|integer|min:1',
            'order_items.*.uom_id'                    => 'required|integer|exists:uoms,id',
            'order_items.*.dimensions'                => 'nullable|array',
            'order_items.*.dimensions.*.value'        => 'required|numeric',
            'order_items.*.dimensions.*.dimension_id' => 'required|integer|exists:uom_dimensions,id',
            'order_items.*.dimensions.*.uom_id'       => 'required|integer|exists:uoms,id',
        ];
    }
}
