import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardText, Collapse, ListGroup, ListGroupItem } from 'reactstrap'

export default class FaqItem extends PureComponent {
  static propTypes = {
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  toggle = () => {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { answer, question } = this.props

    return (
      <Card className="mb-3">
        <ListGroup className="list-group-flush">
          <ListGroupItem action tag="a" href="#" onClick={this.toggle}>
            {question}
          </ListGroupItem>
        </ListGroup>
        <Collapse isOpen={this.state.open}>
          <div>
            <CardBody>
              <CardText>{answer}</CardText>
            </CardBody>
          </div>
        </Collapse>
      </Card>
    )
  }
}
