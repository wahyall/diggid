<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller {
    public function update(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $data = $request->validate([
                'photo' => 'nullable|image|max:2048',
                'name' => 'required|string',
                'bio' => 'nullable|string',
                'address' => 'nullable|string'
            ]);

            $user = User::find(auth()->user()->id);

            // Delete old photo
            if (is_file(storage_path('app/public/' . str_replace('storage/', '', $user->photo)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $user->photo)));
            }

            $data['photo'] = 'storage/' . $request->photo->store('user', 'public');
            $user->update($data);

            return response()->json(['status' => true, 'message' => 'Profil berhasil diperbarui']);
        } else {
            return abort(404);
        }
    }
}
