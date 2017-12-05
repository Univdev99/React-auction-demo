import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import RcSlider from 'rc-slider'


const COMPONENT_CLASS = 'slider'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const direction = (index) =>
  index % 2 ? 'bottom' : 'top'

const handle = (props) => {
  const { value, dragging, index, tipFormatter, ...restProps } = props;
  return (
    <RcSlider.Handle value={value} key={index} {...restProps}>
      <span className={cx(bem('handle-value'), bem(`handle-value--${direction(index)}`))}>
        {tipFormatter ? tipFormatter(value) : value}
      </span>
    </RcSlider.Handle>
  );
};

const defaultValue = ({ value, type, min, max }) => {
  if (type === 'range') {
    if (value) {
      if (value.length) {
        return value
      }
      if (value.size) {
        return value.toJS()
      }
    }
    return [min, max]
  } else {
    return value || parseInt(min + max / 2, 10)
  }
}

const Slider = (props) => {
  const { tipFormatter, type } = props
  const SliderComponent = type === 'range' ? RcSlider.Range : RcSlider
  return (
    <div className={COMPONENT_CLASS}>
      <SliderComponent
        {...props}
        handle={(props) => handle({ ...props, tipFormatter })}
        value={defaultValue(props)}
      />
    </div>
  )
}

Slider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['slider', 'range']),
  value: PropTypes.any
}

Slider.defaultProps = {
  type: 'slider'
}

export default Slider
