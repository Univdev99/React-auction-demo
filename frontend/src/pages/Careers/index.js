import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Alert } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import careersImg1 from 'images/careers-img1.jpg'
import careersImg2 from 'images/careers-img2.jpg'
import careersImg3 from 'images/careers-img3.jpg'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import ImageGrid from 'components/ImageGrid'
import JobItem from './JobItem'
import Section from 'components/Section'
import Spinner from 'components/Spinner'
import { API_PENDING, API_SUCCESS, API_FAIL } from 'store/api/request'
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

  getJobs = () => {
    const { getJobList } = this.props

    getJobList()
  }

  componentWillMount() {
    this.getJobs()
  }

  render() {
    const { jobs } = this.props
    const jobList = jobs.get('jobList')
    const jobListStatus = jobs.get('jobListStatus')

    return (
      <FrontContainerLayout
        breadcrumbPath={this.breadcrumbPath()}
        title="Careers"
        subscribe
      >
        <Section>
          <p>
            Yuma harnesses the power of celebrity, technology, and media to raise awareness and
            funds for some of the world's toughest challenges. With a mission to complement traditional
            fundraising models and help charities transition from analog to digital, Yuma has raised
            well over $200M for charity since inception...and we’re just getting started.
          </p>
          <ImageGrid image1={careersImg1} image2={careersImg2} image3={careersImg3} />
        </Section>

        <Section title="Current Openings">
          {jobListStatus === API_PENDING && <Spinner />}

          {jobListStatus === API_FAIL && <Alert color="danger">
            No Open Jobs!
          </Alert>}

          {jobListStatus === API_SUCCESS &&
            jobList.map((item, index) =>
              <JobItem key={index} job={item} />
            )
          }
        </Section>
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
