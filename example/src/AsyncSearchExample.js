import { BaseFormConfig } from 'react-generic-form';

const searchFunction = async () => new Promise((resolve) => setTimeout(() => resolve([
  { text: 'Option1', value: 1 },
  { text: 'Option2', value: 2 },
  { text: 'Option3', value: 3 },
  { text: 'Option4', value: 4 },
]), 1000));

export class AsyncSearchExample extends BaseFormConfig {
  title = 'Basic Example'

  data = (currValue, prevValues) => {
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
        defaultValue: currValue.date && currValue.date.defaultValue,
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'Name',
        dataId: 'name',
        type: 'input',
        defaultValue: currValue.name && currValue.name.defaultValue,
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'TextArea',
        dataId: 'textarea',
        type: 'textarea',
        defaultValue: currValue.textarea && currValue.textarea.defaultValue,
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'Dropdown',
        dataId: 'dropdown',
        type: 'dropdown',
        defaultValue: currValue.dropdown && currValue.dropdown.defaultValue,
        config: {
          search: true,
          callback: searchFunction,
          clearable: true,
        },
        options: currValue.dropdown && currValue.dropdown.options || [],
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'Dropdown Multiple',
        dataId: 'dropdownMul',
        type: 'dropdown',
        defaultValue: currValue.dropdown && currValue.dropdownMul.defaultValue,
        config: {
          multiple: true,
          search: true,
          callback: searchFunction,
          clearable: true,
        },
        options: currValue.dropdown && currValue.dropdownMul.options || [],
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'Checkbox',
        dataId: 'checkbox',
        type: 'checkbox',
        defaultValue: currValue.checkbox && currValue.checkbox.defaultValue,
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
        defaultValue: currValue.radio && currValue.radio.defaultValue,
        options: [
          { text: 'Radio1', value: 1 },
          { text: 'Radio2', value: 2 },
          { text: 'Radio3', value: 3 },
        ],
      },
    ];
  }
}
