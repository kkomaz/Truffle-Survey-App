import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter, Switch } from 'react-router-dom';
import setContractInstance from 'actions/Contract/setContractInstance';
import { SET_SURVEY_FACTORY_CONTRACT_INSTANCE } from 'actions/constants';
import surveyFactoryContractJSON from 'contracts/SurveyFactory.json';
import setCurrentAccount from 'actions/Web3/setCurrentAccount';
import Survey from './index';
import SurveyWrapper from './SurveyWrapper';

class SurveysWrapper extends Component {
  static propTypes = {
    setContractInstance: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    accountId: PropTypes.string.isRequired,
    setCurrentAccount: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = { loading: true };

  componentDidMount = async () => {
    const { web3, surveyFactoryContract, accountId } = this.props;

    if (!surveyFactoryContract) {
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

    web3.currentProvider.publicConfigStore.on('update', (acc) => {
      if (accountId.toLowerCase() !== acc.selectedAddress) {
        this.props.setCurrentAccount(acc.selectedAddress);
        this.props.history.push('/');
      }
    });
  }

  render() {
    const { web3, accounts, accountId } = this.props;
    const { loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Survey web3={web3} accounts={accounts} accountId={accountId} />}
          />
          <Route
            exact
            path="/surveys"
            render={() => <Survey web3={web3} accounts={accounts} accountId={accountId} />}
          />
          <Route
            path="/surveys/:survey_id"
            render={({ match }) => (
              <SurveyWrapper web3={web3} accounts={accounts} match={match} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accountId: state.web3.currentAccount,
    surveyFactoryContract: state.contract.surveyFactoryContract,
    surveyIds: state.survey.ids,
  };
}

export default connect(mapStateToProps, {
  setContractInstance,
  setCurrentAccount,
})(withRouter(SurveysWrapper));
