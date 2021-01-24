import React from 'react'
import { isEqual } from 'lodash'
import PropTypes from 'prop-types'
import { Button, Modal } from 'semantic-ui-react'

/**
 *
 * @param {*} props
 * type Props: {
 *  onSave: (formData: FormData, dataMap: DataMap, callback: Func) => void
 *  onDelete: (formData: FormData, dataMap: DataMap, deleteCallback: Func) => void
 *  dataMap: DataMap
 *  callback: Func
 *  deleteCallback: Func
 * }
 *
 * onSave and onDelete are the main props required that determine whether to show the Save and Delete button
 * They are called with the rest of the props given in a certain order. The idea was to give convenience to the
 * parent component so that they to implement only one onSave and one onDelete instead of mutliple
 */

export const NestedModal = (props) => {
  const { open, onOpen, close, action, disabled, label } = props
  return (
    <Modal
      open={open}
      onOpen={onOpen}
      size='small'
      closeOnDimmerClick={false}
      closeIcon
      trigger={
        <Button
          primary={label !== 'Delete'}
          basic={label === 'Delete'}
          disabled={disabled}
          content={label || 'Save'}
        />
      }
    >
      <Modal.Header>Confirmation</Modal.Header>
      <Modal.Content>
        <p>Are you absolutely sure?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button icon='check' content='Cancel' onClick={close} />
        <Button icon='check' content={label || 'Save'} onClick={action} />
      </Modal.Actions>
    </Modal>
  )
}

NestedModal.propTypes = {
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  close: PropTypes.func,
  action: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string
}

export const withNestedModal = (Component, Trigger, props = {}) => {
  class ModalWithConfirmation extends React.Component {
    state = {
      open: false,
      openNestedSave: false,
      openNestedDelete: false,
      data: {}
    }

    shouldComponentUpdate(__, nextState) {
      return !isEqual(nextState, this.state)
    }

    componentRef = React.createRef()

    open = () => this.setState({ open: true })

    onOpenNestedDelete = () => this.setState({ openNestedDelete: true })

    onOpenNestedSave = () => this.setState({ openNestedSave: true })

    close = () => {
      // Reset data
      this.setState({
        open: false,
        openNestedDelete: false,
        openNestedSave: false,
        data: {}
      })
    }

    save = async () => {
      const { formData } = this.state.data
      const { onSave, dataMap, callback } = this.props
      if (this.componentRef.current.validateForm) {
        const hasError = await this.componentRef.current.validateForm()
        if (hasError) {
          this.setState({ openNestedSave: false })
          return
        }
      }
      onSave(formData, dataMap, callback)
      this.close()
    }

    delete = async () => {
      const { formData } = this.state.data
      const { onDelete, dataMap, deleteCallback } = this.props
      if (this.componentRef.current.validateForm) {
        const hasError = await this.componentRef.current.validateForm()
        if (hasError) {
          this.setState({ openNestedDelete: false })
          return
        }
      }
      onDelete(formData, dataMap, deleteCallback)
      this.close()
    }

    _handleChange = (data) => {
      this.setState({ data })
    }

    render() {
      let TriggerComponent = Trigger
      const { errors } = this.state.data
      const { onSave, onDelete } = this.props
      const actionDisabled = errors && Object.values(errors).includes(true)
      if (!Trigger) {
        TriggerComponent = <Button>Edit</Button>
      }
      const { open, openNestedDelete, openNestedSave } = this.state
      return (
        <Modal
          open={open}
          onOpen={this.open}
          onClose={this.close}
          trigger={TriggerComponent}
          closeIcon
          closeOnDimmerClick={false}
        >
          <Modal.Header>{props.title || 'Generic Form'}</Modal.Header>
          <Modal.Content scrolling>
            <Component
              {...props}
              onChange={this._handleChange}
              ref={this.componentRef}
            />
          </Modal.Content>
          <Modal.Actions>
            {onDelete && (
              <NestedModal
                open={openNestedDelete}
                onOpen={this.onOpenNestedDelete}
                close={this.close}
                action={this.delete}
                disabled={actionDisabled}
                label='Delete'
              />
            )}
            {onSave && (
              <NestedModal
                open={openNestedSave}
                onOpen={this.onOpenNestedSave}
                close={this.close}
                action={this.save}
                disabled={actionDisabled}
              />
            )}
          </Modal.Actions>
        </Modal>
      )
    }
  }

  ModalWithConfirmation.propTypes = {
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    dataMap: PropTypes.object,
    callback: PropTypes.func,
    deleteCallback: PropTypes.func
  }

  return ModalWithConfirmation
}
