import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Field } from 'redux-form';
import TextField from '../../components/Forms/TextField';

class SurveyQuestions extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
  }

  componentDidMount = () => {
    this.props.fields.push();
  }

  render() {
    const { fields } = this.props;

    return (
      <div className="survey-questions">
        <div className="survey-questions__buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={() => fields.push()}
          >
            Add Question
          </Button>
        </div>
        <ul className="survey-questions__list">
          {
            fields.map((question, index) => (
              <li
                className="survey-questions__item"
                key={index}
              >
                <Field
                  className="survey-questions__question-input"
                  name={question}
                  type="text"
                  component={TextField}
                  label={`Question #${index + 1}`}
                  hideLabel
                  row={2}
                  rowsMax={4}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => fields.remove(index)}
                >
                  Remove Question
                </Button>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default SurveyQuestions;
