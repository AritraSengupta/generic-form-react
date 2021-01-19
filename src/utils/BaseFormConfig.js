export default class BaseFormConfig {
  constructor(props) {
    this.props = props
  }

  title = 'Generic Conditional Input Form'

  data = () => []

  reSyncValues = async (values, prevValues, errors) => ({ values, errors })
}
