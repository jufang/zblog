import React from 'react';
import PropTypes from 'prop-types';
import Item from './recentPost_index';
import { Link } from 'react-router';
import styles from './styles';

const propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      leadSentence: PropTypes.string,
    })
  ),
};

function RecentProjects({ posts }) {
  return (
    <div>
      <h3 className={styles.title}>最近发布的文章</h3>
      <ul className={styles.list} >
        {posts.map(post => {
          return <Item key={post.id} {...post} />;
        })}
      </ul>
      <Link to="/posts" className={styles.button}>
        所有的文章
      </Link>
    </div>
  );
}

RecentProjects.propTypes = propTypes;

export default RecentProjects;
