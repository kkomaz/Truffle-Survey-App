import React from 'react';
import PropTypes from 'prop-types';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    background: '#60c5ba',
    height: 50,
    padding: '0 30px',
  },
  title: {
    color: 'white',
  },
};

const CardHeaderUI = (props) => {
  return (
    <CardHeader
      classes={{ ...props.classes }}
      {...props}
    />
  );
};

CardHeaderUI.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardHeaderUI);
