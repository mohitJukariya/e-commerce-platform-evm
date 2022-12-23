import React from 'react'
import '../App.css'
import Register from './Register'
import Buy from './Buy'
import { Link } from 'react-router-dom'


function Main(props) {
  return (
    <div>
      <div className="container sec1 text-center my-5">
        <h1>
          <strong>E-Commerce Platform</strong>
        </h1>
      </div>
      <div className=" sec2 text-center">
        <div className="container row align-items-center">
          <div className="container-fluid col-1 sec3">
            <strong>Want to sell your Product???</strong>
            <button
              type="button"
              className="btn1 btn-warning"
              onClick={<Register />}
            >
              <Link to="/register">SELL</Link>
            </button>
          </div>
          <div className="container-fluid col-2 sec3">
            <strong>Want to buy a Product???</strong>
            <button
              type="button"
              className="btn1 btn-warning"
              onClick={<Buy />}
            >
              <Link to="/buy">BUY</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
