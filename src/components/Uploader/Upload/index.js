import React, { Component } from 'react'
import { Progress, TextArea, Grid, Table, Icon, Input } from 'semantic-ui-react'

import Dropzone from '../Dropzone/Dropzone'

import './Upload.css'

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false,
      fileData: {},
      error: false
    }

    this.onFilesAdded = this.onFilesAdded.bind(this)
    this.uploadFiles = this.uploadFiles.bind(this)
    this.onProgress = this.onProgress.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { startUpload, successfullUploaded: prevUploaded } = prevProps
    const { startUpload: onStartUpload, onUploadFinished } = this.props
    const { successfullUploaded, uploading, fileData } = this.state
    if (startUpload !== onStartUpload && onStartUpload) {
      this.uploadFiles()
    }
    if (
      successfullUploaded !== prevUploaded &&
      successfullUploaded &&
      !uploading
    ) {
      onUploadFinished(fileData)
    }
  }

  onFilesAdded(files) {
    const { currentFiles = [], showError } = this.props
    const { fileData } = this.state
    const newFiles = []
    files.forEach((file) => {
      if (currentFiles.findIndex((cf) => cf.name === file.name) === -1) {
        fileData[file.name] = {
          name: file.name,
          description: '',
          link: ''
        }
        newFiles.push(file)
        showError(false)
      } else {
        showError(true, false, {
          header: 'File Not Added',
          content: 'File Already Exists'
        })
      }
    })

    this.setState((prevState) => ({
      files: prevState.files.concat(newFiles),
      fileData
    }))
  }

  onProgress(progressEvent, file) {
    const { uploadProgress } = this.state
    const copy = uploadProgress
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    )
    copy[file.name] = {
      state: progress === 100 ? 'done' : 'pending',
      percentage: progress
    }
    this.setState({ uploadProgress: copy })
  }

  _removeRow = (e) => {
    const { files, fileData } = this.state
    const newFiles = files.filter((file) => file.name !== e.target.dataset.name)
    delete fileData[e.target.dataset.name]
    this.setState({ files: newFiles, fileData })
  }

  handleNameChange = (e, { name, value }) => {
    const { fileData } = this.state
    fileData[name].name = value
    this.setState({ fileData })
  }

  handleDescChange = (e, { name, value }) => {
    const { fileData } = this.state
    fileData[name].description = value
    this.setState({ fileData })
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true })
    const { files } = this.state
    const { folderPath, showError } = this.props
    const promises = []
    files.forEach((file) => {
      promises.push(
        this.props.uploadFileLocally(file, folderPath, (e) =>
          this.onProgress(e, file)
        )
      )
    })

    try {
      const result = await Promise.all(promises)
      const fileData = result.reduce((acc, curr) => {
        acc[curr.data.name] = curr.data
        return acc
      }, {})
      this.setState({ successfullUploaded: true, uploading: false, fileData })
    } catch (e) {
      showError(true, true, {
        header: 'Upload Failed',
        content: 'Please try again'
      })
    }
  }

  renderProgress(file) {
    const { uploadProgress } = this.state
    const progress = uploadProgress[file.name]
    return (
      <Table.Row key={file.name}>
        <Table.Cell>
          {file.name}
          <Progress
            percent={progress ? progress.percentage : 0}
            indicating
            size='tiny'
          />
        </Table.Cell>
        <Table.Cell>
          <Icon
            name='checkmark'
            color='green'
            style={{
              opacity: progress && progress.state === 'done' ? 0.5 : 0
            }}
          />
        </Table.Cell>
      </Table.Row>
    )
  }

  render() {
    const { uploading, successfullUploaded, fileData, files } = this.state
    return (
      <Grid divided style={{ width: '100%' }}>
        <Grid.Row stretched>
          <Grid.Column width={4}>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={uploading || successfullUploaded}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            <Table basic='very'>
              <Table.Header>
                {!uploading && (
                  <Table.Row>
                    <Table.HeaderCell width={3}>File Name</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Size (kB)</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                )}
                {uploading && (
                  <Table.Row>
                    <Table.HeaderCell width={12}>Uploading</Table.HeaderCell>
                  </Table.Row>
                )}
              </Table.Header>

              <Table.Body>
                {files.map((file) =>
                  !uploading ? (
                    <Table.Row key={file.name}>
                      <Table.Cell>
                        <Input
                          value={fileData[file.name].name}
                          size='mini'
                          transparent
                          onChange={this.handleNameChange}
                          name={file.name}
                        />
                      </Table.Cell>
                      <Table.Cell>{file.size / 1000 || 'N/A'}</Table.Cell>
                      <Table.Cell>
                        <TextArea
                          value={fileData[file.name].description}
                          rows={2}
                          style={{
                            width: '100%',
                            border: 'none',
                            resize: 'none',
                            fontSize: '11px'
                          }}
                          placeholder='Click to add description'
                          onChange={this.handleDescChange}
                          name={file.name}
                        />
                      </Table.Cell>
                      <Table.Cell
                        style={{ cursor: 'pointer' }}
                        data-name={file.name}
                        onClick={this._removeRow}
                      >
                        <Icon name='close' data-name={file.name} />
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    this.renderProgress(file)
                  )
                )}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Upload
