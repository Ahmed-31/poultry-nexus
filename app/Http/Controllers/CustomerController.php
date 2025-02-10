<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index()
    {
        $customers = Customer::all();
        return response()->json($customers, Response::HTTP_OK);
    }

    /**
     * Store a newly created customer.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'nullable|email|unique:customers,email',
            'phone'        => 'nullable|string|max:20|unique:customers,phone',
            'address'      => 'nullable|string|max:500',
            'company_name' => 'nullable|string|max:255',
            'tax_id'       => 'nullable|string|max:50|unique:customers,tax_id',
        ]);
        $customer = Customer::create($request->all());
        return response()->json($customer, Response::HTTP_CREATED);
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer)
    {
        return response()->json($customer, Response::HTTP_OK);
    }

    /**
     * Update the specified customer.
     */
    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'nullable|email|unique:customers,email,' . $customer->id,
            'phone'        => 'nullable|string|max:20|unique:customers,phone,' . $customer->id,
            'address'      => 'nullable|string|max:500',
            'company_name' => 'nullable|string|max:255',
            'tax_id'       => 'nullable|string|max:50|unique:customers,tax_id,' . $customer->id,
        ]);
        $customer->update($request->all());
        return response()->json($customer, Response::HTTP_OK);
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(['message' => 'Customer deleted successfully'], Response::HTTP_NO_CONTENT);
    }
}
