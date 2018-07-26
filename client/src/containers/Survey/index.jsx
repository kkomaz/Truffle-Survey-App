import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, map } from 'lodash-es';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import setContractInstance from '../../actions/Contract/setContractInstance';
import surveyFactoryContractJSON from '../../contracts/SurveyFactory.json';
import getSurveys from '../../actions/Survey/getSurveys';
import { SET_SURVEY_FACTORY_CONTRACT_INSTANCE } from '../../actions/constants';
import Survey from '../../utils/survey';

class Surveys extends Component {
  static propTypes = {
    setContractInstance: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    surveyFactoryContract: PropTypes.object,
    surveyIds: PropTypes.array.isRequired,
    getSurveys: PropTypes.func.isRequired,
    // history: PropTypes.object.isRequired,
  }

  componentDidMount = async () => {
    try {
      const { web3 } = this.props;

      const result = await this.props.setContractInstance(web3, surveyFactoryContractJSON, SET_SURVEY_FACTORY_CONTRACT_INSTANCE);

      if (result.success) {
        this.getSurveys();
      }
    } catch (error) {
      console.log(error);
    }
  }

  getSurveys = async () => {
    const { surveyFactoryContract, accounts } = this.props;

    await this.props.getSurveys(surveyFactoryContract, accounts);
  }

  createSurvey = async () => {
    const { surveyFactoryContract, accounts } = this.props;
    try {
      console.log('creating survey');
      await surveyFactoryContract.methods
        .createSurvey()
        .send({
          from: accounts[0],
        })
        .on('receipt', (receipt) => {
          console.log(receipt.contractAddress); // contains the new contract address
        })
        .on('confirmation', () => {
          console.log('confirming');
        })
        .then((newContractInstance) => {
          console.log(newContractInstance);
        });
      console.log('ending');
    } catch (err) {
      console.log(err);
    }
  }

  doIt = () => {
    const { web3 } = this.props;
    const survey = Survey('0xA0cC5B15fbE7C30D761b42476eF0e485Ff325827', web3);
    console.log(survey);
  }

  render() {
    const { surveyIds } = this.props;

    if (isEmpty(surveyIds)) {
      return (
        <div>
          <h1>No Surveys created!</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={this.createSurvey}
          >
            Create Survey
          </Button>
        </div>
      );
    }

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.createSurvey}
        >
          Create Survey
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={this.doIt}
        >
          Testing
        </Button>
        {
          map(surveyIds, (id) => {
            return <li key={id}>{id}</li>;
          })
        }
      </div>
    );
  }
}

Surveys.defaultProps = {
  surveyFactoryContract: {},
};

function mapStateToProps(state) {
  return {
    surveyFactoryContract: state.contract.surveyFactoryContract,
    surveyIds: state.survey.ids,
  };
}

export default connect(mapStateToProps, {
  setContractInstance,
  getSurveys,
})(withRouter(Surveys));
