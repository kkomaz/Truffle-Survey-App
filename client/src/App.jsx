import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Route,
  NavLink,
  Switch,
  BrowserRouter,
} from 'react-router-dom';
import setWeb3 from './actions/Web3/setWeb3';
import SurveysWrapper from './containers/Survey/SurveysWrapper';
import './stylesheets/main.scss';

// NavLink - allows you to identify a current route and determine active state
const Links = () => (
  <nav>
    <NavLink exact activeClassName="active" to="/">
      Home
    </NavLink>
    <NavLink activeStyle={{ color: 'green' }} to="/surveys">
      Surveys
    </NavLink>
    <NavLink activeClassName="active" to="/contacts">
      Contacts
    </NavLink>
    <NavLink activeStyle={{ color: 'black' }} to="/old/456">
      Old
    </NavLink>
    <NavLink activeStyle={{ color: 'black' }} to="/new/123">
      New
    </NavLink>
    <NavLink activeStyle={{ color: 'black' }} to="/form">
      Form
    </NavLink>
  </nav>
);

class App extends Component {
  static propTypes = {
    web3: PropTypes.object.isRequired,
    setWeb3: PropTypes.func.isRequired,
    accounts: PropTypes.array.isRequired,
  };

  state = { loading: true };

  componentDidMount = async () => {
    const result = await this.props.setWeb3();

    if (result) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { accounts, web3 } = this.props;

    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return (
      <BrowserRouter>
        <div style={{ marginBottom: '20px' }}>
          <Links />
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
