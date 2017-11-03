import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'


const difference = (until, includeSeconds) => {
  const duration = moment.duration(moment(until).diff(moment()))
  const arr = [
    `${duration.days()}d`,
    `${duration.hours()}h`,
    `${duration.minutes()}m`,
    includeSeconds ? `${duration.seconds()}s` : ''
  ]
  return arr.join(' ')
}


export default class TimeLeft extends PureComponent {

  static propTypes = {
    includeSeconds: PropTypes.bool,
    until: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object // should be moment object
    ])
  }

  constructor(props) {
    super(props)
    const { includeSeconds, until } = props
    this.state = {
      timeLeft: difference(until, includeSeconds)
    }
  }

  componentDidMount() {
    this.timerId = window.setInterval(this.setTimeLeft, 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.timerId)
  }

  setTimeLeft = () => {
    const { includeSeconds, until } = this.props
    this.setState({ timeLeft: difference(until, includeSeconds) })
  }

  render() {
    const { timeLeft } = this.state
    return (
      <span>{timeLeft}</span>
    )
  }
}
