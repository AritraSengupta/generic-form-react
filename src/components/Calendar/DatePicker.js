import React from 'react'
import PropTypes from 'prop-types'
import { Input, Icon, Popup } from 'semantic-ui-react'
import { isEqual } from 'lodash'

import { MonthTable } from './Month'
import { MonthPicker, YearPicker } from './MonthYearPicker'
import { isValidDate, getDateString, changeToUSDateStyle } from '../../utils'

import './DatePicker.css'

/**
 *
 * @param {*} dateValue date input string
 * This functions attempts to convert the input string into a valid date or else tells its an invalid date
 * However if the date is invalid it returns today's day month and year for default placement
 */
export const getDateMonthYear = (dateValue) => {
  // Chaning to US style takes priority
  let providedDate = new Date(changeToUSDateStyle(dateValue || ''))
  let isValidProvidedDate = isValidDate(providedDate)
  if (!isValidProvidedDate) {
    // Last try
    providedDate = new Date(dateValue || '')
    isValidProvidedDate = isValidDate(providedDate)
  }
  const defaultDate = isValidProvidedDate ? providedDate : new Date(Date.now())
  const month = defaultDate.getMonth()
  const year = defaultDate.getFullYear()
  const date = defaultDate.getDate()

  return {
    isValidProvidedDate,
    date,
    month,
    year,
    value: `${date}-${month + 1}-${year}`
  }
}

export const Changer = ({ label, onPrev, onNext, onClick }) => (
  <div style={{ height: 20, backgroundColor: 'white' }}>
    <Icon name='arrow left' onClick={onPrev} className='arrow_icon' />
    <div
      style={{ display: 'inline-block', margin: '0 40px', cursor: 'pointer' }}
      onClick={onClick}
    >
      {label}
    </div>
    <Icon name='arrow right' onClick={onNext} className='arrow_icon' />
  </div>
)

/**
 * Props: {
 *  value(OPTIONAL): date string format (DD-MM-YYYY) to be shown on the input field, default is Date.now()
 *  onDateChange(OPTIONAL): (e: event, {props: Props, value: string}) => void
 * }
 */
