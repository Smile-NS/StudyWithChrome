var allowBrowse = false;
var time;

chrome.runtime.onConnect.addListener(port => {
  let channel = port.name;

  switch(channel) {
    case "get_questions":
      getQuestions(port);
      break;
    case "set_allow_browse":
      allowBrowse = true;
      chrome.storage.local.get("time", value => {
        let time = value.time == null ? 60000 : value.time;
        setTimeout(() => allowBrowse = false, time);
      });
      time = Date.now();
      break;  
    case "is_allow_browse":
      port.postMessage(allowBrowse);
      break;  
    case "get_last_time":
      port.postMessage(time);
      break;  
  }

});

function getQuestions(port) {
  const gasUrl =
   "https://script.google.com/macros/s/AKfycbwN4Rtt2P0AYolRtGbZxcwOe_Fa5xxbYQs6SD5eYXQPnhuKO5fexqfE7anvM9Pmj3z0/exec";

  $.ajax({
    type: "GET",
    url: gasUrl,
    dataType: "json",
  })
  .done(data => {
    console.log("sent");
    console.log(data);
    port.postMessage(data);
  })
  .fail(jqXHR => {
    console.log("エラーが発生しました。ステータス：" + jqXHR.status);
  });;
}