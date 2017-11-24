import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Alert, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'
import { show } from 'redux-modal'

import CommentForm from 'components/CommentForm'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import PostItem from 'components/PostItem'
import Spinner from 'components/Spinner'
import { authSelector, blogSelector } from 'store/selectors'
import { createPostComment, getPostCommentList, getPostDetail } from 'store/modules/blog'


class PostDetail extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    blog: ImmutablePropTypes.map.isRequired,
    createPostComment: PropTypes.func.isRequired,
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

  handlePostComment = (data) => {
    const { createPostComment, match: { params: { id } } } = this.props
    createPostComment({ id, data })
  }

  handleSignIn = (e) => {
    const { show } = this.props
    e.preventDefault()
    show('signinModal')
  }

  render() {
    const { auth, blog } = this.props
    const postDetail = blog.get('postDetail')
    const post = postDetail && postDetail.toJS()
    const comments = blog.get('commentList').toJS()
    const { status } = this.state
    const user = auth.get('currentUser')

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
            {user
              ? <CommentForm onSubmit={this.handlePostComment} user={user} />
              : <Alert color="dark">
                Please <Link to="/signin" className="alert-link" onClick={this.handleSignIn}>sign in</Link> to leave comment
              </Alert>
            }
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
  auth: authSelector,
  blog: blogSelector,
})

const actions = {
  createPostComment,
  getPostDetail,
  getPostCommentList,
  show
}

export default compose(
  connect(selector, actions)
)(PostDetail)
