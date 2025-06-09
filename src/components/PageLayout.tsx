import React from 'react';
import styled from 'styled-components';

// Props definition to support header, footer, and content children (slots)
// as implied by Section 4.1. [3, 8, 12]
interface PageLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

// Styled components implementing styles from Sections 4.1, 7.1.1, and 7.1.3
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F8F9FA; /* Neutral Background */
  color: #212529; /* Text */
`;

const HeaderContainer = styled.header`
  width: 100%;
`;

const ContentContainer = styled.main`
  flex-grow: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px; /* Consistent 8px grid system spacing */
`;

const FooterContainer = styled.footer`
  width: 100%;
  padding: 16px 24px;
  background-color: #FFFFFF;
  border-top: 1px solid #DEE2E6; /* Subtle Borders/Dividers */
`;

export const PageLayout: React.FC<PageLayoutProps> = ({ header, children, footer }) => {
  return (
    <LayoutContainer>
      {header && <HeaderContainer>{header}</HeaderContainer>}
      <ContentContainer>
        {children}
      </ContentContainer>
      {footer && <FooterContainer>{footer}</FooterContainer>}
    </LayoutContainer>
  );
};
