import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import expect from 'expect';
import * as actions from '../../../portal/src/actions/subject';
import * as types from '../../../portal/src/constants/ActionTypes';
import Config from '../../../portal/src/config';

const mockStore = configureStore([thunkMiddleware]);

describe('[Portal] subject action', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should create an action to set subject', () => {
        const subject = 'Hello World';
        expect(
            actions.setSubject(subject)
        ).toEqual({
            type: types.SET_SUBJECT,
            subject
        });
    });

    it('should create an action to save subject', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const subject = 'Hello World';
        const surveyID = '1111-2222-3333';
        const surveyPolicy = {};
        const token = 'xxxxxxx';
        const postData = {
            subject: subject,
            survey: { content: [], thankyou: surveyPolicy }
        };

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .post(`/api/v1/mgnt/surveys/${account.accountid}`, JSON.stringify(postData))
        .reply(200, {
            surveyid: surveyID,
            datetime: Date.now()
        });

        const store = mockStore({
            account,
            surveyPolicy,
            token
        });
        const expectedActions = [
            { type: types.REQUEST_SET_SUBJECT },
            { type: types.SET_SUBJECT, subject },
            { type: types.SET_SURVEYID, surveyID },
            { type: types.EDIT_SUBJECT, editSubject: false },
            { type: types.SET_SUBJECT_SUCCESS },
            { type: types.SET_WEBPAGE, webpage: 'create' }
        ];

        return store.dispatch(actions.saveSubject(subject))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to edit subject', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const surveyID = '1111-2222-3333';
        const subject = 'Hello World';
        const questions = [ {
                page: 1,
                description: 'I am Page 1',
                question: []
            } ];
        const surveyPolicy = {};
        const selectedUser = {};
        const token = 'xxxxxxx';

        const postData = {
            subject: subject,
            survey: {
                format: Config.surveyFormat,
                content: questions,
                thankyou: surveyPolicy
            }
        };

        const store = mockStore({ account, surveyID, subject, questions, surveyPolicy, selectedUser, token });
        const expectedActions = [
            { type: types.SET_SUBJECT, subject },
            { type: types.REQUEST_SAVE_QUESTION }
        ];

        store.dispatch(actions.editSubject(subject));
        expect(
            store.getActions()
        ).toEqual(expectedActions);
    });
});
