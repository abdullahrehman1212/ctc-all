<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .content {
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="content">
        <p>Hi {{ $user->name }},</p>
        <p>Thank you for registering! Please click the link below to verify your email address:</p>
        <a href="{{ $url }}">{{ $url }}</a>
        <p>If you did not create an account, no further action is required.</p>
        <p>Best regards,</p>
        <p>Your Company Name</p>
    </div>
</body>
</html>
