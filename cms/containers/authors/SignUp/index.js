import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { signUp } from 'cms/actions/auths';
import TextField from 'material-ui/TextField';
import ErrorMessage from 'cms/components/shared/ErrorMessage/index';
import inlineStyles from 'shared/styles/MaterialUI/index';
import styles from './styles.css';


const propTypes = {
  fields: PropTypes.object.isRequired,
  signUp: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string
};

function mapStateToProps(state) {
  return {
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    },
    authenticated: state.auth.authenticated,
    errorMessage: state.auth.errorMessage
  }
}

const fields = [
  'name', 'email', 'password', 'passwordConfirmation'
];

function validate(values) {
  const errors = {};

  if (!values.name) {
    errors.name = '请输入您的名字'
  }

  if(!values.password || values.password.length < 6) {
    errors.password = '密码至少6个字符'
  }

  if(values.passwordConfirmation !== values.password) {
    errors.passwordConfirmation = '密码不一致'
  }

  if(!values.email) {
    errors.email = '请输入您的邮箱'
  }

  return errors;
}


class AuthorSignUp extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if(this.props.authenticated) {
      this.context.router.push('/cms')
    }
  }

  handleSubmit(props) {
    this.props.signUp({ author: props })
  }

  renderError() {
    if (this.props.errorMessage) {
      return <span className={styles.error}>{this.props.errorMessage}</span>
    }
  }

  renderErrorMessage() {
    if(this.props.errorMessage) {
      return <ErrorMessage message={this.props.errorMessage} />
    }
  }

  render() {
    const { handleSubmit, submitting, fields: { name, password, passwordConfirmation, email } }  = this.props;
    return(
      <form onSubmit={handleSubmit(this.handleSubmit)} className={styles.root}>
        <h2 className={styles.heading}>注册</h2>
        <TextField
          {...name}
          hintText="请输入您的名字"
          fullWidth={true}
          errorText={name.touched && name.error ? name.error : ''}
          style={inlineStyles.textField}
        />
        <TextField
          {...email}
          hintText="请输入您的邮箱"
          type="email"
          fullWidth={true}
          errorText={email.touched && email.error ? email.error : ''}
          style={inlineStyles.textField}
        />
        <TextField
          {...password}
          hintText="请输入密码"
          type="password"
          fullWidth={true}
          errorText={password.touched && password.error ? password.error : ''}
          style={inlineStyles.textField}
        />
        <TextField
          {...passwordConfirmation}
          hintText="请输入确认密码"
          type="password"
          fullWidth={true}
          errorText={passwordConfirmation.touched && passwordConfirmation.error ? passwordConfirmation.error : ''}
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
}

AuthorSignUp.propTypes = propTypes;

export default reduxForm({
  form: 'SignUp',
  fields,
  validate
}, mapStateToProps, { signUp })(AuthorSignUp);
