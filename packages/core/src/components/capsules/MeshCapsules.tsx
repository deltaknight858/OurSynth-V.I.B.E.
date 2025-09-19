'use client';
import { useEffect, useState } from 'react';

export function MeshCapsules() {
  const [files, setFiles] = useState<string[]>([]);
  
  useEffect(() => { 
    fetch('http://mesh.local:7423/capsules')
      .then(r => r.json())
      .then(setFiles); 
  }, []);
  
  return (
    <div className="p-4 rounded-xl border border-cyan-400/30">
      <h3 className="text-cyan-300 font-semibold mb-2">LAN Capsules</h3>
      <ul className="space-y-1 text-sm text-gray-300">
        {files.map(f => <li key={f}>{f}</li>)}
      </ul>
    </div>
  );
}