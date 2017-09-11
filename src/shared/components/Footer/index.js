import React from 'react';
import config from 'shared/config';
import icon from './gitHubIcon.png';
import styles from './styles';


export default function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.text}>
        <span>{`京ICP备17052038号-1 © 2017 ${config.authorName}`}</span>
        <a href={config.gitHubUrl}>
          <img
            className={styles.gitHubIcon}
            src={icon}
            role="presentation"
          />
        </a>
      </div>
    </footer>
  );
}
