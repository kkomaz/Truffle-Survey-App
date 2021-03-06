import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { map } from 'lodash-es';
import { SubmissionButtons, Select, BarLoader } from 'components';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withRouter } from 'react-router-dom';
import notifier from 'components/Display/Notifier';

class SurveyShowForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    questions: PropTypes.array.isRequired,
    accountId: PropTypes.string.isRequired,
    surveyContract: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    generate: PropTypes.func.isRequired,
  };

  state = {
    options: [
      { label: 'YES', value: 'yes' },
      { label: 'NO', value: 'no' },
    ],
    confirming: false,
  }

  onSubmit = async (fields) => {
    const { accountId, surveyContract } = this.props;
    const results = map(Object.values(fields), (result) => {
      if (result === 'yes') {
        return true;
      }

      return false;
    });

    try {
      await surveyContract.methods
        .giveAnswers(results)
        .send({
          from: accountId,
        });
      this.props.history.push('/surveys');
    } catch (error) {
      this.props.generate('danger', error.message);
    }
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    const {
      questions,
      handleSubmit,
      pristine,
      reset,
      submitting,
    } = this.props;
    const { confirming } = this.state;

    if (confirming) {
      return <BarLoader />;
    }

    return (
      <form
        className="survey-show-form"
        onSubmit={handleSubmit(this.onSubmit)}
      >
        {
          map(questions, (q, index) => (
            <div className="row" key={index}>
              <div className="col-sm-12">
                <p className="mt-half">{q}</p>
              </div>

              <div className="col-sm-12">
                <FormControl style={{ minWidth: '120px', width: '100%' }}>
                  <InputLabel htmlFor="yes/no">Yes/No</InputLabel>
                  <Field
                    name={`question-${index}`}
                    component={Select}
                    type="select"
                    options={this.state.options}
                  />
                </FormControl>
              </div>
            </div>
          ))
        }

        <div className="row mt-one">
          <div className="col-xs-12">
            <SubmissionButtons
              reset={reset}
              pristine={pristine}
              submitting={submitting}
              onCancelClick={this.goBack}
            />
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'SurveyShowForm', // a unique identifier for this form
})(withRouter(notifier(SurveyShowForm)));
