
import React from 'react';
import PureComponent from 'react-pure-render/component';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Actions
import * as SurveysActions from '../../actions/surveys';
import * as QuestionsActions from '../../actions/questions';
import * as EditSubjectActions from '../../actions/editSubject';
import * as PreviewActions from '../../actions/preview';

import ControlBtn from '../../components/List/ControlBtn';
import SurveyList from '../../components/List/SurveyList';

class List extends PureComponent {

    componentWillMount() {
        const { surveysActions } = this.props;
        surveysActions.getSurveys();
    }

    render() {
        const { surveys, selectedSurveys,
            surveysActions, questionsActions, editSubjectActions, previewActions } = this.props;

        return (
            <div ref="root">
                <ControlBtn
                    selectedSurveys={selectedSurveys}
                    editSubjectActions={editSubjectActions}
                    surveysActions={surveysActions}
                    previewActions={previewActions}
                />
                <SurveyList
                    surveys={surveys}
                    selectedSurveys={selectedSurveys}
                    questionsActions={questionsActions}
                    surveysActions={surveysActions}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        surveys: state.surveys,
        selectedSurveys: state.selectedSurveys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        surveysActions: bindActionCreators(SurveysActions, dispatch),
        questionsActions: bindActionCreators(QuestionsActions, dispatch),
        editSubjectActions: bindActionCreators(EditSubjectActions, dispatch),
        previewActions: bindActionCreators(PreviewActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List);
