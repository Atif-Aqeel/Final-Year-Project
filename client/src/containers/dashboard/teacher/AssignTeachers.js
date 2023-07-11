import React, { useEffect, useRef, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { useParams, useNavigate } from 'react-router-dom'

import getClasses from 'helpers/getClasses'
import FieldHeader from 'components/ui/FieldHeader'
import Loading from 'components/ui/Loading'
import axios from 'helpers/axios'

const AddTeacher = () => {
  const formikRef = useRef()
  const params = useParams()
  const navigate = useNavigate()
  const initState = {
    teacher: ''
  }

  const [feedback, setFeedback] = useState({})
  const [classes, setClasses] = useState(null)
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    (async () => {
      getTeachers()
      const data = await getClasses()
      if (data.message === 'success') {
        const classesData = data.classes
        classesData.map(ele => {
          ele.isSelected = false
          return ele
        })
        setClasses(classesData)
      } else {
        setFeedback({ type: 'error', msg: data.data.message || data.statusText || 'Server Error' })
      }
    })()
  }, [params.id])

  const getTeachers = () => {
    axios.get('/getTeachersWithClasses', { params: { userID: params.id } })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          if (!data.teachers.length) {
            navigate('/dashboard/assignTeacher/', { replace: true })
            return
          }
          setTeachers(data.teachers)
          if (formikRef.current) formikRef.current.setFieldValue('teacher', params.id ? params.id : data.teachers[0]._id)
        }
      })
      .catch(error => {
        const data = error.response.data
        setFeedback({ type: 'error', msg: data.message || error.response.statusText || 'Server Error' })
      })
  }

  const toggleCheck = (id) => {
    const teachersData = [...teachers]
    const teacherIndex = teachersData.findIndex(ele => ele._id === formikRef.current.values.teacher)

    if (teacherIndex < 0) return

    const teacherData = { ...teachersData[teacherIndex] }
    const classesData = [...teacherData.classes]

    const classIndex = classesData.findIndex(ele => ele === id)

    if (classIndex >= 0) classesData.splice(classIndex, 1)
    else classesData.push(id)

    teacherData.classes = classesData
    teachersData[teacherIndex] = teacherData

    setTeachers(teachersData)
  }

  const saveTeacher = (values, { setSubmitting, setFieldError }) => {
    setFeedback({})
    // setLoading(true);

    const teachersData = [...teachers]
    const teacherIndex = teachersData.findIndex(ele => ele._id === formikRef.current.values.teacher)

    // TODO: SHOW ERROR
    if (teacherIndex < 0) return

    axios
      .post('/updateTeacherClasses', {
        userID: teachersData[teacherIndex]._id,
        classes: teachersData[teacherIndex].classes
      })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          setFeedback({
            type: 'success',
            msg: ('Class' + (teachersData[teacherIndex].classes.length > 1 ? 'es' : '') + ' Updated successfully.')
          })
        }
      })
      .catch(error => {
        const data = error.response.data
        setFeedback({
          type: 'error',
          msg: data.message || error.response?.statusText || 'Failed to add Teacher.'
        })
      })
      .then(() => {
        setSubmitting(false)
        // setLoading(false);
      })
  }

  return (

        <Formik
            initialValues={initState}
            innerRef={formikRef}
            onSubmit={saveTeacher}
        >
            {({ isSubmitting, values, errors, touched, handleChange }) => (
                <Form className='dashboard__form'>
                    <div className="dashboard__form__header">
                        <h3 className="dashboard__form__header__title">
                            Assign {params.id ? `${teachers[0]?.firstName} ${teachers[0]?.lastName}` : 'Teacher'}
                        </h3>
                    </div>
                    {
                        feedback.msg
                          ? <h3 className={'formFeedback ' + feedback.type}>{feedback.msg}</h3>
                          : null
                    }
                    <div className="dashboard__form__fieldsCont">
                        {
                            classes && teachers
                              ? (
                                <>
                                  {
                                    !params.id &&
                                      <div className="formGroup">
                                        <FieldHeader
                                            name='teachers'
                                            error={errors.teacher}
                                            touched={touched.teacher}
                                        />
                                        <Field
                                            as='select'
                                            name="teacher"
                                            id="teacher">
                                          {
                                              teachers && teachers.map(ele => <option key={ele._id}
                                                                                      value={ele._id}>{ele.firstName + ' ' + ele.lastName}</option>)
                                          }

                                        </Field>
                                      </div>
                                  }

                                    <div className="w-100">
                                        <h3 className="heading-md bold mb-1">
                                            Select Class{classes?.length > 1 ? 'es' : ''}
                                        </h3>
                                        {
                                            classes && classes.map((ele, index) =>
                                                <ClassItem key={ele._id}
                                                           index={index}
                                                           item={ele}
                                                           classes={teachers.find(ele => ele._id === values.teacher)?.classes || []}
                                                           toggleCheck={toggleCheck}/>)
                                        }
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className='btn btn--primary'>
                                        Save Teacher
                                    </button>
                                </>
                                )
                              : <Loading/>
                        }
                    </div>
                </Form>
            )}
        </Formik>

  )
}

const ClassItem = (props) => {
  const classItem = 'class-' + props.index

  return (
        <div className="classItem">

            <label htmlFor={classItem}>
                <input
                    type="checkbox"
                    name={classItem}
                    id={classItem}
                    checked={props.classes.includes(props.item._id)}
                    onChange={() => {
                      props.toggleCheck(props.item._id)
                    }}
                />
                <p>
                    {props.item.name}
                </p>
            </label>

        </div>

  )
}

export default AddTeacher
