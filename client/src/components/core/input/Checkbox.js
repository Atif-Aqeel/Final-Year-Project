import React from 'react'
import clsx from 'clsx'

const Checkbox = (props) => {
  return (<label htmlFor={props.id} className={clsx({
    'flex items-center justify-center gap-4 cursor-pointer pl-5 w-auto': true,
    'opacity-70': props.disabled
  })}>
            <input
                className='w-auto'
                type="checkbox"
                name={props.id}
                id={props.id}
                checked={props.checked}
                onChange={() => {
                  props.toggleCheck(props.id)
                }}
                disabled={props.disabled}
            />
            <p className='text-4xl'>
                {props.name}
            </p>
        </label>
  )
}

export default Checkbox
