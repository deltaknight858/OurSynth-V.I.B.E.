'use client';

import React from 'react';
import styled from 'styled-components';
import { landingPageTemplate } from './landing-page';
import { dashboardTemplate } from './dashboard';
import { useProjectContext } from '@/contexts/ProjectProvider';

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const TemplateCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const Thumbnail = styled.div<{ src: string }>`
  width: 100%;
  height: 160px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const templates = [
  landingPageTemplate,
  dashboardTemplate
];

export default function TemplateSelector() {
  const { setNodes } = useProjectContext();

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setNodes(template.nodes);
  };

  return (
    <TemplateGrid>
      {templates.map((template, index) => (
        <TemplateCard 
          key={index}
          onClick={() => handleTemplateSelect(template)}
        >
          <Thumbnail src={template.thumbnail} />
          <Title>{template.name}</Title>
          <Description>{template.description}</Description>
        </TemplateCard>
      ))}
    </TemplateGrid>
  );
}
