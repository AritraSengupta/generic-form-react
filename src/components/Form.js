import React from 'react'
import { isEqual } from 'lodash'

import FormDisplay from './FormDisplay'
import { getDefaultValues } from '../utils'

/**
 * GenericConditionalForm component renders a form which can be conditional on the current data
 * @props (onChange): OPTIONAL: Function called whenever a formState changes
 * @props (form): the form whose format is very specfic: FormType
 * @props (defaultValues): OPTIONAL: To set the initial values of the form
 * @props (errors): OPTIONAL: To set the initial errors of the form
 * type FormType = (defaultValues: DefaultValues) => {
 *    title: String
 *    data: Array<FormUnit>
 * }
 *
 * type DefaultValues = {[ dataId: String]: { defaultValue: String | { value: Array | String, selected: Array<Textvaluepair> | TextValuePair }, options?: Array<TextValuePair> }}
 * type FormUnit = {
 *    fieldname: String,
 *    dataId: String,
 *    type: 'input' | 'checkbox' | 'dropdown' | 'radio' | 'files' | 'hidden' | 'textarea' | 'date' | 'paymentTerms',
 *    config: Object<any>,
 *    defaultValue: DefaultValue,
 *    validation?: String,
 *    options?: Array<TextValuePair>,
 * }
 * Send the form as a function which only accepts defaultValue object and fill out the rest
 */

export class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultValues: props.defaultValues || {},
      prevValues: {},
      errors: props.errors || {},
      loading: false
    }
    this.formRef = React.createRef()
    this.onChange = this.onChange.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.validateForm = this.validateForm.bind(this)
  }

  async onChange({ formData, errors }) {
    const {
      defaultValues,
      formData: oldFormData,
      errors: oldErrors
    } = this.state
    if (isEqual(oldFormData, formData) && isEqual(errors, oldErrors)) return
    const { data: form, reSyncValues } = this.props
    const prevForm = form(defaultValues)
    let newDefaultValues = getDefaultValues(prevForm, formData)
    let finalErrors = errors
    let loading = false
    if (reSyncValues) {
      try {
        loading = true
        this.updateForm(
          newDefaultValues,
          defaultValues,
          finalErrors,
          formData,
          loading
        )
        const { values, errors: newErrors } = await reSyncValues(
          newDefaultValues,
          defaultValues,
          errors,
          formData,
          this.updateForm
        )
        loading = false
        newDefaultValues = values
        finalErrors = newErrors
      } catch (e) {
        loading = false
        finalErrors.generic = true
      }
    }

    this.updateForm(
      newDefaultValues,
      defaultValues,
      finalErrors,
      formData,
      loading
    )
  }

  validateForm() {
    return this.formRef.current.validateForm()
  }

  updateForm(defaultValues, prevValues, errors, formData, loading) {
    const { onChange } = this.props

    this.setState({
      defaultValues,
      prevValues,
      errors,
      formData,
      loading
    })
    if (onChange) {
      onChange({ formData, errors })
    }
  }

  render() {
    const { errors, defaultValues, prevValues, loading } = this.state
    const { data: form, columns } = this.props
    const currentForm = form(defaultValues, prevValues)
    return (
      <FormDisplay
        columns={columns}
        data={currentForm}
        onChange={this.onChange}
        errors={errors}
        loading={loading}
        ref={this.formRef}
      />
    )
  }
}
