import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Immutable from 'immutable'
import RichTextEditor from 'react-rte'

import PostForm from 'components/PostForm'
import SectionTitle from 'components/SectionTitle'
import { formSubmit } from 'utils/form'
import Spinner from 'components/Spinner'
import {
  getPostDetail,
  updatePost,
} from 'store/modules/admin/blog'
import { adminBlogSelector } from 'store/selectors'


class AdminPostDetail extends PureComponent {

  static propTypes = {
    adminBlog: ImmutablePropTypes.map.isRequired,
    getPostDetail: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    loadingStatus: 1,
  }

  handleSubmit = (data) => {
    const { updatePost, history, match } = this.props
    const _data = data.set('content', data.get('content').toString('html')).toJS()

    const formData = new FormData()
    for (const key in _data) {
      let value = _data[key]
      if (value && value.constructor === Array) {
        value = value.join(',')
      }
      formData.append(key, value)
    }

    return formSubmit(updatePost, {
      id: match.params.id,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
      success: ({ data }) => {
        history.push({
          pathname: '/admin/posts'
        })
      }
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/posts'
  })

  componentWillMount() {
    this.setState({
      loadingStatus: 1
    })

    this.props.getPostDetail({
      id: this.props.match.params.id,
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  render() {
    const { adminBlog } = this.props
    const postDetail = adminBlog.get('postDetail')
    const { loadingStatus } = this.state

    if (loadingStatus === -1) {
      return (
        <div>
          <SectionTitle>Post not found</SectionTitle>
        </div>
      )
    }

    let _postDetail = null
    if (postDetail) {
      _postDetail = postDetail.delete('pk')
      _postDetail = _postDetail.set(
        'content',
        RichTextEditor.createValueFromString(_postDetail.get('content'), 'html')
      )
    } else {
      _postDetail = Immutable.Map({
        content: RichTextEditor.createEmptyValue()
      })
    }

    const featuredImage = _postDetail.get('featured_image', null)
    _postDetail = _postDetail.delete('featured_image')

    return (
      <div>
        <div>
          <SectionTitle className="mb-5">Edit Post</SectionTitle>

          {(loadingStatus === 1 || !postDetail) && <Spinner />}

          {loadingStatus === 10 && postDetail &&
            <PostForm
              initialValues={_postDetail}
              renderMediaDropzone={this.renderMediaDropzone}
              onSubmit={this.handleSubmit}
              onBack={this.handleBack}
              featuredImage={featuredImage}
            />
          }
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminBlog: adminBlogSelector,
})

const actions = {
  getPostDetail,
  updatePost,
}

export default compose(
  connect(selector, actions)
)(AdminPostDetail)
