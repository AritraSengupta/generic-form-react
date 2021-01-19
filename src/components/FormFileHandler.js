import React from 'react'
import { Button, Segment, Message } from 'semantic-ui-react'
import { isEqual, sortBy } from 'lodash'

import { DocumentCenter, DocumentUploader } from './Uploader'

/* state 
appState: add | list | edit
add component document handler
edit component form
list is document handler

folderpath
files
onChange(files, deletedFiles) */

export default class FormFileHandler extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { files } = nextProps
    const { files: prevFiles } = prevState
    if (!isEqual(sortBy(files), sortBy(prevFiles))) {
      return { files }
    }
    return null
  }

  constructor(props) {
    super(props)
    this.state = {
      appState: 'list',
      files: props.files || [],
      startUpload: false,
      deletedFiles: [],
      error: { state: false }
    }
  }

  renderDocList = () => {
    const { files } = this.state
    const { header } = this.props
    return (
      <React.Fragment>
        <Segment clearing basic>
          <span style={{ fontSize: 20, fontWeight: 600 }}>
            {header || 'Files'}
          </span>
          <Button
            basic
            content='Upload'
            onClick={this.showUploader}
            floated='right'
          />
        </Segment>
        <DocumentCenter
          items={files}
          onSave={this.onFileEdit}
          onDelete={this.onDelete}
        />
      </React.Fragment>
    )
  }

  renderUploadForm = () => {
    const { startUpload, files } = this.state
    const { folderPath, header } = this.props
    return (
      <React.Fragment>
        <Segment clearing basic textAlign='left'>
          <span style={{ fontSize: 20, fontWeight: 600 }}>
            {header || 'Files'}
          </span>
          <Button negative onClick={this.showList} floated='right'>
            Cancel
          </Button>
          <Button
            positive
            icon='checkmark'
            labelPosition='right'
            content='Upload'
            onClick={this.setUploadStateActive}
            floated='right'
          />
        </Segment>
        <DocumentUploader
          currentFiles={files}
          startUpload={startUpload}
          onUploadFinished={this.onUploadFinished}
          showError={this.showError}
          folderPath={folderPath}
        />
      </React.Fragment>
    )
  }

  showError = (showError, showList = false, errorType) => {
    const { error } = this.state
    if (!showError) {
      error.state && this.setState({ error: { state: false } })
    } else if (showList) {
      this.setState({
        appState: 'list',
        startUpload: false,
        error: { state: true, type: errorType }
      })
    } else {
      this.setState({ error: { state: true, type: errorType } })
    }
  }

  onUploadFinished = (newFiles) => {
    const addedFiles = Object.values(newFiles)
    const { files, deletedFiles } = this.state
    const { onChange } = this.props
    files.push(...addedFiles)
    if (onChange) {
      onChange({ files, deletedFiles }, this.props)
      this.setState({
        appState: 'list',
        startUpload: false,
        error: { state: false }
      })
    } else {
      this.setState({
        files,
        appState: 'list',
        startUpload: false,
        error: { state: false }
      })
    }
  }

  setUploadStateActive = () => {
    this.setState({ startUpload: true })
  }

  showList = () => {
    this.setState({ appState: 'list' })
  }

  showUploader = () => {
    this.setState({ appState: 'uploader' })
  }

  onFileEdit = (data) => {
    const name = data && data.name
    const { files, deletedFiles } = this.state
    const { onChange } = this.props
    if (name !== null || name !== undefined) {
      const newFiles = files.filter((file) => file.name !== name)
      newFiles.push(data)
      if (onChange) {
        onChange({ files: newFiles, deletedFiles }, this.props)
      } else {
        this.setState({ files: newFiles })
      }
    }
  }

  onDelete = async (data) => {
    const name = data && data.name
    const { files, deletedFiles } = this.state
    const { deleteFileLocally } = this.props
    const { onChange } = this.props
    if (name !== null || name !== undefined) {
      try {
        await deleteFileLocally(data.link)
        // do component stuff and update local state
        const newFiles = files.filter((file) => file.name !== name)
        deletedFiles.push(data)
        if (onChange) {
          onChange({ files: newFiles, deletedFiles }, this.props)
        } else {
          this.setState({ files: newFiles, deletedFiles })
        }
      } catch (e) {
        // do nothing
      }
    }
  }

  render() {
    const { appState, error } = this.state
    return (
      <React.Fragment>
        {error.state && (
          <Message
            negative
            header={error.type.header}
            content={error.type.content}
          />
        )}
        {appState === 'list' ? this.renderDocList() : this.renderUploadForm()}
      </React.Fragment>
    )
  }
}
