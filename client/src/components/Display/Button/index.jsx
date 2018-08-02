import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { dangerColor, whiteColor } from 'components/Colors';

const style = {
  danger: {
    background: dangerColor,
    color: whiteColor,
  },
  general: {
    margin: '5px',
  },
};

export const ButtonUI = (props) => {
  if (props.danger) {
    return (
      <Button
        {...props}
        variant="contained"
        style={{ ...style.danger, ...style.general }}
      >
        {props.text}
      </Button>
    );
  }
  return (
    <Button
      {...props}
      variant="contained"
      style={style.general}
    >
      {props.text}
    </Button>
  );
};

ButtonUI.propTypes = {
  classes: PropTypes.object.isRequired,
  danger: PropTypes.bool,
  text: PropTypes.bool.isRequired,
};

ButtonUI.defaultProps = {
  danger: false,
};

export default ButtonUI;
