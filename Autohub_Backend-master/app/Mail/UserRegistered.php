<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserRegistered extends Mailable
{
    use Queueable, SerializesModels;

    public $user; // Declare the user property
    public $packageName; // Declare the packageName property

    /**
     * Create a new message instance.
     *
     * @param $user // Accept user data in the constructor
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
        $packageId = $user->subscription->package_id;
        $this->packageName = $this->getPackageName($packageId);
    }


    protected function getPackageName($packageId)
    {
        $packages = [
            1 => 'Trial',
            2 => 'Basic',
            3 => 'Silver',
            4 => 'Gold',
        ];

        return $packages[$packageId] ?? 'Unknown';
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('New User Register in Spare Parts360')
            ->html($this->getEmailContent()); // Call method to get email content
    }

    /**
     * Get the email content as a string.
     *
     * @return string
     */
    protected function getEmailContent()
    {
        return "
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }
                    .header {
                        background-color: #f4f4f4;
                        padding: 10px;
                        text-align: center;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding: 10px;
                        font-size: 12px;
                        color: #888;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    table, th, td {
                        border: 1px solid #ccc;
                        padding: 8px;
                    }
                </style>
            </head>
            <body>

                <div class='content'>
                    <p>Thank you for registering. We're excited to have you on board.</p>
                    <p>Here are your registration details:</p>
                    <table>
                        <tr>
                            <th>Name</th>
                            <td>{$this->user->name}</td>
                        </tr>
                        <tr>
                            <th>Package</th>
                            <td>{$this->packageName}</td>
                        </tr>
                        <tr>
                            <th>Company Name</th>
                            <td>{$this->user->company_name}</td>
                        </tr>
                        <tr>
                            <th>Username</th>
                            <td>{$this->user->username}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{$this->user->email}</td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>{$this->user->phone}</td>
                        </tr>
                        <tr>
                            <th>City</th>
                            <td>{$this->user->city}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{$this->user->address}</td>
                        </tr>
                        <tr>
                            <th>Invoice Note</th>
                            <td>{$this->user->invoice_note}</td>
                        </tr>
                        <tr>
                            <th>NTN</th>
                            <td>{$this->user->ntn}</td>
                        </tr>
                        <tr>
                            <th>GST</th>
                            <td>{$this->user->gst}</td>
                        </tr>
                    </table>
                    <p>Best regards,</p>
                    <p>Spare Parts360 Team</p>
                </div>

            </body>
        </html>
        ";
    }
}
