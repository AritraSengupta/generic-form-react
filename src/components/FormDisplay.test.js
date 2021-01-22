import React from 'react'
import { fireEvent, getAllByRole } from '@testing-library/react'
import FormDisplay from './FormDisplay'
import '@testing-library/jest-dom/extend-expect'

const data = [
  {
    dataId: 'id',
    type: 'hidden',
    defaultValue: null
  },
  {
    dataId: 'random',
    defaultValue: '',
    validators: [{ type: 'required' }]
  },
  {
    fieldname: 'Date',
    dataId: 'date',
    type: 'date',
    defaultValue: '1-1-20',
    validators: [{ type: 'required' }]
  },
  {
    fieldname: 'Name',
    dataId: 'name',
    type: 'input',
    defaultValue: 'abcd',
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
    fieldname: 'Dropdown',
    dataId: 'dropdownMul',
    type: 'dropdown',
    defaultValue: {},
    config: {
      multiple: true,
      search: true,
      callback: jest.fn()
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

  it('should render with all the units', async () => {
    const { getByTestId, container, rerender } = render(
      <FormDisplay data={data} onChange={formChangeMock} columns={2} />
    )
    const inputWrapper = getByTestId('input')
    expect(container).toMatchSnapshot()
    const inputElement = inputWrapper.children[0]
    expect(inputElement.value).toBe('abcd')
    fireEvent.change(inputElement, { target: { value: '1234' } })
    expect(inputElement.value).toBe('1234')
    rerender(<FormDisplay data={[]} onChange={formChangeMock} />)
  })

  it('should be able to change dropdown values', () => {
    const dropdownData = [
      {
        fieldname: 'Dropdown',
        dataId: 'dropdown',
        type: 'dropdown',
        defaultValue: { value: 1, selected: { text: 'Option1', value: 1 } },
        config: {
          clearable: true
        },
        options: [
          { text: 'Option1', value: 1 },
          { text: 'Option2', value: 2 }
        ],
        validators: [{ type: 'required' }]
      }
    ]
    const { getByTestId, container } = render(
      <FormDisplay data={dropdownData} onChange={formChangeMock} />
    )
    const dropdownWrapper = getByTestId('dropdown')
    expect(container).toMatchSnapshot()
    const dropdownElement = dropdownWrapper.children[0]
    const dropdownOptions = getAllByRole(dropdownWrapper, 'option')
    const dropdownOptionsText = dropdownOptions.map((d) => d.textContent)
    expect(dropdownElement.textContent).toBe(dropdownOptionsText[0])
    // Open the dropdown choices
    fireEvent.click(dropdownElement)
    // Click the next option
    fireEvent.click(dropdownOptions[1])
    expect(dropdownElement.textContent).toBe(dropdownOptionsText[1])
  })

  it('should be able to search for the search dropdown', () => {
    const dropdownData = [
      {
        fieldname: 'Dropdown',
        dataId: 'dropdown',
        type: 'dropdown',
        defaultValue: { value: 1, selected: { text: 'Option1', value: 1 } },
        config: {
          clearable: true,
          search: true,
          callback: () => {
            return [
              { text: 'Option3', value: 1 },
              { text: 'Option4', value: 2 }
            ]
          }
        },
        options: [
          { text: 'Option1', value: 1 },
          { text: 'Option2', value: 2 }
        ],
        validators: [{ type: 'required' }]
      }
    ]
    const { getByTestId, container } = render(
      <FormDisplay data={dropdownData} onChange={formChangeMock} />
    )
    const dropdownWrapper = getByTestId('dropdown-search')
    expect(container).toMatchSnapshot()
    const searchInput = dropdownWrapper.children[0]
    // Open the dropdown choices
    fireEvent.click(dropdownWrapper)
    fireEvent.click(searchInput)

    fireEvent.input(searchInput, { target: { value: 'Option' } })
    expect(dropdownWrapper).toMatchSnapshot()
    expect(searchInput.value).toBe('Option')
  })

  it('should validate form', () => {
    const dropdownData = [
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
      }
    ]
    const ref = React.createRef()
    const { container } = render(
      <FormDisplay data={dropdownData} onChange={formChangeMock} ref={ref} />
    )
    ref.current.validateForm()
    expect(container).toMatchSnapshot()
    expect(
      container.children[0].children[0].children[0].children[1].textContent
    ).toBe('Dropdown: is required')
  })
})
