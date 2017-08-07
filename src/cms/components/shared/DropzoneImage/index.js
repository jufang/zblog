import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import styles from './styles';

const propTypes = {
  value: PropTypes.string,
  handleUpdate: PropTypes.func.isRequired,
};

class DropzoneImage extends Component {

  constructor(props) {
    super(props);

    this.state = { errorMessage: '' };
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleDrop(files) {
    const file = files[0];

    if (!(/.*image\/(gift|jpg|jpeg|png)$/i).test(file.type)) {
      return this.setState({ errorMessage: '只支持gif,jpg，jpeg,png的图片格式' });
    }

    const self = this;
    const reader = new FileReader();

    reader.onload = (upload) => {
      self.props.handleUpdate(upload.target.result);
      self.setState({ errorMessage: '' });
    };

    reader.onerror = () => {
      self.setState({ errorMessage: '上传图片失败' });
    };

    reader.readAsDataURL(file);
  }

  renderImageBox() {
    if (this.props.value) {
      return (
        <img
          className={styles.previewImage}
          src={this.props.value}
          width="100"
          alt=""
        />
      );
    }
  }

  renderErrorMessage() {
    if (this.state.errorMessage) {
      return <span className={styles.errorMessage}>{this.state.errorMessage}</span>;
    }
  }

  renderPlaceholder() {
    if (!this.props.value) {
      return <span className={styles.placeholder}>将文件拖拽过来或者点击此处上传</span>;
    }
  }

  render() {
    return (
      <div className={styles.root}>
        <Dropzone
          name="image"
          className={styles.dropzone}
          activeClassName={styles.dropzoneActive}
          accept="image/*"
          onDrop={this.handleDrop}
        >
          {this.renderPlaceholder()}
          {this.renderImageBox()}
          {this.renderErrorMessage()}
        </Dropzone>
      </div>
    );
  }
}

DropzoneImage.propTypes = propTypes;

export default DropzoneImage;
