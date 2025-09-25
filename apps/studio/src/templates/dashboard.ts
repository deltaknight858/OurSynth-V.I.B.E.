import { Node } from '@/types/projects';

export const dashboardTemplate = {
  name: 'Dashboard',
  description: 'A modern dashboard layout with cards and charts',
  thumbnail: '/assets/templates/dashboard.png',
  nodes: [
    {
      id: 1,
      project_id: 1,
      type: 'Header',
      x: 0,
      y: 0,
      width: 1200,
      height: 80,
      z_index: 1,
      props: {
        style: {
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '20px'
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
      type: 'Grid',
      x: 20,
      y: 100,
      width: 1160,
      height: 200,
      z_index: 2,
      props: {
        columns: 4,
        gap: 20,
        children: [
          { type: 'StatCard', title: 'Total Users', value: '1,234' },
          { type: 'StatCard', title: 'Revenue', value: '$12,345' },
          { type: 'StatCard', title: 'Active Projects', value: '45' },
          { type: 'StatCard', title: 'Completion Rate', value: '89%' }
        ],
        style: {
          padding: '20px'
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
      type: 'Chart',
      x: 20,
      y: 320,
      width: 760,
      height: 400,
      z_index: 3,
      props: {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Monthly Growth',
            data: [12, 19, 3, 5, 2, 3]
          }]
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px'
        }
      },
      locked: false,
      visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as Node[]
};
