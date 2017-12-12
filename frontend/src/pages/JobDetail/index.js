import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import FrontContainerLayout from 'layouts/FrontContainerLayout'
import JobApplicationForm from 'components/JobApplicationForm'
import Section from 'components/Section'
import Spinner from 'components/Spinner'
import { API_PENDING, API_SUCCESS, API_FAIL } from 'store/api/request'
import { getJobDetail } from 'store/modules/jobs'
import { jobsSelector } from 'store/selectors'


class JobDetail extends PureComponent {

  static propTypes = {
    jobs: ImmutablePropTypes.map.isRequired,
    getJobDetail: PropTypes.func.isRequired,
  }

  breadcrumbPath(title) {
    return [
      { route: '/', text: 'Home' },
      { route: '/careers', text: 'Careers' },
      { text: title }
    ]
  }

  getJobDetail = (id) => {
    const { getJobDetail } = this.props

    getJobDetail({ id })
  }

  submitForm = (data) => {
    console.log(data)
  }

  componentWillMount() {
    this.getJobDetail(this.props.match.params.id)
  }

  render() {
    const { jobs } = this.props
    const jobDetail = jobs.get('jobDetail')
    const jobDetailStatus = jobs.get('jobDetailStatus')
    const title = jobDetail ? jobDetail.get('title') : ''

    return (
      <FrontContainerLayout
        breadcrumbPath={this.breadcrumbPath(title)}
        subscribe
      >
        {jobDetailStatus === API_PENDING && <Spinner />}

        {jobDetailStatus === API_FAIL && <Alert color="danger">Job not found</Alert>}

        {jobDetailStatus === API_SUCCESS && jobDetail && <div>
          <Section title={title}>
            <div
              className="page-content"
              dangerouslySetInnerHTML={{ __html: jobDetail.get('description') }}
            />
          </Section>

          <Section title="Apply For This Job">
            <JobApplicationForm onSubmit={this.submitForm} />
          </Section>
        </div>}
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
  jobs: jobsSelector,
})

const actions = {
  getJobDetail
}

export default connect(selector, actions)(JobDetail)
