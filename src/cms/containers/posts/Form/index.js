import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { fetchEditPost, fetchNewPost, savePost } from 'cms/actions/posts';
import { createItem, updateItem, deleteItem, moveItem } from 'cms/actions/items';
import { createTag, deleteTag } from 'cms/actions/tags';
import EditBox from 'cms/components/posts/forms/Item/Form/EditBox/index';
import TextField from 'material-ui/TextField';
import DatePicker from 'cms/components/shared/CustomDatePicker/index';
import Item from 'cms/components/posts/forms/Item/index';
import TagField from 'cms/components/shared/TagField/index';
import ErrorMessage from 'cms/components/shared/ErrorMessage/index';
import inlineStyles from 'shared/styles/MaterialUI/index';
import styles from './styles';
import {deleteUnusedProps} from 'cms/utilities'

const propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      targetType: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      caption: PropTypes.string
    }).isRequired
  ).isRequired,
  params: PropTypes.object,
  fetchEditPost: PropTypes.func.isRequired,
  fetchNewPost: PropTypes.func.isRequired,
  savePost: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  moveItem: PropTypes.func.isRequired,
  createTag: PropTypes.func.isRequired,
  deleteTag: PropTypes.func.isRequired,
  finishLoading: PropTypes.func.isRequired
};


function mapStateToProps(state) {
  return {
    initialValues: state.posts.postForm,
    items: state.posts.items,
    tags: state.posts.tags,
    tagSuggestions: state.posts.tagSuggestions,
    errorMessage: state.posts.errorMessage
  }
}


const fields = [
  'id', 'title', 'publishedAt', 'leadSentence'
];

function validate(values) {
  const errors = {};
  if (!values.title) {
    errors.title = '请输入文章标题'
  }

  return errors;
}

class PostForm extends Component {

  constructor(props) {
    super(props);

    this.handleSubmit  = this.handleSubmit.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleUpdateItem = this.handleUpdateItem.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleMoveItem = this.handleMoveItem.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
  }
  componentDidMount() {
    if (this.props.params.id) {
      this.props.fetchEditPost(this.props.params.id)
        .then(() => this.props.finishLoading());
    } else {
      this.props.fetchNewPost()
        .then(() => this.props.finishLoading());
    }
  }


  handleSubmit(props) {
    this.props.savePost(
      { 
        post: { 
          ...props, 
          itemsAttributes: this.props.items, 
          taggingsAttributes: this.props.tags
        }
      }
    );
  }

  handleAddItem(targetType) {
    this.props.createItem(targetType);
  }

  handleUpdateItem(sortRank, item) {
    if(!item.id){
      item.id = new Date() -0
    }
    this.props.updateItem(sortRank, item);
  }

  handleDeleteItem(sortRank) {
    this.props.deleteItem(sortRank);
  }

  handleMoveItem(sortRank, type) {
    this.props.moveItem(sortRank, type)
  }

  handleAddTag(tag) {
    this.props.createTag(tag);
  }

  handleDeleteTag(sortRank) {
    this.props.deleteTag(sortRank);
  }


  renderItems() {
    return (
      <section className={styles.itemBlock}>
        <ul className={styles.list}>
          {this.props.items.map((item, index) => {
            var id = item.id || index;
            return (
              <Item
                key={id} 
                sortRank={index}
                item={item}
                totalCount={this.props.items.length-1}
                handleUpdateItem={this.handleUpdateItem}
                handleDeleteItem={this.handleDeleteItem}
                handleMoveItem={this.handleMoveItem}
              />
            );
          })}
        </ul>
      </section>
    );
  }

  renderErrorMessage() {
    if(this.props.errorMessage) {
      return <ErrorMessage message={this.props.errorMessage} />
    }
  }
  
  render() {
    const submitLabel = this.props.params.id ? '更新' : '创建';
    const { handleSubmit, submitting, fields: { title, publishedAt, leadSentence } } = this.props;
    if(publishedAt.value==""){publishedAt.value=null}
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)} >
        <h2 className={styles.heading}>{`${submitLabel} 写文章`}</h2>
        <TextField
          {...deleteUnusedProps(title,0)}
          floatingLabelText="文章标题"
          hintText="请输入文章标题"
          fullWidth={true}
          errorText={title.touched && title.error ? title.error : ''}
          style={inlineStyles.textField}
        />
        <TextField
          {...deleteUnusedProps(leadSentence,0)}
          floatingLabelText="简介"
          hintText="请输入简单的介绍"
          fullWidth={true}
          style={inlineStyles.textField}
        />
        <div className={styles.dateField} >
          <label className={styles.label}>发布日期</label>
          <DatePicker
            className={styles.datapicker}
            container="inline"
            autoOk={true}
            placeholder="发布日期"
            errorText={publishedAt.touched && publishedAt.error ? publishedAt.error : ''}
            {...deleteUnusedProps(publishedAt,1)}
          />
        </div>
        <TagField
          tags={this.props.tags}
          suggestions={this.props.tagSuggestions}
          handleAddTag={this.handleAddTag}
          handleDeleteTag={this.handleDeleteTag}
        />
        {this.renderItems()}
        <EditBox handleAddItem={this.handleAddItem} />
        {this.renderErrorMessage()}
        <button type="submit"
                disabled={submitting}
                className={styles.button}
        >
          {submitLabel}
        </button>
      </form>
    );
  }
}


PostForm.propTypes = propTypes;


export default reduxForm({
  form: 'PostForm',
  fields,
  validate
}, mapStateToProps, {
  fetchEditPost,
  fetchNewPost,
  savePost,
  createItem,
  deleteItem,
  updateItem,
  moveItem,
  createTag,
  deleteTag
})(PostForm);