document.getElementById("send").onclick = () => {
    const field = document.getElementById("time_field");
    const log = document.getElementById("log_div");
    const illegalPasswordLog = '<p class="error_message">数値を入力してください</p>';

    if (!isFinite(field.value)) {
        log.innerHTML = illegalPasswordLog;
        return;
    }

    const time = parseInt(field.value) * 60000;
    chrome.storage.local.set({time: time});
    open("about:blank", "_self").close();
}