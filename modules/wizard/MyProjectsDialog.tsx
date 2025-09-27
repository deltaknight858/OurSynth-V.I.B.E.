// PROMOTED from import-staging/apps/app/pathways/MyProjectsDialog.tsx on 2025-09-08T20:34:32.023Z
// TODO: Review for token + design lint compliance.
import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import '../ui/ui.css';
let useAuth: any = () => ({ user: null });
let supabase: any = { from: () => ({ select: async () => ({ data: [] }), delete: async () => ({}), update: async () => ({}) }) };
try { useAuth = require('../../src/authContext').useAuth; } catch {}
try { supabase = require('../../src/supabaseClient').supabase; } catch {}

type Props = { open: boolean; onClose: () => void; onLoad: (proj: any) => void };
export function MyProjectsDialog({ open, onClose, onLoad }: Props) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  async function fetchProjects() {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  }
  useEffect(() => {
    if (!user || !open) return;
    fetchProjects();
  }, [user, open]);

  const handleDelete = async () => {
    if (!selected) return;
    await supabase.from('projects').delete().eq('id', selected.id);
    setSelected(null);
    fetchProjects();
  };

  const handleEdit = async () => {
    if (!selected) return;
    await supabase.from('projects').update({ name: editName, description: editDesc }).eq('id', selected.id);
    setEditOpen(false);
    fetchProjects();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth ariaLabel="My Projects">
      <DialogHeader>
        <DialogTitle>My Projects</DialogTitle>
      </DialogHeader>
      <DialogBody>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="scrollY" data-maxheight="420">
            <table className="table">
              <thead>
                <tr className="tr">
                  <th className="th">Name</th>
                  <th className="th">Description</th>
                  <th className="th">Last Updated</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className={["tr", selected?.id === p.id ? 'rowSelected' : ''].join(' ')} onClick={() => setSelected(p)}>
                    <td className="td">{p.name}</td>
                    <td className="td">{p.description}</td>
                    <td className="td">{p.updated_at}</td>
                    <td className="td">
                      <div className="rowActions">
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelected(p); setEditName(p.name); setEditDesc(p.description); setEditOpen(true); }}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelected(p); handleDelete(); }}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={() => onLoad(selected)} disabled={!selected}>Load</Button>
      </DialogFooter>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth ariaLabel="Edit Project">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="fieldLabel">Name</div>
          <input className="input" placeholder="Project name" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <div className="fieldLabel mt8">Description</div>
          <input className="input" placeholder="Description" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit}>Save</Button>
        </DialogFooter>
      </Dialog>
    </Dialog>
  );
}
