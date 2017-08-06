import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import inlineStyles from 'shared/styles/MaterialUI/index';
import styles from './pageIndex.css';


const propTypes = {
  prevId: PropTypes.string,
  prevTitle: PropTypes.string,
  nextId: PropTypes.string,
  nextTitle: PropTypes.string,
  adminPath: PropTypes.string,
};

class Pagination extends Component {

  renderPrev() {
    if (!this.props.prevId) { return <span className={styles.prevBox} />; }
    return (
      <Link to={`${this.props.adminPath}/posts/${this.props.prevId}`} className={styles.prevBox}>
        <NavigationChevronLeft color={inlineStyles.iconColor} style={inlineStyles.prevIcon} />
        <div className={styles.prevTitle}>{this.props.prevTitle}</div>
      </Link>
    );
  }

  renderNext() {
    if (!this.props.nextId) { return <span className={styles.nextBox} />; }
    return (
      <Link to={`${this.props.adminPath}/posts/${this.props.nextId}`} className={styles.nextBox}>
        <div className={styles.nextTitle}>{this.props.nextTitle}</div>
        <NavigationChevronRight color={inlineStyles.iconColor} style={inlineStyles.nextIcon} />
      </Link>
    );
  }

  render() {
    return (
      <section className={styles.root}>
        {this.renderPrev()}
        {this.renderNext()}
      </section>
    );
  }
}


Pagination.propTypes = propTypes;

export default Pagination;
