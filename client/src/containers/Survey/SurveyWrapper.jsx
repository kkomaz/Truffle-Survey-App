import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import getSurvey from '../../actions/Survey/getSurvey';

class SurveyWrapper extends Component {
  static propTypes = {
    getSurvey: PropTypes.func.isRequired,
  };

  componentDidMount = async () => {
    const { web3, surveyId } = this.props;

    await this.props.getSurvey(surveyId, web3);
  }

  render() {
    console.log(this.props.surveyContract);
    return (
      <div>
        Hello World
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const surveyId = ownProps.match.params.survey_id;

  return {
    surveyId,
    surveyContract: state.survey[surveyId],
  };
}

export default connect(mapStateToProps, {
  getSurvey,
})(SurveyWrapper);
