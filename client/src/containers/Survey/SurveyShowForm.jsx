import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { map } from 'lodash-es';
import { SubmissionButtons, Switch } from 'components';

class SurveyShowForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    questions: PropTypes.array.isRequired,
  };

  onSubmit = (values) => {
    console.log(values);
  }

  render() {
    const { questions, handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <form
        className="survey-show-form"
        onSubmit={handleSubmit(this.onSubmit)}
      >
        {
          map(questions, (q, index) => (
            <div className="survey-show-form__question" key={index}>
              <p>{q}</p>
              <div>
                <label className="ml-half">
                  (No/Yes)
                </label>
                <Field
                  name={`question-${index}`}
                  component={Switch}
                  type="checkbox"
                />
              </div>
            </div>
          ))
        }
        <SubmissionButtons
          reset={reset}
          pristine={pristine}
          submitting={submitting}
          onCancelClick={this.onCancelClick}
        />
      </form>
    );
  }
}

export default reduxForm({
  form: 'SurveyShowForm', // a unique identifier for this form
})(SurveyShowForm);
