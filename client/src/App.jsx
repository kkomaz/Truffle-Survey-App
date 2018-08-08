import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Route,
  NavLink,
  Switch,
  BrowserRouter,
} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { AppBar } from 'components';
import setWeb3 from './actions/Web3/setWeb3';
import SurveysWrapper from './containers/Survey/SurveysWrapper';
import './stylesheets/main.scss';

// NavLink - allows you to identify a current route and determine active state
const Links = () => (
  <nav>
    <NavLink exact activeClassName="active" to="/" style={{ marginRight: '10px' }}>
      Home
    </NavLink>
    <NavLink activeClassName="active" to="/surveys">
      Surveys
    </NavLink>
  </nav>
);

class App extends Component {
  static propTypes = {
    web3: PropTypes.object.isRequired,
    setWeb3: PropTypes.func.isRequired,
    accounts: PropTypes.array.isRequired,
    accountId: PropTypes.string.isRequired,
  };

  state = { loading: true };

  componentDidMount = async () => {
    const result = await this.props.setWeb3();

    if (result) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { accounts, web3, accountId } = this.props;

    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return (
      <BrowserRouter>
        <div>
          <AppBar>
            <Typography variant="title" color="inherit" style={{ flexGrow: '1', fontSize: '14px' }}>
              ACCOUNT: {accountId}
            </Typography>
            <Typography variant="title" color="inherit">
              <Links />
            </Typography>
          </AppBar>
          <Switch>
            <Route
              exact
              path="/"
              render={() => <SurveysWrapper web3={web3} accounts={accounts} />}
            />
            <Route
              path="/surveys"
              render={() => <SurveysWrapper web3={web3} accounts={accounts} />}
            />
            <Route render={() => <h1>Page Not Found</h1>} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    accountId: state.web3.currentAccount,
    web3: state.web3.web3,
    accounts: state.web3.accounts,
  };
}

export default connect(
  mapStateToProps,
  {
    setWeb3,
  },
)(App);
