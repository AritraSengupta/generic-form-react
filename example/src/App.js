import React, { useState, useRef } from 'react';
import { Form } from 'generic-form-react';

import { ExampleBasicForm } from './FormConfig';
import { AsyncSearchExample } from './AsyncSearchExample';
import { ConditionalFormBasic } from './ConditionalFormBasic';
import { ConditionalFormAdvanced } from './ConditionalFormAdvanced';

import './index.css';
import 'generic-form-react/dist/index.css';
import 'semantic-ui-css/semantic.min.css';

const style = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
  },
  formContainer: {
    width: '400px',
  },
  link: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  get linkSelected() {
    return ({
      ...this.link,
      color: 'black',
      fontWeight: 600,
    });
  },
  buttonReset: {
    marginLeft: '260px',
    marginTop: '20px',
  },
  buttonSubmit: {
    marginLeft: '10px',
    marginTop: '20px',
  },
  separator: {
    marginRight: '8px',
  }
};

const headerMap = {
  basic: {
    header: 'Basic Form Example',
    description: 'This is a basic form example with validation.'
  },
  async: {
    header: 'Dropdown with Asynchronous Values',
    description: 'The dropdown options are loaded dynamically from backend'
  },
  conditional1: {
    header: 'Conditional Form Basic',
    description: 'The form is loaded conditionally based on the current state of the form',
  },
  conditional2: {
    header: 'Conditional Form Advanced',
    description: 'The form options to the second dropdown is based on an api call from the first dropdown',
  },
};

const radioOptions = [
  { text: 'Radio1', value: 1 },
  { text: 'Radio2', value: 2 },
  { text: 'Radio3', value: 3 },
];

const checkboxOptions = [
  { text: 'Checkbox1', value: 1 },
  { text: 'Checkbox2', value: 2 },
];

export default () => {
  const formRef = useRef(null);
  const [ formType, setFormType ] = useState('basic');

  const exampleForm = new ExampleBasicForm({ radioOptions, checkboxOptions });
  const asyncExample = new AsyncSearchExample();
  const conditionalFormBasic = new ConditionalFormBasic();
  const conditionalFormAdvanced = new ConditionalFormAdvanced();

  const validateForm = () => {
    if (formRef.current.validateForm) {
      formRef.current.validateForm();
    }
  };
  
  const getLinkStyle = (linkName) => linkName === formType ? style.linkSelected : style.link;

  return (
    <div style={style.container}>
      <div style={style.formContainer}>
        <div>
          <button
            onClick={() => setFormType('basic')}
            style={getLinkStyle('basic')}
            className={'link'}
          >
            Basic
          </button>
          <span style={style.separator}>|</span> 
          <button
            onClick={() => setFormType('async')}
            style={getLinkStyle('async')}
            className={'link'}
          > 
          Async
          </button>
          <span style={style.separator}>|</span> 
          <button
            onClick={() => setFormType('conditional1')}
            style={getLinkStyle('conditional1')}
            className={'link'}
          >
            Conditional
          </button>
          <span style={style.separator}>|</span> 
          <button
            onClick={() => setFormType('conditional2')}
            style={getLinkStyle('conditional2')}
            className={'link'}
          >
            Conditional (Adv)
          </button>
          <span style={style.separator}>|</span> 
          <hr />
        </div>
        <div>
          <h3>{headerMap[formType].header}</h3>
          <span>{headerMap[formType].description}</span>
        </div>
        {formType === 'basic' && <Form
          data={exampleForm.data}
          ref={formRef}
        />}
        {formType === 'async' && <Form
          data={asyncExample.data}
          ref={formRef}
        />}
        {formType === 'conditional1' && <Form
          data={conditionalFormBasic.data}
          ref={formRef}
        />}
        {formType === 'conditional2' && <Form
          data={conditionalFormAdvanced.data}
          reSyncValues={conditionalFormAdvanced.reSyncValues}
          ref={formRef}
        />}
        <div>
          <button onClick={validateForm} className={'btn btn_primary'} style={style.buttonSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
} 
