import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray, reduxForm } from 'redux-form';
import { Card, CardContent, CardHeader, SubmissionButtons } from 'components';
import { withRouter } from 'react-router-dom';
import convertToNumber from 'utils/convertToNumber';
import SurveyQuestions from './SurveyQuestions';

class CreateSurveyQuestions extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    surveyContract: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    accountId: PropTypes.string.isRequired,
    surveyId: PropTypes.string.isRequired,
  };

  onSubmit = async (values) => {
    const { surveyContract, accountId } = this.props;
    const { questions } = values;
    await surveyContract.methods
      .createQuestion(...questions)
      .send({
        from: accountId,
      });

    this.navigateAway();
  };

  onCancelClick = () => {
    this.props.history.goBack();
  };

  // Hack to check if count has updated
  navigateAway = async () => {
    const { surveyContract, surveyId } = this.props;

    const questionCount = convertToNumber(await surveyContract.methods.getQuestionCount().call());

    if (questionCount === 0) {
      setTimeout(this.navigateAway, 5000);
    } else {
      this.props.history.push(`/surveys/${surveyId}/show`);
    }
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <div className="survey-create-questions container">
        <Card>
          <CardHeader title="Create Questions" />
          <CardContent>
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <FieldArray name="questions" component={SurveyQuestions} />
              <SubmissionButtons
                reset={reset}
                pristine={pristine}
                submitting={submitting}
                onCancelClick={this.onCancelClick}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default reduxForm({
  form: 'SurveyQuestions', // a unique identifier for this form
})(withRouter(CreateSurveyQuestions));
