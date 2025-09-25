import { ComponentDefinition } from '../types/ComponentTypes';
import { FaBox, FaColumns, FaFont, FaImage, FaLayerGroup, FaList, FaTable } from 'react-icons/fa';

export const BASE_COMPONENTS: ComponentDefinition[] = [
  {
    id: 'text',
    type: 'text',
    name: 'Text',
    icon: FaFont,
    color: '#4CAF50',
    category: 'Basic',
    description: 'Simple text display element',
    defaultProps: {
      text: 'Text content',
      style: {
        color: '#000000',
        fontSize: '16px'
      }
    }
  },
  {
    id: 'container',
    type: 'container',
    name: 'Container',
    icon: FaBox,
    color: '#2196F3',
    category: 'Layout',
    description: 'A flexible container for grouping elements',
    defaultProps: {
      style: {
        padding: '20px',
        minHeight: '100px',
        background: '#ffffff',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }
    }
  },
  {
    id: 'image',
    type: 'image',
    name: 'Image',
    icon: FaImage,
    color: '#9C27B0',
    category: 'Basic',
    description: 'Display images and media content',
    defaultProps: {
      src: 'https://via.placeholder.com/200x150',
      alt: 'Image description',
      style: {
        maxWidth: '100%',
        height: 'auto'
      }
    }
  },
  {
    id: 'grid',
    type: 'grid',
    name: 'Grid',
    icon: FaLayerGroup,
    color: '#FF9800',
    category: 'Layout',
    description: 'Grid layout container',
    defaultProps: {
      columns: 2,
      gap: '20px',
      style: {
        display: 'grid',
        padding: '20px',
        minHeight: '100px',
        background: '#ffffff',
        borderRadius: '4px'
      }
    }
  },
  {
    id: 'table',
    type: 'table',
    name: 'Table',
    icon: FaTable,
    color: '#607D8B',
    category: 'Data',
    description: 'Display tabular data',
    defaultProps: {
      headers: ['Column 1', 'Column 2', 'Column 3'],
      data: [
        ['Data 1', 'Data 2', 'Data 3'],
        ['Data 4', 'Data 5', 'Data 6']
      ],
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }
  },
  {
    id: 'list',
    type: 'list',
    name: 'List',
    icon: FaList,
    color: '#795548',
    category: 'Data',
    description: 'Display items in a list',
    defaultProps: {
      items: ['Item 1', 'Item 2', 'Item 3'],
      type: 'unordered',
      style: {
        listStyle: 'disc',
        paddingLeft: '20px'
      }
    }
  },
  {
    id: 'columns',
    type: 'columns',
    name: 'Columns',
    icon: FaColumns,
    color: '#009688',
    category: 'Layout',
    description: 'Multi-column layout',
    defaultProps: {
      columns: 2,
      style: {
        display: 'flex',
        gap: '20px',
        padding: '20px',
        minHeight: '100px',
        background: '#ffffff',
        borderRadius: '4px'
      }
    }
  }
];
