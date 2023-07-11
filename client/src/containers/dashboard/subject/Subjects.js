import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loading from 'components/ui/Loading'

import axios from 'helpers/axios'

const Subjects = () => {
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState(null)

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    getSubjects()
  }, [])

  const getSubjects = () => {
    setLoading(true)

    axios.get('/subject/all')
      .then(r => {
        const data = r.data
        if (data.message === 'success') { setSubjects(data.subjects) }
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
                    Subjects
                </h3>
                {
                    error && <h5 className='dashboardTable__title__error'>{error}</h5>
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
                    Teacher
                </div>
                <div className="w-20">
                    Class(es)
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
                          subjects.length
                            ? subjects.map((ele, index) => <TableItem key={ele._id} index={index} item={ele}/>)
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
                {props.item?.teachers?.length || 0}
            </div>
            <div className="w-20">
                {props.item.classes?.length || 0}
            </div>
            <div className="w-20 btnItem">
                <Link to={'../subjects/' + props.item._id} className="btn btn--tertiary btn--sm">
                    View
                </Link>
            </div>
        </div>
  )
}

export default Subjects
