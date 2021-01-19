import React from 'react'
import { Table } from 'semantic-ui-react'

const monthData = [
  ['Jan', 'Feb', 'Mar'],
  ['Apr', 'May', 'Jun'],
  ['Jul', 'Aug', 'Sep'],
  ['Oct', 'Nov', 'Dec']
]

const yearData = (year) => [
  [year - 7, year - 6, year - 5],
  [year - 4, year - 3, year - 2],
  [year - 1, year, year + 1],
  [year + 2, year + 3, year + 4]
]

export class MonthPicker extends React.Component {
  constructor(props) {
    super(props)

    this._clickMonth = this._clickMonth.bind(this)
  }

  processCells = (tableBodyProps) => {
    const { selectedMonth } = this.props
    const cells = []
    tableBodyProps.forEach((month) => {
      const dayObj = {
        key: month,
        content: month || '',
        className: `compact highlight ${
          selectedMonth === month ? 'selected' : ''
        }`,
        onClick: this._clickMonth,
        'data-name': month
      }
      cells.push(dayObj)
    })
    return cells
  }

  renderBodyRowNew = (tableBodyProps, i) => ({
    key: `row-${i}`,
    cells: this.processCells(tableBodyProps)
  })

  _clickMonth(e) {
    const { onSelectMonth } = this.props
    onSelectMonth(e.target.dataset.name)
  }

  render() {
    return (
      <Table
        size='small'
        textAlign='center'
        renderBodyRow={this.renderBodyRowNew}
        tableData={monthData}
        className='table-month'
      />
    )
  }
}

export class YearPicker extends React.Component {
  constructor(props) {
    super(props)

    this._clickYear = this._clickYear.bind(this)
  }

  _clickYear(e) {
    const { onSelectYear } = this.props
    onSelectYear(parseInt(e.target.dataset.name))
  }

  processCells = (tableBodyProps) => {
    const { selectedYear } = this.props
    const cells = []
    tableBodyProps.forEach((year) => {
      const yearObj = {
        key: year,
        content: year || '',
        className: `compact highlight ${
          selectedYear === year ? 'selected' : ''
        }`,
        onClick: this._clickYear,
        'data-name': year
      }
      cells.push(yearObj)
    })
    return cells
  }

  renderBodyRowNew = (tableBodyProps, i) => ({
    key: `row-${i}`,
    cells: this.processCells(tableBodyProps)
  })

  render() {
    const { year } = this.props
    return (
      <Table
        size='small'
        textAlign='center'
        renderBodyRow={this.renderBodyRowNew}
        tableData={yearData(year)}
        className='table-month'
      />
    )
  }
}
