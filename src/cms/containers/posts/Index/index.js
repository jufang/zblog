import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPosts, togglePost } from 'cms/actions/posts';
import { Link } from 'react-router';
import Item from 'cms/components/posts/indexes/index';
import NoContent from 'shared/components/NoContent/index';
import {
  Table,
  TableHeaderColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Pagination from 'cms/components/shared/Pagination/index';
import inlineStyles from 'shared/styles/MaterialUI/index';
import styles from './styles';


const propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      publishedAt: PropTypes.string,
      status: PropTypes.number.isRequired,
      accepted: PropTypes.bool.isRequired,
    }).isRequired
  ).isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  fetchPosts: PropTypes.func.isRequired,
  togglePost: PropTypes.func.isRequired,
  finishLoading: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    posts: state.posts.posts,
    page: state.posts.page,
    limit: state.posts.limit,
    total: state.posts.total,
  };
}

class PostIndex extends Component {

  constructor(props) {
    super(props);
    this.state = { loading: true };


    this.handleToggle = this.handleToggle.bind(this);
    this.handleMovePage = this.handleMovePage.bind(this);
  }

  componentDidMount() {
    this.props.fetchPosts()
      .then(() => {
        this.props.finishLoading();
        this.setState({ loading: false });
      });
  }

  handleToggle(sortRank, postId) {
    this.props.togglePost(sortRank, postId);
  }

  handleMovePage(page) {
    this.props.fetchPosts(page);
  }

  render() {
    if (this.state.loading) {
      return <section />;
    }

    const newButton = (
      <Link to="/cms/posts/new">
        <FloatingActionButton style={inlineStyles.floatButton} disableTouchRipple>
          <ContentAdd />
        </FloatingActionButton>
      </Link>
    );

    if (!this.props.posts.length) {
      return (
        <section>
          {newButton}
          <NoContent />
        </section>
      );
    }

    return (
      <section>
       {newButton}
        <h1 className={styles.title}>Post</h1>
        <Table fixedHeader fixedFooter>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow selectable={false}>
              <TableHeaderColumn colSpan="1" style={inlineStyles.headerColumn}>
                ID
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="4" style={inlineStyles.headerColumn}>
                标题
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="1" style={inlineStyles.headerColumn}>
                发布状态
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="2" style={inlineStyles.headerColumn}>
                发布日期
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                操作
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.posts.map((post, index) => (
              <Item
                {...post}
                key={post.id}
                sortRank={index}
                handleToggle={this.handleToggle}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn>
                <Pagination
                  page={this.props.page}
                  total={this.props.total}
                  limit={this.props.limit}
                  handlePageClick={this.handleMovePage}
                />
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    );
  }
}

PostIndex.propTypes = propTypes;

export default connect(mapStateToProps, { fetchPosts, togglePost })(PostIndex);
