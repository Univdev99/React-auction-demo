import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Editor, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'

import BlockStyleControls from './BlockStyleControls'
import InlineStyleControls from './InlineStyleControls'


const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
}

class RichTextEditor extends PureComponent {

  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  }

  focus = () => this.editor.focus()

  getBlockStyle = (block) => {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote'
      default: return null
    }
  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.props.onChange(newState)
      return true
    }
    return false
  }

  _onTab(e) {
    const maxDepth = 4
    this.props.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
  }

  toggleBlockType = (blockType) => {
    this.props.onChange(
      RichUtils.toggleBlockType(
        this.props.value,
        blockType
      )
    )
  }

  toggleInlineStyle = (inlineStyle) => {
    this.props.onChange(
      RichUtils.toggleInlineStyle(
        this.props.value,
        inlineStyle
      )
    )
  }

  render() {
    const { value, onChange, placeholder } = this.props

    let className = 'RichEditor-editor'
    const contentState = value.getCurrentContent()
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder'
      }
    }

    return (
      <div className="form-control">
        <BlockStyleControls
          editorState={value}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={value}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            editorState={value}
            onChange={onChange}
            placeholder={placeholder}
            blockStyleFn={this.getBlockStyle}
            customStyleMap={styleMap}
            handleKeyCommand={this.handleKeyCommand}
            onTab={this.onTab}
            ref={(ref) => this.editor = ref}
            spellCheck={true}
            style={{ minHeight: 300 }}
          />
        </div>
      </div>
    )
  }
}

export default RichTextEditor
