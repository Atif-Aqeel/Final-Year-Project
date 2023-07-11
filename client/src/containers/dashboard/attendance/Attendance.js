import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'

import getClasses from 'helpers/getClasses'
import axios from 'helpers/axios'
import FieldHeader from 'components/ui/FieldHeader'
import * as validate from 'helpers/formValidation'
import fieldChangeHandler from 'helpers/fieldChangeHandler'
import Loading from 'components/ui/Loading'

const Attendance = (props) => {
  const formikRef = useRef()
  const params = useParams()

  const [backendErrors, setBackendErrors] = useState({})
  const [formFeedback, setFormFeedback] = useState({})

  const [classes, setClasses] = useState([])
  const [attendanceData, setAttendanceData] = useState(null)

  const [isLoading, setLoading] = useState(false)
  const [disableAttendance, setDisableAttendance] = useState(false)

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
    studentClass: '',
    date: new Date().toLocaleDateString('en-CA')
  }

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    setFormFeedback({})
    setDisableAttendance(false)
    setLoading(true)

    axios
      .get('/getInitialAttendance', {
        params: {
          studentClass: values.studentClass,
          date: values.date
        }
      })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          setAttendanceData(data.initialAttendance)
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
        setLoading(false)
      })
  }

  const saveAttendance = () => {
    if (disableAttendance) return

    setFormFeedback({})
    setDisableAttendance(true)

    let students = [...attendanceData]

    students = students.map(ele => {
      return {
        _id: ele._id,
        isPresent: ele.isPresent
      }
    })

    axios
      .post('/markAttendance', {
        studentClass: formikRef.current.values.studentClass,
        date: formikRef.current.values.date,
        students
      })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          setFormFeedback({
            type: 'success',
            msg: 'Attendance Marked successfully.'
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
  }

  const updateAttendance = (value, id) => {
    const data = [...attendanceData]

    const index = data.findIndex(ele => ele._id === id)
    if (index >= 0) data[index].isPresent = value

    setAttendanceData(data)
  }

  const updateAllAttendance = (value = false) => {
    const data = [...attendanceData]
    for (let i = 0; i < data.length; i++) {
      data[i].isPresent = value
    }
    setAttendanceData(data)
  }

  return (
        <>
            <Formik
                initialValues={initState}
                onSubmit={submitForm}
                innerRef={formikRef}
            >
                {({ values, isSubmitting, errors, touched, handleChange }) => (
                    <Form className='dashboard__form'>

                        <div className="dashboard__form__header">

                            <h3 className="dashboard__form__header__title">
                                Class Attendance for {new Date(values.date).toDateString()}
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
                                header='Date'
                                name='date'
                                error={errors.date}
                                backendError={backendErrors.date}
                                touched={touched.date}
                            />

                            <Field
                                type='date'
                                name="date"
                                id="date"
                                validate={(value) => validate.minLength(value, 'Class Name', 1)}
                                onChange={(e) => fieldChangeHandler(e, handleChange, backendErrors, setBackendErrors)}
                            />
                        </div>

                        <button type="submit" disabled={isSubmitting} className='btn btn--primary'>
                            Get Class Data
                        </button>

                    </Form>
                )}
            </Formik>

            <div className={'dashboardTable mt-1' + (disableAttendance ? ' disableTable' : '')}>

                <div className="dashboardTable__title">
                    <h3 className='dashboardTable__title__name'>
                        Students
                    </h3>
                    {
                        !props.isStatic &&
                        <div className="dashboardTable__title__options">
                            <button className="btn btn--tertiary btn--sm" onClick={() => {
                              if (disableAttendance) return
                              updateAllAttendance(true)
                            }}>
                                Mark all Present
                            </button>
                            <button className="btn btn--tertiary btn--sm" onClick={() => {
                              if (disableAttendance) return
                              updateAllAttendance(false)
                            }}>
                                Mark all Absent
                            </button>
                            <button className="btn btn--primary btn--sm" onClick={saveAttendance}>
                                Save Attendance
                            </button>
                        </div>
                    }

                </div>

                <div className="dashboardTable__header">

                    <div className="w-20">
                        No
                    </div>
                    <div className="w-20">
                        Name
                    </div>
                    <div className="w-20">
                        Roll No
                    </div>
                    <div className="w-40">
                        Attedance
                    </div>

                </div>

                <div className="dashboardTable__body">

                    {
                        isLoading
                          ? <Loading/>
                          : attendanceData && (
                            attendanceData.length > 0
                              ? attendanceData.map((ele, index) =>
                                        <TableItem
                                            key={ele._id}
                                            index={index}
                                            item={ele}
                                            updateAttendance={updateAttendance}
                                            disableFields={disableAttendance}
                                            isStatic={props.isStatic}
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
  const presentName = 'present' + props.index
  const absentName = 'absent' + props.index

  return (
        <div className="tableItem">

            <div className="w-20">
                {props.index + 1}
            </div>
            <div className="w-20">
                {props.item.firstName + ' ' + props.item.lastName}
            </div>
            <div className="w-20">
                {props.item.rollNo}
            </div>
            <div className="w-40">

                <div className="attendanceItem">

                    {
                        props.isStatic
                          ? <h4 className={props.item.isPresent ? 'success' : 'danger'}>
                                {
                                    props.item.isPresent ? 'Present' : 'Absent'
                                }
                            </h4>
                          : <>
                                <label htmlFor={presentName}>
                                    <input
                                        type="radio"
                                        name={presentName}
                                        id={presentName}
                                        checked={props.item.isPresent}
                                        onChange={() => {
                                          if (props.disableFields) return
                                          props.updateAttendance(true, props.item._id)
                                        }}
                                    />
                                    <p>
                                        Present
                                    </p>
                                </label>
                                <label htmlFor={absentName}>
                                    <input
                                        type="radio"
                                        name={absentName}
                                        id={absentName}
                                        checked={!props.item.isPresent}
                                        onChange={() => {
                                          if (props.disableFields) return
                                          props.updateAttendance(false, props.item._id)
                                        }}
                                    />
                                    <p>
                                        Absent
                                    </p>
                                </label>
                            </>
                    }

                </div>

            </div>

        </div>
  )
}

export default Attendance
