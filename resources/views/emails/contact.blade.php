 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Contact Message</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f7;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #fff;
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .header h2 {
      color: #4f46e5;
      margin: 0;
    }
    .content p {
      line-height: 1.6;
      margin: 10px 0;
    }
    .label {
      font-weight: 600;
      color: #555;
    }
    .footer {
      margin-top: 30px;
      font-size: 0.85em;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📬 Amharic Screenplay Writing Tool – New Contact Message</h2>
    </div>

    <div class="content">
      <p><span class="label">👤 Name:</span> {{ $data['name'] }}</p>
      <p><span class="label">📧 Email:</span> {{ $data['email'] }}</p>
      <p><span class="label">📝 Subject:</span> {{ $data['subject'] }}</p>
      <p><span class="label">💬 Message:</span></p>
      <p style="margin-left: 10px;">{{ $data['message'] }}</p>
    </div>

    <div class="footer">
      &copy; {{ date('Y') }} Amharic Screenplay Writing Tool. All rights reserved.
    </div>
  </div>
</body>
</html>