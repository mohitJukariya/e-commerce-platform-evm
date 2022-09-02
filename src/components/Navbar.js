import React from 'react'

function Navbar(props) {
  return (
    <div>
        <nav className="navbar navbar-expand-lg bg-dark ">
            <div className="container-fluid">
                <a className="navbar-brand text-light mb-1" style={{margin: '2', padding: '0'}} href="/"><strong>E Commerce Platform</strong></a>
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
