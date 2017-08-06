import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';

const propTypes = {
  message: PropTypes.string.isRequired,
};

function ErrorMessage({ message }) {
  return (
    <div className={styles.root}>
      <p className={styles.text}>{message}</p>
    </div>
  );
}

ErrorMessage.propTypes = propTypes;

export default ErrorMessage;

