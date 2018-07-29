var recorderHandler = {
    format: function (str) {
        return str.trim().replace(/\n/g, '').replace(/\xa0/g, ' ').replace('\u25b2', '').replace('*', '').replace(':', '')
    }
    , getSelectedRowLocator: function ($e) {
        var locator = [];
        $e.closest('table').find('th').each(function (index) {
            var colText = ''
            if ($e.prop('tagName')=='DIV'){
                colText = $e.text()
            }else{
                colText = $e.closest('tr').find('td').eq(index).text()
            }
            if ($(this).text() != '' && colText != '') {
                locator.push($(this).text() + "=" + colText);
            }
        });
        return locator;
    }
    , recordStep: function ($e, keyword, useLabel, value) {
        var recordedStep = [keyword];
        var foundLabel = false;
        var defaultLocator = '';
        var labelText = ''
        if (useLabel) {
            var $curr = $e;
            while (!foundLabel && $curr.prop('tagName') != 'BODY') {
                //exclude the nested children text
                labelText = $curr.clone().children().remove().end().text().trim();
                if (['LABEL', 'DT'].indexOf($curr.prop('tagName')) >= 0 && labelText != '') {
                    foundLabel = true;
                    break;
                }
                $curr.prevAll('label, dt').each(function (index) {
                    labelText = $(this).clone().children().remove().end().text().trim();
                    if (labelText != '') {
                        foundLabel = true;
                        return;
                    }
                });
                if (!foundLabel) $curr = $curr.parent();
            }
        }
        if ($e[0].hasAttribute('id')) {
            defaultLocator = 'id=' + $e.attr('id');
        }
        else if ($e[0].hasAttribute('name')) {
            defaultLocator = 'name=' + $e.attr('name');
        }
        else if ($e[0].hasAttribute('class')) {
            defaultLocator = 'css=' + $e.attr('class').replace(/ /g, '.');
        }
        if (useLabel) {
            if (foundLabel) {
                labelText = recorderHandler.format(labelText);
                recordedStep = recordedStep.concat([labelText, value[0]]);
            }
            else {
                recordedStep = recordedStep.concat([defaultLocator, value[0]]);
            }
        }
        else {
            if (value.length == 1 && value[0] == '' && defaultLocator != '') {
                recordedStep.push(defaultLocator);
            }
            else if (value[0] != '') {
                $.each(value, function (index, val) {
                    recordedStep = recordedStep.concat(val);
                });
            }
        }
        if (recordedStep.length != 1) recorder.updateTestCase(recordedStep);
    }
    , handleChangeEvent: function (event) {
        if (event.isTrusted) {
            var $e = $(event.target);
            var className = $e.attr('class') || '';
            var tagName = $e.prop('tagName');
            var type = $e.attr('type') || '';
            if (tagName == 'INPUT') {
                var inputTypes = ["text", "password", "number", "tel", "email", ""];
                if (inputTypes.indexOf(type) >= 0) {
                    recorderHandler.recordStep($e, 'input text', true, [$e.val()]);
                }
                else if (type == 'FILE') {
                    recorderHandler.recordStep($e, 'choose file', false, [$e.val()]);
                }
            }
            else if (tagName == 'TEXTAREA') {
                recorderHandler.recordStep($e, 'input text', true, [$e.val()]);
            }
            else if (tagName == 'SELECT') {
                recorderHandler.recordStep($e, 'select from list', true, [$e.find(':selected').text()]);
            }
            recorderUi.updateTestCaseDiv();
        }
    }
    , handleClickEvent: function (event) {
        if (event.isTrusted) {
            var $e = $(event.target);
            var className = $e.attr('class') || '';
            var tagName = $e.prop('tagName');
            var prarentTagName = $e.parent().prop('tagName') || '';
            var prarentClassName = $e.parent().attr('class') || '';
            var type = $e.attr('type') || '';
            var eleText = ($e.val() || $e.text()).trim();
            var buttonTypes = ['submit', 'button'];
            if ((buttonTypes.indexOf(type) >= 0 || tagName == 'BUTTON') && className != 'recorderToolBarButton') {
                if (eleText != '') {
                    recorderHandler.recordStep($e, 'click button', false, [eleText]);
                }
                else {
                    recorderHandler.recordStep($e, 'click element', false, ['']);
                };
            }
            else if (type == 'radio' && $e.parent().prop('tagName') != 'TD') {
                recorderHandler.recordStep($e, 'select radio button', false, [$e.attr('name'), $e.attr('value')]);
            }
            else if (tagName == 'A') {
                if (className == 'select2-search-choice-close') {
                    recorderHandler.recordStep($e, 'unselect', true, $e.parent().text());
                }
                else if ($e.attr('role') == 'tab' || (prarentTagName == 'LI' && prarentClassName == 'tabBut')) {
                    recorderHandler.recordStep($e, 'select tab', false, [$e.text()]);
                }
                else if (className.includes('btn')) {
                    recorderHandler.recordStep($e, 'click button', false, [$e.text()]);
                }
                else if (prarentTagName == 'LI' && prarentClassName.includes('top_menu_class')) {
                    recorderHandler.recordStep($e, 'select tab', false, [$e.text()]);
                }
                else if (recorderHandler.format(eleText) != '') {
                    recorderHandler.recordStep($e, 'click link', false, [$e.text()]);
                }
            }
            else if (type == 'checkbox' || type == 'radio') {
                if ($e.next() == null) {
                    if (prarentTagName == 'TD') {
                        var rowLocator = recorderHandler.getSelectedRowLocator($e);
                        recorderHandler.recordStep($e, 'select table item', false, rowLocator);
                    }
                    else {
                        if ($e.prop('checked') == true) {
                            recorderHandler.recordStep($e, 'select checkbox', false, [$e.parent.text()]);
                        }
                        else if ($e.prop('checked') == false) {
                            recorderHandler.recordStep($e, 'unselect checkbox', false, [$e.parent.text()]);
                        }
                    }
                }
                else {
                    if ($e.prop('checked') == true) {
                        recorderHandler.recordStep($e, 'select checkbox', true, ['']);
                    }
                    else if ($e.prop('checked') == false) {
                        recorderHandler.recordStep($e, 'unselect checkbox', true, ['']);
                    }
                }
            }
            else if (tagName == 'I') {
                if (prarentTagName == 'BUTTON') {
                    recorderHandler.recordStep($e, 'click element', false, ['']);
                }
                else if (prarentTagName == 'TD' || $e.parent().parent().prop('tagName') == 'TD') {
                    var action = [];
                    if (className.includes('fa-trash-o')) {
                        action.push('action=delete')
                    }
                    else if (className.includes('fa-edit') || className.includes('fa-pencil')) {
                        action.push('action=edit')
                    }
                    else if (className.includes('fa-play')) {
                        action.push('action=start')
                    }
                    else if (className.includes('fa-resume')) {
                        action.push('action=stop')
                    }
                    var rowLocator = recorderHandler.getSelectedRowLocator($e);
                    recorderHandler.recordStep($e, 'operate table item', false, action.concat(rowLocator));
                }
                else {
                    recorderHandler.recordStep($e, 'click element', false, ['']);
                }
            }
            else if (tagName == 'EM') {
                let eleText = $e.parent().prev('span').text().replace('\n', '');
                recorder.updateTestCase(['click left navigator', [eleText]]);
            }
            else if (tagName == 'IMG') {
                if ($e.attr('src').includes('app-cc-h17-link.png')) {
                    tc = recorderHandler.format($e.parents('table').eq(1).find('td').eq(0).text());
                    recorderHandler.recordStep($e, 'click igd icon', false, [tc]);
                }
                else {
                    recorderHandler.recordStep($e, 'click element', false, [eleText]);
                }
            }
            else if (tagName == 'DIV') {
                if (prarentTagName == 'A') {
                    recorderHandler.recordStep($e, 'click link', false, [$e.parent().text()]);
                }
                else if (className == 'device-info' || prarentClassName == 'device-info') {
                    recorderHandler.recordStep($e, 'click element', false, ['']);
                }
            }
            else if (tagName == 'SPAN' && prarentClassName == 'A') {
                recorderHandler.recordStep($e, 'click link', false, [$e.text()]);
            }
            recorderUi.updateTestCaseDiv();
        }
    }
    , handleMouseDownEvent: function (event) {
        if (event.isTrusted) {
            var $e = $(event.target);
            var className = $e.attr('class') || '';
            var tagName = $e.prop('tagName');
            if (tagName == 'DIV' && className == 'select2-result-label') {
                var select2 = document.getElementsByClassName('select2-container select2-container-multi')[0];
                recorderHandler.recordStep($(select2), 'select from list', true, [$e.text()]);
            }
            else if (tagName == 'TD' || $e.parent().prop('tagName') == 'TD') {
                var noDataErr = ['No data available in table'];
                if (noDataErr.indexOf(recorderHandler.format($e.text())) < 0) {
                    var rowLocator = recorderHandler.getSelectedRowLocator($e);
                    recorderHandler.recordStep($e, 'select table item', false, rowLocator);
                }
            }
            recorderUi.updateTestCaseDiv();
        }
    }
}