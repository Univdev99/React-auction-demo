import React, { PureComponent } from 'react'
import { Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import PostItem from 'components/PostItem'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import { getPostListPage } from 'store/modules/blog'
import { blogSelector } from 'store/selectors'


class Posts extends PureComponent {

  static propTypes = {
    blog: ImmutablePropTypes.map.isRequired,
    getPostListPage: PropTypes.func.isRequired,
  }

  breadcrumbPath() {
    return [
      { route: '/', text: 'Home' },
      { text: 'Blog' },
    ]
  }

  componentWillMount() {
    const { blog, getPostListPage } = this.props
    if (!blog.get('postListPageLoaded')) {
      getPostListPage()
    }
  }

  render() {
    const { blog } = this.props
    const postListPage = blog.get('postListPage')

    return (
      <FrontContainerLayout
        breadcrumbPath={this.breadcrumbPath()}
        title="Our Blog"
        subscribe
      >  
        <Row>
          {postListPage.map(post => (
            <Col key={post.get('pk')} xs={12} md={6} className="mb-3">
              <PostItem post={post.toJS()} />
            </Col>
          ))}
        </Row>
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
  blog: blogSelector,
})

const actions = {
  getPostListPage,
}

export default compose(
  connect(selector, actions)
)(Posts)
