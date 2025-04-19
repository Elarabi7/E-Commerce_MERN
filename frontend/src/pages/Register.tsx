import { Box, Button, Container, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'

const Register = () => {
    const [error, setError] = useState('')
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const onSubmit = async () => {
        
        const firstName = firstNameRef.current?.value
        const lastName = lastNameRef.current?.value
        const email = emailRef.current?.value
        const password = passwordRef.current?.value

        const response = fetch("http://localhost:3001/user/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, password })
        })
        if (!(await response).ok) {
            setError('Error registering user, please try different credentials')
            return;
        }
        const data = (await response).json();
        console.log(data)
    }
    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 4 }}>

                <Typography variant='h4'>Register New Account</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, border: 1, p: 2 }} >
                    <TextField inputRef={firstNameRef} label="First Name" variant="outlined" sx={{ m: 1 }} />
                    <TextField inputRef={lastNameRef} label="Last Name" variant="outlined" sx={{ m: 1 }} />
                    <TextField inputRef={emailRef} label="Email" variant="outlined" sx={{ m: 1 }} />
                    <TextField inputRef={passwordRef} type='password' label="Password" variant="outlined" sx={{ m: 1 }} />
                    <Button onClick={onSubmit} variant="contained" color="primary" sx={{ m: 1 }} >Register</Button>
                    {error && <Typography color="error">{error}</Typography>}
                </Box>
            </Box>
        </Container >
    )
}

export default Register