import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, BarLoader } from 'components';

const cardLoader = ({ title }) => (
  <Card>
    <CardHeader title={title} />
    <CardContent>
      <BarLoader />
    </CardContent>
  </Card>
);

cardLoader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default cardLoader;
