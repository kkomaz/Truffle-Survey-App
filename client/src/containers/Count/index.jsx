import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import setContractInstance from '../../actions/Contract/setContractInstance';
import setCountValue from '../../actions/Count/setCountValue';
import contractDefinition from '../../contracts/SimpleStorage.json';
import surveyFactoryContract from '../../contracts/SurveyFactory.json';
import getContractInstance from '../../utils/getContractInstance';
import './stylesheets/count.css';

class Count extends Component {
  static propTypes = {
    setContractInstance: PropTypes.func.isRequired,
    setCountValue: PropTypes.func.isRequired,
    count: PropTypes.any.isRequired,
    web3: PropTypes.object.isRequired,
  }

  componentDidMount = async () => {
    try {
      const { web3 } = this.props;

      // const result = await this.props.setContractInstance(web3, contractDefinition);
      const test = await getContractInstance(web3, surveyFactoryContract);

      console.log(test);

      // if (result.success) {
      //   this.runExample();
      // }
    } catch (error) {
      console.log(error);
    }
  }

  runExample = async () => {
    const { accounts, contract } = this.props;

    await this.props.setCountValue(contract, accounts);
  }

  render() {
    if (!this.props.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="count">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully,
          below will show a stored value of 5 (by default).
        </p>
        <p>Try changing the value stored on <strong>line 37</strong> of Count.js.</p>
        <div>The stored value is: {this.props.count}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contract: state.contract.contract,
    count: state.count.count,
  };
}

export default connect(mapStateToProps, {
  setContractInstance,
  setCountValue,
})(Count);
