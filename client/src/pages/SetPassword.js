import React, { useState, useEffect } from 'react'
import { Field, Form, Formik } from 'formik'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import logo from 'assests/img/logo_colors.svg'
import axios from 'helpers/axios'

import FieldHeader from 'components/ui/FieldHeader'
import * as validate from 'helpers/formValidation'
import fieldChangeHandler from 'helpers/fieldChangeHandler'
import isAuth from 'helpers/isAuth'

const initState = {
  password: '',
  confirmPassword: ''
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [backendErrors, setBackendErrors] = useState({})
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    if (isAuth()) {
      navigate('/dashboard', { replace: true })
    }
    const params = new URLSearchParams(location.search)
    if (!params.get('token') || !params.get('token')) navigate('/login', { replace: true })
  }, [])

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    if (values.password !== values.confirmPassword) {
      setFieldError('confirmPassword', 'Password do not Match')
      setSubmitting(false)
      return
    }
    setFormError(null)
    const params = new URLSearchParams(location.search)
    const userID = params.get('id')
    const token = params.get('token')

    axios
      .post('/set-password', {
        ...values,
        userID,
        token
      })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          localStorage.setItem('cmsToken', data.token)
          localStorage.setItem('cmsUserID', data.userID)
          localStorage.setItem('cmsRole', data.role)
          localStorage.setItem('cmsInstituteID', data.instituteID)
          localStorage.setItem('cmsUserName', data.userName)
          navigate('/dashboard/classes')
        } else {
          setFormError(data.message)
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
          setFormError(data.message)
        }
      })
      .then(() => {
        setSubmitting(false)
      })
  }

  return (
        <div className='authPage'>
            <div className="authPage__container">
                <img src={logo} alt="" className="authPage__logo"/>
                <Formik
                    initialValues={initState}
                    onSubmit={submitForm}
                >
                    {({ isSubmitting, errors, touched, handleChange }) => (
                        <Form className='authPage__form'>
                            {
                                formError
                                  ? <h3 className='formErrorMsg'>{formError}</h3>
                                  : null
                            }
                            <div className="formGroup">
                                <FieldHeader
                                    name='password'
                                    error={errors.password}
                                    backendError={backendErrors.password}
                                    touched={touched.password}
                                />
                                <Field
                                    type="password"
                                    name="password"
                                    id="password"
                                    validate={(value) => validate.minLength(value, 'Password', 6)}
                                    onChange={(e) => {
                                      setFormError(null)
                                      fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)
                                    }}
                                />
                            </div>
                            <div className="formGroup">
                                <FieldHeader
                                    header='Confirm Password'
                                    name='confirmPassword'
                                    error={errors.confirmPassword}
                                    backendError={backendErrors.confirmPassword}
                                    touched={touched.confirmPassword}
                                />
                                <Field
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    validate={(value) => validate.minLength(value, 'Confirm Password', 6)}
                                    onChange={(e) => {
                                      setFormError(null)
                                      fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)
                                    }}
                                />
                            </div>
                            <button type="submit" disabled={isSubmitting} className='btn btn--primary'>
                                Set Password
                            </button>
                        </Form>
                    )}
                </Formik>

            </div>

        </div>
  )
}

export default Login
