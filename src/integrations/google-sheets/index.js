import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportToGoogleSheets = (responses, template) => {
  // Convert responses to worksheet format
  const data = responses.map(response => {
    const row = {};
    template.questions.forEach(question => {
      row[question.label] = response.answers[question._id] || '';
    });
    row['Submitted At'] = new Date(response.createdAt).toLocaleString();
    return row;
  });

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Responses');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save file
  saveAs(dataBlob, `${template.title}_responses.xlsx`);
};
