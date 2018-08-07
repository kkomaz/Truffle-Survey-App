import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardLoader } from 'components';
import SimpleList from 'components/Display/SimpleList';
import { range, isUndefined, map } from 'lodash-es';
import convertToNumber from 'utils/convertToNumber';
import SurveyShowButtons from './SurveyShowButtons';
import SurveyShowForm from './SurveyShowForm';

class SurveyShow extends Component {
  static propTypes = {
    surveyId: PropTypes.string.isRequired,
    accountId: PropTypes.string.isRequired,
    surveyContract: PropTypes.object.isRequired,
  };

  state = { questions: [] };

  componentDidMount = async () => {
    const { surveyContract, accountId } = this.props;
    let allQuestions = [];
    const questionCount = convertToNumber(
      await surveyContract.methods.getQuestionCount().call(),
    );
    const owner = await surveyContract.methods.getOwner().call();

    if (questionCount === 0) {
      return this.setState({
        questionCount,
        owner,
      });
    }

    const surveyResults = map(await surveyContract.methods.getResults(true).call(), i => convertToNumber(i));
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
      surveyResults,
      participantCount,
    });
  };

  render() {
    const { questions, questionCount, enrolled, owner, surveyResults, participantCount } = this.state;
    const { surveyId, accountId, surveyContract } = this.props;

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
          <CardHeader title={surveyId} />
          {questionCount === 0 ? (
            <CardContent>
              {owner === accountId && (
                <SurveyShowButtons
                  surveyId={surveyId}
                  questionCount={questionCount}
                />
              )}
              <h4>No Questions Exist!</h4>
            </CardContent>
          ) : (
            <CardContent>
              {owner === accountId && <div>Hello World</div>}
              {enrolled ? (
                <SimpleList items={questions} />
              ) : (
                <SurveyShowForm
                  questions={questions}
                  accountId={accountId}
                  surveyContract={surveyContract}
                  surveyResults={surveyResults}
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
