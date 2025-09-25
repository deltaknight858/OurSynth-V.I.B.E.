export const ComponentGrid = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  max-height: ${props => props.$expanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
    &:hover {
      background: rgba(255,255,255,0.3);
    }
  }
`;

export const ComponentCard = styled.div<{ $categoryColor: string; $isDragging: boolean; $isFavorite?: boolean; }>`
  position: relative;
  padding: var(--spacing-lg);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid ${props => props.$isDragging ? props.$categoryColor : 'rgba(255, 255, 255, 0.1)'};
  border-radius: var(--glass-border-radius);
  cursor: move;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border-color: ${props => props.$categoryColor};
  }
  .component-icon {
    font-size: 2.5rem;
    color: ${props => props.$categoryColor};
    margin-bottom: var(--spacing-sm);
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover .component-icon {
    transform: scale(1.1) rotate(3deg);
  }
  .component-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    text-align: center;
    margin-bottom: var(--spacing-sm);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 var(--spacing-xs);
    line-height: 1.2;
  }
  .component-description {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
  opacity: ${props => props.$isDragging ? 0.5 : 1};
  transform: ${props => props.$isDragging ? 'scale(0.95)' : 'scale(1)'};
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .favorite-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    color: ${props => props.$isFavorite ? '#ffd700' : 'var(--text-muted)'};
    opacity: ${props => props.$isFavorite ? 1 : 0};
    transition: all 0.3s ease;
    z-index: 10;
    &:hover {
      color: #ffd700;
      transform: scale(1.2);
      filter: drop-shadow(0 0 8px #ffd700);
    }
  }
  &:hover .favorite-btn {
    opacity: 1;
  }
  .add-btn {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 28px;
    height: 28px;
    border: none;
    background: ${props => `linear-gradient(135deg, ${props.$categoryColor}, ${props.$categoryColor}dd)`};
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 10;
    font-weight: bold;
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 15px ${props => `${props.$categoryColor}80`};
    }
  }
  &:hover .add-btn {
    opacity: 1;
  }
  .component-preview {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-sm);
    transition: all 0.3s ease;
    min-height: 24px;
    align-items: center;
  }
  &:hover .component-preview {
    transform: scale(1.1);
  }
`;

export const FavoritesSection = styled.div`
  border-bottom: var(--glass-border);
  padding: var(--spacing-sm);
`;
import styled from 'styled-components';

export const PaletteContainer = styled.div`
  flex: 0 0 320px;
  min-width: 280px;
  max-width: 380px;
  height: 100vh;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border-right: var(--glass-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .component-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    overflow-y: auto;
  }
  .template-button {
    margin: 16px;
    padding: 12px;
    background: var(--accent-primary);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    &:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
    &:hover {
      background: rgba(255,255,255,0.3);
    }
  }
`;

export const SearchSection = styled.div`
  padding: var(--spacing-md);
  border-bottom: var(--glass-border);
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--glass-border-radius);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  &::placeholder {
    color: var(--text-muted);
  }
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
  }
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: var(--background-primary);
  padding: 24px;
  border-radius: 12px;
  width: 80%;
  max-width: 1200px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

export const AISuggestion = styled.div`
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: linear-gradient(45deg, rgba(0, 123, 255, 0.1), rgba(138, 43, 226, 0.1));
  border: 1px solid rgba(0, 123, 255, 0.2);
  border-radius: var(--glass-border-radius);
  font-size: 0.8rem;
  color: var(--text-secondary);
  .suggestion-text {
    color: var(--accent-color);
    font-weight: 600;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const CategoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--accent-color);
    border-radius: 3px;
  }
`;

export const CategoryHeader = styled.div<{ $color: string; $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  margin: var(--spacing-sm) 0;
  background: ${props => `linear-gradient(135deg, ${props.$color}20, ${props.$color}10)`};
  border: 1px solid ${props => `${props.$color}40`};
  border-radius: var(--glass-border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: ${props => `linear-gradient(135deg, ${props.$color}30, ${props.$color}15)`};
    box-shadow: 0 0 20px ${props => `${props.$color}30`};
    transform: translateY(-1px);
  }
  .category-icon {
    font-size: 1.2rem;
    margin-right: var(--spacing-sm);
    filter: drop-shadow(0 0 8px ${props => props.$color});
  }
  .category-info {
    flex: 1;
  }
  .category-title {
    font-weight: 700;
    color: var(--text-primary);
    font-size: 0.95rem;
  }
  .category-subtitle {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 2px;
  }
  .expand-arrow {
    font-size: 0.8rem;
    color: var(--text-muted);
    transition: transform 0.3s ease;
    transform: rotate(${props => props.$expanded ? '90deg' : '0deg'});
  }
`;

// ...existing code for other styled components...
