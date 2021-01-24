# react-generic-form

> Generic react form component

[![NPM](https://img.shields.io/npm/v/react-generic-form.svg)](https://www.npmjs.com/package/react-generic-form) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Example
You can find a few different examples here: https://aritrasengupta.github.io/react-generic-form/
## Install

```bash
npm install --save react-generic-form
```

## Usage

```jsx
import React, { Component } from 'react'

import { Form, BaseFormConfig } from 'react-generic-form';
import 'react-generic-form/dist/index.css'

/* Write the config */
class ExampleBasicForm extends BaseFormConfig {
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

/** Write the form component */
class Example extends Component {
  render() {
    const radioOptions = [
      { text: 'Radio1', value: 1 },
      { text: 'Radio2', value: 2 },
      { text: 'Radio3', value: 3 },
    ];

    const checkboxOptions = [
      { text: 'Checkbox1', value: 1 },
      { text: 'Checkbox2', value: 2 },
    ];
    const exampleForm = new ExampleBasicForm({ radioOptions, checkboxOptions });
    return <Form
      data={exampleForm.data}
      ref={formRef}
      defaultValues={defaultValues}
    />
  }
}
```

## License

MIT © [AritraSengupta](https://github.com/AritraSengupta)
