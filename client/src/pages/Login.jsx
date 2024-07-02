import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';
import '../App'; 

function Login() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);
    } catch (e) {
      console.error('Error:', e.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div className="container my-1-9">
      <Link to="/signup" className="back-link">← Go to Signup</Link>

      <h2 className='login-title'>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group-z">
          <label htmlFor="email" className="label-z">Email address:</label>
          <input
            className="input-z"
            placeholder="youremail@test.com"
            name="email"
            type="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="form-group-z">
          <label htmlFor="pwd" className="label-z">Password:</label>
          <input
            className="input-z"
            placeholder="******"
            name="password"
            type="password"
            id="pwd"
            onChange={handleChange}
          />
        </div>
        {error && (
          <div>
            <p className="error-text">The provided credentials are incorrect</p>
          </div>
        )}
        <div className="button-container-z">
          <button type="submit" className="submit-button-z">Submit</button>
        </div>
      </form>
    </div>
    
  );
}

export default Login;