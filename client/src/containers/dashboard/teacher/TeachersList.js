import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loading from 'components/ui/Loading'

import axios from 'helpers/axios'

const TeachersList = (props) => {
  const [teachers, setTeachers] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    getTeachers()
  }, [])

  const getTeachers = () => {
    setLoading(true)

    axios.get('/getTeachers')
      .then(r => {
        const data = r.data
        if (data.message === 'success') { setTeachers(data.teachers) }
      })
      .catch(error => {
        const data = error.response.data
        setError(data.message || error.response.statusText || 'Server Error')
      })
      .then(() => {
        setLoading(false)
      })
  }

  return (

        <div className="dashboardTable">

            <div className="dashboardTable__title">
                <h3 className='dashboardTable__title__name'>
                    Institute Teachers
                </h3>

                {
                    error && <h5 className='dashboardTable__title__error'>
                        {error}
                    </h5>
                }

            </div>

            <div className="dashboardTable__header">

                <div className="w-16">
                    No
                </div>
                <div className="w-16">
                    Name
                </div>
                <div className="w-16">
                    Roll No
                </div>
                <div className="w-16">
                    Admission Date
                </div>
                <div className="w-16">
                    Class
                </div>
                <div className="w-16">
                    Details
                </div>

            </div>

            <div className="dashboardTable__body">

                {
                    isLoading
                      ? <Loading/>
                      : (
                          teachers.length > 0
                            ? teachers.map((ele, index) =>
                                    <TableItem
                                        key={ele._id}
                                        index={index}
                                        item={ele}
                                    />
                            )
                            : <h4 className="notFound">No Data Found.</h4>
                        )
                }

            </div>

        </div>

  )
}

const TableItem = (props) => {
  return (
        <div className="tableItem">

            <div className="w-16">
                {props.index + 1}
            </div>
            <div className="w-16">
                {props.item.firstName + ' ' + props.item.lastName}
            </div>
            <div className="w-16">
                {props.item.staffID}
            </div>
            <div className="w-16">
                {props.item.joiningDate}
            </div>
            <div className="w-16">
                {props.item.classes}
            </div>
            <div className="w-16 btnItem">
                <Link to={'../teachers/' + props.item._id} className="btn btn--tertiary btn--sm">
                    View
                </Link>
            </div>

        </div>
  )
}

export default TeachersList
