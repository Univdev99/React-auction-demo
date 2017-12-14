import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import { Progress } from 'reactstrap'
import FaImage from 'react-icons/lib/fa/image'

class Uploader extends PureComponent {

  static propTypes = {
    uploadAction: PropTypes.func,
    onChange: PropTypes.func,
    uploadActionParams: PropTypes.object,
    disabled: PropTypes.bool,
    defaultImageURL: PropTypes.string,
    preview: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
    defaultImageURL: null,
    preview: false,
  }

  state = {
    uploading: false,
    progress: 0,
    previewImageData: null,
  }

  handleDrop = (acceptedFiles) => {
    if (!acceptedFiles.length) {
      alert('Please upload a file')
      return
    }

    const file = acceptedFiles[0]
    const { preview, onChange, uploadAction, uploadActionParams } = this.props

    if (uploadAction) {
      const data = new FormData()
      data.append('file', file)

      this.setState({
        uploading: true,
        progress: 0,
      })

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

    if (onChange) {
      onChange(file)
    }

    if (preview) {
      const reader = new FileReader()
      reader.addEventListener('load', () => this.setState({
        previewImageData: reader.result
      }))
      reader.readAsDataURL(file)
    }
  }

  uploaderStyle = () => {
    const { defaultImageURL } = this.props
    let style = {
      width: '100%',
      height: 80,
      // borderWidth: 1,
      // borderColor: '#f9f8fe',
      // borderStyle: 'dotted',
      // borderRadius: 3,
    }
    if (defaultImageURL) {
      style = {
        ...style,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${defaultImageURL})`,
      }
    }
    return style
  }

  acceptStyle = () => {
    const style = this.uploaderStyle()
    style.borderColor = '#28a745'
    return style
  }

  render() {
    const { disabled, defaultImageURL } = this.props
    const { uploading, progress, previewImageData } = this.state

    const wrapperStyle = {}
    if (previewImageData) {
      wrapperStyle.backgroundImage = `url(${previewImageData})`
    }

    return (
      <div className="uploader">
        <div className="clearfix">
          <div className="dropzone-wrapper" style={wrapperStyle}>
            {!defaultImageURL && <div className="dropzone-icon text-black">
              <span className="dropzone-plus-text">+ </span>
              <FaImage />
            </div>}
            <Dropzone
              style={this.uploaderStyle()}
              acceptStyle={this.acceptStyle()}
              multiple={false}
              disabled={disabled || uploading}
              onDrop={this.handleDrop}
            />
          </div>
        </div>

        {uploading && <div className="mt-3">
          {progress < 100 ? 'Uploading...' : 'Processing...'}
          <Progress animated color="success" value={progress} />
        </div>}
      </div>
    )
  }
}

export default Uploader
