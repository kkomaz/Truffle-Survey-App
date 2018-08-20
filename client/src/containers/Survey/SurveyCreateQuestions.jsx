import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray, reduxForm } from 'redux-form';
import { Card, CardContent, CardHeader, SubmissionButtons, BarLoader } from 'components';
import notifier from 'components/Display/Notifier';
import { withRouter } from 'react-router-dom';
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
    generate: PropTypes.func.isRequired,
  };

  state = { confirming: false };

  onSubmit = async (values) => {
    const { surveyContract, accountId, surveyId } = this.props;
    const { questions } = values;

    try {
      await surveyContract.methods
        .createQuestion(...questions)
        .send({
          from: accountId,
        });
      this.props.history.push(`/surveys/${surveyId}/show`);
    } catch (error) {
      this.props.generate('danger', error.message);
    }
  };

  onCancelClick = () => {
    this.props.history.goBack();
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const { confirming } = this.state;

    return (
      <div className="survey-create-questions container">
        <Card>
          <CardHeader title="Create Questions" />
          <CardContent>
            {
              confirming ? <BarLoader /> :
              <form onSubmit={handleSubmit(this.onSubmit)}>
                <FieldArray name="questions" component={SurveyQuestions} />
                <SubmissionButtons
                  reset={reset}
                  pristine={pristine}
                  submitting={submitting}
                  onCancelClick={this.onCancelClick}
                />
              </form>
            }
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default reduxForm({
  form: 'SurveyQuestions', // a unique identifier for this form
})(withRouter(notifier(CreateSurveyQuestions)));
