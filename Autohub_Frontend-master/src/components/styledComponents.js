import { Button } from '@mui/material';
import { styled, keyframes } from '@mui/system';

const rightToLeft = keyframes`
  0% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 100%;
  }
`;





export const StyledButton1 = styled(Button)({
  backgroundColor: 'red',
  textTransform: 'none',
  color: 'white',
  backgroundSize: '200% 100%',
  backgroundImage: 'linear-gradient(to left, red 50%, black 50%)',
  backgroundPosition: '100% 100%',
  transition: 'color 0.3s ease, background-position 0.4s ease',
  fontWeight: 'bold',
  padding: '10px 30px', 
  fontSize: '16px',
  '&:hover': {
    animation: `${rightToLeft} 0.4s forwards`,
    backgroundPosition: '0% 100%',
  },
});

export const StyledButton2 = styled(Button)({
  textTransform: 'none',
  color: 'white',
  fontWeight: 'bold',
  '&:hover': {
    color: 'red',
  },
});


export const StyledButton3 = styled(Button)({
  marginLeft: '10px',
  backgroundColor: 'white',
  textTransform: 'none',
  color: 'black',
  border: 'none',
  backgroundSize: '200% 100%',
  backgroundImage: 'linear-gradient(to left, white 50%, red 50%)',
  backgroundPosition: '100% 100%',
  transition: 'color 0.3s ease, background-position 0.4s ease',
  fontWeight: 'bold',
  padding: '10px 30px', 
  fontSize: '16px',
  '&:hover': {
    animation: `${rightToLeft} 0.4s forwards`,
    backgroundPosition: '0% 100%',
    color: 'white',
  },
});

