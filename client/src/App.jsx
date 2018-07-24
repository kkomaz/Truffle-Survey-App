import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, NavLink, Switch, Prompt, BrowserRouter } from 'react-router-dom';
import setWeb3 from './actions/Web3/setWeb3';
import Count from './containers/Count';
import './App.css';

const Contacts = (props) => {
  return (
    <div>
      <Switch>
        <Route exact path={props.match.path} render={() => <h1>My Contacts Path</h1>} />
        <Route path={`${props.match.path}/:contactId`} render={({ match }) => <h1>My Single Contact Path {match.params.contactId}</h1>} />
      </Switch>
    </div>
  );
};

Contacts.propTypes = {
  match: PropTypes.shape.isRequired,
};

// NavLink - allows you to identify a current route and determine active state
const Links = () => (
  <nav>
    <NavLink exact activeClassName="active" to="/">Home</NavLink>
    <NavLink activeStyle={{ color: 'green' }} to="/about">About</NavLink>
    <NavLink activeClassName="active" to="/contacts">Contacts</NavLink>
    <NavLink activeStyle={{ color: 'black' }} to="/old/456">Old</NavLink>
    <NavLink activeStyle={{ color: 'black' }} to="/new/123">New</NavLink>
    <NavLink activeStyle={{ color: 'black' }} to="/form">Form</NavLink>
  </nav>
);

class Form extends Component {
  state = { dirty: false }

  setDirty = () => this.setState({ dirty: true })

  render() {
    return (
      <div>
        <h1>Form</h1>
        <input type="text" onInput={this.setDirty} />
        <Prompt when={this.state.dirty} message="Data will be lost" />
      </div>
    );
  }
}

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
        <div>
          <Links />
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Count web3={web3} accounts={accounts} />}
            />
            <Route path="/about" render={() => <h1>About</h1>} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/form" component={Form} />
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
