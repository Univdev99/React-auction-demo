import React, { PureComponent } from 'react'
import { Container } from 'reactstrap'

class AppContainerLayout extends PureComponent {
  render() {
    const { children } = this.props

    return (
      <Container className="app-container-layout">
        {children}
      </Container>
    )
  }
}

export default AppContainerLayout
