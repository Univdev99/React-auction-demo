import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Alert, Button, ListGroup, ListGroupItem } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'

import FrontContainerLayout from 'layouts/FrontContainerLayout'
import Spinner from 'components/Spinner'
import { getJobList } from 'store/modules/jobs'
import { jobsSelector } from 'store/selectors'


class Careers extends PureComponent {

  static propTypes = {
    jobs: ImmutablePropTypes.map.isRequired,
    getJobList: PropTypes.func.isRequired,
  }

  breadcrumbPath() {
    return [
      { route: '/', text: 'Home' },
      { text: 'Careers' },
    ]
  }

  constructor(props) {
    super(props)
    this.state = {
      status: 0, // 0: loading, 1: loaded, -1: error
    }
  }

  getJobs = () => {
    const { getJobList } = this.props

    this.setState({
      status: 0
    })

    getJobList({
      success: () => this.setState({
        status: 1
      }),
      fail: () => this.setState({
        status: -1
      }),
    })
  }

  componentWillMount() {
    this.getJobs()
  }

  render() {
    const { jobs } = this.props
    const jobList = jobs.get('jobList')
    const { status } = this.state

    return (
      <FrontContainerLayout
        breadcrumbPath={this.breadcrumbPath()}
        title="Careers"
        subscribe
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ut nibh dictum, auctor libero ac,
          varius sem. Aenean in augue sed enim pulvinar ultricies eget at nibh. Sed ac iaculis lorem. Donec
          faucibus sodales risus, ac scelerisque urna tristique at. Etiam non nulla molestie mi pellentesque
          rutrum. Fusce sodales tellus sit amet facilisis dictum. Sed sagittis vel dui condimentum dictum.
          Cras ut purus in ligula fermentum convallis. Praesent non dolor imperdiet, rutrum mi in, rhoncus
          neque. Maecenas sed gravida turpis. Proin commodo sem in arcu viverra lobortis. Morbi pulvinar at
          ante sed vestibulum. Sed molestie mi nec odio pharetra finibus non non est. Vivamus cursus velit
          leo, vel malesuada quam aliquam et.
        </p>

        <h3 className="mt-5 mb-3">Current Openings</h3>

        {status === 0 && <Spinner />}

        {status === -1 && <Alert color="danger">
          No Open Jobs!
        </Alert>}

        {status === 1 && <ListGroup>
          {jobList.map((item, index) => (
            <ListGroupItem className="d-flex" key={index}>
              <div className="col align-self-md-center">
                {item.get('title')}
              </div>
              <div className="text-right align-self-md-center">
                <Button color="primary" tag={Link} to={`/jobs/${item.get('pk')}`}>
                  Apply
                </Button>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>}
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
  jobs: jobsSelector,
})

const actions = {
  getJobList
}

export default compose(
  connect(selector, actions)
)(Careers)
