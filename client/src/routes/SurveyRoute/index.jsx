import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Survey from '../../containers/Survey';
import SurveyCreateQuestions from '../../containers/Survey/SurveyCreateQuestions';

const SurveyRoute = (props) => {
  return (
    <div>
      <Switch>
        <Route
          exact
          path={props.match.path}
          render={() => <Survey web3={props.web3} accounts={props.accounts} />}
        />
        <Route path="/surveys/:survey_id/create" render={() => <SurveyCreateQuestions />} />
      </Switch>
    </div>
  );
};

SurveyRoute.propTypes = {
  match: PropTypes.object.isRequired,
  web3: PropTypes.object.isRequired,
  accounts: PropTypes.object.isRequired,
};

export default SurveyRoute;
