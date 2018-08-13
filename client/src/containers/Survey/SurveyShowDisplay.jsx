import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash-es';
import { List, ListItem, ListItemText } from 'components';

class SurveyShowDisplay extends Component {
  static propTypes = {
    questions: PropTypes.array.isRequired,
    surveyResultsTrue: PropTypes.array,
    surveyResultsFalse: PropTypes.array,
    questionCount: PropTypes.number.isRequired,
  };

  render() {
    const {
      questions,
      surveyResultsTrue,
      surveyResultsFalse,
      questionCount,
    } = this.props;

    if (questionCount === 0) {
      return (
        <div className="survey-show-display">
          <h4>No Questions Exist!</h4>
        </div>
      );
    }

    return (
      <div className="survey-show-display">
        <List className="survey-show-display__list">
          {
            map(questions, (i, index) => (
              (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${index + 1}. ${i}`}
                    secondary={
                      `Results - yes: ${surveyResultsTrue[index]} no: ${surveyResultsFalse[index]}`
                    }
                  />
                </ListItem>
              )
            ))
          }
        </List>
      </div>
    );
  }
}

SurveyShowDisplay.defaultProps = {
  surveyResultsTrue: [],
  surveyResultsFalse: [],
};

export default SurveyShowDisplay;
