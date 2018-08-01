import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash-es';
import { Route, Switch } from 'react-router-dom';
import getSurvey from '../../actions/Survey/getSurvey';
import SurveyCreateQuestions from './SurveyCreateQuestions';
import SurveyShow from './SurveyShow';

class SurveyWrapper extends Component {
  static propTypes = {
    getSurvey: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    surveyContract: PropTypes.object,
    accounts: PropTypes.array.isRequired,
    surveyId: PropTypes.string.isRequired,
  };

  componentDidMount = async () => {
    const { web3, surveyId } = this.props;

    await this.props.getSurvey(surveyId, web3);
  };

  render() {
    const { web3, accounts, surveyContract, surveyId } = this.props;

    if (isEmpty(surveyContract)) {
      return <div>Pending...</div>;
    }

    return (
      <div>
        <Switch>
          <Route
            exact
            path="/surveys/:survey_id/show"
            render={() => (
              <SurveyShow
                web3={web3}
                accounts={accounts}
                surveyContract={surveyContract}
                surveyId={surveyId}
              />
            )}
          />
          <Route
            exact
            path="/surveys/:survey_id/create"
            render={() => (
              <SurveyCreateQuestions
                web3={web3}
                accounts={accounts}
                surveyContract={surveyContract}
                surveyId={surveyId}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

SurveyWrapper.defaultProps = {
  surveyContract: {},
};

function mapStateToProps(state, ownProps) {
  const surveyId = ownProps.match.params.survey_id;

  return {
    surveyId,
    surveyContract: state.survey[surveyId],
  };
}

export default connect(
  mapStateToProps,
  {
    getSurvey,
  },
)(SurveyWrapper);
