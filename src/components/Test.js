import React from 'react'
import { Button } from 'semantic-ui-react'

export const Test = (props) => {
  return (
    <div>
      <Button content='Submit' />
      This is the time to get off the Trump train {props.text}
    </div>
  )
}
