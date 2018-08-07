import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash-es';
import { List, ListItem, ListItemText } from 'components';

class SurveyShowDisplay extends Component {
  static propTypes = {
    questions: PropTypes.array.isRequired,
    surveyResultsTrue: PropTypes.array.isRequired,
    surveyResultsFalse: PropTypes.array.isRequired,
  };

  render() {
    const { questions, surveyResultsTrue, surveyResultsFalse } = this.props;

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

export default SurveyShowDisplay;
