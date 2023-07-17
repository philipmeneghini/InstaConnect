import { useState } from 'react'
import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import React from 'react'
import { _authenticationApiClient } from '../App'
import LoginRegisterAlert from '../components/LoginRegisterAlert'
import LoginHeader from '../components/LoginHeader'
import { SideButton } from '../utils/Constants'
import { FormProperties } from '../utils/FormProperties'
import { GenericResponse } from '../api_views/IBaseApiClient'

export const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false);
    const [login, setLogin] = useState<FormProperties>({
      isOpen: false,
      isSuccess: false,
      message: ''
    });

    const handleClickShowPassword = () => {
      setShowPassword(!showPassword)
    }

    const handleClickLogin = async() => {
      if (!email || !password) {
        setLogin({
          isOpen: true,
          isSuccess: false,
          message: "An email or password has not been entered yet"
        })
        return
      }
      const response: GenericResponse<string> = await _authenticationApiClient.login(email, password)
      if (response.data) {
        setLogin({
          isOpen: true,
          isSuccess: true,
          message: "User Has Successfully Logged In!"
        })
      }
      else {
        let loginProperties: FormProperties = {
          isOpen: true,
          isSuccess: false,
          message: String(response.statusCode)
        }
        if (response.statusCode === undefined) {
          loginProperties.message = "Network Error"
          setLogin(loginProperties)
        }
        else if (response.statusCode === 400) {
          loginProperties.message = "Invalid Email or Password"
          setLogin(loginProperties)
        }
        else {
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
        <LoginHeader sideButton='Register' sideButtonPath={SideButton['Register']}/>
        <Grid
          container
          spacing={3}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '100vh' }}
        >
          <Grid item xs={10}>
            <TextField
              style={{ width: '60ch' }}
              label="Email"
              variant="outlined"
              value={email}
              onChange={onChangeEmail} />
          </Grid>
          <Grid item xs={5}>
            <FormControl sx={{ m: 1, width: '60ch' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={<InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>}
                label="Password"
                onChange={onChangePassword} />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleClickLogin}
            >
              <Typography variant="h5" display="block" align="center">
                Log in
              </Typography>
            </Button>
            <LoginRegisterAlert login={login} setLogin={setLogin} />
          </Grid>
        </Grid>
      </>)
}

export default LoginPage