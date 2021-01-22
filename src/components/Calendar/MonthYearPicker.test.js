import React from 'react'

import { MonthPicker, YearPicker } from './MonthYearPicker'

describe('Picker', () => {
  it('should render month picker', () => {
    const { container } = render(<MonthPicker selectedMonth='Apr' />)

    expect(container).toMatchSnapshot()
  })

  it('should render year picker', () => {
    const { container } = render(<YearPicker selectedYear={2019} />)

    expect(container).toMatchSnapshot()
  })
})
