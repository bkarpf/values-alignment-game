import styled from 'styled-components';
import type { Value } from '../types';

interface ValueCardProps {
  value: Value | undefined | null; // Allow undefined/null to be passed
  isDragging?: boolean;
  color?: string;
}

interface StyledCardProps {
  $isDragging?: boolean;
  $color?: string;
}

const CardContainer = styled.div<StyledCardProps>`
  box-sizing: border-box;
  width: 150px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ $color }) => $color || '#FFFFFF'};
  font-family: 'Inter', sans-serif;
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    box-shadow: 0 4px 10px rgba(0,0,0,0.12);
  }

  transform: ${({ $isDragging }) => $isDragging ? 'scale(1.05) rotate(3deg)' : 'scale(1) rotate(0deg)'};
  box-shadow: ${({ $isDragging }) => $isDragging ? '0 5px 15px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)'};
`;

const CardName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
`;

const CardDefinition = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #495057;
  margin: 0;
  line-height: 1.4;
`;

export const ValueCard: React.FC<ValueCardProps> = ({ value, isDragging = false, color }) => {
  if (!value) {
    return null;
  }

  return (
    <CardContainer $isDragging={isDragging} $color={color}>
      <CardName>{value.name}</CardName>
      <CardDefinition>{value.definition}</CardDefinition>
    </CardContainer>
  );
};