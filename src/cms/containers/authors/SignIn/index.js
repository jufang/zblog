import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { signIn } from 'cms/actions/auths';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import ErrorMessage from 'cms/components/shared/ErrorMessage/index';
import TextField from 'material-ui/TextField';
import inlineStyles from 'shared/styles/MaterialUI/index';
import styles from './styles';
import {deleteUnusedProps} from 'cms/utilities'

const propTypes = {
  fields: PropTypes.object.isRequired,
  signIn: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string
};

function mapStateToProps(state) {
  return {
    initialValues: {
      email: "",
      password: ""
    },
    authenticated: state.auth.authenticated,
    errorMessage: state.auth.errorMessage
  }
}

const fields = [
  "email", "password"
];

function validate(values) {
  const errors = {};
  if(!values.email) {
    errors.name = '请输入您的邮箱'
  }

  if (!values.password || values.password.length < 6) {
    errors.password = '密码至少6个字符'
  }

  return errors;
}

class AuthorSignIn extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if (this.props.authenticated) {
      this.context.router.push("/cms")
    }
  }

  handleSubmit(author) {
    this.props.signIn({ author });
  }

  renderErrorMessage() {
    if(this.props.errorMessage) {
      return <ErrorMessage message={this.props.errorMessage} />
    }
  }

  render() {
    const { handleSubmit, submitting, fields: { email, password } }  = this.props;
    return(
      <form onSubmit={handleSubmit(this.handleSubmit)} className={styles.root}>
        <h2 className={styles.heading}>登陆</h2>
        <TextField
          {...deleteUnusedProps(email,1)}
          type="email"
          hintText="请输入您的邮箱"
          fullWidth={true}
          errorText={email.touched && email.error ? email.error : ''}
          style={inlineStyles.textField}
        />
        <TextField
          {...deleteUnusedProps(password,0)}
          type="password"
          hintText="请输入密码"
          fullWidth={true}
          errorText={password.touched && password.error ? password.error : ''}
          style={inlineStyles.textField}
        />
        {this.renderErrorMessage()}
        <button type="submit"
                disabled={submitting}
                className={styles.button}
        >
          提交
        </button>
      </form>)
  }
};


AuthorSignIn.propTypes = propTypes;

export default reduxForm({
  form: 'SignIn',
  fields,
  validate
}, mapStateToProps, {
  signIn
})(AuthorSignIn);