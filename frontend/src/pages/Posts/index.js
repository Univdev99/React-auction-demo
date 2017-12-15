import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import ListWrapper from 'components/ListWrapper'
import PostItem from 'components/PostItem'
import EmptyItems from 'components/EmptyItems'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import Pagination from 'components/Pagination'
import SectionTitle from 'components/SectionTitle'
import Spinner from 'components/Spinner'
import { API_PENDING, API_SUCCESS, API_FAIL } from 'store/api/request'
import { BLOG_POSTS_PAGE_SIZE } from 'config'
import { blogSelector } from 'store/selectors'
import { getPostListPage } from 'store/modules/blog'


class Posts extends PureComponent {

  static propTypes = {
    blog: ImmutablePropTypes.map.isRequired,
    getPostListPage: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { blog, getPostListPage } = this.props
    if (!blog.get('postListPageLoaded')) {
      getPostListPage()
    }
  }

  getPage = (page) => {
    getPostListPage({
      params: { page }
    })
  }

  renderList() {
    const { blog } = this.props
    const postListPage = blog.get('postListPage')
    const currentPage = blog.get('postPageNumber')
    const totalCount = blog.get('postCount')

    return totalCount ? (
      <div>
        <ListWrapper>
          {postListPage.map(post => (
            <PostItem key={post.get('pk')} post={post} />
          ))}
        </ListWrapper>
        <div className="mt-40 mt-md-80">
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={BLOG_POSTS_PAGE_SIZE}
            onPage={this.getPage}
          />
        </div>
      </div>
    ) : (
      <EmptyItems
        description="Sorry, No posts added yet."
        actionText="Subscribe to get updates."
      />
    )
  }

  render() {
    const { blog } = this.props
    const postListPageStatus = blog.get('postListPageStatus')

    return (
      <FrontContainerLayout
        title="Our Blog"
        subscribe
      > 
        {postListPageStatus === API_PENDING && <Spinner />}
        {postListPageStatus === API_FAIL &&
          <SectionTitle className="text-center">Failed to fetch posts.</SectionTitle>
        }
        {postListPageStatus === API_SUCCESS && this.renderList()}
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
