import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash-es';
import { List, ListItem, ListItemText } from 'components';

const SimpleList = (props) => {
  const { items } = props;

  return (
    <List className="">
      {
        map(items, (i, index) => {
          return (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${i}`} />
            </ListItem>
          );
        })
      }
    </List>
  );
};

SimpleList.propTypes = {
  items: PropTypes.array.isRequired,
};

export default SimpleList;
