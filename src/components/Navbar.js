import React from 'react'
import '../App.css';
import { Link } from 'react-router-dom';


function Navbar(props) {
  return (
    <div>
        <nav className="navbar navbar-expand-lg text-dark" id='navbar'>
            <div className="container-fluid" >
                <Link className="navbar-brand text-light mb-1"  style={{margin: '2', padding: '0'}} to="/"><strong>मंगल बाजार</strong></Link>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <a className="nav-link active text-light mx-3" aria-current="page" href="/">Home</a>
                    </li>
                </ul>
            </div>
            <small className='text-white mx-3 px-2' >
            {props.account}
            </small>
        </nav>
    </div>
  )
}

export default Navbar
