import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styles from './tagsItemIndex.css';

const propTypes = {
  adminPath: PropTypes.string,
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

function Item({ adminPath, id, text }) {
  return (
    <Link to={`${adminPath}/posts?tag-id=${id}`} className={styles.root}>
      {text}
    </Link>
  );
}

Item.propTpes = propTypes;

export default Item;
