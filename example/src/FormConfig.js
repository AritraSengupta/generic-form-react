import { BaseFormConfig } from 'generic-form-react';

export class ExampleBasicForm extends BaseFormConfig {
  title = 'Basic Example'

  data = (currValue, prevValues) => {
    const { checkboxOptions, radioOptions } = this.props;
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
          clearable: true,
        },
        options: [
          { text: 'Option1', value: 1 },
          { text: 'Option2', value: 2 },
        ],
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'Checkbox',
        dataId: 'checkbox',
        type: 'checkbox',
        defaultValue: currValue.checkbox && currValue.checkbox.defaultValue,
        options: checkboxOptions,
        validators: [{ type: 'required' }],
      },
      {
        fieldname: 'Radio',
        dataId: 'radio',
        type: 'radio',
        defaultValue: currValue.radio && currValue.radio.defaultValue,
        options: radioOptions,
        validators: [{ type: 'required' }],
      },
    ];
  }
}
