import { BaseFormConfig } from 'generic-form-react';

const searchFunction = async () => new Promise((resolve) => setTimeout(() => resolve([
  { text: 'Option1', value: 1 },
  { text: 'Option2', value: 2 },
  { text: 'Option3', value: 3 },
  { text: 'Option4', value: 4 },
]), 1000));

export class ConditionalFormBasic extends BaseFormConfig {
  title = 'Basic Example'

  data = (currValue, prevValues) => {
    const dateDefaultValue = currValue.date && currValue.date.defaultValue;
    const nameDefaultValue = dateDefaultValue ? currValue.name && currValue.name.defaultValue : null;
    const textAreaDefaultValue = nameDefaultValue ? currValue.textarea && currValue.textarea.defaultValue : null;
    const dropdownDefaultValue = textAreaDefaultValue ? currValue.dropdown && currValue.dropdown.defaultValue : {};
    const prevDropdownDefaultValue = prevValues && prevValues.dropdown && prevValues.dropdown.defaultValue;
    const checkboxDefaultValue =(prevDropdownDefaultValue || {}).value !== (dropdownDefaultValue || {}).value
      ? {}
      : (currValue.checkbox && currValue.checkbox.defaultValue) || {};
    const radioDefaultValue = checkboxDefaultValue.value ? currValue.radio && currValue.radio.defaultValue : {};

    return [
      {
        dataId: 'id',
        type: 'hidden',
        defaultValue: null,
      },
      {
        fieldname: 'Date',
        dataId: 'date',
        type: 'date',
        defaultValue: dateDefaultValue,
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'Name',
        dataId: 'name',
        type: 'input',
        defaultValue: nameDefaultValue,
        config: {
          visible: !!dateDefaultValue,
        },
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'TextArea',
        dataId: 'textarea',
        type: 'textarea',
        config: {
          visible: !!nameDefaultValue,
        },
        defaultValue: textAreaDefaultValue,
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'Dropdown',
        dataId: 'dropdown',
        type: 'dropdown',
        defaultValue: dropdownDefaultValue,
        config: {
          search: true,
          callback: searchFunction,
          clearable: true,
          visible: !!textAreaDefaultValue,
        },
        options: (currValue.dropdown && currValue.dropdown.options) || [],
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'Checkbox',
        dataId: 'checkbox',
        type: 'checkbox',
        defaultValue: checkboxDefaultValue,
        config: {
          visible: !!dropdownDefaultValue.value,
        },
        options: [
          { text: 'Checkbox1', value: 1 },
          { text: 'Checkbox2', value: 2 },
        ],
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'Radio',
        dataId: 'radio',
        type: 'radio',
        config: {
          visible: checkboxDefaultValue.selected !== undefined && checkboxDefaultValue.selected !== null && !!checkboxDefaultValue.selected.length,
        },
        defaultValue: radioDefaultValue,
        options: [
          { text: 'Radio1', value: 1 },
          { text: 'Radio2', value: 2 },
          { text: 'Radio3', value: 3 },
        ],
      },
    ];
  }
}
