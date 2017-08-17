import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { fetchAbout } from 'client/actions/abouts';
import { connect } from 'react-redux';
import TextDisplay from 'shared/components/textEditors/Display/index';
import shallowCompare from 'react-addons-shallow-compare';
import config from 'shared/config';
import styles from './styles';

const propTypes = {
  about: PropTypes.shape({
    image: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  fetchAbout: PropTypes.func.isRequired,
  finishLoading: PropTypes.func.isRequired,
};


function mapStateToProps(state) {
  return {
    about: state.about
  };
}

class AboutShow extends Component {

  componentDidMount() {
    this.props.fetchAbout()
      .then(() => this.props.finishLoading());
  }


  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    if (!this.props.about) {
      return <seciont />;
    }

    if (this.props.about.description == null) {
      return <seciont />;
    }

    return (
      <section>
        <Helmet title="About" />
        <h1 className={styles.heading}>关于我</h1>
        <TextDisplay description={this.props.about.description} />
        <h2 className={styles.subHeading}>{config.siteName}</h2>
        <div className={styles.siteDescription}>
          <p className={styles.text}>个人的react blog，平时记录一些内容在这儿。<br/>前端：react redux material-ui draft-js...<br/>后端：koa mongodb<br/>采用阿里云服务器</p>
        </div>
      </section>
    );
  }

}

AboutShow.propTypes = propTypes;

export default connect(mapStateToProps, { fetchAbout })(AboutShow);
