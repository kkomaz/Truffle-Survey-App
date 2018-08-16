import React from 'react';
import PropTypes from 'prop-types';
import { round } from 'lodash-es';

export const surveyShowDetails = (props) => {
  const {
    participantCount,
    surveyRequiredCount,
    surveyContract,
  } = props;

  return (
    <div className="survey-show-details">
      {participantCount} / {surveyRequiredCount} surveys completed
      <p>{surveyContract.depositAmount} Ether deposited</p>
      <p>Current Balance in Contract: {surveyContract.balance} Ether</p>
      <p>Distribution Amount: {round((surveyContract.depositAmount / surveyRequiredCount), 2)} Ether</p>
      <p>Current Eth Price: ${round(surveyContract.ethPrice, 2)}</p>
    </div>
  );
};

surveyShowDetails.propTypes = {
  participantCount: PropTypes.number.isRequired,
  surveyRequiredCount: PropTypes.number.isRequired,
  surveyContract: PropTypes.object.isRequired,
};

export default surveyShowDetails;
