import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'


class ChoiceDropdown extends PureComponent {

  static propTypes = {
    choices: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  state = {
    dropdownOpen: false
  }

  handleToggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  render() {
    const { choices, value, onSelect } = this.props

    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.handleToggle}>
        <DropdownToggle caret>
          {value}
        </DropdownToggle>
        <DropdownMenu>
          {choices.map(choice => (
            <DropdownItem
              key={choice}
              active={choice === value}
              onClick={() => onSelect(choice)}
            >
              {choice}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </ButtonDropdown>
    )
  }
}

export default ChoiceDropdown
