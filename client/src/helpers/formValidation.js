const validateEmail = value => {
  let errorMessage

  if (!value) {
    errorMessage = 'Required'
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
  ) {
    errorMessage = 'Invalid email address'
  }

  return errorMessage
}

function minLength (value, name, length) {
  return value.length < length ? `${name} must have ${length} characters.` : null
}

export { validateEmail, minLength }
