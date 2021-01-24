import React from 'react'

import { MonthPicker, YearPicker } from './MonthYearPicker'

describe('Picker', () => {
  it('should render month picker', () => {
    const selectedMonthMock = jest.fn()
    const { container } = render(
      <MonthPicker selectedMonth='Apr' onSelectMonth={selectedMonthMock} />
    )

    expect(container).toMatchSnapshot()
  })

  it('should render year picker', () => {
    const selectYearMock = jest.fn()
    const { container } = render(
      <YearPicker
        year={2019}
        selectedYear={2019}
        onSelectYear={selectYearMock}
      />
    )

    expect(container).toMatchSnapshot()
  })
})
