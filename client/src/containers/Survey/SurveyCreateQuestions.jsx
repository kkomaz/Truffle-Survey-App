import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray, reduxForm } from 'redux-form';
import { Button, Card, CardContent, CardHeader } from 'components';
import { withRouter } from 'react-router-dom';
import SurveyQuestions from './SurveyQuestions';

class CreateSurveyQuestions extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    surveyContract: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
  };

  onSubmit = async (values) => {
    const { surveyContract, accounts } = this.props;
    const { questions } = values;
    const result = await surveyContract.methods
      .createQuestion(...questions)
      .send({
        from: accounts[0],
      });
  };

  onCancelClick = () => {
    this.props.history.goBack();
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    console.log(this.props);

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
