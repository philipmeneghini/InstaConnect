import { useState } from 'react'
import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, TextField, Typography} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import React from 'react'
import { _apiClient } from '../../App'
import SubmissionAlert from '../../components/login-pages/SubmissionAlert'
import LoginHeader from '../../components/login-pages/LoginHeader'
import { Paths } from '../../utils/Constants'
import { FormProperties } from '../../utils/FormProperties'
import { ApiException, LoginResponse } from '../../api/Client'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false);
    const [login, setLogin] = useState<FormProperties>({
      isOpen: false,
      isSuccess: false,
      message: ''
    })

    const navigate = useNavigate()

    const handleClickShowPassword = () => {
      setShowPassword(!showPassword)
    }

    const handleSuccessfulLogin = ( jwt: string ) => {
      localStorage.setItem('token', jwt)
      navigate(Paths['Home'], { replace: true })
    }

    const handleClickLogin = async() => {
      if (!email || !password) {
        setLogin({
          isOpen: true,
          isSuccess: false,
          message: 'An email or password has not been entered yet'
        })
        return
      }
      try {
        const response: LoginResponse = await _apiClient.login({ email, password })
        setLogin({
          isOpen: true,
          isSuccess: true,
          message: 'User Has Successfully Logged In!'
        })
        setTimeout(() => 
        { handleSuccessfulLogin(response.token as string) }, 
        3000)
      }
      catch(err: any) {
        let loginProperties: FormProperties = {
          isOpen: true,
          isSuccess: false,
          message: ''
        }
        if (err instanceof ApiException) {
          loginProperties.message = err.response
          setLogin(loginProperties)
        }
        else {
          loginProperties.message = 'Internal Server Error'
          setLogin(loginProperties)
        }
      }
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
    
    const onChangeEmail = (event: any): void => {
      setEmail(event.target.value)
    }

    const onChangePassword = (event: any): void => {
      setPassword(event.target.value)
    }

    return (
      <>
        <LoginHeader sideButton='Register' sideButtonPath={Paths['Register']}/>
        <Grid
          container
          spacing={3}
          direction='column'
          alignItems='center'
          justifyContent='center'
          sx={{ minHeight: '100vh' }}
        >
          <Grid item xs={10}>
            <TextField
              style={{ width: '60ch' }}
              label='Email'
              variant='outlined'
              value={email}
              onChange={onChangeEmail} />
          </Grid>
          <Grid item xs={5}>
            <FormControl sx={{ m: 1, width: '60ch' }} variant='outlined'>
              <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
              <OutlinedInput
                id='outlined-adornment-password'
                type={showPassword ? 'text' : 'password'}
                endAdornment={<InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>}
                label='Password'
                onChange={onChangePassword} />
            </FormControl>
          </Grid>
          <Grid item container direction='row' alignItems='center' justifyContent='center' xs={11}>
            <Grid item xs={4.75}></Grid>
            <Grid item xs={1.5}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                onClick={handleClickLogin}
              >
                <Typography variant='h5' display='block' align='center'>
                  Log in
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={4.75}>
              <Link display='flex' alignContent='start' justifyContent='start' href='http://localhost:3000/resetPassword'>Reset Password</Link>
            </Grid>
            <SubmissionAlert value={login} setValue={setLogin} />
          </Grid>
        </Grid>
      </>)
}

export default LoginPage