import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash-es';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const renderSelect = (props) => {
  const { input, type, meta: { touched, error }, className, options } = props;

  return (
    <React.Fragment>
      <Select
        className={className}
        {...input}
        id={input.label}
        type={type}
      >
        {
          map(options, (opt, i) => (
            <MenuItem key={i} value={opt.value}>{opt.label}</MenuItem>
          ))
        }
      </Select>
      {touched && error && <span className="danger">{error}</span>}
    </React.Fragment>
  );
};

renderSelect.propTypes = {
  input: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  className: PropTypes.string,
  options: PropTypes.array.isRequired,
};

renderSelect.defaultProps = {
  className: 'al-radio',
};

export default renderSelect;
