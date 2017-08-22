import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding
} from 'draft-js';
import {
  getKeyBinding,
  hasSelectionInBlock,
  handleKeyCommand,
  handleReturn,
  handleTab
} from "draft-js-code"
import { getBlockStyle } from './../shared/utilities';
import { decorator } from '../shared/Decorator/index';
import { BlockStyleControls } from '../shared/BlockStyleControl/index';
import { InlineStyleControls } from '../shared/InlineStyleControl/index';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import inlineStyles from 'shared/styles/MaterialUI/index';
import styles from '../shared/styles';


const propTypes = {
  value: PropTypes.string,
  handleUpdate: PropTypes.func.isRequired,
};

class TextEditor extends Component {
  constructor(props) {
    super(props);

    if (props.value) {
      const blocks = convertFromRaw(JSON.parse(props.value));
      this.state = {
        editorState: EditorState.createWithContent(blocks, decorator),
        inputtable: false,
        urlValue: '',
      };
    } else {
      this.state = {
        editorState: EditorState.createEmpty(decorator),
        inputtable: false,
        urlValue: '',
      };
    }

    this.handleFocus = () => this.refs.editor.focus();
    this.handleToggleInlineStyle = this.handleToggleInlineStyle.bind(this);
    this.handleToggleBlockType = this.handleToggleBlockType.bind(this);
    this.handleChange = (editorState) => this.setState({ editorState });
    this.handleChangeURL = (e) => this.setState({ urlValue: e.target.value });
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.keyBindingFn = (e) => this._keyBindingFn(e);
    this.onTab = (e) => this._onTab(e);
    this.onReturn = (e) => this._onReturn(e);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handlePromptForLink = this.handlePromptForLink.bind(this);
    this.handleConfirmLink = this.handleConfirmLink.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.value && nextProps.value) {
      const blocks = convertFromRaw(JSON.parse(nextProps.value));
      this.setState({ editorState: EditorState.createWithContent(blocks, decorator) });
    } else if (!nextProps.value) {
      this.state = { editorState: EditorState.createEmpty(decorator) };
    }
  }
  _handleKeyCommand(command) {
    const {editorState} = this.state;
    let newState;

    if (hasSelectionInBlock(editorState)) {
        newState = handleKeyCommand(editorState, command);
    }

    if (!newState) {
        newState = RichUtils.handleKeyCommand(editorState, command);
    }

    if (newState) {
        this.handleChange(newState);
        return true;
    }
    return false;
  }
   _keyBindingFn(e) {
    let editorState = this.state.editorState;
    let command;

    if (hasSelectionInBlock(editorState)) {
        command = getKeyBinding(e);
    }
    if (command) {
        return command;
    }

    return getDefaultKeyBinding(e);
  }
   _onTab(e) {
    let editorState = this.state.editorState;

    if (!hasSelectionInBlock(editorState)) {
        return;
    }

    this.handleChange(
        handleTab(e, editorState)
    )
  }

  _onReturn(e) {
    let editorState = this.state.editorState;

    if (!hasSelectionInBlock(editorState)) {
        return;
    }

    this.handleChange(
        handleReturn(e, editorState)
    )
    return true;
  }

  handlePromptForLink(e) {
    e.preventDefault();
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        inputtable: true,
        urlValue: '',
      }, () => {
        setTimeout(() => this.refs.url.focus(), 0);
      });
    }
  }

  handleConfirmLink(e) {
    e.preventDefault();
    const { editorState, urlValue } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    this.setState({
      editorState: RichUtils.toggleLink(
        editorState,
        editorState.getSelection(),
        entityKey
      ),
      inputtable: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0);
    });
  }

  handleInputKeyDown(e) {
    if (e.which === 13) {
      this.handleConfirmLink(e);
    }
  }

  handleRemoveLink(e) {
    e.preventDefault();
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  }

  handleUpdate() {
    const description = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    this.props.handleUpdate(description);
  }

  handleToggleBlockType(blockType) {
    this.handleChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }


  handleToggleInlineStyle(inlineStyle) {
    this.handleChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }
  renderURLField() {
    if (this.state.inputtable) {
      return (
        <div className={styles.urlInputBox}>
          <TextField
            onChange={this.handleChangeURL}
            ref="url"
            hintText="请输入链接地址"
            style={inlineStyles.urlInput}
            value={this.state.urlValue}
            onKeyDown={this.handleInputKeyDown}
          />
          <IconButton onMouseDown={this.handleConfirmLink}>
            <ContentAddCircle />
          </IconButton>
        </div>
      );
    }
  }

  render() {
    const { editorState } = this.state;

    return (
      <div className={styles.root} onBlur={this.handleUpdate} >
        <div className={styles.controls}>
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.handleToggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.handleToggleInlineStyle}
            onRemoveLink={this.handleRemoveLink}
            onPromptForLink={this.handlePromptForLink}
          />
          {this.renderURLField()}
          <Divider />
        </div>
        <div className={styles.editor} onClick={this.handleFocus}>
          <Editor
            onChange={this.handleChange}
            blockStyleFn={getBlockStyle}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            spellCheck={true}
            handleReturn={this.onReturn}
            onTab={this.onTab}
            keyBindingFn={this.keyBindingFn}
            placeholder="写点东西吧 O(∩_∩)O~"
            ref="editor"
          />
        </div>
      </div>
    );
  }
}

TextEditor.propTypes = propTypes;

export default TextEditor;
