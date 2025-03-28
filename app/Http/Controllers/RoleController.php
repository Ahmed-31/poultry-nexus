<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleController extends Controller
{
    // Get all roles with permissions
    public function index()
{
    $roles = Role::with('permissions:id,name')->get(); 
    return response()->json($roles);
}


    public function getPermissions()
{
    try {
        $permissions = Permission::all(['id', 'name']);
        return response()->json($permissions);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to fetch permissions'], 500);
    }
}

public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'required|string|unique:roles,name,' . $id,
        'permissions' => 'array'
    ]);

    $role = Role::findOrFail($id);
    $role->update(['name' => $request->name]);

    if ($request->has('permissions')) {
        $permissions = Permission::whereIn('name', $request->permissions)->get();
        $role->syncPermissions($permissions);
    }

    return response()->json([
        'message' => 'Role updated successfully',
        'role' => $role->load('permissions')
    ]);
}


    // Create a new role
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles',
            'permissions' => 'array'
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->has('permissions')) {
            $permissions = Permission::whereIn('name', $request->permissions)->get();
            $role->syncPermissions($permissions);
        }

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role->load('permissions')
        ], 201);
    }

    // Delete a role
    public function destroy($id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                return response()->json(['message' => 'Role not found'], 404);
            }

            // Unassign role from users
            $usersWithRole = User::role($role->name)->get();
            foreach ($usersWithRole as $user) {
                $user->removeRole($role->name);
            }

            // Remove permissions before deleting role
            $role->syncPermissions([]);

            // Delete role
            $role->delete();

            return response()->json(['message' => 'Role deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }
}
