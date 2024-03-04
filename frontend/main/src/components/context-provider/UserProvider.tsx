import React, { useState, createContext, useEffect, useContext } from 'react'
import { JwtModel, UserModel } from '../../api/Client'
import { _apiClient } from '../../App'
import { Box, Modal, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { Paths } from '../../utils/Constants'
import { NotificationContext } from './NotificationProvider'

export const UserContext =
    createContext({
        getUser: () => {}
    })

const UserProvider = (props: any) => {
    const [ user, setUser ] = useState<UserModel>()
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

      getUser(localStorage.getItem('token'))
    }, [ localStorage.getItem('token') ])

    useEffect(() => {
      if (jwt?.expiration) {
        const interval = setInterval(() => {
          const timeRemaining = Math.abs(jwt?.expiration as number) - (Date.now()/1000)
          setPopup(timeRemaining <= 300)
          if (timeRemaining <= 0) {
            localStorage.removeItem('token')
            setPopup(false)
            navigate(Paths['Login'], { replace: true })
            notificationContext.openNotification(false, 'Logging out due to inactivity')
          }
        }, 3000)

        return () => {
          clearInterval(interval)
        }
      }
    }, [ jwt ])

    const getUser = () => {
      return user
    }

    return (
        <UserContext.Provider value={{getUser}}>
          <Modal open={popup}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: 500,
                backgroundColor: 'whitesmoke',
                padding: '20px',
                outline: 'none'
              }}
            >
              <Typography> 
                Your session is ending. If you would like to continue please hit the continue button below. Otherwise hit logout.
              </Typography>
            </Box>
          </Modal>
          {props.children}
        </UserContext.Provider>
    )
}
export default UserProvider