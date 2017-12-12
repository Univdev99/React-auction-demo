import React from 'react'

import IconPlus from 'icons/IconPlus'


const COMPONENT_CLASS = 'file-field'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const FileField = ({
  input: { value, ...inputProps },
  meta: { error, touched },
  placeholder
}) => (
  <div className={COMPONENT_CLASS}>
    <input
      className={bem('input')}
      type="file"
      {...inputProps}
    />
    <IconPlus size={10} className="mr-2" />
    <span className="align-middle">
      {value && value.length ? value[0].name : placeholder}
    </span>
  </div>
)

export default FileField
