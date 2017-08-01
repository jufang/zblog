import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { fetchHome } from 'client/actions/homes';
import { connect } from 'react-redux';
import TextDisplay from 'shared/components/textEditors/Display/index';
import RecentPosts from 'client/components/homes/shows/RecentPosts/index';
import shallowCompare from 'react-addons-shallow-compare';
import mainImage from './home.jpg';
import styles from './styles';

const propTypes = {
  home: PropTypes.shape({
    introduction: PropTypes.string,
    latestPosts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      leadSentence: PropTypes.string,
    })),
  }).isRequired,

  fetchHome: PropTypes.func.isRequired,
  finishLoading: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return { home: state.home };
}

class HomeShow extends Component {

  componentDidMount() {
    this.props.fetchHome()
      .then(() => this.props.finishLoading());
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  renderRecentPosts() {
    if (this.props.home.latestPosts) {
      return (<RecentPosts posts={this.props.home.latestPosts} />);
    }
  }

  render() {
    if (!this.props.home.introduction) {
      return <sectioon />;
    }

    return (
      <section>
        <Helmet title="Home" />
        <img
          className={styles.image}
          src={mainImage}
          alt=""
        />
        <TextDisplay description={this.props.home.introduction} />
        <div className={styles.list} >
          {this.renderRecentPosts()}
        </div>
      </section>
    );
  }

}

HomeShow.propTypes = propTypes;

export default connect(mapStateToProps, { fetchHome })(HomeShow);
