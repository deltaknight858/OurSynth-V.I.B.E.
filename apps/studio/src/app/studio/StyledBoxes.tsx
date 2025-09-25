import styled from 'styled-components';

export const DroppedComponentBox = styled.div`
  position: absolute;
  padding: 8px 16px;
  border-radius: 8px;
  color: #222;
  font-weight: 600;
`;

export const ErrorBox = styled.div`
  color: var(--danger-color);
  text-align: center;
  margin: 2rem 0;
`;

export const EmptyProjectsBox = styled.div`
  color: var(--text-secondary);
  text-align: center;
  margin: 2rem 0;
`;

export const CanvasColumn = styled.div`
  flex: 1;
`;

export const ComponentCount = styled.span`
  font-size: 0.9rem;
  font-weight: normal;
  color: var(--text-secondary);
  margin-left: var(--spacing-md);
`;
