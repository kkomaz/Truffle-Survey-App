import React from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

const renderSwitch = (props) => {
  const { input, type, meta: { touched, error }, className } = props;

  return (
    <React.Fragment>
      <Switch
        className={className}
        {...input}
        id={input.label}
        type={type}
      />
      {touched && error && <span className="danger">{error}</span>}
    </React.Fragment>
  );
};

renderSwitch.propTypes = {
  input: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  className: PropTypes.string,
};

renderSwitch.defaultProps = {
  className: 'al-switch',
};

export default renderSwitch;
