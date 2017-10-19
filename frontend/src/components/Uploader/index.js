import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'

import './style.css'


class Uploader extends PureComponent {

  static propTypes = {
    uploadAction: PropTypes.func.isRequired,
    uploadActionParams: PropTypes.object,
    disabled: PropTypes.bool,
    defaultImageURL: PropTypes.string,
  }

  static defaultProps = {
    disabled: false,
    defaultImageURL: null,
  }

  state = {
    uploading: false,
    progress: 0,
  }

  handleDrop = (acceptedFiles) => {
    if (!acceptedFiles.length) {
      alert('Please upload a file')
      return
    }

    const file = acceptedFiles[0]
    const data = new FormData()
    data.append('file', file)

    this.setState({
      uploading: true,
      progress: 0,
    })

    const { uploadAction, uploadActionParams } = this.props
    uploadAction({
      ...uploadActionParams,
      data,
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent
        const progress = parseInt(parseFloat(loaded) / parseFloat(total) * 100, 10)
        this.setState({
          progress
        })
      },
      success: () => this.setState({
        uploading: false
      }),
      fail: () => this.setState({
        uploading: false
      }),
    })
  }

  uploaderStyle = () => {
    const { defaultImageURL } = this.props
    let style = {
      width: 200,
      height: 200,
      borderWidth: 2,
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: 5,
    }
    if (defaultImageURL) {
      style = {
        ...style,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundImage: `url(${defaultImageURL})`,
      }
    }
    return style
  }

  render() {
    const { disabled } = this.props
    const { uploading, progress } = this.state

    return (
      <div className="uploader">
        <Dropzone
          style={this.uploaderStyle()}
          multiple={false}
          disabled={disabled || uploading}
          onDrop={this.handleDrop}
        />

        {uploading && <div className="mt-3">
          {progress < 100 ? 'Uploading...' : 'Processing...'}
          <div className="progress">
            <div
              className="progress-bar" role="progressbar"
              aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
              style={{ width: `${progress}%`, height: 3 }}
            ></div>
          </div>
        </div>}
      </div>
    )
  }
}

export default Uploader
