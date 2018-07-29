/**
 * Description: The main class of Robot Test Recorder
 * Author: Yulin Jin
 */
recorderUi.init();
chrome.storage.local.get('recorderUi', function (data) {
    if (data['recorderUi']) {
        $("#recorderDialog").show();
    }
    else {
        $("#recorderDialog").hide()
    }
});
chrome.storage.local.get('testCase', function (data) {
    if (data['testCase'][0] != null) {
        recorder.testCase = data['testCase'];
        recorderUi.updateTestCaseDiv();
    }
});
window.addEventListener('change', function (event) {
    recorderHandler.handleChangeEvent(event);
}, true);
window.addEventListener('click', function (event) {
    recorderHandler.handleClickEvent(event);
}, true);
window.addEventListener('mousedown', function (event) {
    recorderHandler.handleMouseDownEvent(event);
}, true);