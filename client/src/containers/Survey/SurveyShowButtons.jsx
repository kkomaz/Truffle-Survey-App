import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'components';
import TextField from '@material-ui/core/TextField';
import setEthPrice from 'actions/Survey/setEthPrice';

class SurveyShowButtons extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    surveyId: PropTypes.string.isRequired,
    questionCount: PropTypes.number.isRequired,
    surveyContract: PropTypes.object.isRequired,
    accountId: PropTypes.string.isRequired,
    web3: PropTypes.object.isRequired,
    setEthPrice: PropTypes.func.isRequired,
    surveyRequiredCount: PropTypes.number.isRequired,
    participantCount: PropTypes.number.isRequired,
  }

  state = { amount: '', showFundInput: false };

  onCreateQuestionClick = () => {
    const { surveyId } = this.props;
    this.props.history.push(`/surveys/${surveyId}/create`);
  }

  onAddFunds = () => {
    const { showFundInput } = this.state;

    this.setState({ showFundInput: !showFundInput });
  }

  onSubmitFunds = async () => {
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

  updateEthPrice = async () => {
    const { surveyContract, accountId, surveyId } = this.props;

    const result = await this.props.setEthPrice(surveyContract, accountId, surveyId);
    if (result.success) {
      this.setState({ requireRefresh: true });
    }
  }

  render() {
    const { questionCount, surveyContract, surveyRequiredCount, participantCount } = this.props;
    const { showFundInput, requireRefresh } = this.state;

    return (
      <div className="survey-show-buttons">
        <div className="survey-show-buttons__actions">
          <Button
            text="Create Questions"
            color="primary"
            onClick={this.onCreateQuestionClick}
            disabled={questionCount > 0 || surveyContract.balance === 0}
            style={{
              marginLeft: '0px',
            }}
          />
          <Button
            text="Add Funds"
            color="secondary"
            onClick={this.onAddFunds}
            disabled={surveyRequiredCount === participantCount}
          />
          <Button
            text="Update Eth Price"
            onClick={this.updateEthPrice}
            danger
          />
        </div>
        {
          showFundInput &&
          <div className="survey-show-buttons__deposit">
            <TextField
              id="amount"
              label="Amount"
              value={this.state.amount}
              onChange={this.handleChange('amount')}
              margin="normal"
            />

            <Button
              text="Submit Funds"
              color="secondary"
              onClick={this.onSubmitFunds}
              danger
            />
          </div>
        }
        {
          requireRefresh &&
          <p className="danger">
            If price of ETH does not change, please refresh...
          </p>
        }
      </div>
    );
  }
}

export default connect(null, {
  setEthPrice,
})(withRouter(SurveyShowButtons));
