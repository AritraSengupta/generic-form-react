import React, { Component } from 'react'
import { Button, Dimmer, Image, Progress, Loader } from 'semantic-ui-react'

import baseImage from '../images/image-background.png'

export default class ImageUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: !!props.link,
      state: props.link ? 'downloading' : 'default',
      file: null,
      uploadProgress: 0,
      link: props.link || ''
    }
    this.fileInputRef = React.createRef()

    this.openFileDialog = this.openFileDialog.bind(this)
    this.onFilesAdded = this.onFilesAdded.bind(this)
    this.onFilesRemoved = this.onFilesRemoved.bind(this)
    this.getDimmerContent = this.getDimmerContent.bind(this)
    this.uploadFiles = this.uploadFiles.bind(this)
    this.handleImageErrored = this.handleImageErrored.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.onProgress = this.onProgress.bind(this)
  }

  handleShow = () => this.setState({ active: true })

  handleHide = () => {
    const { state } = this.state
    if (state === 'default') {
      this.setState({ active: false })
    }
  }

  onProgress(progressEvent) {
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    )
    this.setState({ uploadProgress: progress })
  }

  openFileDialog() {
    const { disabled } = this.props
    if (disabled) return
    this.fileInputRef.current.click()
  }

  onFilesAdded(event) {
    const { files } = event.target
    this.setState({ file: files[0], state: 'selected', active: true })
  }

  onFilesRemoved() {
    this.setState({ file: null, state: 'default' })
  }

  getDimmerContent() {
    const { state, file, uploadProgress } = this.state
    switch (state) {
      case 'selected':
        return (
          <div>
            <div>{file.name}</div>
            <Button basic inverted onClick={this.onFilesRemoved}>
              Remove
            </Button>
            <Button primary onClick={this.uploadFiles}>
              Upload
            </Button>
          </div>
        )
      case 'uploading':
        return (
          <div>
            <div>{file.name}</div>
            <Progress percent={uploadProgress} indicating size='tiny' />
          </div>
        )
      case 'downloading':
        return (
          <div>
            <Loader content='Loading' />
          </div>
        )
      default:
        return (
          <div>
            <Button primary onClick={this.openFileDialog}>
              Edit
            </Button>
            <input
              ref={this.fileInputRef}
              className='FileInput'
              type='file'
              onChange={this.onFilesAdded}
            />
          </div>
        )
    }
  }

  async uploadFiles() {
    this.setState({ uploadProgress: 0, state: 'uploading' })
    const { file } = this.state
    const {
      link,
      onDbCallback,
      uploadFileLocally,
      deleteFileLocally
    } = this.props
    try {
      const response = await uploadFileLocally(file, 'po', this.onProgress)
      if (onDbCallback) {
        await onDbCallback(response.data)
      }
      if (link && link.length) {
        await deleteFileLocally(link)
      }
      this.setState({
        uploadProgress: 100,
        state: 'default',
        link: response.data.link
      })
    } catch (e) {
      // TODO: ERROR HANDLING
      this.setState({ uploadProgress: 100, state: 'default' })
    }
  }

  handleImageLoaded() {
    this.setState({ state: 'default', active: false })
  }

  handleImageErrored() {
    // TODO: Error handling
    this.setState({ state: 'default', active: false })
  }

  render() {
    const { active, link } = this.state
    const { size } = this.props
    const content = this.getDimmerContent()

    return (
      <Dimmer.Dimmable
        as={Image}
        dimmed={active}
        dimmer={{ active, content }}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        size={size || 'medium'}
        src={(link.length && link) || baseImage}
        onLoad={this.handleImageLoaded}
        onError={this.handleImageErrored}
      />
    )
  }
}
