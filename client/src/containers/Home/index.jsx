import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash-es';
import Button from '@material-ui/core/Button';
import setContractInstance from '../../actions/Contract/setContractInstance';
import surveyFactoryContractJSON from '../../contracts/SurveyFactory.json';
import getSurveys from '../../actions/Survey/getSurveys';
import { SET_SURVEY_FACTORY_CONTRACT_INSTANCE } from '../../actions/constants';

class Home extends Component {
  static propTypes = {
    setContractInstance: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    surveyFactoryContract: PropTypes.object,
    surveyIds: PropTypes.array.isRequired,
    getSurveys: PropTypes.func.isRequired,
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

    // Event focused function
    // const result = await this.props.getSurveys(surveyFactoryContract, accounts);
    // if (result.success) {
    //   this.getEvents();
    // }
  }

  // getEvents() {
  //   const { surveyFactoryContract } = this.props;
  //
  //   surveyFactoryContract.events.allEvents((err, res) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(res, 'res');
  //     }
  //   });
  // }

  render() {
    const { surveyIds } = this.props;

    if (isEmpty(surveyIds)) {
      return (
        <div>
          <h1>No Surveys created!</h1>
          <Button variant="contained" color="primary">
            Primary
          </Button>
        </div>
      );
    }

    return (
      <div>
        Hello World
      </div>
    );
  }
}

Home.defaultProps = {
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
})(Home);
