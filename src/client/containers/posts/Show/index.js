import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { fetchPost, resetPost } from 'client/actions/posts';
import Tags from 'client/components/posts/shows/tagsIndex';
import Item from 'client/components/posts/shows/itemIndex';
import shallowCompare from 'react-addons-shallow-compare';
import Pagination from 'client/components/posts/shows/pageIndex';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import inlineStyles from 'shared/styles/MaterialUI/index';

import styles from './styles';

const propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    publishedAt: PropTypes.string,
    prevId: PropTypes.string,
    prevTitle: PropTypes.string,
    nextId: PropTypes.string,
    nextTitle: PropTypes.string,
  }).isRequired,
  params: PropTypes.shape({
    id: PropTypes.string,
  }),

  location: PropTypes.object,

  fetchPost: PropTypes.func.isRequired,
  finishLoading: PropTypes.func.isRequired,
  resetPost: PropTypes.func.isRequired,
};

const cmsRegexp = /^(\/cms)*/;


function mapStateToProps(state) {
  return {
    post: state.posts.post
  };
}

class PostShow extends Component {

  componentWillMount() {
    this.props.resetPost();
  }

  componentDidMount() {
    this.props.fetchPost(`${this.props.params.id}${this.previewQuery}`)
      .then(() => this.props.finishLoading());
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.props.resetPost();
      nextProps.fetchPost(`${nextProps.params.id}${this.previewQuery}`);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  get adminPath() {
    const paths = this.props.location.pathname.match(cmsRegexp);
    return paths[0] ? paths[0] : '';
  }

  get previewQuery() {
    return this.adminPath ? '?previewing=true' : '';
  }

  renderPagination() {
    if (this.props.post.prevId || this.props.post.nextId) {
      return (
        <Pagination
          adminPath={this.adminPath}
          prevId={this.props.post.prevId}
          prevTitle={this.props.post.prevTitle}
          nextId={this.props.post.nextId}
          nextTitle={this.props.post.nextTitle}/>
      );
    }
  }

  render() {
    if (!this.props.post || !this.props.post.title) {
      return <section />;
    }
    return (
      <section>
        <Helmet
          title={this.props.post.title}
          meta={[{ property: 'og:title', content: `${this.props.post.title}` }]}
        />
        <div className={styles.heading}>
          <h1 className={styles.title}>{this.props.post.title} </h1>
          <div className={styles.dateTime}>
            <ActionSchedule color={inlineStyles.iconColor} style={inlineStyles.dateTimeLogo} />
            <span className={styles.time}>{this.props.post.publishedAt}</span>
          </div>
        </div>
        {this.props.post.items.map((item) => {
          return <Item key={item.id} item={item} />;
        })}
        <Tags adminPath={this.adminPath} tags={this.props.post.tags} />
        {this.renderPagination()}
      </section>
    );
  }
}

PostShow.propTypes = propTypes;

export default connect(mapStateToProps, { fetchPost, resetPost })(PostShow);
