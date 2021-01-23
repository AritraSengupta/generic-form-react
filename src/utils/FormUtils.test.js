import { cloneDeep } from 'lodash'
import {
  getDefaultValues,
  conditionalFormDefaultValuesGetter,
  defaultValueMapper,
  apiDataMapper,
  dropdownOptionsMapper,
  getValidatorMap
} from './FormUtils'

const data = [
  {
    type: 'checkbox',
    dataId: 'check',
    defaultValue: null,
    validators: [{ type: 'required' }]
  },
  {
    type: 'files',
    dataId: 'files',
    defaultValue: null,
    validators: [{ type: 'required' }]
  },
  {
    type: 'dropdown',
    dataId: 'dropdown',
    defaultValue: null,
    options: []
  },
  {
    type: 'dropdown',
    dataId: 'dropdownMul',
    config: {
      multiple: true
    },
    defaultValue: null,
    options: [],
    validators: [{ type: 'required' }]
  },
  {
    type: 'text',
    dataId: 'input',
    defaultValue: null,
    validators: []
  }
]

const option1 = { text: 'Option1', value: 1 }
const option2 = { text: 'Option2', value: 2 }

const apiData = {
  check: [1, 2],
  files: [option1],
  dropdown: option1,
  dropdownMul: [option1, option2],
  input: '123'
}

const dataMap = {
  check: 'check',
  files: 'files',
  dropdown: {
    id: 'dropdown',
    text: 'text',
    value: 'value'
  },
  dropdownMul: {
    id: 'dropdownMul',
    text: 'text',
    value: 'value'
  },
  input: 'input'
}

const result = {
  check: {
    defaultValue: { value: { 1: true, 2: true }, selected: apiData.check }
  },
  files: { defaultValue: { files: apiData.files, deletedFiles: [] } },
  dropdown: {
    defaultValue: { value: option1.value, selected: apiData.dropdown },
    options: [option1]
  },
  dropdownMul: {
    defaultValue: {
      value: [option1.value, option2.value],
      selected: apiData.dropdownMul
    },
    options: [option1, option2]
  },
  input: { defaultValue: apiData.input }
}

describe('FormUtils', () => {
  describe('getDefaultValues', () => {
    it('should return a proper config', () => {
      const formState = {
        check: { value: option1.value, selected: option1 },
        files: [option1],
        dropdown: { value: option1.value, selected: option1 },
        dropdownMul: {
          value: [option1.value, option2.value],
          selected: [option1, option2]
        },
        input: '123'
      }
      const output = {
        check: { defaultValue: formState.check },
        files: { defaultValue: formState.files },
        dropdown: { defaultValue: formState.dropdown, options: [option1] },
        dropdownMul: {
          defaultValue: formState.dropdownMul,
          options: [option1, option2]
        },
        input: { defaultValue: formState.input }
      }
      expect(getDefaultValues(data, formState)).toEqual(output)
    })
  })

  describe('conditionalFormDefaultValuesGetter', () => {
    it('should return proper defaultvalues', () => {
      const formDataFunc = () => data
      expect(
        conditionalFormDefaultValuesGetter(formDataFunc, apiData, dataMap)
      ).toEqual(result)
    })

    it('should return proper defaultvalues will null api', () => {
      const formDataFunc = () => data
      const apiDataNull = {
        check: null,
        files: null,
        dropdown: undefined,
        dropdownMul: undefined,
        input: null
      }
      const output = {
        check: { defaultValue: null },
        files: { defaultValue: { files: apiDataNull.files, deletedFiles: [] } },
        dropdown: { defaultValue: null, options: [] },
        dropdownMul: { defaultValue: null, options: [] },
        input: { defaultValue: apiDataNull.input }
      }
      expect(
        conditionalFormDefaultValuesGetter(formDataFunc, apiDataNull, dataMap)
      ).toEqual(output)
    })
  })

  describe('defaultValueMapper', () => {
    it('should return proper defaultValues', () => {
      const cloneData = cloneDeep(data)

      const defaultMappedData = defaultValueMapper(cloneData, apiData, dataMap)
      expect(defaultMappedData[0].dataId).toBe('check')
      expect(defaultMappedData[0].defaultValue).toEqual({
        value: { 1: true, 2: true },
        selected: [1, 2]
      })
    })
  })

  describe('apiDataMapper', () => {
    it('should map the data properly', () => {
      const formData = {}
      Object.keys(result).forEach((r) => (formData[r] = result[r].defaultValue))
      expect(apiDataMapper(formData, dataMap)).toEqual(apiData)
    })
  })

  describe('dropdownOptionsMapper', () => {
    it('should return null if supplied with no list', () => {
      expect(dropdownOptionsMapper(null, 'text', 'value')).toEqual([])
    })

    it('should return textValuePairList with default label as name and id', () => {
      const unMappedDropdown = [{ name: 'name', id: 'id' }]
      expect(dropdownOptionsMapper(unMappedDropdown)).toEqual([
        { text: 'name', value: 'id' }
      ])
    })

    it('should return proper text value pair if provided with label keys', () => {
      const unMappedDropdown = [{ key1: 'name', key2: 'id' }]
      expect(dropdownOptionsMapper(unMappedDropdown, 'key2', 'key1')).toEqual([
        { text: 'name', value: 'id' }
      ])
    })
  })

  describe('getValidatorMap', () => {
    it('should return a proper validator map', () => {
      const formData = {}
      Object.keys(result).forEach((r) => (formData[r] = result[r].defaultValue))
      const validatorMap = getValidatorMap(data, formData)
      expect(validatorMap[2].validators).toBeUndefined()
      expect(validatorMap[4].validators).toEqual([])
    })
  })

  describe('getFormGridStruct', () => {})

  describe('getErrorList', () => {})

  describe('getDefaultState', () => {})
})
