import React from 'react'
import { Grid, Header } from 'semantic-ui-react'
import { MonthTable } from './Month'

function getMonthArray(endingMonth, totalMonths, year) {
  let monthValue = endingMonth
  let yearValue = year
  const monthArray = []
  for (let i = 0; i < totalMonths; i += 1) {
    if (monthValue === 0) {
      monthValue = 12
      yearValue -= 1
    }
    monthArray.unshift({ month: monthValue, year: yearValue })
    monthValue -= 1
  }

  return monthArray
}

export default function Calendar(props) {
  const { endingMonth, year, totalMonths, highlightedDates } = props
  const months = [
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
  const monthArray = getMonthArray(endingMonth, totalMonths, year)
  return (
    <Grid stackable>
      {monthArray.map((month) => (
        <Grid.Column width={5} key={`${months[month.month - 1]} ${month.year}`}>
          <Header as='h4'>{`${months[month.month - 1]} ${month.year}`}</Header>
          <MonthTable
            month={month.month}
            year={month.year}
            highlightedDates={
              (highlightedDates &&
                highlightedDates[year] &&
                highlightedDates[year][month]) ||
              []
            }
          />
        </Grid.Column>
      ))}
    </Grid>
  )
}
