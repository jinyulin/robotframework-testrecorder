var recorderUi = {
    init: function () {
        var recorderDialog = $("\
            <div id='recorderDialog'>\
                <div id='recorderTitle'>Test Recorder</div>\
                <div id='recorderToolBar'>\
                    <input type='button' id='recorderNewTestBtn' value='Reset' class='recorderToolBarButton'/>\
                    <input type='button' id='recorderPauseBtn' value='Pause' class='recorderToolBarButton'/>\
                </div>\
                <div id='recorderContent' contenteditable='true'></div>\
            </div>\
        ");
        recorderDialog.appendTo("body");
        var leftPos = ($(window).width() - $('#recorderDialog').width()) / 2
            , topPos = ($(window).height() - $('#recorderDialog').height()) / 2;
        $('#recorderDialog').css({
            'left': leftPos
            , 'top': topPos
        });
        recorderUi.bindUiEvent();
    }
    , bindUiEvent: function () {
        $(document).ready(function () {
            var $dragging = null;
            var originalLeft;
            var originalTop;
            var mouseLeft;
            var mouseTop;
            $(document.body).on("mousemove", function (e) {
                if ($dragging) {
                    $('#recorderDialog').offset({
                        top: originalTop + e.clientY - mouseTop
                        , left: originalLeft + e.clientX - mouseLeft
                    });
                }
            });
            $("#recorderTitle").on("mousedown", function (e) {
                $dragging = $(this);
                originalLeft = $('#recorderDialog').offset().left;
                originalTop = $('#recorderDialog').offset().top;
                mouseLeft = e.clientX;
                mouseTop = e.clientY;
            });
            $(document.body).on("mouseup", function (e) {
                $dragging = null;
            });
            $("#recorderNewTestBtn").click(function () {
                recorder.pause = false;
                recorder.testCase = [];
                recorderUi.updateTestCaseDiv();
                recorder.updateBrowserCache();
            });
            $("#recorderPauseBtn").click(function () {
                if (recorderPauseBtn.value == 'Resume') {
                    recorder.pause = false;
                    recorderPauseBtn.value = 'Pause'
                }
                else {
                    recorder.pause = true;
                    recorderPauseBtn.value = 'Resume'
                }
            });
        });
    }
    , updateTestCaseDiv: function () {
        var stepNumber = recorder.testCase.length;
        var testCaseStr = '&nbsp;&nbsp;&nbsp;&nbsp;';
        for (var i = 0; i < stepNumber; i++) {
            for (var j = 0; j < 　recorder.testCase[i].length; j++) {
                testCaseStr = testCaseStr + recorder.testCase[i][j] + '&nbsp;&nbsp;&nbsp;&nbsp;'
            }
            if (i != stepNumber - 1) {
                testCaseStr = testCaseStr + '<br>&nbsp;&nbsp;&nbsp;&nbsp;';
            }
        }
        $('#recorderContent').html(testCaseStr);
    }
}