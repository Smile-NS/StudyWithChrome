console.log('start "content.js"...');

var qCount = 0;
var questions, subject, question, answer, keys;

chrome.runtime.connect({name: "is_allow_browse"})
.onMessage.addListener(response => {
  if (response) reserveLock();
  else lock();
});

function lock() {
  let elements = document.getElementsByTagName('*');
  for(let i = 0; i < elements.length; i++) elements[i].remove();

  chrome.runtime.connect({name: "get_questions"})
  .onMessage.addListener(response => {
    questions = response;
    keys = Object.keys(response);
    changeNextQuestion();
    putElements();
  });   
}

const defaultInterval = 1800000;

function reserveLock() {
  chrome.runtime.connect({name: "get_last_time"})
  .onMessage.addListener(response => {
    let now = Date.now();

    chrome.storage.local.get("time", value => {
      let time = value.time == null ? defaultInterval : value.time;
      setTimeout(() => lock(), time - (now - response));
    });  
  });    
}

function changeNextQuestion() {
  subject = keys[qCount];
  question = questions[subject].question;
  answer = questions[subject].answer;
  qCount++;
}

function putElements() {
  const div = document.createElement("div");
  div.style.textAlign = "center";
  document.appendChild(div);

  const title = document.createElement("div");
  title.innerHTML = "《" + subject + "》";
  div.appendChild(title);

  const text = document.createElement("div");
  text.innerHTML = question;
  div.appendChild(text);

  const input = document.createElement("input");
  input.type = "text";
  input.maxlength = "30";
  input.size = 10;
  div.appendChild(input);
  
  const button = document.createElement("input");
  button.classList.add("send");
  button.type = "button";
  button.value = "送信";

  const failedMsg = document.createElement("div");

  div.appendChild(button).addEventListener("click", () => {
    if (input.value != answer) {
      failedMsg.innerHTML = "不正解！";
      input.value = "";
      return;
    }
    if (qCount == keys.length) {
      chrome.runtime.connect({name: "set_allow_browse"});
      location.reload();
      return;
    }

    changeNextQuestion();
    title.innerHTML = "《" + subject + "》";
    text.innerHTML = question;
    input.value = "";
    failedMsg.innerHTML = "";

  }, false);

  div.appendChild(failedMsg);
}
