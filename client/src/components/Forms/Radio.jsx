import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';

const renderRadioField = (props) => {
  const { input, type, meta: { touched, error }, className } = props;

  return (
    <React.Fragment>
      <Radio
        className={className}
        {...input}
        id={input.label}
        type={type}
      />
      {touched && error && <span className="danger">{error}</span>}
    </React.Fragment>
  );
};

renderRadioField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  className: PropTypes.string,
};

renderRadioField.defaultProps = {
  className: 'al-radio',
};

export default renderRadioField;
