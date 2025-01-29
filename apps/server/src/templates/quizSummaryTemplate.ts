const quizSummaryTemplate = (tableData: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz History</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    table {
      margin-top: 20px;
      width: 100%;
    }
    th, td {
      text-align: center;
      vertical-align: middle;
    }
  </style>
</head>
<body>
  ${tableData}
</body>
</html>`

export default quizSummaryTemplate