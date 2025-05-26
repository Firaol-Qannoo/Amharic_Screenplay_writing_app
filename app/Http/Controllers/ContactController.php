<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Send the email
        Mail::to(config('mail.admin_address'))->send(new ContactMessage($validated));

       $locale = auth()->user()->lang_pref ?? 'en';
        app()->setLocale($locale);

        flash()->success(__('messages.message_sent'));
        return Inertia::location(url()->previous());
    }
}