export default class DatePicker extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { value: propsValue, startDisabled, endDisabled } = nextProps
    const startDisabledObj = getDateMonthYear(startDisabled || null)
    const endDisabledObj = getDateMonthYear(endDisabled || null)
    const {
      value: stateValue,
      startDisabled: startOld,
      endDisabled: endOld
    } = prevState
    const { isValidProvidedDate, value } = getDateMonthYear(propsValue)

    const newState = {}
    if (propsValue && propsValue !== stateValue) {
      newState.value = isValidProvidedDate ? value : propsValue
    }

    if (startDisabledObj.value !== startOld) {
      newState.startDisabled = startDisabledObj.isValidProvidedDate
        ? startDisabledObj
        : null
    }

    if (endDisabledObj.value !== endOld) {
      newState.endDisabled = endDisabledObj.isValidProvidedDate
        ? endDisabledObj
        : null
    }

    return newState
  }

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

  constructor(props) {
    super(props)

    const { date, month, year, isValidProvidedDate, value } = getDateMonthYear(
      props.value
    )
    const startDisabledObj = getDateMonthYear(props.startDisabled || '')
    const endDisabledObj = getDateMonthYear(props.endDisabled || '')
    this.state = {
      month,
      year,
      date,
      value: isValidProvidedDate ? value : '',
      popupOpen: false,
      showMonth: false,
      showYear: false,
      pickerYear: year,
      startDisabled: startDisabledObj.isValidProvidedDate
        ? startDisabledObj
        : null,
      endDisabled: endDisabledObj.isValidProvidedDate ? endDisabledObj : null
    }
    this._today = getDateString(date, month, year)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { value, popupOpen } = this.state
    const { popupOpenNew } = nextState
    const { value: newValue } = nextProps
    return (
      value !== newValue ||
      popupOpen !== popupOpenNew ||
      !isEqual(this.props, nextProps)
    )
  }

  _yearPrev = () => {
    let { year } = this.state
    year -= 1
    this.setState({ year })
  }

  _yearNext = () => {
    let { year } = this.state
    year += 1
    this.setState({ year })
  }

  _monthNext = () => {
    let { month, year } = this.state
    month += 1
    if (month > 11) {
      month = 0
      year += 1
    }
    this.setState({ month, year })
  }

  _monthPrev = () => {
    let { month, year } = this.state
    month -= 1
    if (month < 0) {
      month = 11
      year -= 1
    }
    this.setState({ month, year })
  }

  _onDateChange = (e, date) => {
    const { month, year } = this.state
    const { onDateChange } = this.props
    const value = getDateString(date, month, year)
    if (onDateChange) {
      onDateChange(e, { ...this.props, value })
      this.setState({ popupOpen: false })
    } else {
      this.setState({ value, date, popupOpen: false })
    }
  }

  _onClick = () => {
    this.setState({ popupOpen: true })
  }

  _handleClose = () => {
    this.setState({ popupOpen: false })
  }

  _showMonthTable = () => {
    this.setState({ showMonth: true })
  }

  _hideMonthTable = () => {
    this.setState({ showMonth: false })
  }

  _showYearTable = () => {
    this.setState({ showYear: true })
  }

  _onSelectMonth = (month) => {
    this.setState({ month: this._monthArray.indexOf(month), showMonth: false })
  }

  _onSelectYear = (year) => {
    this.setState({ year, pickerYear: year, showYear: false })
  }

  _pickerYearPrev = () => {
    const { pickerYear } = this.state
    this.setState({ pickerYear: pickerYear - 12 })
  }

  _pickerYearNext = () => {
    const { pickerYear } = this.state
    this.setState({ pickerYear: pickerYear + 12 })
  }

  render() {
    const {
      month,
      year,
      date,
      value,
      popupOpen,
      showMonth,
      showYear,
      pickerYear,
      startDisabled,
      endDisabled
    } = this.state
    const disableStart = startDisabled
      ? new Date(startDisabled.year, startDisabled.month, startDisabled.date)
      : null
    const disableEnd = endDisabled
      ? new Date(endDisabled.year, endDisabled.month, endDisabled.date)
      : null

    const DatePickerHolder = (
      <div className='date_picker_container results transition visible'>
        <Changer
          label={year}
          onPrev={this._yearPrev}
          onNext={this._yearNext}
          onClick={this._showYearTable}
        />
        <Changer
          label={this._monthArray[month]}
          onPrev={this._monthPrev}
          onNext={this._monthNext}
          onClick={this._showMonthTable}
        />
        <MonthTable
          disableStart={disableStart}
          disableEnd={disableEnd}
          month={month}
          year={year}
          date={date}
          onChange={this._onDateChange}
          selectedOrCurrent={value || this._today}
        />
      </div>
    )

    const YearPickerHolder = (
      <div className='date_picker_container results transition visible'>
        <Changer
          label={null}
          onPrev={this._pickerYearPrev}
          onNext={this._pickerYearNext}
          onClick={() => null}
        />
        <YearPicker
          onSelectYear={this._onSelectYear}
          year={pickerYear}
          selectedYear={year}
        />
      </div>
    )

    const MonthPickerHolder = (
      <div className='date_picker_container results transition visible'>
        <MonthPicker
          onSelectMonth={this._onSelectMonth}
          selectedMonth={this._monthArray[month]}
        />
      </div>
    )

    let Picker
    if (showMonth) {
      Picker = MonthPickerHolder
    } else if (showYear) {
      Picker = YearPickerHolder
    } else {
      Picker = DatePickerHolder
    }

    const Trigger = (
      <Input
        fluid
        icon='calendar'
        iconPosition='left'
        value={value}
        onClick={this._onClick}
      />
    )

    return (
      <Popup
        trigger={Trigger}
        content={Picker}
        on='click'
        open={popupOpen}
        onClose={this._handleClose}
        basic
        style={{ padding: 0 }}
        verticalOffset={-10}
      />
    )
  }
}

DatePicker.propTypes = {
  value: PropTypes.string,
  startDisabled: PropTypes.string,
  endDisabled: PropTypes.string,
  onDateChange: PropTypes.func.isRequired
}
