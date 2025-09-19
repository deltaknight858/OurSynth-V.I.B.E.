
"use client";
import styled from 'styled-components';


export const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
`;

export const TemplateCard = styled.div`
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  overflow: hidden;
  transition: var(--transition-normal);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--glass-box-shadow), 0 8px 32px rgba(0, 0, 0, 0.2);
  }
`;

export const LoadingSpinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  margin-right: var(--spacing-xs);
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const StatusMessage = styled.div<{ $type: 'success' | 'error' }>`
  padding: var(--spacing-md);
  border-radius: var(--glass-border-radius);
  margin-bottom: var(--spacing-lg);
  background: ${props => props.$type === 'success' 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${props => props.$type === 'success' 
    ? 'rgba(34, 197, 94, 0.3)' 
    : 'rgba(239, 68, 68, 0.3)'};
  color: ${props => props.$type === 'success' 
    ? '#10b981' 
    : '#ef4444'};
  text-align: center;
`;



export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const TemplatesContainer = styled.div`
  padding: var(--spacing-lg) 0;
`;

export const Header = styled.div`
  background: var(--glass-background, rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 40px;
  text-align: center;
`;

export const Title = styled.h1`
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
`;

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 32px;
`;


export const PreviewImage = styled.div<{ $backgroundImage?: string }>`
  height: 200px;
  background: ${props => props.$backgroundImage 
    ? `url(${props.$backgroundImage}) center/cover` 
    : 'var(--primary-gradient)'};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(0, 255, 204, 0.1), rgba(160, 32, 240, 0.1));
  }
`;

export const PlayIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--accent-color);
  transition: var(--transition-normal);
  z-index: 1;
`;

export const CardContent = styled.div`
  padding: var(--spacing-lg);
`;

export const CardTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
`;

export const CardDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

export const Price = styled.span`
  color: var(--accent-color);
  font-size: 1.1rem;
  font-weight: 600;
`;

export const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

export const Stars = styled.div`
  color: #ffd700;
`;

export const Tags = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
`;

export const Tag = styled.span`
  background: var(--glass-background-dark);
  color: var(--text-muted);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 12px;
  font-size: 0.8rem;
`;

export const UseTemplateButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--primary-gradient);
  border: none;
  border-radius: var(--glass-border-radius);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  transition: var(--transition-normal);
  opacity: ${props => props.$loading ? 0.7 : 1};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(160, 32, 240, 0.4);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const SearchSection = styled.div`
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--glass-background-dark);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-normal);
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(160, 32, 240, 0.2);
  }
`;

export const FilterSection = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
  flex-wrap: wrap;
`;

export const FilterTag = styled.button<{ $active: boolean }>`
  padding: var(--spacing-sm) var(--spacing-md);
  background: ${props => props.$active 
    ? 'var(--accent-color)' 
    : 'var(--glass-background-dark)'};
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  color: ${props => props.$active 
    ? 'white' 
    : 'var(--text-secondary)'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    background: ${props => props.$active 
      ? 'var(--accent-color)' 
      : 'var(--glass-background)'};
    transform: translateY(-1px);
  }
`;
