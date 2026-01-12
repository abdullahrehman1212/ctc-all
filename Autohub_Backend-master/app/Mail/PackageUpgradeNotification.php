<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PackageUpgradeNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $package;

    /**
     * Create a new message instance.
     *
     * @param $user
     * @param $package
     */
    public function __construct($user, $package)
    {
        $this->user = $user;
        $this->package = $package;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Package Upgrade Notification')
                    ->view('package-upgrade')
                    ->with([
                        'user' => $this->user,
                        'package' => $this->package,
                    ]);
    }
}
