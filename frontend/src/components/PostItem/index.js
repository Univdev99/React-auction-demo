import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardText, CardTitle, Col, Input, Row } from 'reactstrap'
import moment from 'moment'
import { Link } from 'react-router-dom'

const COMPONENT_CLASS = 'post-item'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

class PostItem extends PureComponent {

  static propTypes = {
    post: PropTypes.object.isRequired,
  }

  render() {
    const { post: { pk, title, created_at: postDate, excerpt, featured_image: image } } = this.props
    const linkTo = `/blog/posts/${pk}`
    return (
      <Col xs={12} md={6} className="gb">
        <Card className={COMPONENT_CLASS}>
          <Link to={linkTo}>
            <div className={cx(bem('image'), 'card-img-top')} style={{ backgroundImage: `url(${image})`}} />
          </Link>
          <CardBody>
            <CardTitle className={bem('title')} title={title}>{title}</CardTitle>
            <CardText>{excerpt}</CardText>
            <Row className="mt-3">
              <Col xs={12} md={6} lg={7} xl={8}>
                <Input plaintext>{moment(postDate).format('ll')}</Input>
              </Col>
              <Col xs={12} md={6} lg={5} xl={4} className="text-right">
                <Button block color='primary' tag={Link} to={`/blog/posts/${pk}`}>
                  Read Article
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default PostItem
