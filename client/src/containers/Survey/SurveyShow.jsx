import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardLoader } from 'components';
import { range, isUndefined, map, round } from 'lodash-es';
import convertToNumber from 'utils/convertToNumber';
import SurveyShowButtons from './SurveyShowButtons';
import SurveyShowForm from './SurveyShowForm';
import SurveyShowDisplay from './SurveyShowDisplay';

class SurveyShow extends Component {
  static propTypes = {
    surveyId: PropTypes.string.isRequired,
    accountId: PropTypes.string.isRequired,
    surveyContract: PropTypes.object.isRequired,
    web3: PropTypes.object.isRequired,
  };

  state = { questions: [] };

  componentDidMount = async () => {
    const { surveyContract, accountId } = this.props;
    let allQuestions = [];
    const questionCount = convertToNumber(
      await surveyContract.methods.getQuestionCount().call(),
    );
    const owner = await surveyContract.methods.getOwner().call();
    const surveyRequiredCount = parseInt(await surveyContract.methods.getSurveyRequiredCount().call(), 10);

    if (questionCount === 0) {
      return this.setState({
        questionCount,
        owner,
        surveyRequiredCount,
      });
    }

    const surveyResultsTrue = map(await surveyContract.methods.getResults(true).call(), i => convertToNumber(i));
    const surveyResultsFalse = map(await surveyContract.methods.getResults(false).call(), i => convertToNumber(i));

    const participantCount = convertToNumber(await surveyContract.methods
      .getParticipantCount()
      .call());
    const rangeQuestionCount = range(questionCount);
    allQuestions = await surveyContract.methods
      .returnAllQuestions(...rangeQuestionCount)
      .call();

    const questions = typeof (allQuestions) === 'string' ? [allQuestions] : Object.values(allQuestions);
    const enrolled = await surveyContract.methods.getParticipant(accountId).call();

    return this.setState({
      questions,
      questionCount,
      enrolled,
      owner,
      surveyResultsTrue,
      surveyResultsFalse,
      participantCount,
      surveyRequiredCount,
    });
  };

  render() {
    const {
      questions,
      questionCount,
      enrolled,
      owner,
      surveyResultsTrue,
      surveyResultsFalse,
      participantCount,
      surveyRequiredCount,
    } = this.state;

    const {
      surveyId,
      accountId,
      surveyContract,
      web3,
    } = this.props;

    if (isUndefined(questionCount)) {
      return (
        <div className="survey-show container">
          <CardLoader title={surveyId} />
        </div>
      );
    }

    return (
      <div className="survey-show container">
        <Card>
          <CardHeader title={surveyId} subheader={enrolled ? 'Already applied - Display Only' : ''} />
          {questionCount === 0 ? (
            <CardContent>
              {owner === accountId && (
                <SurveyShowButtons
                  surveyId={surveyId}
                  questionCount={questionCount}
                  surveyContract={surveyContract}
                  accountId={accountId}
                  web3={web3}
                />
              )}
              <div className="survey-show__contract-details">
                <p>{surveyContract.balance} Ether deposited</p>
                <p>Distribution Amount: {round((surveyContract.balance / surveyRequiredCount), 2)} Ether</p>
                <p>Current Eth Price: ${round(surveyContract.ethPrice, 2)}</p>
              </div>
              <h4>No Questions Exist!</h4>
            </CardContent>
          ) : (
            <CardContent>
              <div className="survey-show__participation">
                {participantCount} / {surveyRequiredCount} surveys completed
                <p>{surveyContract.balance} Ether deposited</p>
                <p>Distribution Amount: {round((surveyContract.balance / surveyRequiredCount), 2)} Ether</p>
                <p>Current Eth Price: ${round(surveyContract.ethPrice, 2)}</p>
              </div>

              {enrolled ? (
                <SurveyShowDisplay
                  questions={questions}
                  surveyResultsTrue={surveyResultsTrue}
                  surveyResultsFalse={surveyResultsFalse}
                />
              ) : (
                <SurveyShowForm
                  questions={questions}
                  accountId={accountId}
                  surveyContract={surveyContract}
                  surveyResultsTrue={surveyResultsTrue}
                  surveyResultsFalse={surveyResultsFalse}
                  participantCount={participantCount}
                />
              )}
            </CardContent>
          )}
        </Card>
      </div>
    );
  }
}

export default SurveyShow;
