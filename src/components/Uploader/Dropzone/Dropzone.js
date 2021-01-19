import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'

import './Dropzone.css'

const fileListToArray = (list) => {
  const array = []
  for (let i = 0; i < list.length; i += 1) {
    array.push(list.item(i))
  }
  return array
}

class Dropzone extends Component {
  constructor(props) {
    super(props)
    this.state = { hightlight: false }
    this.fileInputRef = React.createRef()

    this.openFileDialog = this.openFileDialog.bind(this)
    this.onFilesAdded = this.onFilesAdded.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  onFilesAdded(evt) {
    const { disabled, onFilesAdded: addFile } = this.props
    if (disabled) return
    const { files } = evt.target
    if (addFile) {
      const array = fileListToArray(files)
      addFile(array)
    }
  }

  onDragOver(event) {
    const { disabled } = this.props
    event.preventDefault()
    if (disabled) return
    this.setState({ hightlight: true })
  }

  onDragLeave() {
    this.setState({ hightlight: false })
  }

  onDrop(event) {
    const { disabled, onFilesAdded } = this.props
    event.preventDefault()
    if (disabled) return
    const { files } = event.dataTransfer
    if (onFilesAdded) {
      const array = fileListToArray(files)
      onFilesAdded(array)
    }
    this.setState({ hightlight: false })
  }

  openFileDialog() {
    const { disabled } = this.props
    if (disabled) return
    this.fileInputRef.current.click()
  }

  render() {
    const { disabled, multiple } = this.props
    const { hightlight } = this.state
    return (
      <div
        className={`Dropzone ${hightlight ? 'Highlight' : ''}`}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onClick={this.openFileDialog}
        style={{ cursor: disabled ? 'default' : 'pointer' }}
      >
        <input
          ref={this.fileInputRef}
          className='FileInput'
          type='file'
          multiple={multiple || true}
          onChange={this.onFilesAdded}
        />
        <Icon name='upload' size='small' />
        <span>Upload Files</span>
      </div>
    )
  }
}

export default Dropzone
