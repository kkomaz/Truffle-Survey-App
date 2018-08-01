import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map, range } from 'lodash-es';

class SurveyShow extends Component {
  state = { questions: [] };

  componentDidMount = async () => {
    const { surveyContract } = this.props;
    const questionCount = await surveyContract.methods.getQuestionCount().call();
    const rangeQuestionCount = range(questionCount);

    const result = await surveyContract.methods.returnAllQuestions(...rangeQuestionCount).call();
    const questions = Object.values(result);

    this.setState({
      questions,
      questionCount,
    });
  }

  render() {
    const { questions, questionCount } = this.state;

    return (
      <div className="survey-show">
        <h3>{questionCount}</h3>
        <ul>
          {
            map(questions, (q, index) => {
              return (
                <li key={index}>{q}</li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}

export default SurveyShow;
