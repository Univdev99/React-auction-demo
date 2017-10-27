import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import Autosuggest from 'react-autosuggest'

import './style.css'
import { getTagSuggestions } from 'store/modules/admin/tags'


class TagsInputField extends PureComponent {

  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string,
    helpText: PropTypes.string,
    getTagSuggestions: PropTypes.func.isRequired,
  }

  state = {
    suggestedTags: []
  }

  autosuggestRenderInput = ({ addTag, ...props }) => {
    const handleChange = (e, {newValue, method}) => {
      if (method === 'enter') {
        e.preventDefault()
      } else {
        props.onChange(e)
      }
    }

    const { suggestedTags } = this.state

    const theme = {
      container:                'react-autosuggest__container',
      containerOpen:            'react-autosuggest__container--open',
      input:                    'react-autosuggest__input',
      inputOpen:                'react-autosuggest__input--open',
      inputFocused:             'react-autosuggest__input--focused',
      suggestionsContainer:     'react-autosuggest__suggestions-container',
      suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
      suggestionsList:          'react-autosuggest__suggestions-list dropdown-menu show',
      suggestion:               'react-autosuggest__suggestion dropdown-item',
      suggestionFirst:          'react-autosuggest__suggestion--first',
      suggestionHighlighted:    'react-autosuggest__suggestion--highlighted',
      sectionContainer:         'react-autosuggest__section-container',
      sectionContainerFirst:    'react-autosuggest__section-container--first',
      sectionTitle:             'react-autosuggest__section-title'
    }

    return (
      <Autosuggest
        ref={props.ref}
        suggestions={suggestedTags}
        shouldRenderSuggestions={(value) => value && value.trim().length > 0}
        getSuggestionValue={suggestion => suggestion}
        renderSuggestion={(suggestion) => <span>{suggestion}</span>}
        inputProps={{...props, onChange: handleChange, style: { display: 'inline-block' }}}
        onSuggestionSelected={(e, {suggestion}) => addTag(suggestion)}
        onSuggestionsClearRequested={() => this.setState({ suggestedTags: [] })}
        onSuggestionsFetchRequested={this.getSuggestedTags}
        theme={theme}
      />
    )
  }

  getSuggestedTags = ({ value, reason }) => {
    this.props.getTagSuggestions({
      keyword: value,
      success: ({ data }) => {
        this.setState({
          suggestedTags: data
        })
      }
    })
  }

  handleChange = (value, changed, index) => {
    this.props.input.onChange(Immutable.fromJS(value))
  }

  value = () => {
    const value = this.props.input.value
    return value ? value.toJS() : []
  }

  render() {
    const {
      input,
      meta,
      label,
      helpText,
    } = this.props
    const { name } = input
    const fieldError = meta.invalid
    const errorClasses = ['form-text']
    if (meta.pristine) {
      errorClasses.push('text-muted')
    } else {
      errorClasses.push('text-danger')
    }

    return (
      <div className="form-group">
        {label && <label htmlFor={name}>{label}</label>}
        <TagsInput
          name={name}
          onChange={this.handleChange}
          value={this.value()}
          renderInput={this.autosuggestRenderInput}
        />
        {fieldError && <small className={errorClasses.join(' ')}>
          {meta.error}
        </small>}
        {helpText && !fieldError && <small className="form-text text-muted">
          {helpText}
        </small>}
      </div>
    )
  }
}

const actions = {
  getTagSuggestions,
}

export default compose(
  connect(null, actions)
)(TagsInputField)
