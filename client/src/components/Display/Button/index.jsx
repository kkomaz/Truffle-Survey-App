import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { omit } from 'lodash-es';
import { dangerColor, whiteColor } from 'components/Colors';

export const ButtonUI = (props) => {
  const buttonProps = omit(props, 'danger');

  if (props.danger && !props.contained) {
    return (
      <Button
        {...buttonProps}
        style={{ ...props.style.danger, ...props.style.general }}
      >
        {props.text}
      </Button>
    );
  }

  if (!props.contained) {
    return (
      <Button
        {...buttonProps}
        style={props.style.general}
      >
        {props.text}
      </Button>
    );
  }

  if (props.danger) {
    return (
      <Button
        {...buttonProps}
        variant="contained"
        style={{ ...props.style.danger, ...props.style.general }}
      >
        {props.text}
      </Button>
    );
  }

  return (
    <Button
      {...buttonProps}
      variant="contained"
      style={props.style.general}
    >
      {props.text}
    </Button>
  );
};

ButtonUI.propTypes = {
  classes: PropTypes.object,
  danger: PropTypes.bool,
  text: PropTypes.string.isRequired,
  contained: PropTypes.bool,
  style: PropTypes.object,
};

ButtonUI.defaultProps = {
  classes: {},
  danger: false,
  contained: true,
  style: {
    danger: {
      background: dangerColor,
      color: whiteColor,
    },
    general: {
      margin: '5px',
    },
  },
};

export default ButtonUI;
