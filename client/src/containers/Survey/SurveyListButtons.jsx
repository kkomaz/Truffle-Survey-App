import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SurveyListButtons extends Component {
  render() {
    const { id } = this.props;

    return (
      <div className="survey-list-buttons">
        {id}
      </div>
    );
  }
}

SurveyListButtons.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SurveyListButtons;
