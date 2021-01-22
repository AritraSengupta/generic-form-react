import React from 'react'
import { fireEvent } from '@testing-library/react'
import Month, { isDisabledCell } from './Month'

describe('Month', () => {
  it('should render a invalid table if data is invalid', () => {
    const { container } = render(<Month month='April' year={null} />)
    expect(container).toMatchSnapshot()
    const tableObj = container.querySelectorAll('table')
    expect(tableObj.length).toBe(0)
  })
  it('should render a month table if valid date', () => {
    const { container } = render(
      <Month month={1} year={2019} disableStart='2019-2-15' />
    )
    expect(container).toMatchSnapshot()
    const tableObj = container.getElementsByTagName('table')
    expect(tableObj.length).toBe(1)
  })

  it('should be able to click and date', () => {
    const clickMock = jest.fn()
    const { container } = render(
      <Month month={1} year={2019} onChange={clickMock} />
    )
    const tableObj = container.querySelectorAll('td[data-name="16"]')
    expect(tableObj.length).toBe(1)
    fireEvent.click(tableObj[0])
    expect(clickMock).toHaveBeenCalledWith(expect.anything(), '16')
  })
})
