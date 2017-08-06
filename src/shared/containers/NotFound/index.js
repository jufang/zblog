import React from 'react';
import styles from './styles';
import mainImage from './404.jpg';

const NotFound = () => (
  <section className={styles.root}>
    <img
      className={styles.image}
      src={mainImage}
      alt=""
    />
    <h1 className={styles.title}>对不起，页面不存在</h1>
    <p className={styles.text}>你可能访问一个错误的地址，或者此页面已经不存在→<a className={styles.link} href="/">首页</a>
    </p>
  </section>
);


export default NotFound;
