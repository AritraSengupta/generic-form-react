import { get, set, uniqBy, has } from 'lodash'

import { formatInputIfDate } from './Common'

/**
 * @param {*} formData -> the form datastructure object
 * @param {*} formState -> the current state of the form
 * This function returns the default values of the current form in the format which
 * the form understands. Should be used when converting formState to defaultvalue object
 * to be passed to the form
 */

export const getDefaultValues = (formData, formState) => {
  const defaultValues = {}
  formData.forEach((data) => {
    if (data.type === 'checkbox') {
      const defaultValue = get(formState, data.dataId, {
        value: {},
        selected: []
      })
      defaultValues[data.dataId] = {
        defaultValue
      }
      return
    }
    if (data.type === 'files') {
      const defaultValue = get(formState, data.dataId, [])
      defaultValues[data.dataId] = { defaultValue }
      return
    }
    if (data.type === 'dropdown') {
      const defaultValue = get(formState, data.dataId, {})
      let value
      let options
      if (data.config && data.config.multiple) {
        value = (defaultValue && defaultValue.selected) || []
        if (value.length === 0) {
          defaultValue.value = []
          defaultValue.selected = []
        }
        options = uniqBy([...(data.options || []), ...value], 'value')
      } else {
        const { selected } = defaultValue || {}
        value = selected ? [selected] : []
        options = uniqBy([...(data.options || []), ...value], 'value')
      }

      defaultValues[data.dataId] = {
        defaultValue,
        options
      }
      return
    }
    const defaultValue = get(formState, data.dataId, null)
    defaultValues[data.dataId] = {
      defaultValue
    }
  })
  return defaultValues
}

/**
 *
 * @param {*} formDataFunc: The conditional Form Function
 * @param {*} apiData: apiData of that needs mapped
 * @param {*} dataMap: the datamap to map apidata to formdata
 *
 * returns an object with keys as form ids and value with default values from api
 * NOTE options from dropdown are not mapped
 */
export const conditionalFormDefaultValuesGetter = (
  formDataFunc,
  apiData,
  dataMap
) => {
  const formData = formDataFunc({})
  const mappedDefaults = {}
  formData.forEach((data) => {
    if (data.type === 'checkbox') {
      const defaultValue = get(apiData, dataMap[data.dataId], null)
      if (defaultValue === null || defaultValue === undefined) {
        // case to handle null values for api calls
        mappedDefaults[data.dataId] = {
          defaultValue: null
        }
      } else {
        const value = (defaultValue || []).reduce((acc, curr) => {
          acc[curr] = true
          return acc
        }, {})
        mappedDefaults[data.dataId] = {
          defaultValue: {
            value,
            selected: defaultValue
          }
        }
      }
    } else if (data.type === 'files') {
      const defaultValue = get(apiData, dataMap[data.dataId], [])
      mappedDefaults[data.dataId] = {
        defaultValue: {
          files: defaultValue,
          deletedFiles: []
        }
      }
    } else if (data.type === 'dropdown') {
      const defaultValue = get(apiData, dataMap[data.dataId].id, null)
      if (defaultValue === null || defaultValue === undefined) {
        // case to handle null api values for api calls
        mappedDefaults[data.dataId] = {
          defaultValue: null,
          options: data.options
        }
      } else {
        const valueLabel = dataMap[data.dataId].value || 'id'
        const textLabel = dataMap[data.dataId].text || 'name'
        let value
        let options
        if (data.config && data.config.multiple) {
          const selected =
            (defaultValue &&
              defaultValue.map((d) => ({
                value: d[valueLabel],
                text: d[textLabel]
              }))) ||
            []
          value = {
            value:
              (defaultValue && defaultValue.map((d) => d[valueLabel])) || [],
            selected
          }
          options = uniqBy([...data.options, ...selected], 'value')
        } else {
          const selected = {
            text: defaultValue && defaultValue[textLabel],
            value: defaultValue && defaultValue[valueLabel]
          }
          value = { value: defaultValue && defaultValue[valueLabel], selected }
          options = uniqBy([...data.options, selected], 'value')
        }
        mappedDefaults[data.dataId] = {
          defaultValue: {
            ...value
          },
          options
        }
      }
    } else {
      const defaultValue = get(apiData, dataMap[data.dataId], null)
      mappedDefaults[data.dataId] = {
        defaultValue
      }
    }
  })
  return mappedDefaults
}

