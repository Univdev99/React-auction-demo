import React from 'react'
import cx from 'classnames'


const COMPONENT_CLASS = 'charities-block'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`
const bemM = (suffix) => `${COMPONENT_CLASS}--${suffix}`

const CharitiesBlock = ({ charities, forCard }) => (
  <div className={cx(COMPONENT_CLASS, { [bemM('card')]: forCard })}>
    <div
      className={cx('text-primary', {
        'h4': !forCard,
        'mb-3': !forCard,
        'mb-2': forCard
      })}
    >
      Supporting:
    </div>
    <div className={bem('logos')}>
      {charities.map((charity, index) => (
        <div key={index} className={bem('logo')}>
          <img src={charity.get('logo')} alt={charity.get('title')} title={charity.get('title')} />
        </div>
      ))}
    </div>
  </div>
)

export default CharitiesBlock
