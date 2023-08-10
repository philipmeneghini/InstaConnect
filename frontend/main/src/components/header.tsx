import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'

export const Header = () => {
    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                <Typography variant='h4' component='div' sx={{ flexGrow: 1 }}>
                    InstaConnect
                </Typography>
                <Avatar/>
                </Toolbar>
            </Container>
        </AppBar>
)}

export default Header