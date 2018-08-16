import { map } from 'lodash-es';

const createQuestionData = (yesArray, noArray, name) => (
  map(yesArray, (yes, index) => (
    {
      [name]: `Q${index + 1}`,
      yes,
      no: noArray[index],
    }
  ))
);

export default createQuestionData;
