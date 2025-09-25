import React, { useState } from 'react';
import styled from 'styled-components';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Folder, Description, Image, Settings, Palette, Article, Storefront } from '@mui/icons-material';

const Panel = styled.div`
  height: 100%;
// ...full code as provided in previous response...
'use client';
  padding: 16px 8px;
  overflow-y: auto;
  color: var(--text-primary);
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid var(--glass-border);
  background: rgba(255,255,255,0.08);
  color: var(--text-primary);
  font-size: 1rem;
`;

const sections = [
  { id: 'pages', label: 'Pages', icon: <Description /> },
  { id: 'blog', label: 'Blog Posts', icon: <Article /> },
  { id: 'products', label: 'Products', icon: <Storefront /> },
  { id: 'templates', label: 'Templates', icon: <Folder /> },
  { id: 'media', label: 'Media Library', icon: <Image /> },
  { id: 'styles', label: 'Styles', icon: <Palette /> },
  { id: 'settings', label: 'Settings', icon: <Settings /> },
];

export default function SiteStructurePanel() {
  const [search, setSearch] = useState('');
  // For demo, static tree
  return (
    <Panel>
      <SearchInput
        type="text"
        placeholder="Search pages, assets, or settings..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <TreeView defaultCollapseIcon={<Folder />} defaultExpandIcon={<Folder />}>
        {sections.map(section => (
          <TreeItem key={section.id} nodeId={section.id} label={<span style={{display:'flex',alignItems:'center',gap:8}}>{section.icon}{section.label}</span>}>
            {/* Example children */}
            <TreeItem nodeId={section.id+':1'} label={section.label+" Item 1"} />
            <TreeItem nodeId={section.id+':2'} label={section.label+" Item 2"} />
          </TreeItem>
        ))}
      </TreeView>
    </Panel>
  );
}
