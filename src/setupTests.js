// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

global.render = render
global.screen = screen

// ----------------------------------------
// Console
// ----------------------------------------
// Fail on all activity.
// It is important we overload console here, before consoleUtil.js is loaded and caches it.
// let log
// let info
// let warn
// let error

// const throwOnConsole = (method) => (...args) => {
//   throw new Error(
//     `console.${method} should never be called but was called with:\n${args.join(' ')}`,
//   )
// }

// /* eslint-disable no-console */
// beforeEach(() => {
//   log = console.log
//   info = console.info
//   warn = console.warn
//   error = console.error

//   console.log = throwOnConsole('log')
//   console.info = throwOnConsole('info')
//   console.warn = throwOnConsole('warn')
//   console.error = throwOnConsole('error')
// })
// afterEach(() => {
//   console.log = log
//   console.info = info
//   console.warn = warn
//   console.error = error
// })
/* eslint-enable no-console */
