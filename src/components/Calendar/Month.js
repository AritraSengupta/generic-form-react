import React from 'react'
import { Table } from 'semantic-ui-react'
import { getDateString, isValidDate } from '../../utils'

export const isDisabledCell = (date, month, year, startDisable, endDisable) => {
  if (!date) return true

  if (!isValidDate(startDisable) && !isValidDate(endDisable)) return false
  const start = isValidDate(startDisable) ? startDisable : -Infinity
  const end = isValidDate(endDisable) ? endDisable : Infinity
  const currentDate = new Date(year, month, date)

  return currentDate >= start && currentDate <= end
}

/**
 * type Props = {
 *  onChange: (e: Event, name: string) => void
 *  month: string
 *  year: string
 *  selectedOrCurrent: Date string (DD-MM-YYYY), showing date in blue, useful for showing selection
 *  highlightedDates: Array<{[date: number]: warning | negative | positive | error}>
 * }
 *
 * selectedOrCurrent is used to show a selected or current date when using a date picker
 * highlightedDates are to be used in calendar mode when each month is a different instance of the component
 */

export class MonthTable extends React.Component {
  _dayArray = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  _monthArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  getMonthData(month, year) {
    // Month + 1 because 0th date is last day of prev month
    const lastDate = new Date(year, month + 1, 0)
    if (isValidDate(lastDate)) {
      const days = lastDate.getDate()
      const day = lastDate.getDay()
      return this.createMonthObject([{}], day, days)
    }
    return null
  }

  _getClassName = (day, tableBodyProps, disabled) => {
    const date = tableBodyProps[day] || ''
    if (!date) return 'compact'
    if (disabled) return 'compact disabled'
    const { month, year, selectedOrCurrent } = this.props
    const cellDate = getDateString(date, month, year)
    return cellDate === selectedOrCurrent
      ? 'compact highlight selected'
      : 'compact highlight'
  }

  _clickDay = (e) => {
    const { onChange } = this.props
    onChange(e, e.target.dataset.name)
  }

  processCells = (tableBodyProps) => {
    const {
      highlightedDates,
      month,
      year,
      disableStart,
      disableEnd
    } = this.props
    const cells = []
    this._dayArray.forEach((day) => {
      const isDisabled = isDisabledCell(
        tableBodyProps[day],
        month,
        year,
        disableStart,
        disableEnd
      )
      const dayObj = {
        key: day,
        content: tableBodyProps[day] || '',
        className: this._getClassName(day, tableBodyProps, isDisabled),
        onClick: !isDisabled ? this._clickDay : null, // To prevent clicking outside a given date
        'data-name': tableBodyProps[day]
      }
      const specialSign =
        highlightedDates && highlightedDates[tableBodyProps[day]]
      if (specialSign) {
        dayObj[specialSign] = true
      }
      cells.push(dayObj)
    })
    return cells
  }

  getHeaderRow() {
    return {
      cells: this._dayArray.map((day) => ({
        key: day,
        style: { padding: 0 },
        content: day
      }))
    }
  }

  createMonthObject(data, dayIndex, date) {
    if (date === 0) return data

    const dayString = this._dayArray[dayIndex]

    // eslint-disable-next-line
    data[0][dayString] = date;

    if (dayIndex === 0 && date > 1) {
      data.unshift({})
      return this.createMonthObject(data, 6, date - 1)
    }

    return this.createMonthObject(data, dayIndex - 1, date - 1)
  }

  renderBodyRowNew = (tableBodyProps, i) => ({
    key: `row-${i}`,
    cells: this.processCells(tableBodyProps)
  })

  render() {
    const { month, year } = this.props
    const tableData = this.getMonthData(month, year)
    const headerRow = this.getHeaderRow()
    if (!tableData) {
      return <span> Invalid Date </span>
    }
    return (
      <Table
        size='small'
        textAlign='center'
        collapsing
        headerRow={headerRow}
        renderBodyRow={this.renderBodyRowNew}
        tableData={tableData}
        className='table-month'
      />
    )
  }
}

export default MonthTable
