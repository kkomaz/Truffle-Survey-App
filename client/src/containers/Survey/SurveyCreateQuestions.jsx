import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { FieldArray, reduxForm } from 'redux-form';
import SureyQuestions from './SurveyQuestions';
import getSurvey from '../../actions/Survey/getSurvey';

class CreateSurveyQuestions extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    surveyId: PropTypes.string.isRequired,
    web3: PropTypes.object.isRequired,
    surveyContract: PropTypes.object,
    accounts: PropTypes.array.isRequired,
  }

  componentDidMount = async () => {
    const { web3, surveyId } = this.props;

    await this.props.getSurvey(surveyId, web3);
  }

  onSubmit = async (values) => {
    const { surveyContract, accounts } = this.props;
    const { questions } = values;
    const result = await surveyContract.methods
      .createQuestion(...questions)
      .send({
        from: accounts[0],
      });
    console.log(result);
  }

  getQuestions = async () => {
    const { surveyContract } = this.props;

    console.log(surveyContract);

    const result = await surveyContract.methods.returnAllQuestions(0, 1).call();
    console.log(result[0]);
    console.log(result[1]);
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
          <Button onClick={this.getQuestions}>
            getQuestions
          </Button>
        </div>
      </form>
    );
  }
}

CreateSurveyQuestions.defaultProps = {
  surveyContract: {},
};

function mapStateToProps(state, ownProps) {
  const surveyId = ownProps.match.params.survey_id;

  return {
    surveyId,
    surveyContract: state.survey[surveyId],
  };
}

CreateSurveyQuestions = connect(mapStateToProps, {
  getSurvey,
})(CreateSurveyQuestions);


export default reduxForm({
  form: 'SurveyQuestions', // a unique identifier for this form
})(CreateSurveyQuestions);
