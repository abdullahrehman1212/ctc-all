import React, { useState } from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(() => ({
    backgroundColor: '#D32F2F',
    color: 'white',
    fontSize: '12px',
    padding: '10px 20px',
    borderRadius: '8px',
    maxWidth:'100px',
    maxHeight:'35px',
    fontWeight:'bold',
    transition: 'transform 0.1s ease, background-color 0.3s ease',
    '&:hover': {
        backgroundColor: '#B71C1C',
    },
    '&.clicked': {
        transform: 'scale(0.9)',
    },
}));

const UpgradeButton = ({ onClick }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        if (onClick) onClick();
        setTimeout(() => setIsClicked(false), 200); 
    };

    return (
        <StyledButton
            className={isClicked ? 'clicked' : ''}
            onClick={handleClick}
            variant="contained"
        >
            UPGRADE
        </StyledButton>
    );
};

export default UpgradeButton;
