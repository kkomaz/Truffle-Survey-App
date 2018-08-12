import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardLoader, Button } from 'components';
import { withRouter } from 'react-router-dom';
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
    history: PropTypes.object.isRequired,
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

  getParticipant = async () => {
    const { surveyContract, accountId } = this.props;
    await surveyContract.methods.getParticipant(accountId).call();
  }

  retrievePayment = async () => {
    const { surveyContract, accountId } = this.props;

    const result = await surveyContract.methods.payoutParticipant().send({
      from: accountId,
      gas: 3000000,
    });

    if (result) {
      this.props.history.push('/');
    }
  }

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
                <p>{surveyContract.depositAmount} Ether deposited</p>
                <p>Current Balance in Contract: {surveyContract.balance} Ether</p>
                <p>Distribution Amount: {round((surveyContract.depositAmount / surveyRequiredCount), 2)} Ether</p>
                <p>Current Eth Price: ${round(surveyContract.ethPrice, 2)}</p>
              </div>
              <h4>No Questions Exist!</h4>
            </CardContent>
          ) : (
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

              {
                enrolled &&
                <Button
                  text="Retrieve Fund"
                  color="primary"
                  onClick={this.retrievePayment}
                  style={{
                    general: {
                      marginLeft: '0px',
                    },
                  }}
                  disabled={surveyRequiredCount !== participantCount}
                />
              }

              <div className="survey-show__contract-details">
                {participantCount} / {surveyRequiredCount} surveys completed
                <p>{surveyContract.depositAmount} Ether deposited</p>
                <p>Current Balance in Contract: {surveyContract.balance} Ether</p>
                <p>Distribution Amount: {round((surveyContract.depositAmount / surveyRequiredCount), 2)} Ether</p>
                <p>Current Eth Price: ${round(surveyContract.ethPrice, 2)}</p>
              </div>

              {(enrolled || participantCount === surveyRequiredCount) ? (
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

export default withRouter(SurveyShow);
