import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'components';
import TextField from '@material-ui/core/TextField';

class SurveyShowButtons extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    surveyId: PropTypes.string.isRequired,
    questionCount: PropTypes.number.isRequired,
    surveyContract: PropTypes.object.isRequired,
    accountId: PropTypes.string.isRequired,
    web3: PropTypes.object.isRequired,
  }

  state = { amount: '' };

  onCreateQuestionClick = () => {
    const { surveyId } = this.props;
    this.props.history.push(`/surveys/${surveyId}/create`);
  }

  onAddFunds = async () => {
    const { surveyContract, accountId, web3 } = this.props;
    const { amount } = this.state;
    const { BN } = web3.utils;

    const etherAmount = new BN(amount);
    const weiValue = web3.utils.toWei(etherAmount, 'ether');

    await surveyContract.methods
      .depositRewardAmount()
      .send({
        from: accountId,
        value: weiValue,
      });

    const balance = await surveyContract.methods.getBalance().call();

    if (balance) {
      window.location.reload(); // eslint-disable-line no-undef
    }
  }

  handleChange = amount => event => (
    this.setState({
      [amount]: event.target.value,
    })
  )


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
        <div className="survey-show-buttons__deposit" style={{ marginLeft: '5px' }}>
          <TextField
            id="amount"
            label="Amount"
            value={this.state.amount}
            onChange={this.handleChange('amount')}
            margin="normal"
          />

          <Button
            text="Add Funds"
            color="secondary"
            onClick={this.onAddFunds}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(SurveyShowButtons);
