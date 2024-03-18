import React, { useState, createContext, useEffect, useContext } from 'react'
import { JwtModel, UserModel } from '../../api/Client'
import { _apiClient } from '../../App'
import { Box, Button, Modal, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { Paths } from '../../utils/Constants'
import { NotificationContext } from './NotificationProvider'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(
  () => ({
      modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 500,
        backgroundColor: 'whitesmoke',
        padding: '20px',
        outline: 'none'
      },
      buttonWrapper: { 
        display: 'flex', 
        justifyContent: 'space-between',
        paddingTop: '1vh'
      }
}))

interface UserProviderProps {
  children: React.ReactNode
}

export const UserContext = createContext<{user: UserModel|undefined, 
                                          token: string|null, 
                                          updateToken: (newToken: string|null) => void}>({
        user: undefined,
        token: null,
        updateToken: (newToken: string|null) => {}, 
      })

const UserProvider = (props: UserProviderProps) => {
    const [ user, setUser ] = useState<UserModel>()
    const [ timeRemaining, setTimeRemaining ] = useState<number>()
    const [ token, setToken ] = useState<string|null>(localStorage.getItem('token'))
    const [ jwt, setJwt ] = useState<JwtModel>()
    const [ popup, setPopup ] = useState<boolean>(false)

    const notificationContext = useContext(NotificationContext)
    const navigate = useNavigate()

    useEffect(() => {
      const getUser = async(jwt: string | null | undefined) => {
          if (jwt) {
              try {
                  const jwtResponse = await _apiClient.verifyToken(jwt)
                  const user = await _apiClient.userGET(jwtResponse.email)
                  setUser(user)
                  setJwt(jwtResponse)
              }
              catch(err: any) {
                  setUser(undefined)
              }
          }
          else {
            setJwt(undefined)
            setUser(undefined)
          }
      }

      getUser(token)
    }, [token])

    useEffect(() => {
      if (jwt?.expiration) {
        const interval = setInterval(() => {
          const timeRemaining = Math.abs(jwt?.expiration as number) - (Date.now()/1000)
          setTimeRemaining(Math.round(timeRemaining/60))
          setPopup(timeRemaining <= 300)
          if (timeRemaining <= 0) {
            localStorage.removeItem('token')
            setPopup(false)
            navigate(Paths['Login'], { replace: true })
            notificationContext.openNotification(false, 'Logged out due to inactivity')
            setToken(null)
          }
        }, 30000)

        return () => {
          clearInterval(interval)
        }
      }
    }, [ jwt, navigate, notificationContext ])

    const { classes } = useStyles()

    const {
      modalBox,
      buttonWrapper
    } = classes

    const handleLogout = () => {
      localStorage.removeItem('token')
      setToken(null)
      setPopup(false)
      navigate(Paths['Login'], { replace: true })
      notificationContext.openNotification(true, 'Successfully logged out')
    }

    const handleContinueSession = async () => {
      const response = await _apiClient.refreshToken()
      localStorage.setItem('token', response.token ?? '')
      setToken(localStorage.getItem('token'))
      setPopup(false)
      notificationContext.openNotification(true, 'Successfully refreshed user session')
    }

    const updateToken = (newToken: string|null) => {
      setToken(newToken)
      localStorage.setItem('token', newToken as string)
    }

    return (
        <UserContext.Provider value={{user, token, updateToken}}>
          <Modal open={popup}>
            <Box className={modalBox}>
              <Typography textAlign={'center'}> 
                Your session is ending in {timeRemaining} {timeRemaining === 1 ? 'minute' : 'minutes'}. If you would like to continue please hit the continue button below. Otherwise hit logout.
              </Typography>
              <Box className={buttonWrapper}>
                <Button onClick={handleContinueSession} variant='contained'>
                  Continue Session
                </Button>
                <Button onClick={handleLogout} variant='contained'>
                  Logout
                </Button>
              </Box>
            </Box>
          </Modal>
          {props.children}
        </UserContext.Provider>
    )
}
export default UserProvider