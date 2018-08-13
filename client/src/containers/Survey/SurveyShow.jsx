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

  state = { questions: [], subheaderText: '' };

  componentDidMount = async () => {
    const { surveyContract, accountId } = this.props;
    let allQuestions = [];
    const questionCount = convertToNumber(
      await surveyContract.methods.getQuestionCount().call(),
    );
    const owner = await surveyContract.methods.getOwner().call();
    const surveyRequiredCount = parseInt(await surveyContract.methods.getSurveyRequiredCount().call(), 10);
    const participantCount = convertToNumber(await surveyContract.methods
      .getParticipantCount()
      .call());

    if (questionCount === 0) {
      return this.setState({
        questionCount,
        owner,
        surveyRequiredCount,
        participantCount,
      });
    }

    const surveyResultsTrue = map(await surveyContract.methods.getResults(true).call(), i => convertToNumber(i));
    const surveyResultsFalse = map(await surveyContract.methods.getResults(false).call(), i => convertToNumber(i));
    const rangeQuestionCount = range(questionCount);
    allQuestions = await surveyContract.methods
      .returnAllQuestions(...rangeQuestionCount)
      .call();

    const questions = typeof (allQuestions) === 'string' ? [allQuestions] : Object.values(allQuestions);
    const enrolled = await surveyContract.methods.getParticipant(accountId).call();
    const subheaderText = () => {
      if (surveyRequiredCount === participantCount) {
        return 'Survey is officially completed!';
      }

      return enrolled ? 'Already applied - Display Only' : '';
    };

    return this.setState({
      questions,
      questionCount,
      enrolled,
      owner,
      surveyResultsTrue,
      surveyResultsFalse,
      participantCount,
      surveyRequiredCount,
      subheaderText: subheaderText(),
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
      subheaderText,
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
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <Card>
              <CardHeader title="Survey Questions" subheader={subheaderText} />
              <CardContent>
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

                {(enrolled || questionCount === 0 || participantCount === surveyRequiredCount) ? (
                  <SurveyShowDisplay
                    questions={questions}
                    surveyResultsTrue={surveyResultsTrue}
                    surveyResultsFalse={surveyResultsFalse}
                    questionCount={questionCount}
                    surveyRequiredCount={surveyRequiredCount}
                    participantCount={participantCount}
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
            </Card>
          </div>

          <div className="col-xs-12 col-sm-6">
            <Card>
              <CardHeader title="Survey Information" />
              <CardContent>
                <div className="survey-show__contract-details">
                  {owner === accountId && (
                    <SurveyShowButtons
                      surveyId={surveyId}
                      questionCount={questionCount}
                      surveyContract={surveyContract}
                      accountId={accountId}
                      web3={web3}
                    />
                  )}
                  <p>Survey Address: {surveyId}</p>
                  {participantCount} / {surveyRequiredCount} surveys completed
                  <p>{surveyContract.depositAmount} Ether deposited</p>
                  <p>Current Balance in Contract: {surveyContract.balance} Ether</p>
                  <p>Distribution Amount: {round((surveyContract.depositAmount / surveyRequiredCount), 2)} Ether</p>
                  <p>Current Eth Price: ${round(surveyContract.ethPrice, 2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SurveyShow);
