import DomMock from '../../helpers/dom-mock';
import { wrapInTestContext } from '../../helpers/dnd-test';
import jsdom from 'mocha-jsdom';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import EditQuestion from '../../../portal/src/components/EditPanel/EditQuestion';

DomMock('<html><body></body></html>');

describe('[Portal] Testing EditQuestion Component', () => {
    jsdom({ skipWindowCheck: true });

    const fakeData = {
        id: '1AN2AL0F9BNA7A',
        type: 'rating',
        label: 'Testing question text',
        data: [
            { value: 1, label: 'Very dissatisfied' },
            { value: 2, label: 'Very satisfied' }
        ],
        input: 'Tell us the reason why you choose this answe',
        required: false
    };
    const props = {
        editQuestion: fakeData,
        editQuestionActions: () => {},
        questionsActions: () => {}
    };

    const EditQuestionContext = wrapInTestContext(EditQuestion);
    const contentRoot = TestUtils.renderIntoDocument(<EditQuestionContext {...props} />);

    it('show question editor: question label', () => {
        const textarea = TestUtils.scryRenderedDOMComponentsWithClass(contentRoot, 'ut-editQuestion');
        // Expect component
        expect(textarea[0].textContent).toEqual(fakeData.label);
    });

    it('show question editor: question advance', () => {
        const div = TestUtils.scryRenderedDOMComponentsWithClass(contentRoot, 'ut-advance');
        // Expect one component
        expect(div.length).toEqual(1);
    });

    it('show question editor: question advance checkbox', () => {
        const chk = TestUtils.scryRenderedDOMComponentsWithClass(contentRoot, 'ut-chk');
        // Expect one check component
        expect(chk[0].checked).toEqual(true);
    });
});
