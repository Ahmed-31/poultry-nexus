<?php

namespace App\Http\Controllers;

use App\Models\Menu;

class MenuController extends Controller
{
    public function index()
{
    $menus = Menu::orderBy('order')->get();
    return response()->json($this->buildMenuTree($menus));
}

private function buildMenuTree($menus, $parentId = null)
{
    return $menus->where('parent_id', $parentId)->map(function ($menu) use ($menus) {
        return [
            'id' => $menu->id,
            'title' => $menu->title,
            'url' => $menu->url,
            'icon' => $menu->icon,
            'children' => $this->buildMenuTree($menus, $menu->id),
        ];
    })->values();
}
}
