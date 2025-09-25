'use client';

import React, { useState, useMemo } from 'react';
import {
  PaletteContainer,
  SearchSection,
  SearchInput,
  Modal,
  ModalContent,
  AISuggestion,
  CategoryContainer,
  CategoryHeader,
  ComponentGrid,
  ComponentCard,
  FavoritesSection
} from './ComponentPalette.styled';
import { useProjectContext } from '@/contexts/ProjectProvider';
import type { Node } from '@/types/projects';
import type { ComponentDefinition } from '@/types/component-types';

import { baseComponents } from '@/components/base-components';

// Dynamically generate categories from baseComponents
const CATEGORIES = Array.from(
  new Map(
    baseComponents.map(c => [c.category, { key: c.category, title: c.category, color: c.color }])
  ).values()
);
const COMPONENTS: ComponentDefinition[] = baseComponents;

export default function ComponentPalette() {
  const { addNode } = useProjectContext();
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    if (!search.trim()) return COMPONENTS;
    return COMPONENTS.filter(c =>
      (c.displayName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (c.keywords ?? []).some(k => k.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  return (
    <PaletteContainer>
      <SearchSection>
        <SearchInput
          type="text"
          placeholder="Search components..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </SearchSection>
      <CategoryContainer>
        {CATEGORIES.map(cat => (
          <React.Fragment key={cat.key}>
            <CategoryHeader $color={cat.color} $expanded={true}>
              <span className="category-title">{cat.title}</span>
            </CategoryHeader>
            <ComponentGrid $expanded={true}>
              {filtered.filter(c => c.category === cat.key).map(component => (
                <ComponentCard
                  key={component.type}
                  $categoryColor={cat.color}
                  $isDragging={false}
                  onClick={() => addNode && addNode({
                    project_id: 1, // mock project id
                    type: component.type,
                    props: component.defaultProps,
                    x: 0,
                    y: 0,
                    width: component.width || 200,
                    height: component.height || 50,
                    z_index: 1,
                    locked: false,
                    visible: true
                  })}
                >
                  <div className="component-icon">{React.createElement(component.icon)}</div>
                  <div className="component-name">{component.displayName}</div>
                  <div className="component-description">{component.description}</div>
                </ComponentCard>
              ))}
            </ComponentGrid>
          </React.Fragment>
        ))}
      </CategoryContainer>
    </PaletteContainer>
  );
}

