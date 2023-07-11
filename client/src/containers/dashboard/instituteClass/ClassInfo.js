import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'

import axios from 'helpers/axios'
import FieldHeader from 'components/ui/FieldHeader'
import * as validate from 'helpers/formValidation'
import fieldChangeHandler from 'helpers/fieldChangeHandler'

import getClasses from 'helpers/getClasses'
import Loading from 'components/ui/Loading'

const ClassInfo = (props) => {
  const formikRef = useRef()
  const params = useParams()

  const [backendErrors, setBackendErrors] = useState({})
  const [formFeedback, setFormFeedback] = useState({})

  const [classes, setClasses] = useState([])
  const [classData, setClassData] = useState([])

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      setLoading(true)
      getClassData(params.id, () => {
      })
      return
    }

    (async () => {
      const data = await getClasses()
      if (data.message === 'success') {
        setClasses(data.classes)
        if (formikRef.current && data.classes[0]) { formikRef.current.setFieldValue('className', data.classes[0]._id) }
      } else {
        setFormFeedback({ type: 'error', msg: data.data.message || data.statusText })
      }
    })()
  }, [params])

  const initState = {
    className: ''
  }

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    setFormFeedback({})

    getClassData(values.className, setSubmitting)
  }

  const getClassData = (classID, setSubmitting) => {
    setLoading(true)

    axios
      .get('/getClassData', {
        params: {
          classID
        }
      })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          setClassData(data.classData)
        } else {
          setFormFeedback({
            type: 'error',
            msg: data.message
          })
        }
      })
      .catch(error => {
        const data = error.response.data
        setFormFeedback({
          type: 'error',
          msg: data.message || error.response.statusText
        })
      })
      .then(() => {
        setSubmitting(false)
        setLoading(false)
      })
  }

  return (
        <>
            <Formik
                initialValues={initState}
                onSubmit={submitForm}
                innerRef={formikRef}
            >
                {({ isSubmitting, errors, touched, handleChange }) => (
                    <Form className={'dashboard__form formMd' + (params.id ? ' formNone' : '')}>
                        <div className="dashboard__form__header">
                            <h3 className="dashboard__form__header__title">
                                {classData.name || 'Class'} Information
                            </h3>
                        </div>
                        {
                            formFeedback.msg
                              ? <h3 className={'formFeedback ' + formFeedback.type}>{formFeedback.msg}</h3>
                              : null
                        }

                        {
                            !params.id &&
                            <>
                                <div className="formGroup">

                                    <FieldHeader
                                        header='Class Name'
                                        name='className'
                                        error={errors.className}
                                        backendError={backendErrors.className}
                                        touched={touched.className}
                                    />

                                    <Field
                                        as='select'
                                        name="className"
                                        id="className"
                                        validate={(value) => validate.minLength(value, 'Class Name', 1)}
                                        onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                                    >
                                        {
                                            classes.map(ele => <option key={ele._id}
                                                                       value={ele._id}>{ele.name}</option>)
                                        }
                                    </Field>
                                </div>

                                <button type="submit" disabled={isSubmitting} className='btn btn--primary'>
                                    Get Class Data
                                </button>
                            </>
                        }
                    </Form>
                )}
            </Formik>

            {/* ================== Students Table ================== */}
            <div className={'dashboardTable' + (params.id ? ' unsetTop' : '')}>

                <div className="dashboardTable__title">
                    <h3 className='dashboardTable__title__name'>
                        Students
                    </h3>
                </div>

                <div className="dashboardTable__header">

                    <div className="w-20">
                        No
                    </div>
                    <div className="w-20">
                        Name
                    </div>
                    <div className="w-20">
                        Roll Number
                    </div>
                    <div className="w-20">
                        Admission Date
                    </div>
                    <div className="w-20">
                        Details
                    </div>

                </div>

                <div className="dashboardTable__body">
                    {
                        isLoading
                          ? <Loading/>
                          : classData.name && (
                            classData.students?.length > 0
                              ? classData.students.map((ele, index) =>
                                        <TableItem
                                            key={ele._id}
                                            index={index}
                                            name={ele.firstName + ' ' + ele.lastName}
                                            about={ele.rollNo}
                                            meta={ele.admissionDate}
                                            goto={'/dashboard/students/' + ele._id}
                                        />
                              )
                              : <h4 className="notFound">No Data Found.</h4>
                          )
                    }
                </div>
            </div>

            {/* ================== Teachers Table ================== */}
            <div className="dashboardTable">
                <div className="dashboardTable__title">
                    <h3 className='dashboardTable__title__name'>
                        Teachers
                    </h3>
                </div>

                <div className="dashboardTable__header">

                    <div className="w-20">
                        No
                    </div>
                    <div className="w-20">
                        Name
                    </div>
                    <div className="w-20">
                        Staff ID
                    </div>
                    <div className="w-20">
                        Joining Date
                    </div>
                    <div className="w-20">
                        Details
                    </div>

                </div>

                <div className="dashboardTable__body">
                    {
                        isLoading
                          ? <Loading/>
                          : classData.name && (
                            classData.teachers?.length > 0
                              ? classData.teachers.map((ele, index) =>
                                        <TableItem
                                            key={ele._id}
                                            index={index}
                                            name={ele.firstName + ' ' + ele.lastName}
                                            about={ele.staffID}
                                            meta={ele.joiningDate}
                                            goto={'/dashboard/teachers/' + ele._id}
                                        />
                              )
                              : <h4 className="notFound">No Data Found.</h4>
                          )
                    }
                </div>
            </div>
        </>
  )
}

const TableItem = (props) => {
  return (
        <div className="tableItem">
            <div className="w-20">
                {props.index + 1}
            </div>
            <div className="w-20">
                {props.name}
            </div>
            <div className="w-20">
                {props.about}
            </div>
            <div className="w-20">
                {props.meta}
            </div>
            <div className="w-20 btnItem">
                <Link to={props.goto} className="btn btn--tertiary btn--sm">
                    View
                </Link>
            </div>

        </div>
  )
}

export default ClassInfo
