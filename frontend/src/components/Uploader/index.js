import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import { Progress, Input, Button, Row, Col } from 'reactstrap'
import FaImage from 'react-icons/lib/fa/image'
import cx from 'classnames'


class Uploader extends PureComponent {

  static propTypes = {
    uploadAction: PropTypes.func,
    onChange: PropTypes.func,
    uploadActionParams: PropTypes.object,
    disabled: PropTypes.bool,
    defaultImageURL: PropTypes.string,
    preview: PropTypes.bool,
    bordered: PropTypes.bool,
    allowEmbed: PropTypes.bool,
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
    embed: '',
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

  handleChangeEmbedText = (e) => {
    this.setState({
      embed: e.target.value
    })
  }

  handleClickAddEmbedMedium = () => {
    const { embed } = this.state

    if (!embed) {
      alert('Please input embed code')
      return
    }

    const { uploadAction, uploadActionParams } = this.props

    if (uploadAction) {
      const data = {
        embed,
      }

      uploadAction({
        ...uploadActionParams,
        data,
      })
    }
  }

  uploaderStyle = () => {
    const { defaultImageURL } = this.props
    const { previewImageData } = this.state
    let style = {
      width: '100%',
      height: 80,
      borderWidth: 1,
      borderColor: '#cccccd',
      borderStyle: 'dotted',
      borderRadius: 3,
    }
    if (defaultImageURL || previewImageData) {
      style = {
        ...style,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${previewImageData || defaultImageURL})`,
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
    const { disabled, defaultImageURL, bordered, allowEmbed } = this.props
    const { uploading, progress, embed } = this.state

    return (
      <div className="uploader">
        <div className="clearfix">
          {allowEmbed && <label>
            Click to choose or drag and drop files into here:
          </label>}
          <div className={cx({ 'dropzone-wrapper': true, 'bordered': bordered })}>
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

          {allowEmbed && <div>
            <label className="mt-2">Or enter embed code to create embedded medium:</label>
            <Row className="mb-5">
              <Col>
                <Input type="textarea" value={embed} onChange={this.handleChangeEmbedText} />
              </Col>
              <Col xs="auto">
                <Button color="primary" style={{ width: 100 }} onClick={this.handleClickAddEmbedMedium}>Add</Button>
              </Col>
            </Row>
          </div>}
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
