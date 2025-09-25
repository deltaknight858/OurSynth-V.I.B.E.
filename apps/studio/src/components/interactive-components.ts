import { FaBox, FaHeading, FaImage, FaFont, FaTable, FaChartBar, FaList, FaLink, FaTags, FaChartLine, FaChartPie, FaCaretSquareRight } from 'react-icons/fa';
import { MdViewModule, MdInput, MdTimeline, MdStackedBarChart } from 'react-icons/md';
import { animationPresets } from './animations';

export const interactiveComponents = [
  {
    id: 'tabs',
    type: 'Tabs',
    name: 'Tabs',
    icon: FaTags,
    color: '#673AB7',
    category: 'Interactive',
    description: 'Tabbed content with animations',
    defaultProps: {
      tabs: [
        { label: 'Tab 1', content: 'Content for tab 1' },
        { label: 'Tab 2', content: 'Content for tab 2' },
        { label: 'Tab 3', content: 'Content for tab 3' }
      ],
      style: {
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        overflow: 'hidden'
      },
      animation: animationPresets.default
    }
  },
  {
    id: 'lineChart',
    type: 'LineChart',
    name: 'Line Chart',
    icon: FaChartLine,
    color: '#2196F3',
    category: 'Charts',
    description: 'Animated line chart',
    defaultProps: {
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sales',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: '#2196F3',
          tension: 0.4
        }]
      },
      style: {
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px'
      },
      animation: animationPresets.slideDown
    }
  },
  {
    id: 'barChart',
    type: 'BarChart',
    name: 'Bar Chart',
    icon: FaChartBar,
    color: '#4CAF50',
    category: 'Charts',
    description: 'Animated bar chart',
    defaultProps: {
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Revenue',
          data: [65, 59, 80, 81],
          backgroundColor: '#4CAF50'
        }]
      },
      style: {
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px'
      },
      animation: animationPresets.slideLeft
    }
  },
  {
    id: 'pieChart',
    type: 'PieChart',
    name: 'Pie Chart',
    icon: FaChartPie,
    color: '#FF9800',
    category: 'Charts',
    description: 'Animated pie chart',
    defaultProps: {
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
          data: [300, 50, 100],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      },
      style: {
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px'
      },
      animation: animationPresets.popIn
    }
  },
  {
    id: 'timeline',
    type: 'Timeline',
    name: 'Timeline',
    icon: MdTimeline,
    color: '#9C27B0',
    category: 'Interactive',
    description: 'Vertical timeline with events',
    defaultProps: {
      events: [
        { date: '2023', title: 'Event 1', description: 'Description 1' },
        { date: '2024', title: 'Event 2', description: 'Description 2' },
        { date: '2025', title: 'Event 3', description: 'Description 3' }
      ],
      style: {
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px'
      },
      animation: animationPresets.slideLeft
    }
  },
  {
    id: 'accordion',
    type: 'Accordion',
    name: 'Accordion',
    icon: FaCaretSquareRight,
    color: '#00BCD4',
    category: 'Interactive',
    description: 'Collapsible content sections',
    defaultProps: {
      items: [
        { title: 'Section 1', content: 'Content for section 1' },
        { title: 'Section 2', content: 'Content for section 2' },
        { title: 'Section 3', content: 'Content for section 3' }
      ],
      style: {
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        overflow: 'hidden'
      },
      animation: animationPresets.default
    }
  },
  {
    id: 'dataTable',
    type: 'DataTable',
    name: 'Data Table',
    icon: FaTable,
    color: '#E91E63',
    category: 'Interactive',
    description: 'Interactive data table with sorting',
    defaultProps: {
      columns: [
        { field: 'name', header: 'Name' },
        { field: 'age', header: 'Age' },
        { field: 'city', header: 'City' }
      ],
      data: [
        { name: 'John Doe', age: 30, city: 'New York' },
        { name: 'Jane Smith', age: 25, city: 'London' },
        { name: 'Bob Johnson', age: 35, city: 'Paris' }
      ],
      style: {
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        overflow: 'hidden'
      },
      animation: animationPresets.slideDown
    }
  }
];
