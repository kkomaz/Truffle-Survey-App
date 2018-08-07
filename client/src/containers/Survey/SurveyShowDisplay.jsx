import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SimpleList from 'components/Display/SimpleList';

class SurveyShowDisplay extends Component {
  static propTypes = {
    questions: PropTypes.array.isRequired,
  };

  render() {
    const { questions } = this.props;

    return (
      <div className="survey-show-display">
        <SimpleList items={questions} />
      </div>
    );
  }
}

export default SurveyShowDisplay;
