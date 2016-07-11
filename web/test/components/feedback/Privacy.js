import DomMock from '../../helpers/dom-mock';
import jsdom from 'mocha-jsdom';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Privacy from '../../../src/components/Privacy';

DomMock('<html><body></body></html>');

describe('Testing Privacy Component', () => {
    jsdom({ skipWindowCheck: true });

    it('should contain correct content', () => {
        const item = {
            label: 'If Trend Micro has a follow-up survey on the Email Scan, would you like to participate?',
            terms: 'Yes, Trend Micro can reach me at this address: ',
            input: 'Please enter your email address.'
        };
        const content = TestUtils.renderIntoDocument(
            <Privacy item={item} />
        );
        const label = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-label');
        const terms = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-terms');

        expect(label.textContent).toEqual(item.label);
        expect(terms.textContent).toEqual(item.terms);
    });

    it('should contain two inputs', () => {
        const item = {
            label: 'If Trend Micro has a follow-up survey on the Email Scan, would you like to participate?',
            terms: 'Yes, Trend Micro can reach me at this address: ',
            input: 'Please enter your email address.'
        };
        const content = TestUtils.renderIntoDocument(
            <Privacy item={item} />
        );

        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(content, 'input');
        expect(inputs.length).toEqual(2);
    });
});
