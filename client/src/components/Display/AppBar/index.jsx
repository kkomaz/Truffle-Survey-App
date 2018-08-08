import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function SimpleAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root} style={{ marginBottom: '20px' }}>
      <AppBar position="static">
        <Toolbar>
          {props.children}
        </Toolbar>
      </AppBar>
    </div>
  );
}

SimpleAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
};

export default withStyles(styles)(SimpleAppBar);
