import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loading from 'components/ui/Loading'

import axios from 'helpers/axios'

const Classes = (props) => {
  const [classes, setClasses] = useState([])
  const [error, setError] = useState(null)

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    getClasses()
  }, [])

  const getClasses = () => {
    setLoading(true)

    axios.get('/getClassesData')
      .then(r => {
        const data = r.data
        if (data.message === 'success') { setClasses(data.classes) }
      })
      .catch(error => {
        const data = error.response.data
        setError(data.message)
      })
      .then(() => {
        setLoading(false)
      })
  }

  return (

        <div className="dashboardTable">

            <div className="dashboardTable__title">
                <h3 className='dashboardTable__title__name'>
                    Institute Classes
                </h3>

                {
                    error && <h5 className='dashboardTable__title__error'>
                        {error}
                    </h5>
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
                    Students
                </div>
                <div className="w-20">
                    Teacher
                </div>
                <div className="w-20">
                    Details
                </div>

            </div>

            <div className="dashboardTable__body">

                {
                    isLoading
                      ? <Loading/>
                      : (
                          classes.length > 0
                            ? classes.map((ele, index) => <TableItem key={ele._id} index={index} item={ele}/>)
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

            <div className="w-20">
                {props.index + 1}
            </div>
            <div className="w-20">
                {props.item.name}
            </div>
            <div className="w-20">
                {props.item.students}
            </div>
            <div className="w-20">
                {props.item.teachers}
            </div>
            <div className="w-20 btnItem">
                <Link to={'../classInfo/' + props.item._id} className="btn btn--tertiary btn--sm">
                    View
                </Link>
            </div>

        </div>
  )
}

export default Classes
