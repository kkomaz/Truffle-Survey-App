import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components';

const submissionButtons = (props) => {
  const { reset, pristine, submitting, onCancelClick, className } = props;

  return (
    <div className={`submission-buttons ${className}`}>
      <Button
        className="mr-half"
        text="Reset"
        danger
        type="button"
        disabled={pristine || submitting}
        onClick={reset}
      />
      <Button
        className="mr-half"
        text="Cancel"
        type="button"
        disabled={pristine || submitting}
        onClick={onCancelClick}
      />
      <Button
        className="mr-half"
        text="Submit"
        color="primary"
        type="submit"
        disabled={submitting}
      />
    </div>
  );
};

submissionButtons.propTypes = {
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

submissionButtons.defaultProps = {
  className: '',
};

export default submissionButtons;
