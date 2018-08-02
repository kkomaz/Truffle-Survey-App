import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/Inbox';
import SurveyListButtons from './SurveyListButtons';

class SurveyList extends Component {
  render() {
    const { id } = this.props;

    return (
      <React.Fragment>
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText
            primary={<SurveyListButtons id={id} />}
          />
        </ListItem>
      </React.Fragment>
    );
  }
}

SurveyList.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SurveyList;
