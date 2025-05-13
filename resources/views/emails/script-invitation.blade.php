<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Amharic Screenplay Writer - Script Invitation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            padding: 20px;
        }
        .container {
            background: white;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .app-title {
            font-size: 20px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
            margin-bottom: 10px;
        }
        h1 {
            color: #444;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #888;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="app-title">Amharic Screenplay Writer</div>

        <h1>You've been invited!</h1>
        <p><strong>{{ $inviterName }}</strong> has invited you to collaborate on a script titled <strong>"{{ $scriptTitle }}"</strong>.</p>
        <p>Click the button below to accept the invitation:</p>

        <a class="button" href="{{ $url }}">Accept Invitation</a>

        <p>If you weren't expecting this invitation, you can safely ignore this email.</p>

        <div class="footer">
            &copy; {{ date('Y') }} Amharic Screenplay Writer. All rights reserved.
        </div>
    </div>
</body>
</html>