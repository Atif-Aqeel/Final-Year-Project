import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'

import getClasses from 'helpers/getClasses'
import axios from 'helpers/axios'
import FieldHeader from 'components/ui/FieldHeader'
import * as validate from 'helpers/formValidation'
import fieldChangeHandler from 'helpers/fieldChangeHandler'

const AddStudent = () => {
  const formikRef = useRef()
  const params = useParams()

  const [backendErrors, setBackendErrors] = useState({})
  const [formFeedback, setFormFeedback] = useState({})

  const [classes, setClasses] = useState([])

  // const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      const data = await getClasses()
      if (data.message === 'success') {
        setClasses(data.classes)
        if (formikRef.current && data.classes[0]) { formikRef.current.setFieldValue('studentClass', data.classes[0]._id) }
      } else {
        setFormFeedback({ type: 'error', msg: data.data.message || data.statusText })
      }
    })()
  }, [params])

  const initState = {
    email: '',
    studentClass: '',
    rollNo: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    admissionDate: ''
  }

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    setFormFeedback({})
    // setLoading(true);

    axios
      .post('/addStudent', {
        ...values
      })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          setFormFeedback({
            type: 'success',
            msg: 'Student Added successsfully.'
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
            msg: data.message || error.response.statusText || 'Failed to add Student.'
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
                            Add Student
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
                                header='Class Name'
                                name='studentClass'
                                error={errors.studentClass}
                                backendError={backendErrors.studentClass}
                                touched={touched.studentClass}
                            />

                            <Field
                                as='select'
                                name="studentClass"
                                id="studentClass"
                                validate={(value) => validate.minLength(value, 'Class Name', 1)}
                                onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                            >
                                {
                                    classes.map(ele => <option key={ele._id}
                                                               value={ele._id}>{ele.name}</option>)
                                }
                            </Field>
                        </div>
                        <div className="formGroup">
                            <FieldHeader
                                header='Roll No'
                                name='rollNo'
                                error={errors.rollNo}
                                backendError={backendErrors.rollNo}
                                touched={touched.rollNo}
                            />

                            <Field
                                type="rollNo"
                                name="rollNo"
                                id="rollNo"
                                validate={(value) => validate.minLength(value, 'Roll No', 1)}
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
                                header='Admission Date'
                                name='admissionDate'
                                error={errors.admissionDate}
                                backendError={backendErrors.admissionDate}
                                touched={touched.admissionDate}
                            />

                            <Field
                                type="date"
                                name="admissionDate"
                                id="admissionDate"
                                validate={(value) => validate.minLength(value, 'Admission Date', 1)}
                                onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                            />
                        </div>

                        <div className="w-100 flex-center">
                            <button type="submit" disabled={isSubmitting} className='btn btn--primary w-30'>
                                Add Student
                            </button>
                        </div>

                    </div>

                </Form>
            )}
        </Formik>

  )
}

export default AddStudent
