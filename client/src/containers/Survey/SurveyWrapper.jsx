import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash-es';
import { Route, Switch } from 'react-router-dom';
import { SET_SURVEY_FACTORY_CONTRACT_INSTANCE } from 'actions/constants';
import setContractInstance from 'actions/Contract/setContractInstance';
import surveyFactoryContractJSON from 'contracts/SurveyFactory.json';
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
    accountId: PropTypes.string,
    surveyFactoryContract: PropTypes.object,
    setContractInstance: PropTypes.func.isRequired,
  };

  state = { loading: true };

  componentDidMount = async () => {
    const { web3, surveyFactoryContract, surveyId } = this.props;

    if (isEmpty(surveyFactoryContract)) {
      try {
        const result = await this.props.setContractInstance(web3, surveyFactoryContractJSON, SET_SURVEY_FACTORY_CONTRACT_INSTANCE);
        if (result.success) {
          this.setState({ loading: false });
        }
      } catch (error) {
        this.setState({ loading: false });
      }
    } else {
      this.setState({ loading: false });
    }

    await this.props.getSurvey(surveyId, web3);
  };

  render() {
    const {
      web3,
      accounts,
      surveyContract,
      surveyId,
      accountId,
      surveyFactoryContract,
    } = this.props;

    if (isEmpty(surveyContract) || this.state.loading) {
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
                accountId={accountId}
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
                accountId={accountId}
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
  surveyFactoryContract: {},
  accountId: '',
};

function mapStateToProps(state, ownProps) {
  const surveyId = ownProps.match.params.survey_id;

  return {
    accountId: state.web3.accounts[0],
    surveyContract: state.survey[surveyId],
    surveyFactoryContract: state.contract.surveyFactoryContract,
    surveyId,
  };
}

export default connect(
  mapStateToProps,
  {
    getSurvey,
    setContractInstance,
  },
)(SurveyWrapper);
