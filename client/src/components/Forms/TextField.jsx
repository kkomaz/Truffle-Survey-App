import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const renderTextField = (props) => {
  const { input, label, type, meta: { touched, error }, hideLabel, className } = props;

  return (
    <div className={className}>
      {
        !hideLabel &&
          <label>
            {label}
          </label>
      }
      <div>
        <TextField
          {...input}
          id={input.label}
          type={type}
          placeholder={label}
          multiline
          rows={2}
          rowsMax={4}
        />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  );
};

renderTextField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  hideLabel: PropTypes.bool,
  className: PropTypes.string,
};

renderTextField.defaultProps = {
  hideLabel: false,
  className: 'al-textfield',
};

export default renderTextField;
