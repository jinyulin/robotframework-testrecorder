var recorder = {
    testCase: []
    , stop: false
    , pause: false
    , updateTestCase: function (testStep) {
        if (recorder.pause == false) {
            if (recorder.testCase.length == 0) {
                recorder.testCase.push(testStep);
            }
            else {
                var testStepNum = recorder.testCase.length
                var lastStep = recorder.testCase[testStepNum - 1]
                if (lastStep.toString() != testStep.toString()) {
                    if (lastStep[1] == 'Rules' && testStep[1] == 'Rules') {
                        recorder.testCase[testStepNum - 1].push(testStep[2]);
                    }
                    else {
                        recorder.testCase.push(testStep);
                    }
                }
            }
        }
        recorder.updateBrowserCache();
    }
    , updateBrowserCache: function () {
        chrome.storage.local.set({
            'testCase': recorder.testCase
        });
    }
}