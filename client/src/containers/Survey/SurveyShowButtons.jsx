import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'components';

class SurveyShowButtons extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    surveyId: PropTypes.string.isRequired,
    questionCount: PropTypes.number.isRequired,
  }

  onCreateQuestionClick = () => {
    const { surveyId } = this.props;
    this.props.history.push(`/surveys/${surveyId}/create`);
  }

  render() {
    const { questionCount } = this.props;

    return (
      <div className="survey-show-buttons">
        <Button
          text="Create Questions"
          color="primary"
          onClick={this.onCreateQuestionClick}
          disabled={questionCount > 0}
        />
      </div>
    );
  }
}

export default withRouter(SurveyShowButtons);
