import React, { Component } from 'react';
import { Link } from 'react-router';
import config from 'shared/config';
import styles from './styles';

function NavigationBar() {
  return (
    <div className={styles.appBar}>
      <h1 className={styles.logo}>
        <Link to="/">{config.authorName}</Link>
      </h1>
      <div className={styles.menu}>
          <Link to="/about" >个人信息</Link>
          <Link to="/posts" >文章</Link>
      </div>
    </div>
  );
}
export default NavigationBar;
