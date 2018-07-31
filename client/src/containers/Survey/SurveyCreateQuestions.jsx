import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { FieldArray, reduxForm } from 'redux-form';
import SureyQuestions from './SurveyQuestions';

class CreateSurveyQuestions extends Component {
  onSubmit = (values) => {
    console.log(values);
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <FieldArray name="questions" component={SureyQuestions} />
        <div>
          <Button variant="contained" color="primary" type="submit" disabled={submitting}>
            Submit
          </Button>
          <Button variant="contained" type="button" disabled={pristine || submitting} onClick={reset}>
            Clear Values
          </Button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'fieldArrays', // a unique identifier for this form
})(CreateSurveyQuestions);
