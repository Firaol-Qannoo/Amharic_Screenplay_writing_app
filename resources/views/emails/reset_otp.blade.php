<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #007bff;
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
        }
        .otp-section {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            text-align: center;
        }
        .otp {
            font-size: 2em;
            color: #28a745;
            font-weight: bold;
            letter-spacing: 10px;
        }
        p {
            margin-bottom: 15px;
        }
        .important {
            font-weight: bold;
            color: #dc3545;
        }
        .instructions {
            margin-top: 30px;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 6px;
            background-color: #f9f9f9;
        }
        .instructions h3 {
            color: #007bff;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #777;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset OTP</h2>
        <p>You have requested to reset your password. Please use the One-Time Password (OTP) below to proceed:</p>
        <div class="otp-section">
            <strong class="otp">{{ $otp }}</strong>
        </div>
        <p>This OTP is valid for the next <strong class="important">10 minutes</strong>. Please enter this code on the password reset page.</p>
        <div class="instructions">
            <h3>Important Instructions:</h3>
            <ul>
                <li>Do not share this OTP with anyone. Our team will never ask you for this code.</li>
                <li>If you did not request a password reset, you can ignore this email. Your account remains secure.</li>
            </ul>
        </div>
        <p>Thank you,</p>
        <p>The Ahmaric ScreenPlay Team</p>
        <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>