import React from 'react'
import FormDisplay from './FormDisplay'

const data = [
  {
    dataId: 'id',
    type: 'hidden',
    defaultValue: null
  },
  {
    fieldname: 'Date',
    dataId: 'date',
    type: 'date',
    defaultValue: '',
    validators: [{ type: 'required' }]
  },
  {
    fieldname: 'Name',
    dataId: 'name',
    type: 'input',
    defaultValue: '',
    validators: [{ type: 'required' }]
  },
  {
    fieldname: 'TextArea',
    dataId: 'textarea',
    type: 'textarea',
    defaultValue: '',
    validators: [{ type: 'required' }]
  },
  {
    fieldname: 'Dropdown',
    dataId: 'dropdown',
    type: 'dropdown',
    defaultValue: {},
    config: {
      clearable: true
    },
    options: [
      { text: 'Option1', value: 1 },
      { text: 'Option2', value: 2 }
    ],
    validators: [{ type: 'required' }]
  },
  {
    fieldname: 'Checkbox',
    dataId: 'checkbox',
    type: 'checkbox',
    defaultValue: {},
    options: [
      { text: 'Option1', value: 1 },
      { text: 'Option2', value: 2 }
    ],
    validators: [{ type: 'required' }]
  },
  {
    fieldname: 'Radio',
    dataId: 'radio',
    type: 'radio',
    defaultValue: {},
    options: [
      { text: 'Option1', value: 1 },
      { text: 'Option2', value: 2 },
      { text: 'Option3', value: 3 }
    ],
    validators: [{ type: 'required' }]
  }
]

const formChangeMock = jest.fn()

describe('FormDisplay', () => {
  beforeEach(() => {
    formChangeMock.mockRestore()
  })

  it('should render', () => {
    const wrapper = render(<FormDisplay data={[]} onChange={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render with all the units', () => {
    const wrapper = render(
      <FormDisplay data={data} onChange={formChangeMock} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
