import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'

import FieldHeader from 'components/ui/FieldHeader'
import * as validate from 'helpers/formValidation'
import fieldChangeHandler from 'helpers/fieldChangeHandler'
import axios from 'helpers/axios'

const AddClass = (props) => {
  const navigate = useNavigate()
  const [backendErrors, setBackendErrors] = useState({})
  const [formFeedback, setFormFeedback] = useState({})

  const initState = {
    className: ''
  }

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    setFormFeedback({})

    axios
      .post('/addClass', {
        ...values
      })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          setFormFeedback({
            type: 'success',
            msg: 'Class added successfully.'
          })
          // navigate('/classes');
        } else {
          setFormFeedback({
            type: 'error',
            msg: data.message
          })
        }
      })
      .catch(error => {
        const data = error.response.data
        const errors = {}

        if (Array.isArray(data.error)) {
          data.error.forEach((err) => {
            setFieldError(err.param, err.msg)
            errors[err.param] = err.msg
          })

          setBackendErrors({ ...backendErrors, ...errors })
        } else {
          setFormFeedback({
            type: 'error',
            msg: data.message || error.response.statusText
          })
        }
      })
      .then(() => {
        setSubmitting(false)
      })
  }

  return (
        <Formik
            initialValues={initState}
            onSubmit={submitForm}
        >
            {({ isSubmitting, errors, touched, handleChange }) => (
                <Form className='dashboard__form formMd'>

                    <div className="dashboard__form__header">

                        <h3 className="dashboard__form__header__title">
                            Add Class
                        </h3>

                    </div>

                    {
                        formFeedback.msg
                          ? <h3 className={'formFeedback ' + formFeedback.type}>{formFeedback.msg}</h3>
                          : null
                    }

                    <div className="formGroup">

                        <FieldHeader
                            header='Class Name'
                            name='className'
                            error={errors.className}
                            backendError={backendErrors.className}
                            touched={touched.className}
                        />

                        <Field
                            name="className"
                            id="className"
                            validate={(value) => validate.minLength(value, 'Class Name', 1)}
                            onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className='btn btn--primary'>
                        Add Class
                    </button>
                </Form>
            )}
        </Formik>
  )
}

export default AddClass
