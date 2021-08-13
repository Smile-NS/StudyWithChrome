function doPost(e) {
  const params = JSON.parse(e.postData.getDataAsString());

  const res = { sucsess: true };

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(res));
  return output;
}

function doGet(){
  const res = getQuestions();

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(res));
  return output;
}

const id = '********************************************';
const ss = SpreadsheetApp.openById(id);
const subjects = ["japanese", "math", "english", "social_studies", "science"];

function init() {
  let manager = ss.getSheetByName("シート1");
  manager.setName(subjects[0]);

  for (let i = 1;i < subjects.length;i++) ss.insertSheet(subjects[i]);
}

function getQuestions() {
  let questions = {};
  for (let subject of subjects) {
    let q = getSingleQuestion(subject);
    questions[subject] = q;
  }
  return questions;
}

function getSingleQuestion(subject) {
  let sheet = ss.getSheetByName(subject);
  let lastRow = sheet.getLastRow();
  let questions = sheet.getRange(1, 1, lastRow).getValues();
  let answers = sheet.getRange(1, 2, lastRow).getValues();
  let random = parseInt(Math.random() * questions.length);

  return {
    question: questions[random][0],
    answer: answers[random][0]
  }
}






