import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { reduxForm } from 'redux-form'

import FormField from 'components/FormField'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import InputField from 'components/InputField'
import SectionTitle from 'components/SectionTitle'
import Spinner from 'components/Spinner'
import TextareaField from 'components/TextareaField'
import { getJobDetail } from 'store/modules/jobs'
import { jobsSelector } from 'store/selectors'


const isRequired = value => (value ? undefined : 'This Field is Required')
const isValidEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined


class JobDetail extends PureComponent {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    jobs: ImmutablePropTypes.map.isRequired,
    getJobDetail: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      status: 0, // 0: loading, 1: loaded, -1: error
    }
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

    this.setState({
      status: 0
    })

    getJobDetail({
      id,
      success: () => this.setState({
        status: 1
      }),
      fail: () => this.setState({
        status: -1
      }),
    })
  }

  submitForm = (data) => {
    console.log(data)
  }

  componentWillMount() {
    this.getJobDetail(this.props.match.params.id)
  }

  render() {
    const { handleSubmit, jobs } = this.props
    const jobDetail = jobs.get('jobDetail')
    const { status } = this.state
    const title = jobDetail ? jobDetail.get('title') : ''

    return (
      <FrontContainerLayout
        breadcrumbPath={this.breadcrumbPath(title)}
        subscribe
      >
        {status === 0 && <Spinner />}

        {status === -1 && <Alert color="danger">Job not found</Alert>}

        {status === 1 && jobDetail && <div>
          <SectionTitle className="mb-5">{title}</SectionTitle>

          <div className="mb-5">
            {jobDetail.get('description')}
          </div>

          <SectionTitle className="mt-5 mb-3">Apply For This Job</SectionTitle>
          <form onSubmit={handleSubmit(this.submitForm)}>
            <Row>
              <Col xs={12} md={6}>
                <FormField
                  name="name"
                  type="text"
                  label="Name"
                  validate={[isRequired]}
                  component={InputField}
                />
              </Col>
              <Col xs={12} md={6}>
                <FormField
                  name="email"
                  type="email"
                  label="Email"
                  validate={[isRequired, isValidEmail]}
                  component={InputField}
                />
              </Col>
            </Row>
            <FormField
              name="message"
              label="Message"
              validate={[isRequired]}
              component={TextareaField}
            />
            <Row>
              <Col xs={12} md={6}>
                <FormField
                  name="resume"
                  label="Attach your resume"
                  type="file"
                  component={InputField}
                />
              </Col>
              <Col xs={12} md={6} className="text-right">
                <Button type="submit" color="primary">Submit</Button>
              </Col>
            </Row>
          </form>
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

export default compose(
  connect(selector, actions),
  reduxForm({
    form: 'jobApplicationForm'
  })
)(JobDetail)
