import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray, reduxForm } from 'redux-form';
import { Button, Card, CardContent, CardHeader } from 'components';
import { range, isEmpty } from 'lodash-es';
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
    const { surveyContract, accountId, surveyId } = this.props;
    const { questions } = values;
    await surveyContract.methods
      .createQuestion(...questions)
      .send({
        from: accountId,
      });

    const questionCount = convertToNumber(await surveyContract.methods.getQuestionCount().call());

    if (isEmpty(questionCount === 0)) {
      console.log(questionCount);
      this.props.history.push(`/surveys/${surveyId}/show`);
    }
  };

  onCancelClick = () => {
    this.props.history.goBack();
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <div className="survey-create-questions container">
        <Card>
          <CardHeader title="Create Questions" />
          <CardContent>
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <FieldArray name="questions" component={SurveyQuestions} />
              <div className="survey-create-questions__buttons">
                <Button
                  className="mr-half"
                  text="Reset"
                  danger
                  type="button"
                  disabled={pristine || submitting}
                  onClick={reset}
                />
                <Button
                  className="mr-half"
                  text="Cancel"
                  type="button"
                  disabled={pristine || submitting}
                  onClick={this.onCancelClick}
                />
                <Button
                  className="mr-half"
                  text="Submit"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                />
              </div>
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
