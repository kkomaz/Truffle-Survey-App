import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash-es';
import { List, ListItem, ListItemText } from 'components';

const SurveyShowDisplay = (props) => {
  const { items } = props;

  return (
    <List className="">
      {
        map(items, (q, index) => {
          return (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${q}`} />
            </ListItem>
          );
        })
      }
    </List>
  );
};

SurveyShowDisplay.propTypes = {
  items: PropTypes.array.isRequired,
};

export default SurveyShowDisplay;
