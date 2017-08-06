import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import LabelOutline from 'material-ui/svg-icons/action/label-outline';
import inlineStyles from 'shared/styles/MaterialUI/index';
import styles from './styles';

const propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  path: PropTypes.string.isRequired,
};

function TagList({ tags, path }) {
  return (
    <div className={styles.root} >
      <LabelOutline color={inlineStyles.tagColor} style={inlineStyles.tagIcon} />
      {tags.map((tag) => {
        return (
          <Link key={tag.id} to={`${path}?tag-id=${tag.id}`} className={styles.item}>
            <span className={styles.name}>{tag.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

TagList.propTypes = propTypes;

export default TagList;
