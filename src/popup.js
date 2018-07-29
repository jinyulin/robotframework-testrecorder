$(function () {
    $("#tabs").tabs();
    $("#radioset").buttonset();
    $("#controlgroup").controlgroup();
    $("#recorder-ui-on").click(function () {
        chrome.tabs.executeScript({
            code: '$("#recorderDialog").show()'
        });
        chrome.storage.local.set({
            'recorderUi': true
        }, function () {
            console.log('Settings saved');
        });
    });
    $("#recorder-ui-off").click(function () {
        chrome.tabs.executeScript({
            code: '$("#recorderDialog").hide()'
        });
        chrome.storage.local.set({
            'recorderUi': false
        }, function () {
            console.log('Settings saved');
        });
    });
});
window.onload = function () {
    chrome.storage.local.get('recorderUi', function (data) {
        if (data['recorderUi']) {
            $('#recorder-ui-on').attr('checked', 'checked');
        }
        else {
            $('#recorder-ui-off').attr('checked', 'checked');
        }
        $('input').button('refresh');
    });
};