import { EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'


export function convertHTMLToEditorState(html) {
  if (!html) {
    return EditorState.createEmpty()
  }

  return EditorState.createWithContent(stateFromHTML(html))
}

export function convertEditorStateToHTML(editorState) {
  return stateToHTML(editorState.getCurrentContent())
}
