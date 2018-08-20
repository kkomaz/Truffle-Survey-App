const headlinerFilter = (type) => {
  switch (type) {
    case 'danger': {
      return 'Error!';
    }
    case 'warning': {
      return 'Warning!';
    }
    case 'info': {
      return '';
    }
    default: {
      return 'Success!';
    }
  }
};

export default headlinerFilter;
