import React from 'react';
import { Link } from 'react-router';
import styles from './styles';


function Item({ id, title, leadSentence }) {
  return (
    <li className={styles.root}>
      <Link to={`/posts/${id}`}>
        <p className={styles.content}>{title}</p>
        <p className={styles.leadSentence}>{leadSentence}</p>
      </Link>
    </li>
  );
}

export default Item;
