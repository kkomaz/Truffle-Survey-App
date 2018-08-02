import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader } from 'components';
import SimpleList from 'components/Display/SimpleList';
import { map, range } from 'lodash-es';
import SurveyShowDisplay from './SurveyShowDisplay';

class SurveyShow extends Component {
  state = { questions: [] };

  componentDidMount = async () => {
    const { surveyContract } = this.props;
    const questionCount = await surveyContract.methods.getQuestionCount().call();
    const rangeQuestionCount = range(questionCount);

    const allQuestions = await surveyContract.methods.returnAllQuestions(...rangeQuestionCount).call();
    const questions = Object.values(allQuestions);

    const enrolled = await surveyContract.methods.getParticipant().call();

    this.setState({
      questions,
      questionCount,
      enrolled,
    });
  }

  render() {
    const { questions, questionCount, enrolled } = this.state;

    return (
      <div className="survey-show container">
        <Card>
          <CardHeader title="Survey" subheader="secondary" />
          <h3>{questionCount}</h3>
          <SimpleList items={questions} />
        </Card>
      </div>
    );
  }
}

export default SurveyShow;
