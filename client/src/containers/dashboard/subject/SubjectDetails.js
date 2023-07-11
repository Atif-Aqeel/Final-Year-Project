import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import axios from 'helpers/axios'
import getClasses from 'helpers/getClasses'
import Loading from 'components/ui/Loading'

const SubjectDetails = () => {
  const params = useParams()

  const [formFeedback, setFormFeedback] = useState({})
  const [subject, setSubject] = useState({})
  const [subjectMetadata, setSubjectMetadata] = useState({})

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    getClassData(params.id)
  }, [params])

  const getClassData = (subjectID) => {
    setLoading(true)
    axios
      .get('/subject', {
        params: {
          subjectID
        }
      })
      .then(r => {
        const data = r.data
        if (data.message === 'success') {
          setSubject(data.subject)
          setSubjectMetadata(data.data)
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
        setLoading(false)
      })
  }

  return (
       <>
            <div className="dashboard__form__header">
                <h3 className="dashboard__form__header__title">
                    {subject.name || 'Subject'} Information
                </h3>
            </div>

           <h3 className={clsx({
             'text-3xl my-4 w-full text-center bold': true,
             'text-red-500': formFeedback.type === 'error'
           })}>{formFeedback.msg}</h3>

            {/* ================== Classes Table ================== */}
            <div className='dashboardTable'>
                <div className="dashboardTable__title">
                    <h3 className='dashboardTable__title__name'>
                        Classes
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
                        Teachers
                    </div>
                    <div className="w-20">
                        Students
                    </div>
                    <div className="w-20">
                        Details
                    </div>
                </div>
                <div className="dashboardTable__body">
                    {
                        isLoading
                          ? <Loading/>
                          : subject.name && (
                            subjectMetadata.classes?.length
                              ? subjectMetadata.classes.map((ele, index) =>
                                        <TableItem
                                            key={ele._id}
                                            index={index}
                                            name={ele.name}
                                            about={ele.subjects?.length || 0}
                                            meta={ele.students?.length || 0}
                                            goto={'/dashboard/classInfo/' + ele._id}
                                        />
                              )
                              : <h4 className="notFound">No Class Found for this Subject.</h4>
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
                          : subject.name && (
                            subjectMetadata.teachers?.length > 0
                              ? subjectMetadata.teachers.map((ele, index) =>
                                        <TableItem
                                            key={ele._id}
                                            index={index}
                                            name={ele.firstName + ' ' + ele.lastName}
                                            about={ele.staffID}
                                            meta={ele.joiningDate}
                                            goto={'/dashboard/teachers/' + ele._id}
                                        />
                              )
                              : <h4 className="notFound">No Teacher Found for this Subject.</h4>
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

export default SubjectDetails
