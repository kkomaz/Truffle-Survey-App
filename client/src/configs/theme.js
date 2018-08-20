import { createMuiTheme } from '@material-ui/core/styles';
import { primaryColor, secondaryColor } from 'components/Colors';

const generateTheme = () => (
  createMuiTheme({
    palette: {
      primary: {
        main: primaryColor,
        contrastText: 'white',
      },

      secondary: {
        main: secondaryColor,
        contrastText: 'white',
      },
    },
  })
);

export default generateTheme;
