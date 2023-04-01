import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../helpers/Context'
import './MakeAComment.scss'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import alumniData from '../navbar/akumniData.json'
// import Navbar from '../navbar/navbar'

const MakeAComment = () => {
  const { result, user, profile, isStudent, setIsStudent } = useContext(
    LoginContext,
  )
  const [userData, setUserData] = useState({})
  const [comment, setComment] = useState()
  const { loading, setLoading } = useContext(LoginContext)
  const [approvedComments, setApprovedComments] = useState([])
  const [state, setState] = useState(false)
  const [comments, setComments] = useState({})
  const alumniEmail = alumniData

  useEffect(() => {
    if (alumniEmail.includes(user.email)) {
      setIsStudent(false)
    } else {
      setIsStudent(true)
    }
  })
  const navigate = useNavigate()

  // useEffect(() => {
  //   setLoading(true)
  //   const Load = async () => {
  //     await new Promise((r) => setTimeout(r, 1000))

  //     setLoading((loading) => !loading)
  //   }

  //   Load()
  // }, [])

  
  const handleSubmit2 = async (e) => {
    e.preventDefault()
    console.log(result)
    if (isStudent === false) {
      await axios
        .post(process.env.REACT_APP_API_URL + '/comments', {
          comment_sender_id: profile._id,
          comment_sender_name: profile.name,
          comment_sender_roll_no: profile.roll_no,
          comment_sender_email_id: profile.email,
          comment_sender_academic_program: profile.academic_program,
          comment_reciever_id: result[0]._id,
          comment_reciever_name: result[0].name,
          comment_reciever_roll_no: result[0].roll_no,
          comment_reciever_email_id: result[0].email,
          comment_reciever_academic_program: result[0].academic_program,
          comment: comment,
          status: 'new',
        })
        .then((res) => {
          console.log(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      await axios
        .post(process.env.REACT_APP_API_URL + '/Comments', {
          comment_sender_id: '',
          comment_sender_name: user._name,
          comment_sender_roll_no: '',
          comment_sender_email_id: user.email,
          comment_sender_academic_program: profile.academic_program,
          comment_reciever_id: result[0]._id,
          comment_reciever_name: result[0].name,
          comment_reciever_roll_no: result[0].roll_no,
          comment_reciever_email_id: result[0].email,
          comment_reciever_academic_program: result[0].academic_program,
          comment: comment,
          status: 'new',
        })
        .then((res) => {
          console.log(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    if (isStudent === true) {
      navigate('/')
    } else {
      console.log('fuck')
      navigate(`/profile/${profile._id}/${profile.name}/${profile.roll_no}`)
    }
    window.localStorage.removeItem('searchAlumni')
  }

  //Getting all the comments

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + '/getComments')
      .then((res) => {
        setComments(res.data)
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      {loading && (
        <div className="spinner">
          <span class="loader"></span>
        </div>
      )}
      {!loading && (
        <div className="containermc">
          <style>
            @import
            url('https://fonts.googleapis.com/css2?family=Quantico&display=swap');
          </style>
          <div className="container2">
            <div className="left1" id="named">
              <div className="dota">
                {result.length && (
                  <img id="ip" src={result[0].profile_img} alt="err" />
                )}
              </div>
              {result.length && (
                <div className="description" id="desc">
                  <h2>{result[0].name}</h2>

                  <h3 style={{ color: 'white' }}>
                    Roll No: {result[0].roll_no}
                  </h3>
                  {/* <h3 style={{ color: 'white' }}>
                    {' '}
                    {result[0].academic_program}, {result[0].department}
                  </h3> */}
                  <h4 style={{ color: 'white' }}>
                    {result[0].academic_program}, {result[0].department}
                  </h4>
                  <h3 style={{ color: 'white' }}>{result[0].about}</h3>
                </div>
              )}
            </div>

            <div className="right1">
              <h1 id="make">Make a Comment</h1>
              <form>
                <textarea
                  name="comment"
                  id="commenttext"
                  cols="85"
                  rows="25"
                  placeholder="Add your Comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value)
                  }}
                />
                <br />
                <button
                  type="submit"
                  id="post"
                  onClick={handleSubmit2}
                  style={{
                    color: 'white',
                    float: 'right',
                    background: state ? '#838080' : '#3E185C',
                  }}
                  disabled={state}
                >
                  POST!
                </button>
              </form>
            </div>
          </div>

          <div id="apcomments">
            <div style={{ display: 'inline' }}>
              <h1 id="make">Approved Comments</h1>
            </div>
            <div id="cards-container">
              {comments.map((val) =>
                val.comment_sender.map(
                  (val2) =>
                    val.comment_reciever_email_id === result[0].email &&
                    val2.status === 'approved' && (
                      <Card
                        style={{
                          minWidth: '18rem',
                          height: '11rem',
                          margin: '1rem',
                          overflow: 'auto',
                        }}
                      >
                        <Card.Img variant="top" />
                        <Card.Body>
                          <Card.Text style={{ paddingBottom: '1rem' }}>
                            {val2.comment}
                          </Card.Text>
                          <p id="name" style={{ paddingBottom: '0rem' }}>
                            By {val2.name}
                          </p>
                        </Card.Body>
                      </Card>
                    ),
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MakeAComment
