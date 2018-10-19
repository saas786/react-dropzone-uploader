import React from 'react'
import PropTypes from 'prop-types'

import { formatBytes } from './string'
import './FileUploader.css'

class FileUploadPreview extends React.PureComponent {
  render() {
    const {
      meta: { name = '', percent = 0, size = 0, previewUrl, type, status },
      showProgress,
      onCancel,
      onRemove,
    } = this.props

    let title = `${name || '?'}, ${formatBytes(size)}`

    if (status === 'error_file_size') {
      let tooBig = <span>File exceeds size limit...</span>
      if (type.startsWith('image/')) tooBig = <span>Image exceeds size limit...</span>
      if (type.startsWith('video/')) tooBig = <div><span>Video exceeds size limit...</span></div>

      return (
        <div className="uploader-previewContainer">
          <span>{title}</span>
          {tooBig}
          {onRemove && <span className="uploader-abortButton" onClick={onRemove} />}
        </div>
      )
    }

    if (status === 'error_upload_params' || status === 'error_upload') title = `${title} (upload failed)`
    if (status === 'aborted') title = `${title} (cancelled)`

    return (
      <div className="uploader-previewContainer">
        {previewUrl && <img className="uploader-preview" src={previewUrl} alt={title} title={title} />}
        {!previewUrl && <span>{title}</span>}

        <div className="uploader-statusContainer">
          {showProgress && <progress max={100} value={status === 'done' ? 100 : percent} />}
          {status === 'uploading' && onCancel && <span className="uploader-abortButton" onClick={onCancel} />}
          {status !== 'uploading' && onRemove && <span className="uploader-abortButton" onClick={onRemove} />}
        </div>
      </div>
    )
  }
}

FileUploadPreview.propTypes = {
  meta: PropTypes.shape({
    status: PropTypes.oneOf(
      ['uploading', 'error_file_size', 'error_upload_params', 'aborted', 'done', 'error_upload']
    ).isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    percent: PropTypes.number,
    size: PropTypes.number,
    previewUrl: PropTypes.string,
    uploadedDate: PropTypes.string.isRequired,
    lastModifiedDate: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
  showProgress: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
}

export default FileUploadPreview