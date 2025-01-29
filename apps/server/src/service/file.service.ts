import puppeteer from 'puppeteer';
import QuizService from './quiz.service';
import UserService from './user.service';
import quizSummaryTemplate from '../templates/quizSummaryTemplate';


class FileService {
  static generatePDF = async (userId: string) => {
    const user = await UserService.getUser(userId);
    const quizzes = await QuizService.getUserQuizzes(user._id)
    let tableString = ""
    for (let i = 0; i < quizzes.length; i++) {
      tableString += `
          <tr>
          <td>${i + 1}</td>
          <td>${quizzes[i].courseId.name}</td>
          <td>${quizzes[i].courseId.subjectId.name}</td>
          <td style="color: {{#if this.isPassed}}green{{else}}red{{/if}};">
            <strong>${quizzes[i].isPassed ? `<span style="color: green">Pass</span>` : `<span style="color: red">Fail</span>`}</strong>
          </td>
          <td>${new Date(quizzes[i].createdAt).toLocaleString()}</td>
          <td>${quizzes[i].totalQuestions}</td>
          <td>${quizzes[i].correctQuestions}</td>
        </tr>`
    }

    const tableData = `
    <h1 class="text-center">Quiz History</h1>
  <table class="table table-hover table-responsive">
    <thead>
      <tr>
        <th>SN</th>
        <th>Course Name</th>
        <th>Subject Name</th>
        <th>Status</th>
        <th>Quiz Taken Date</th>
        <th>Total Questions</th>
        <th>Correct Answers</th>
      </tr>
    </thead>
    <tbody>
      ${tableString}
    </tbody>
  </table>
  `
    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(quizSummaryTemplate(tableData), { waitUntil: 'networkidle0' });
    // Generate the PDF file
    const fileName = `quiz-history-${user.fireBaseId}.pdf`
    const pdfPath = `assets/summary/${fileName}`
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    console.log(`PDF generated at ${pdfPath}`);
    return fileName
  }

}

export default FileService