import React from "react";
import styled from "styled-components";

const SpinnerStyled = styled.div`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border: ${props => props.borderSize} solid white;
  border-radius:100rem;
  border-bottom: ${props => props.borderSize} solid transparent;
  border-top: ${props => props.borderSize} solid transparent;
  display: inline-block;
  animation: spinner 1s infinite linear;

  @keyframes spinner {
    100% { 
        transform: rotate(360deg)
    }
  }
  
`;
const LoadingSpinner = ({ size = "40px", borderSize = "5px", ...props }) => {
    return <SpinnerStyled size={size} borderSize={borderSize} {...props}></SpinnerStyled>;
};

export default LoadingSpinner;
