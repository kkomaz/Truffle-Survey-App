import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Button } from 'components';
import TextField from 'components/Forms/TextField';

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
            text="Add Question"
            color="primary"
            onClick={() => fields.push()}
            disabled={fields.length === 4}
          />
        </div>
        <ul className="survey-questions__list">
          {
            fields.map((question, index) => (
              <li
                className="survey-questions__item mb-one"
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
                  text="Remove Question"
                  danger
                  onClick={() => fields.remove(index)}
                />
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default SurveyQuestions;
