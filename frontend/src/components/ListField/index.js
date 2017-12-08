import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Button, Label, Input, FormFeedback, FormGroup, FormText } from 'reactstrap'
import { sanitizeFormError } from 'utils/form'


class ListField extends PureComponent {

  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string,
    helpText: PropTypes.string,
    options: ImmutablePropTypes.list.isRequired,
    getTitle: PropTypes.func.isRequired,
  }

  state = {
    selectValue: 0
  }

  getItemTitle = (pk) => {
    const { options, getTitle } = this.props
    const item = options.find(option => option.get('pk') === pk)
    if (item) {
      return getTitle(item)
    }
    return ' '
  }

  handleRemoveItem = (pk, event) => {
    event.preventDefault()

    const { input } = this.props
    const _value = input.value.filter(item => item !== pk)
    input.onChange(_value)
  }

  handleAddItem = () => {
    const { input } = this.props
    const { selectValue } = this.state

    if (!selectValue) {
      return
    }
    const _value = input.value.push(parseInt(selectValue, 10))
    input.onChange(_value)
  }

  handleSelectChange = (event) => {
    this.setState({
      selectValue: event.target.value
    })
  }

  render() {
    const {
      input,
      meta: { error, touched },
      label,
      helpText,
      options,
      getTitle,
    } = this.props
    const { name, value } = input
    const { selectValue } = this.state
    const fieldError = touched && error

    const availableOptions = options.filter(option => value.indexOf(option.get('pk')) === -1)

    return (
      <FormGroup>
        {label && <Label htmlFor={name}>{label}</Label>}
        <div>
          {value && value.map(itemPk => (
            <div key={itemPk} className="mb-2 border px-2 py-1" style={{ borderRadius: 3 }}>
              {this.getItemTitle(itemPk)}
              <a href="/" onClick={this.handleRemoveItem.bind(this, itemPk)}>
                <i className="p-1 float-right fa fa-close" />
              </a>
            </div>
          ))}
          <div className="d-flex">
            <div className="pr-1" style={{ flex: '1 1 auto' }}>
              <Input
                type="select"
                disabled={availableOptions.size === 0}
                value={selectValue}
                onChange={this.handleSelectChange}
              >
                <option value={0}>- Select a charity -</option>
                {availableOptions.map(option => (
                  <option
                    key={option.get('pk')}
                    value={option.get('pk')}
                  >
                    {getTitle(option)}
                  </option>
                ))}
              </Input>
            </div>
            <div>
              <Button color="primary" onClick={this.handleAddItem}>Add</Button>
            </div>
          </div>
        </div>
        {fieldError && <FormFeedback>{sanitizeFormError(error)}</FormFeedback>}
        {helpText && !fieldError && <FormText>{helpText}</FormText>}
      </FormGroup>
    )
  }
}

export default ListField
