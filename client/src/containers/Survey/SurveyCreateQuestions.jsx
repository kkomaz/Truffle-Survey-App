import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray, reduxForm } from 'redux-form';
import { Button, Card, CardHeader, CardContent } from '../../components';
import SurveyQuestions from './SurveyQuestions';

class CreateSurveyQuestions extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    surveyContract: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
  }

  onSubmit = async (values) => {
    const { surveyContract, accounts } = this.props;
    const { questions } = values;
    const result = await surveyContract.methods
      .createQuestion(...questions)
      .send({
        from: accounts[0],
      });
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <div className="survey-create-questions container">
        <Card>
          <CardHeader title="Create Questions" />
          <CardContent>
            <form
              className="container"
              onSubmit={handleSubmit(this.onSubmit)}
            >
              <FieldArray name="questions" component={SurveyQuestions} />
              <div>
                <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                  Submit
                </Button>
                <Button variant="contained" type="button" disabled={pristine || submitting} onClick={reset}>
                  Clear Values
                </Button>
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
})(CreateSurveyQuestions);
