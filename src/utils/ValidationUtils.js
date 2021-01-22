/**
 * This file contains all the utils regarding the form validation process,
 * We will use the following structure for error:
 * @param error: {
 *  name: <string> 'field name',
 *  state: <boolean> 'true or false',
 *  message: <string> message to be shown to the user in case state is true
 * }
 */

export const standardValidators = {
  required: (value) => {
    if (typeof value === 'number') {
      return {
        state: false
      }
    }
    return {
      state: !(value && value.length),
      message: 'is required'
    }
  },

  maxLength: (value, { maxLength }) => {
    if (typeof value !== 'string') {
      return {
        state: true,
        message: 'should be a string'
      }
    }
    return {
      state: value.length > maxLength,
      message: `can be a maximum length of ${maxLength}`
    }
  },

  minLength: (value, { minLength }) => {
    if (typeof value !== 'string') {
      return {
        state: true,
        message: 'should be a string'
      }
    }
    return {
      state: value.length < minLength,
      message: `should be a minimum length of ${minLength}`
    }
  },

  number: (value) => ({
    state: !(typeof value === 'number' && !Number.isNaN(Number(value))),
    message: 'should be a number'
  }),

  max: (value, { max }) => ({
    state: Number(value) > max,
    message: `cannot be more than ${max}`
  }),

  min: (value, { min }) => ({
    state: Number(value) < min,
    message: `cannot be less than ${min}`
  }),

  pattern: (value, { pattern, message }) => {
    const regPattern = new RegExp(pattern)
    return {
      state: !regPattern.test(value),
      message: message || `does not match pattern ${pattern}`
    }
  }
}

export const validateValue = (value, validator) => {
  if (typeof validator === 'function') {
    return validator(value)
  }

  if (validator.type && standardValidators[validator.type]) {
    return standardValidators[validator.type](value, validator.params)
  }

  throw new Error('Not a valid Validator')
}

export const runValidationAgainstAllValues = (values, validator) => {
  if (Array.isArray(values) && values.length) {
    let error = null
    for (let i = 0; i < values.length; i += 1) {
      if (error && error.state) break
      error = validateValue(values[i], validator)
    }
    return error
  }
  return validateValue(values, validator)
}

export const runValidation = (values, validators, name) => {
  if (Array.isArray(validators)) {
    const errors = []
    validators.forEach((validator) => {
      const error = runValidationAgainstAllValues(values, validator)

      if (error.state) {
        errors.push({ name, ...error })
      }
    })
    return errors
  }
  const error = runValidationAgainstAllValues(values, validators)
  return error.state ? [{ name, ...error }] : []
}

export const isRequired = (validators) => {
  if (Array.isArray(validators)) {
    return validators.some((v) => !!(v && v.type === 'required'))
  }
  return !!(validators && validators.type === 'required')
}
