import React, { Component } from 'react'

export default (WrappedComponent, selectData) => {
  return class extends Component {
    componentDidMount() {
      window.scrollTo(0, 0)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
