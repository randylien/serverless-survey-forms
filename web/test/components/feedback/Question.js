import DomMock from '../../helpers/dom-mock';
import jsdom from 'mocha-jsdom';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Question from '../../../src/components/Question';

DomMock('<html><body></body></html>');

describe('Testing Question Component', () => {
    jsdom({ skipWindowCheck: true });

    it('should contain correct question id and text', () => {
        const content = TestUtils.renderIntoDocument(
            <Question id={2} text={'Question 2'} />
        );
        const question = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-question');

        expect(question.textContent).toEqual('2. Question 2');
    });

    it('should contain *required tag', () => {
        const content = TestUtils.renderIntoDocument(
            <Question required={true} />
        );
        const requiredTag = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-required');

        expect(requiredTag.textContent).toEqual('*required');
    });
});
