import styled, { css } from 'styled-components';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

// The internal interface for the styled component uses the transient prop
interface StyledButtonProps {
  $variant: 'primary' | 'secondary';
}

const primaryStyles = css`
  background-color: #007AFF;
  color: #FFFFFF;
  border: 2px solid transparent;
  &:hover:not(:disabled) { background-color: #0056b3; }
`;

const secondaryStyles = css`
  background-color: transparent;
  color: #007AFF;
  border: 2px solid #007AFF;
  &:hover:not(:disabled) { background-color: #E6F7FF; }
`;

const StyledButton = styled.button<StyledButtonProps>`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;

  ${({ $variant }) => ($variant === 'secondary' ? secondaryStyles : primaryStyles)}

  &:disabled {
    background-color: #DEE2E6;
    color: #6c757d;
    border-color: transparent;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.5);
  }
`;

export const Button: React.FC<ButtonProps> = ({ onClick, disabled = false, children, variant = 'primary' }) => {
  return (
    // Pass the prop with the '$' prefix to the styled component
    <StyledButton onClick={onClick} disabled={disabled} $variant={variant}>
      {children}
    </StyledButton>
  );
};