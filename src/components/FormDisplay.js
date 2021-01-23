import React from 'react'
import PropTypes from 'prop-types'
import { Form, Grid, Message } from 'semantic-ui-react'
import { debounce, uniqBy, isEqual } from 'lodash'

import DatePicker from './Calendar/DatePicker'
import {
  getErrorList,
  getFormGridStruct,
  getValidatorMap,
  getDefaultState,
  convertToArray,
  runValidation,
  isRequired
} from '../utils'

export default class FormDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = getDefaultState(props)
    this.handleDynamicSearchChange = debounce(
      this.handleDynamicSearchChange.bind(this),
      500
    )
    this.getFormUnit = this.getFormUnit.bind(this)
    this.updateStateIfPropsChange = this.updateStateIfPropsChange.bind(this)
    props.onChange(this.state)
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateStateIfPropsChange(prevProps)
    if (!isEqual(prevState, this.state)) {
      const { onChange } = this.props
      onChange(this.state)
    }
  }

  updateStateIfPropsChange(prevProps) {
    if (!isEqual(prevProps, this.props)) {
      const newState = getDefaultState(this.props)
      this.setState(newState)
    }
  }

  /**
   * @values an array or a string representing the values that need validations
   * @validators an array of validators or an object with type and params or a custom funtion
   */
  validateInput = (values, validators, prevState, name, fieldname) => {
    if (!validators || (Array.isArray(validators) && !validators.length))
      return prevState.errors
    return {
      ...prevState.errors,
      [name]: runValidation(values, validators, fieldname)
    }
  }

  handleInputChange = (e, { name, value, validators, fieldname }) =>
    this.setState((prevState) => ({
      formData: { ...prevState.formData, [name]: value },
      errors: this.validateInput(value, validators, prevState, name, fieldname)
    }))

  handleCheckChange = (e, { name, value, checked, validators, fieldname }) =>
    this.setState((prevState) => {
      const currValue = { ...prevState.formData[name].value, [value]: checked }
      const selected = convertToArray(currValue)
      return {
        formData: {
          ...prevState.formData,
          [name]: {
            value: currValue,
            selected
          }
        },
        errors: this.validateInput(
          (selected || []).filter((s) => !!s),
          validators,
          prevState,
          name,
          fieldname
        )
      }
    })

  handleDropdownChange = (
    e,
    { name, value, validators, multiple, options, fieldname }
  ) => {
    let selectedOptions
    let values
    if (multiple) {
      selectedOptions = options.filter((o) => value.includes(o.value))
      values = selectedOptions.map((so) => so && so.text)
    } else {
      // eslint-disable-next-line prefer-destructuring
      selectedOptions = options.filter((o) => o.value === value)[0]
      values = selectedOptions && selectedOptions.text
    }
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: { value, selected: selectedOptions }
      },
      errors: this.validateInput(values, validators, prevState, name, fieldname)
    }))
  }

  addNewDropdownItem = (
    e,
    { name, value, multiple, validators, fieldname }
  ) => {
    if (multiple) {
      throw new Error(
        'Adding new elements with multiple dropdown not supported yet'
      )
    }
    const { dynamicOptions } = this.state
    const currentOption = { text: value, value: -1 }
    dynamicOptions[name].options = [
      ...dynamicOptions[name].options,
      currentOption
    ]

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: { value: currentOption.value, selected: currentOption }
      },
      errors: this.validateInput(value, validators, prevState, name, fieldname),
      dynamicOptions
    }))
  }

  async handleDynamicSearchChange(e, { name, multiple, searchQuery }) {
    if (!searchQuery.length) return
    const { dynamicOptions, formData } = this.state
    dynamicOptions[name].loading = true
    this.setState({ dynamicOptions })
    let newOptions
    try {
      newOptions = await dynamicOptions[name].callback(searchQuery)
    } catch {
      newOptions = []
    }
    const oldOptions = formData[name].selected || []
    if (multiple) {
      dynamicOptions[name].options = uniqBy(
        [...newOptions, ...oldOptions],
        'value'
      )
    } else {
      dynamicOptions[name].options = newOptions
    }
    dynamicOptions[name].loading = false
    this.setState({ dynamicOptions })
  }

  getFormUnit(val) {
    const { formData, errors, dynamicOptions } = this.state

    if (val.type === 'hidden' || (val.config && val.config.visible === false)) {
      return null
    }
    if (val.type === 'input') {
      return (
        <Form.Input
          key={val.dataId}
          required={isRequired(val.validators)}
          validators={val.validators}
          name={val.dataId}
          field_name={val.fieldname}
          label={val.fieldname}
          value={formData[val.dataId] || ''}
          error={!!(errors[val.dataId] && errors[val.dataId].length)}
          onChange={this.handleInputChange}
          disabled={val.config && val.config.disabled}
          {...((val.config && val.config.props) || {})}
          data-testid='input'
        />
      )
    }
    if (val.type === 'dropdown') {
      if (val.config && val.config.search) {
        const isMultiple = val.config && val.config.multiple
        let value = (formData[val.dataId] || {}).value
        if (!value && isMultiple) {
          // handling case for multiple dropdowns
          value = []
        }
        return (
          <Form.Dropdown
            key={val.dataId}
            label={val.fieldname}
            name={val.dataId}
            fieldname={val.fieldname}
            options={dynamicOptions[val.dataId].options}
            multiple={isMultiple}
            clearable={val.config && val.config.clearable}
            selection
            search
            placeholder={val.placeholder}
            value={value}
            onChange={this.handleDropdownChange}
            onSearchChange={this.handleDynamicSearchChange}
            disabled={
              (val.config && val.config.disabled) ||
              dynamicOptions[val.dataId].loading
            }
            loading={dynamicOptions[val.dataId].loading}
            onAddItem={this.addNewDropdownItem}
            allowAdditions={val.config && val.config.allowAdditions}
            validators={val.validators}
            error={!!(errors[val.dataId] && errors[val.dataId].length)}
            required={isRequired(val.validators)}
            data-testid='dropdown-search'
          />
        )
      }
      return (
        <Form.Dropdown
          key={val.dataId}
          label={val.fieldname}
          name={val.dataId}
          fieldname={val.fieldname}
          options={val.options}
          multiple={val.config && val.config.multiple}
          clearable={val.config && val.config.clearable}
          selection
          placeholder={val.placeholder}
          value={(formData[val.dataId] || {}).value}
          onChange={this.handleDropdownChange}
          disabled={val.config && val.config.disabled}
          onAddItem={this.addNewDropdownItem}
          allowAdditions={val.config && val.config.allowAdditions}
          loading={val.config && val.config.loading}
          validators={val.validators}
          error={!!(errors[val.dataId] && errors[val.dataId].length)}
          required={isRequired(val.validators)}
          data-testid='dropdown'
        />
      )
    }
    if (val.type === 'radio') {
      return (
        <React.Fragment key={val.dataId}>
          <Form.Field
            required={isRequired(val.validators)}
            error={!!(errors[val.dataId] && errors[val.dataId].length)}
          >
            <label>{val.fieldname}</label>
          </Form.Field>
          {val.options.map((radio) => (
            <Form.Radio
              key={radio.value}
              label={radio.text}
              name={val.dataId}
              fieldname={val.fieldname}
              value={radio.value}
              checked={formData[val.dataId] === radio.value}
              onChange={this.handleInputChange}
              validators={val.validators}
              error={!!(errors[val.dataId] && errors[val.dataId].length)}
            />
          ))}
        </React.Fragment>
      )
    }
    if (val.type === 'checkbox') {
      return (
        <React.Fragment key={val.dataId}>
          <Form.Field
            required={isRequired(val.validators)}
            error={!!(errors[val.dataId] && errors[val.dataId].length)}
          >
            <label>{val.fieldname}</label>
          </Form.Field>
          {val.options.map((check) => (
            <Form.Checkbox
              key={check.value}
              label={check.text}
              name={val.dataId}
              fieldname={val.fieldname}
              value={check.value}
              checked={
                !!((formData[val.dataId] || {}).value || {})[check.value]
              }
              onChange={this.handleCheckChange}
              validators={val.validators}
              error={!!(errors[val.dataId] && errors[val.dataId].length)}
            />
          ))}
        </React.Fragment>
      )
    }
    if (val.type === 'textarea') {
      return (
        <Form.TextArea
          key={val.dataId}
          required={isRequired(val.validators)}
          name={val.dataId}
          fieldname={val.fieldname}
          label={val.fieldname}
          value={formData[val.dataId] || ''}
          error={!!(errors[val.dataId] && errors[val.dataId].length)}
          onChange={this.handleInputChange}
          validators={val.validators}
        />
      )
    }
    if (val.type === 'date') {
      return (
        <React.Fragment key={val.dataId}>
          <Form.Field
            required={isRequired(val.validators)}
            error={!!(errors[val.dataId] && errors[val.dataId].length)}
          >
            <label>{val.fieldname}</label>
            <DatePicker
              data-testid='date'
              key={val.dataId}
              name={val.dataId}
              fieldname={val.fieldname}
              value={formData[val.dataId]}
              onDateChange={this.handleInputChange}
              validators={val.validators}
              {...((val.config && val.config.props) || {})}
            />
          </Form.Field>
        </React.Fragment>
      )
    }
    return <div>Improper Config</div>
  }

  validateForm = async () => {
    const { errors: currentErrors, formData: formState } = this.state
    const { data: form } = this.props
    // If error exists return
    if (Object.values(currentErrors).some((s) => s.length)) return true
    const validatorMap = getValidatorMap(form, formState)
    const errors = {}
    validatorMap.forEach((vm) => {
      if (vm.validators) {
        errors[vm.id] = runValidation(vm.value, vm.validators, vm.name)
      }
    })
    // We want to set the state first before making the final return of the function
    return new Promise((resolve) => {
      this.setState({ errors }, () => {
        const hasError = !!Object.values(errors).some((s) => s.length)
        resolve(hasError)
      })
    })
  }

  renderGrid(data, columns) {
    const gridList = getFormGridStruct(data, columns)
    const firstRowLength = (gridList[0] || []).length
    const actualColumns = columns < firstRowLength ? columns : firstRowLength
    return (
      <Grid columns={actualColumns} divided padded>
        {gridList.map((gl, idx) => (
          <Grid.Row key={`${gl.dataId}${idx}`}>
            {gl.map((gr, idx) => (
              <Grid.Column key={`${gr.dataId}${idx}`}>
                {this.getFormUnit(gr)}
              </Grid.Column>
            ))}
          </Grid.Row>
        ))}
      </Grid>
    )
  }

  render() {
    const { errors } = this.state
    const { data, loading, columns } = this.props

    const isColumnView = columns > 1

    return (
      <Form
        loading={!!loading}
        error={errors && Object.values(errors).some((s) => s.length)}
      >
        <Message
          error
          header='Please check the form for the following'
          list={getErrorList(errors)}
        />
        {isColumnView
          ? this.renderGrid(data, columns)
          : data.map((val) => this.getFormUnit(val))}
      </Form>
    )
  }
}

FormDisplay.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.exact({
      dataId: PropTypes.string.isRequired,
      type: PropTypes.oneOf([
        'hidden',
        'date',
        'input',
        'textarea',
        'dropdown',
        'checkbox',
        'radio'
      ]).isRequired,
      fieldname: PropTypes.string,
      defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object
      ]),
      config: PropTypes.object,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        })
      ),
      validators: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.object, PropTypes.func])
      )
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  columns: PropTypes.number,
  errors: PropTypes.object
}
