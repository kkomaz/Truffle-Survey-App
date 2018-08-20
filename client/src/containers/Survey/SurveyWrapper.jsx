import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash-es';
import { Route, Switch } from 'react-router-dom';
import { Loader, Card, CardHeader, CardContent } from 'components';
import getSurvey from 'actions/Survey/getSurvey';
import getSurveyBalance from 'actions/Survey/getSurveyBalance';
import getEthPrice from 'actions/Survey/getEthPrice';
import {
  getSurveyDepositAmount,
} from 'actions/Survey';
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
    getSurveyBalance: PropTypes.func.isRequired,
    getEthPrice: PropTypes.func.isRequired,
    getSurveyDepositAmount: PropTypes.func.isRequired,
  };

  componentDidMount = async () => {
    const { web3, surveyId, surveyContract } = this.props;

    if (isEmpty(surveyContract)) {
      const result = await this.props.getSurvey(surveyId, web3);
      await this.props.getSurveyBalance(result.contract, web3, surveyId);
      await this.props.getEthPrice(result.contract, surveyId);
      await this.props.getSurveyDepositAmount(result.contract, web3, surveyId);
    }
  };

  isLoading() {
    const { surveyContract } = this.props;

    return isEmpty(surveyContract);
  }

  render() {
    const {
      web3,
      accounts,
      surveyContract,
      surveyId,
      accountId,
    } = this.props;

    if (this.isLoading()) {
      return (
        <div className="container">
          <Card>
            <CardHeader title="Survey" />
            <CardContent>
              <Loader />
            </CardContent>
          </Card>
        </div>
      );
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
  accountId: '',
};

function mapStateToProps(state, ownProps) {
  const surveyId = ownProps.match.params.survey_id;

  return {
    accountId: state.web3.currentAccount,
    surveyContract: state.survey[surveyId],
    surveyFactoryContract: state.contract.surveyFactoryContract,
    surveyId,
  };
}

export default connect(
  mapStateToProps,
  {
    getSurvey,
    getSurveyBalance,
    getEthPrice,
    getSurveyDepositAmount,
  },
)(SurveyWrapper);
