import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, map } from 'lodash-es';
import InboxIcon from '@material-ui/icons/Inbox';
import { withRouter } from 'react-router-dom';
import {
  BarLoader,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardHeader,
  CardContent,
} from 'components';
import {
  getSurveys,
  createSurvey,
} from 'actions/Survey';
import notifier from 'components/Display/Notifier';
import setContractInstance from 'actions/Contract/setContractInstance';

class Surveys extends Component {
  static propTypes = {
    surveyFactoryContract: PropTypes.object,
    surveyIds: PropTypes.array.isRequired,
    getSurveys: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    createSurvey: PropTypes.func.isRequired,
    accountId: PropTypes.string.isRequired,
    web3: PropTypes.object.isRequired,
    generate: PropTypes.func.isRequired,
  };

  state = { loading: true };

  componentDidMount = async () => {
    this.getSurveys();
  };

  onSurveyClick = (id) => {
    this.props.history.push(`/surveys/${id}/show`);
  };

  getSurveys = async () => {
    const { surveyFactoryContract, accountId } = this.props;

    await this.props.getSurveys(surveyFactoryContract, accountId);
    this.setState({ loading: false });
  };

  createSurvey = async () => {
    const { surveyFactoryContract, accountId, web3 } = this.props;

    try {
      const result = await this.props.createSurvey(surveyFactoryContract, web3, accountId);

      if (result.address) {
        this.props.history.push(`/surveys/${result.address}/show`);
      }
    } catch (error) {
      this.props.generate('danger', error.message);
    }
  };

  render() {
    const { surveyIds } = this.props;

    if (isEmpty(surveyIds)) {
      return (
        <div>
          <h1>No Surveys created!</h1>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.createSurvey}
            text="Create Survey"
          />
        </div>
      );
    }

    return (
      <div className="container">
        <Card>
          <CardHeader title="Surveys" />
          <CardContent>
            {
              this.state.loading ? <BarLoader /> :
              <React.Fragment>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.createSurvey}
                  text="Create Survey"
                />
                <List>
                  {map(surveyIds, (id, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => this.onSurveyClick(id)}
                    >
                      <ListItemIcon>
                        <InboxIcon />
                      </ListItemIcon>
                      <ListItemText primary={id} />
                    </ListItem>
                  ))}
                </List>
              </React.Fragment>
            }
          </CardContent>
        </Card>
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

export default connect(
  mapStateToProps,
  {
    setContractInstance,
    getSurveys,
    createSurvey,
  },
)(withRouter(notifier(Surveys)));
