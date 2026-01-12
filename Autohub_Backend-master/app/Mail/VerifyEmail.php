<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $otp;

    public function __construct($name, $otp)
    {
        $this->name = $name;
        $this->otp = $otp;
    }

    public function build()
    {
        return $this->subject('Your OTP Code')
            ->view('emails.otp')
            ->with([
                'name' => $this->name,
                'otp' => $this->otp,
            ]);
    }
}
