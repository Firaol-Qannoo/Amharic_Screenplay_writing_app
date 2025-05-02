<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup OTP Verification</title>
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
        h1 {
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
            font-size: 2.5em;
            color: #28a745;
            font-weight: bold;
            letter-spacing: 15px;
        }
        p {
            margin-bottom: 15px;
            text-align: center;
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
        <h1>Welcome to Amharic Screenplay!</h1>
        <p>Thank you for signing up. Please use the One-Time Password (OTP) below to verify your account:</p>
        <div class="otp-section">
            <strong class="otp">{{ $otp }}</strong>
        </div>
        <p>Enter this OTP on the verification page to complete your registration.</p>
        <div class="instructions">
            <h3>Important:</h3>
            <ul>
                <li>Do not share this OTP with anyone.</li>
                <li>This OTP is for account verification only.</li>
            </ul>
        </div>
        <p>Best regards,</p>
        <p>The Ahmaric ScreenPlay Team</p>
        <div class="footer">
            <p>If you have any issues, please contact our support team.</p>
        </div>
    </div>
</body>
</html>