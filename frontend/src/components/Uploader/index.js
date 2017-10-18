import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'


class Uploader extends PureComponent {

  static propTypes = {
    uploadAction: PropTypes.func.isRequired,
    uploadActionParams: PropTypes.object,
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
        const uploading = (progress < 100)
        this.setState({
          uploading,
          progress,
        })
      },
    })
  }

  render() {
    const { uploading, progress } = this.state

    return (
      <div className="uploader">
        <Dropzone onDrop={this.handleDrop} />

        {uploading && <div className="mt-3">
          Uploading...
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
