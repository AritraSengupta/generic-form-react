import {
  standardValidators,
  validateValue,
  runValidationAgainstAllValues,
  runValidation,
  isRequired
} from './ValidationUtils'

describe('Validation Utils', () => {
  describe('Standard Validators', () => {
    it('should validate all the standard validations', () => {
      // required with number
      expect(standardValidators.required(0)).toEqual({ state: false })
      // required empty string false
      expect(standardValidators.required('')).toEqual({
        state: true,
        message: 'is required'
      })

      expect(standardValidators.maxLength(0, { maxLength: 6 })).toEqual({
        state: true,
        message: 'should be a string'
      })
      expect(
        standardValidators.maxLength('1234567', { maxLength: 6 })
      ).toEqual({ state: true, message: 'can be a maximum length of 6' })

      expect(standardValidators.minLength(0, { maxLength: 6 })).toEqual({
        state: true,
        message: 'should be a string'
      })
      expect(standardValidators.minLength('12345', { minLength: 6 })).toEqual({
        state: true,
        message: 'should be a minimum length of 6'
      })

      expect(standardValidators.number('q')).toEqual({
        state: true,
        message: 'should be a number'
      })
      expect(standardValidators.number(Number.NaN)).toEqual({
        state: true,
        message: 'should be a number'
      })

      const max = 5
      expect(standardValidators.max(6, { max })).toEqual({
        state: true,
        message: `cannot be more than ${max}`
      })

      const min = 7
      expect(standardValidators.min(6, { min })).toEqual({
        state: true,
        message: `cannot be less than ${min}`
      })

      expect(
        standardValidators.pattern('value', {
          pattern: /[0-9]/,
          message: 'wrong'
        })
      ).toEqual({ state: true, message: 'wrong' })
    })
  })
})
