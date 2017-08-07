import React from 'react';
import styles from './styles';

function NoContent() {
  return (
    <div className={styles.root}>
      <p className={styles.text}>
        您还没有写任何文章哦，点击下方按钮开始你的博客之旅吧~O(∩_∩)O哈哈~
      </p>
    </div>
  );
}

export default NoContent;
