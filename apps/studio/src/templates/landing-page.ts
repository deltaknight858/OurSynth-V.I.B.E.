import { Node } from '@/types/projects';

export const landingPageTemplate = {
  name: 'Landing Page',
  description: 'A modern landing page template with hero section, features, and CTA',
  thumbnail: '/assets/templates/landing-page.png',
  nodes: [
    {
      id: 1,
      project_id: 1,
      type: 'Section',
      x: 0,
      y: 0,
      width: 1200,
      height: 600,
      z_index: 1,
      props: {
        style: {
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          padding: '40px'
        }
      },
      locked: false,
      visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      project_id: 1,
      type: 'Text',
      x: 100,
      y: 200,
      width: 600,
      height: 100,
      z_index: 2,
      props: {
        text: 'Welcome to OurSynth',
        style: {
          fontSize: '48px',
          fontWeight: 'bold'
        }
      },
      locked: false,
      visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      project_id: 1,
      type: 'Grid',
      x: 0,
      y: 600,
      width: 1200,
      height: 400,
      z_index: 3,
      props: {
        columns: 3,
        gap: 20,
        style: {
          padding: '40px'
        }
      },
      locked: false,
      visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as Node[]
};
