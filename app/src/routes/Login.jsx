import { Navigate, Link } from 'react-router-dom';
import { useRef } from 'react';
import swal from 'sweetalert';
import { Suspense } from 'react';
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button';
import { useState } from 'react';


export const Login = (props) => {

  const URL = 'http://localhost:8000/api'

  const { isLoggedIn, setIsLoggedIn } = props
  const usernameRef = useRef();
  const passwordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  //Does a fetch call on log in click that sends the users password and username to authent
  function signIn(e) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      loginHandler()
    }, 1000)
  }
  const loginHandler = () => {
    let inputUsername = usernameRef.current.value
    let inputPassword = passwordRef.current.value
    console.log(inputPassword, inputUsername)
    //Checks to ensure both a username and password were input
   if(inputUsername == '' || inputPassword == ''){
    swal('Both username and Paswword are required')
   }
   //Sends a request to the login to verify username and password
    fetch(`${URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          username: `${inputUsername}`,
          password: `${inputPassword}`
      })
    })
    .then(result => result.json())
    .then(data => verifyLogin(data))
    // setIsLoggedIn(false)
  }
  //Verifies that the user was logged in
  //If the response is not the users information it gives an alert
  //If login was successful it sets session storage to users info
  function verifyLogin(data){
    let info = data[0]
    console.log(info)
    if(info.response == 'Incorrect Username'){
      swal('Incorrect Username')
      setIsLoading(false)
    } else if(info.response == 'false'){
      swal('Incorrect Password')
      setIsLoading(false)
    } else {
      sessionStorage.setItem('username', info.username)
      sessionStorage.setItem('userToken', info.userToken)
      sessionStorage.setItem('asanaToken', info.asanaToken)
      setSessionToken()
    }
  }
  //Creates a new session token on each log in
  //This token is verfied on the home page to ensure it is the correct user
  function setSessionToken(){
    fetch(`${URL}/token`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: sessionStorage.getItem('username')
      })
    })
    .then(result => result.json())
    .then(data => sessionStorage.setItem('sessionToken', data[0].session_token))
    .then(setIsLoading(false))
  }
  //if user is already logged in, they will be automatically navigated to the home page
  // if(isLoggedIn){
  //   return <Navigate to="/" />
  // };

  return(
    <>
    <div id="signInBody">
      <h2>SIGN IN</h2>
      <div id="signInForm">
        <form>
          <label>Username:</label>
          <input ref={usernameRef} type="text" placeholder="type username here" required />
          <label>Password:</label>
          <input ref={passwordRef} type="password" placeholder="type password here" minLength={8} required />
          {/* Checks to see if button was pressed, if it was it shows a spinner */}
          { isLoading === true ?
                       <Button className="button" id="new-post-submit" variant="primary" disabled>
                       <Spinner
                         as="span"
                         animation="border"
                         size="sm"
                         role="status"
                         aria-hidden="true"
                       />
                       <span className="visually-hidden">Loading...</span>
                     </Button>
                       :
                    <Button type='submit' value="Sign In" onClick={(e) => signIn(e)} >Login</Button>
                }
        </form>
        <p>
          Don't have an account? Click <Link to='/register'>Here</Link>
        </p>
      </div>
    </div>
    </>
  );
}