export const defaultValueMapper = (formData, apiData, dataMap) =>
  formData.map((data) => {
    if (data.type === 'checkbox') {
      const defaultValue = get(apiData, dataMap[data.dataId], []) || []
      const value = defaultValue.reduce((acc, curr) => {
        acc[curr] = true
        return acc
      }, {})
      return {
        ...data,
        defaultValue: { value, selected: defaultValue }
      }
    }
    if (data.type === 'files') {
      const defaultValue = get(apiData, dataMap[data.dataId], [])
      return {
        ...data,
        defaultValue: { files: defaultValue, deletedFiles: [] }
      }
    }
    if (data.type === 'dropdown') {
      const defaultValue = get(apiData, dataMap[data.dataId].id, null)
      const valueLabel = dataMap[data.dataId].value || 'id'
      const textLabel = dataMap[data.dataId].text || 'name'
      let value
      let options
      if (data.config && data.config.multiple) {
        const selected =
          (defaultValue &&
            defaultValue.map((d) => ({
              value: d[valueLabel],
              text: d[textLabel]
            }))) ||
          []
        value = {
          value: (defaultValue && defaultValue.map((d) => d[valueLabel])) || [],
          selected
        }
        options = uniqBy([...(data.options || []), ...selected], 'value')
      } else {
        const selected = {
          text: defaultValue && defaultValue[textLabel],
          value: defaultValue && defaultValue[valueLabel]
        }
        value = { value: defaultValue && defaultValue[valueLabel], selected }
        options = uniqBy([...(data.options || []), selected], 'value')
      }
      return {
        ...data,
        defaultValue: value,
        options
      }
    }
    const defaultValue = get(apiData, dataMap[data.dataId], null)
    return {
      ...data,
      defaultValue
    }
  })

export const apiDataMapper = (formData, dataMap) => {
  const apiData = {}
  Object.keys(formData).forEach((key) => {
    let formDataValue
    // Doing it this way ensures that is the selected key is present then the value
    // inside selected is retured regardless whether its falsy or not
    if (has(formData, `${key}.selected`)) {
      formDataValue = formData[key].selected
    } else if (has(formData, `${key}.files`)) {
      formDataValue = formData[key].files
    } else {
      // Change to OpenAPI spec if the date is in DD-MM-YYYY format
      formDataValue = formatInputIfDate(formData[key])
    }
    const formKey = dataMap[key].id || dataMap[key]
    set(apiData, formKey, formDataValue)
  })
  return apiData
}

export const dropdownOptionsMapper = (
  list,
  valueLabel = 'id',
  textLabel = 'name'
) => {
  if (!list) return []
  return list.map((l) => ({
    text: l[textLabel],
    value: l[valueLabel]
  }))
}

export const getValidatorMap = (form, formState) =>
  form.map((el) => {
    let value = formState[el.dataId]
    if (value && el.type === 'dropdown') {
      const { selected } = value
      if (Array.isArray(selected)) {
        value = selected.map((s) => s.text)
      } else {
        value = selected && selected.text
      }
    } else if (value && el.type === 'checkbox') {
      value = value.selected
    }
    return {
      id: el.dataId,
      validators: el.validators,
      value,
      name: el.fieldname
    }
  })

export const getFormGridStruct = (formData, columns) => {
  const gridList = []
  let i = 0
  while (i < formData.length) {
    const gridRow = []
    let j = 0
    while (j < columns && i < formData.length) {
      if (formData[i] && formData[i].type !== 'hidden') {
        gridRow.push(formData[i])
        j += 1
      }
      i += 1
    }

    if (gridRow.length) {
      gridList.push(gridRow)
    }
  }
  return gridList
}

export const getErrorList = (errors) => {
  const errorList = []
  Object.keys(errors).forEach((key) => {
    const valErrors = []
    ;(errors[key] || []).forEach((e) => {
      e.state && valErrors.push(`${e.name}: ${e.message}`)
    })
    errorList.push(...valErrors)
  })
  return errorList
}

export function getDefaultState(props) {
  return {
    formData: props.data.reduce((acc, curr) => {
      acc[curr.dataId] = curr.defaultValue
      return acc
    }, {}),
    errors: props.errors || {},
    dynamicOptions: props.data.reduce((acc, curr) => {
      if (curr.type === 'dropdown' && curr.config && curr.config.search) {
        acc[curr.dataId] = {
          options: curr.options,
          callback: curr.config.callback,
          loading: false
        }
      }
      return acc
    }, {})
  }
}
