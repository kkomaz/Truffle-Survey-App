import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, BarLoader } from 'components';
import SimpleList from 'components/Display/SimpleList';
import { range, isUndefined } from 'lodash-es';
import convertToNumber from 'utils/convertToNumber';
import SurveyShowButtons from './SurveyShowButtons';
import SurveyShowForm from './SurveyShowForm';

class SurveyShow extends Component {
  static propTypes = {
    surveyId: PropTypes.string.isRequired,
    accountId: PropTypes.string.isRequired,
  };

  state = { questions: [] };

  componentDidMount = async () => {
    const { surveyContract } = this.props;
    let allQuestions = [];
    const questionCount = convertToNumber(await surveyContract.methods.getQuestionCount().call());
    const owner = await surveyContract.methods.getOwner().call();

    if (questionCount === 0) {
      return this.setState({
        questionCount,
        owner,
      });
    }

    const rangeQuestionCount = range(questionCount);
    allQuestions = await surveyContract.methods.returnAllQuestions(...rangeQuestionCount).call();
    const questions = Object.values(allQuestions);

    const enrolled = await surveyContract.methods.getParticipant().call();

    return this.setState({
      questions,
      questionCount,
      enrolled,
      owner,
    });
  }

  render() {
    const { questions, questionCount, enrolled, owner } = this.state;
    const { surveyId, accountId } = this.props;

    if (isUndefined(questionCount)) {
      return (
        <div className="survey-show container">
          <Card>
            <CardHeader title={surveyId} />
            <CardContent>
              <BarLoader />
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="survey-show container">
        <Card>
          <CardHeader title={surveyId} />
          {
            questionCount === 0 ? (
              <CardContent>
                {
                  owner === accountId &&
                  <SurveyShowButtons
                    surveyId={surveyId}
                    questionCount={questionCount}
                  />
                }
                <h4>No Questions Exist!</h4>
              </CardContent>
            ) : (
              <CardContent>
                {
                  owner === accountId &&
                  <div>Hello World</div>
                }
                {
                  enrolled ? <SimpleList items={questions} /> :
                  <SurveyShowForm questions={questions} />
                }
              </CardContent>
            )
          }
        </Card>
      </div>
    );
  }
}

export default SurveyShow;
