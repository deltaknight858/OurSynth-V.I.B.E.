import React, { useState } from 'react';
import styled from 'styled-components';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const Panel = styled.div`
// ...full code as provided in previous response...
'use client';
  background: var(--glass-bg);
  padding: 16px 8px;
  overflow-y: auto;
  color: var(--text-primary);
`;
const TabContent = styled.div`
  margin-top: 16px;
`;
const HelpIcon = styled.span`
  margin-left: 8px;
  color: #00d4ff;
  cursor: help;
  font-size: 1.1rem;
`;

const tabLabels = ['Layout', 'Style', 'Data', 'Events'];

export default function InspectorPanel({ selectedSection, bodyLayout }: { selectedSection: number; bodyLayout: string | null }) {
  const [tab, setTab] = useState(0);

  // Contextual help text
  let helpText = '';
  if (selectedSection === 0) helpText = 'Edit your site header: logo, navigation, background.';
  else if (selectedSection === 1) helpText = bodyLayout ? `Edit your ${bodyLayout} section.` : 'Choose a layout for your body section.';
  else if (selectedSection === 2) helpText = 'Edit your site footer: copyright, links, background.';

  return (
    <Panel>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="inherit"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{
          background: 'rgba(0,212,255,0.08)',
          borderRadius: '8px',
          color: 'var(--text-primary)',
        }}
      >
        {tabLabels.map(label => <Tab key={label} label={label} />)}
      </Tabs>
      <TabContent>
        <div style={{ marginBottom: 12, color: '#b3e5fc', fontSize: '0.98rem' }}>
          {helpText} <HelpIcon title={helpText}>?</HelpIcon>
        </div>
        {tab === 0 && selectedSection === 0 && <div>Header layout controls (logo, nav links, background)</div>}
        {tab === 0 && selectedSection === 1 && bodyLayout && <div>{bodyLayout} layout controls (headline, images, content)</div>}
        {tab === 0 && selectedSection === 2 && <div>Footer layout controls (copyright, links, background)</div>}
        {tab === 1 && <div>Style controls (colors, typography, shadows, glass-morphism)</div>}
        {tab === 2 && <div>Data controls (bind data sources, API endpoints, Supabase tables)</div>}
        {tab === 3 && <div>Events (onClick, onHover, custom JS callbacks)</div>}
      </TabContent>
    </Panel>
  );
}
