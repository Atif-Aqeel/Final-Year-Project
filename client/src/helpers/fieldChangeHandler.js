const fieldChangeHandler = (e, handleChange, backendErrors, setBackendErrors) => {
  const name = e.target.name
  const { [name]: fieldName, ...rest } = backendErrors
  setBackendErrors(rest)
  handleChange(e)
}

export default fieldChangeHandler
