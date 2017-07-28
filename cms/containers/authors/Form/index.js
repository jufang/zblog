import React, { Component, PropTypes } from 'react';
import { fetchAuthor, updateAuthor } from 'cms/actions/authors';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import DropzoneImage from 'cms/components/shared/DropzoneImage/index';
import TextField from 'material-ui/TextField';
import TextEditor from 'shared/components/textEditors/Editor/index'
import ErrorMessage from 'cms/components/shared/ErrorMessage/index';
import inlineStyles from 'shared/styles/MaterialUI/index';
import styles from './styles';


const propTypes = {
  fields: PropTypes.object.isRequired,
  params: PropTypes.object,
  fetchAuthor: PropTypes.func.isRequired,
  updateAuthor: PropTypes.func.isRequired,
  finishLoading: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    initialValues: state.authors.author,
    errorMessage: state.authors.errorMessage
  }
}


const fields = [
  "id", "name", "image", "description", "introduction"
];

function validate(values) {
  const errors = {};
  if(!values.name) {
    errors.name = "请输入名字"
  }

  return errors;
}

class AuthorForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit               = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchAuthor()
      .then(() => this.props.finishLoading())
  }

  handleSubmit(props) {
    this.props.updateAuthor(
      {
        author: {
          ...props
        }
      }
    );
  }

  renderErrorMessage() {
    if(this.props.errorMessage) {
      return <ErrorMessage message={this.props.errorMessage} />
    }
  }

  render() {
    const { handleSubmit, submitting, fields: { name, image, description, introduction } } = this.props;
    
    return (
      <form className={styles.root} onSubmit={handleSubmit(this.handleSubmit)}>
        <h2 className={styles.heading}>关于我</h2>
        <TextField
          {...name}
          floatingLabelText="昵称"
          hintText="请输入您的昵称"
          fullWidth={true}
          style={inlineStyles.textField}
          errorText={name.touched && name.error ? name.error : ''}
        />
        <div className={styles.formGroup}>
          <label className={styles.label}>简单介绍一下自己吧</label>
          <TextEditor
            key="description"
            {...description}
            handleUpdate={ (value) => { description.onChange(value) }}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>具体介绍</label>
          <TextEditor
            key="introduction"
            {...introduction}
            handleUpdate={ (value) => { introduction.onChange(value) }}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>个人图像</label>
          <DropzoneImage
            {...image}
            handleUpdate={ (file) => image.onChange(file) }
          />
        </div>
        {this.renderErrorMessage()}
        <button type="submit"
                disabled={submitting}
                className={styles.button}
        >
          更新
        </button>
      </form>

    );
  }
}

AuthorForm.propTypes = propTypes;

export default reduxForm({
  form: "AuthorForm",
  fields,
  validate
}, mapStateToProps, {
  fetchAuthor,
  updateAuthor,
})(AuthorForm);