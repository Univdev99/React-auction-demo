import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardText, CardHeader, Collapse, CardTitle } from 'reactstrap'

export default class FaqItem extends PureComponent {
  static propTypes = {
    question: PropTypes.string.isRequired,
    answer: PropTypes.node.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  toggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    const { answer, question } = this.props

    return (
      <Card className="mb-3">
        <CardHeader
          className="list-group-flush cursor-pointer outline-none"
          onClick={this.toggle}
          tabIndex={0}
        >
          <CardTitle className="mb-0">{question}</CardTitle>
        </CardHeader>
        <Collapse isOpen={this.state.open}>
          <CardBody>
            <CardText tag="div">{answer}</CardText>
          </CardBody>
        </Collapse>
      </Card>
    )
  }
}
