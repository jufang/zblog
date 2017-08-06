import React from 'react';
import PropTypes from 'prop-types';
import Item from './tagsItemIndex';
import styles from './tagsIndex.css';

const propTypes = {
  adminPath: PropTypes.string,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

function Tags({ tags, adminPath }) {
  return (
    <section className={styles.root}>
      {tags.map((tag) => {
        return (
          <Item
            key={tag.id}
            adminPath={adminPath}
            {...tag}
          />
        );
      })}
    </section>
  );
}

Tags.propTypes = propTypes;
export default Tags;
