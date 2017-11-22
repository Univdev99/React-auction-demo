import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import PostItem from 'components/PostItem'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import Spinner from 'components/Spinner'
import { blogSelector } from 'store/selectors'
import { getPostCommentList, getPostDetail } from 'store/modules/blog'


class PostDetail extends PureComponent {

  static propTypes = {
    blog: ImmutablePropTypes.map.isRequired,
    getPostCommentList: PropTypes.func.isRequired,
    getPostDetail: PropTypes.func.isRequired
  }

  constructor(props) {
    super()

    this.state = {
      status: 0, // 0: loading, 1: loaded, -1: error
    }
  }

  breadcrumbPath() {
    const postDetail = this.props.blog.get('postDetail')

    return [
      { route: '/', text: 'Home' },
      { route: '/blog', text: 'Posts' },
      { text: postDetail ? postDetail.get('title') : '' },
    ]
  }

  getDetail = (id) => {
    const { getPostDetail, getPostCommentList } = this.props

    this.setState({
      status: 0
    })

    getPostDetail({
      id,
      success: () => this.setState({
        status: 1
      }),
      fail: () => this.setState({
        status: -1
      }),
    })

    getPostCommentList({ id })
  }

  componentWillMount() {
    this.getDetail(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.getDetail(nextProps.match.params.id)
    }
  }

  render() {
    const { blog } = this.props
    const postDetail = blog.get('postDetail')
    const post = postDetail && postDetail.toJS()
    const comments = blog.get('commentList').toJS()
    const { status } = this.state

    return (
      <FrontContainerLayout breadcrumbPath={this.breadcrumbPath()} subscribe>
        {status !== -1 && !postDetail && <Spinner />}

        {status === -1 && <h3><center>Post not found</center></h3>}

        {status !== -1 && postDetail && <div>
          <h3 className="mb-4">{post.title}</h3>
          <p><img src={post.featured_image} alt={post.title} className="w-100"/></p>
          <div className="my-5" dangerouslySetInnerHTML={{ __html: post.content }} />

          <h3 className="mb-5">Comments ({comments ? comments.length : 0})</h3>
          <div className="mb-5">
            {comments && !!comments.length && comments.map((comment, index) => (
              <div className="mb-4" key={index}>
                <div className="mb-3">{comment.content}</div>
                <Row>
                  <Col xs={6} className="mb-2">{moment(comment.created_at).format('ll')}</Col>
                  <Col xs={6} className="text-right mb-2">{comment.user.full_name}</Col>
                </Row>
              </div>
            ))}
          </div>

          <h3 className="mb-5">Similar Posts</h3>
          <Row className="mb-5">
            {post.similar_posts.map(post => (
              <Col key={post.pk} xs={12} md={6} className="mb-3">
                <PostItem post={post} />
              </Col>
            ))}
          </Row>
        </div>}
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
  blog: blogSelector,
})

const actions = {
  getPostDetail,
  getPostCommentList
}

export default compose(
  connect(selector, actions)
)(PostDetail)
