import React from 'react'

const FieldHeader = (props) => {
  return (
        <label htmlFor={props.name}>
            <p>
                {
                    props.header || props.name
                }
            </p>
            <span className='error'>
                {(props.error || props.backendError) && props.touched && (props.error || props.backendError)}
            </span>
        </label>
  )
}

export default FieldHeader
