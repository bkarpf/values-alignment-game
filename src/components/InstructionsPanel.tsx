import React from 'react';
import styled from 'styled-components';

// Props definition based on Section 4.2
interface InstructionsPanelProps {
  title: string;
  children: React.ReactNode;
}

// Styled component implementing styles from Sections 4.2, 7.1.1, 7.1.2, and 7.1.3
const PanelContainer = styled.div`
  /* Using Interactive Surface color for background as per 7.1.1 */
  background-color: #FFFFFF;
  border: 1px solid #DEE2E6; /* Subtle Borders/Dividers */
  border-radius: 8px;
  padding: 24px; /* 8px grid system */
  margin-bottom: 24px;
`;

const PanelTitle = styled.h2`
  /* Typography from 7.1.2 */
  font-family: 'Inter', sans-serif;
  font-weight: 600; /* Semibold */
  font-size: 24px; /* H2 size */
  color: #212529; /* Text */
  margin-top: 0;
  margin-bottom: 16px;
`;

const PanelBody = styled.div`
  /* Typography from 7.1.2 */
  font-family: 'Inter', sans-serif;
  font-weight: 400; /* Regular */
  font-size: 16px; /* Body size */
  line-height: 1.5;
`;

export const InstructionsPanel: React.FC<InstructionsPanelProps> = ({ title, children }) => {
  return (
    <PanelContainer>
      <PanelTitle>{title}</PanelTitle>
      <PanelBody>{children}</PanelBody>
    </PanelContainer>
  );
};
