import React from 'react'
import { fireEvent } from '@testing-library/react'

import { withNestedModal } from './NestedModal'

class Test extends React.Component {
  render() {
    return <span>Test</span>
  }
}

describe('Nested Modal', () => {
  it('should render NestedModal', () => {
    const Component = withNestedModal(Test, <button>Click</button>, { id: 1 })
    const saveMock = jest.fn()
    const deleteMock = jest.fn()

    const { container } = render(
      <Component onSave={saveMock} onDelete={deleteMock} />
    )

    expect(container).toMatchSnapshot()
    const button = container.getElementsByTagName('button')
    expect(button.length).toBe(1)
    expect(container.textContent).toBe('Click')

    fireEvent.click(button[0])
    expect(container).toMatchSnapshot()
  })
})
