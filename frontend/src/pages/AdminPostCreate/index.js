import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable'
import RichTextEditor from 'react-rte'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import PostForm from 'components/PostForm'
import SectionTitle from 'components/SectionTitle'
import { createPost } from 'store/modules/admin/blog'
import { formSubmit } from 'utils/form'
import { POST_VISIBILITY_PUBLIC } from 'config'


class AdminPostCreate extends PureComponent {

  static propTypes = {
    createPost: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  handleSubmit = (data) => {
    const { createPost, history } = this.props
    const _data = data.set('content', data.get('content').toString('html')).toJS()

    const formData = new FormData()
    for (const key in _data) {
      let value = _data[key]
      if (value.constructor === Array) {
        value = value.join(',')
      }
      formData.append(key, value)
    }

    return formSubmit(createPost, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
      success: ({ data }) => {
        history.push({
          pathname: `/admin/posts/${data.pk}`
        })
      }
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/posts'
  })

  render() {
    const _postDetail = Immutable.Map({
      content: RichTextEditor.createEmptyValue(),
      visibility: POST_VISIBILITY_PUBLIC
    })

    return (
      <div>
        <div>
          <SectionTitle className="mb-5">Create Post</SectionTitle>

          <PostForm
            initialValues={_postDetail}
            renderMediaDropzone={e => e}
            onSubmit={this.handleSubmit}
            onBack={this.handleBack}
          />
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
})

const actions = {
  createPost,
}

export default compose(
  withRouter,
  connect(selector, actions)
)(AdminPostCreate)
