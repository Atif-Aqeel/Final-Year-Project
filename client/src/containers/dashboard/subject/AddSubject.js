import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'

import FieldHeader from 'components/ui/FieldHeader'
import * as validate from 'helpers/formValidation'
import fieldChangeHandler from 'helpers/fieldChangeHandler'
import axios from 'helpers/axios'

const AddSubject = () => {
  const [backendErrors, setBackendErrors] = useState({})
  const [formFeedback, setFormFeedback] = useState({})
  const initState = {
    subjectName: ''
  }

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    setFormFeedback({})

    axios
      .post('/subject', {
        name: values.subjectName
      })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          setFormFeedback({
            type: 'success',
            msg: 'Subject added successfully.'
          })
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
                            Add Subject
                        </h3>
                    </div>
                    {
                        formFeedback.msg && <h3 className={'formFeedback ' + formFeedback.type}>{formFeedback.msg}</h3>
                    }
                    <div className="formGroup">
                        <FieldHeader
                            header='Subject Name'
                            name='subjectName'
                            error={errors.subjectName}
                            backendError={backendErrors.subjectName}
                            touched={touched.subjectName}
                        />
                        <Field
                            name="subjectName"
                            id="subjectName"
                            validate={(value) => validate.minLength(value, 'Class Name', 1)}
                            onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className='btn btn--primary'>
                        Add Subject
                    </button>
                </Form>
            )}
        </Formik>
  )
}

export default AddSubject
