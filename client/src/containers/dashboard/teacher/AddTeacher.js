import React, { useEffect, useRef, useState } from 'react'
import { Field, Form, Formik } from 'formik'

import axios from '../../../helpers/axios'
import FieldHeader from 'components/ui/FieldHeader'
import * as validate from 'helpers/formValidation'
import fieldChangeHandler from 'helpers/fieldChangeHandler'

const AddTeacher = () => {
  const formikRef = useRef()

  const [backendErrors, setBackendErrors] = useState({})
  const [formFeedback, setFormFeedback] = useState({})

  const initState = {
    email: '',
    staffID: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    joiningDate: ''
  }

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    setFormFeedback({})
    // setLoading(true);

    axios
      .post('/addTeacher', {
        ...values,
        role: 'Teacher'
      })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          setFormFeedback({
            type: 'success',
            msg: 'Teacher Added successsfully.'
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
            msg: data.message || error.response?.statusText || 'Failed to add Teacher.'
          })
        }
      })
      .then(() => {
        setSubmitting(false)
        // setLoading(false);
      })
  }

  return (

        <Formik
            initialValues={initState}
            onSubmit={submitForm}
            innerRef={formikRef}
        >
            {({ isSubmitting, errors, touched, handleChange }) => (
                <Form className='dashboard__form'>

                    <div className="dashboard__form__header">

                        <h3 className="dashboard__form__header__title">
                            Add Teacher
                        </h3>

                    </div>

                    {
                        formFeedback.msg
                          ? <h3 className={'formFeedback ' + formFeedback.type}>{formFeedback.msg}</h3>
                          : null
                    }

                    <div className="dashboard__form__fieldsCont">

                        <div className="formGroup">

                            <FieldHeader
                                name='email'
                                error={errors.email}
                                backendError={backendErrors.email}
                                touched={touched.email}
                            />

                            <Field
                                type="email"
                                name="email"
                                id="email"
                                validate={validate.validateEmail}
                                onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                            />
                        </div>
                        <div className="formGroup">
                            <FieldHeader
                                header='Staff ID'
                                name='staffID'
                                error={errors.staffID}
                                backendError={backendErrors.staffID}
                                touched={touched.staffID}
                            />
                            <Field
                                type="staffID"
                                name="staffID"
                                id="staffID"
                                validate={(value) => validate.minLength(value, 'Staff ID', 1)}
                                onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                            />
                        </div>
                        <div className="formGroup">
                            <FieldHeader
                                header='First Name'
                                name='firstName'
                                error={errors.firstName}
                                backendError={backendErrors.firstName}
                                touched={touched.firstName}
                            />

                            <Field
                                type="firstName"
                                name="firstName"
                                id="firstName"
                                validate={(value) => validate.minLength(value, 'First Name', 1)}
                                onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                            />
                        </div>
                        <div className="formGroup">
                            <FieldHeader
                                header='Last Name'
                                name='lastName'
                                error={errors.lastName}
                                backendError={backendErrors.lastName}
                                touched={touched.lastName}
                            />

                            <Field
                                type="lastName"
                                name="lastName"
                                id="lastName"
                                validate={(value) => validate.minLength(value, 'Last Name', 1)}
                                onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                            />
                        </div>
                        <div className="formGroup">
                            <FieldHeader
                                header='Date of Birth'
                                name='dob'
                                error={errors.dob}
                                backendError={backendErrors.dob}
                                touched={touched.dob}
                            />

                            <Field
                                type="date"
                                name="dob"
                                id="dob"
                                validate={(value) => validate.minLength(value, 'Date of Birth', 1)}
                                onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                            />
                        </div>
                        <div className="formGroup">
                            <FieldHeader
                                name='gender'
                                error={errors.gender}
                                backendError={backendErrors.gender}
                                touched={touched.gender}
                            />

                            <Field
                                as='select'
                                name="gender"
                                id="gender"
                                validate={(value) => validate.minLength(value, 'Gender', 1)}
                                onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Field>
                        </div>
                        <div className="formGroup">
                            <FieldHeader
                                header='Joining Date'
                                name='joiningDate'
                                error={errors.joiningDate}
                                backendError={backendErrors.joiningDate}
                                touched={touched.joiningDate}
                            />

                            <Field
                                type="date"
                                name="joiningDate"
                                id="joiningDate"
                                validate={(value) => validate.minLength(value, 'Joining Date', 1)}
                                onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                            />
                        </div>

                        <div className="w-100 flex-center">
                            <button type="submit" disabled={isSubmitting} className='btn btn--primary w-30'>
                                Add Teacher
                            </button>
                        </div>

                    </div>

                </Form>
            )}
        </Formik>

  )
}

export default AddTeacher
