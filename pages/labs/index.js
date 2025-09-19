import dynamic from 'next/dynamic';

const LabsApp = dynamic(() => import('../../labs/pages/index'), { ssr: false });
export default LabsApp;
