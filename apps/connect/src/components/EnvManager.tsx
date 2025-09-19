
    import { useState, useEffect } from 'react';
import { useDeployments } from '@/hooks/useDeployments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, PlusCircle, Save, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface EnvManagerProps {
  siteId: string;
}

export default function EnvManager({ siteId }: EnvManagerProps) {
  const { env, getEnv, updateEnv, isEnvLoading: isUpdating } = useDeployments();
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    if (siteId) {
      setIsLoading(true);
      getEnv(siteId).finally(() => setIsLoading(false));
    }
  }, [siteId, getEnv]);

  useEffect(() => {
    if (env) {
      setVariables(env);
    }
  }, [env]);

  const handleAddVariable = async () => {
    if (!newKey || !newValue) {
      toast.error('Key and Value cannot be empty.');
      return;
    }
    if (variables[newKey]) {
      toast.error('Variable key already exists.');
      return;
    }

    const updatedEnv = { ...variables, [newKey]: newValue };
    await updateEnv(siteId, updatedEnv);
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
  };

  const handleDeleteVariable = async (keyToDelete: string) => {
<<<<<<< HEAD
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
=======
>>>>>>> 4feaadea468fca2b13cf09955b1eec9f1acc2214
    const { [keyToDelete]: _, ...remainingVars } = variables;
    await updateEnv(siteId, remainingVars);
  };

  const handleStartEdit = (key: string, value: string) => {
    setEditingKey(key);
    setEditingValue(value);
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditingValue('');
  };

  const handleUpdateVariable = async () => {
    if (!editingKey || !editingValue) return;
    
    const updatedEnv = { ...variables, [editingKey]: editingValue };
    await updateEnv(siteId, updatedEnv);
    setEditingKey(null);
    setEditingValue('');
  };

  const renderTableContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i} className="border-b-transparent">
          <TableCell><Skeleton className="h-8 w-full bg-white/10" /></TableCell>
          <TableCell><Skeleton className="h-8 w-full bg-white/10" /></TableCell>
          <TableCell className="w-28"><Skeleton className="h-8 w-full bg-white/10" /></TableCell>
        </TableRow>
      ));
    }

    const variableEntries = Object.entries(variables);

    if (variableEntries.length === 0 && !isAdding) {
        return (
            <TableRow className="border-b-transparent">
                <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                    No environment variables set.
                </TableCell>
            </TableRow>
        );
    }

    return variableEntries.map(([key, value]) => (
      editingKey === key ? (
        <TableRow key={key} className="bg-cyan-500/10 border-b-cyan-400/20">
          <TableCell className="font-medium align-middle text-cyan-300">{key}</TableCell>
          <TableCell>
            <Input
              type="password"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              className="bg-transparent border-cyan-400/50 focus:ring-cyan-400 focus:border-cyan-400"
              disabled={isUpdating}
            />
          </TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="icon" onClick={handleUpdateVariable} disabled={isUpdating} className="text-green-400 hover:text-green-300 hover:bg-green-400/10">
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancelEdit} disabled={isUpdating} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow key={key} className="border-b-white/10 dark:odd:bg-white/5 hover:bg-cyan-400/5 group transition-colors duration-200">
          <TableCell className="font-medium">{key}</TableCell>
          <TableCell>
            <span className="font-mono text-muted-foreground">••••••••••••••••</span>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" onClick={() => handleStartEdit(key, value)} className="hover:text-cyan-300 hover:bg-cyan-400/10">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteVariable(key)} className="hover:text-red-400 hover:bg-red-400/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )
    ));
  };

  return (
    <Card className="glass-card border-cyan-400/20 shadow-lg shadow-cyan-500/5">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="neon-etched-light text-2xl tracking-wider">Environment Variables</CardTitle>
        <Button 
          variant="outline" 
          onClick={() => setIsAdding(!isAdding)} 
          disabled={isUpdating}
          className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 transition-all duration-300 hover:shadow-[0_0_15px_-3px_rgba(0,255,255,0.4)]"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {isAdding ? 'Cancel' : 'Add Variable'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg border-white/10">
            <Table>
            <TableHeader>
                <TableRow className="border-b-white/10 hover:bg-transparent">
                <TableHead className="w-[30%]">Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right w-28">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isAdding && (
                <TableRow className="bg-cyan-500/10 border-b-cyan-400/20">
                    <TableCell>
                    <Input
                        placeholder="VARIABLE_NAME"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                        className="bg-transparent border-cyan-400/50 focus:ring-cyan-400 focus:border-cyan-400"
                        disabled={isUpdating}
                    />
                    </TableCell>
                    <TableCell>
                    <Input
                        type="password"
                        placeholder="Value"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="bg-transparent border-cyan-400/50 focus:ring-cyan-400 focus:border-cyan-400"
                        disabled={isUpdating}
                    />
                    </TableCell>
                    <TableCell className="text-right">
                    <Button onClick={handleAddVariable} disabled={isUpdating || !newKey || !newValue} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all duration-300 hover:shadow-[0_0_15px_-3px_rgba(0,255,255,0.8)] disabled:shadow-none">
                        Add
                    </Button>
                    </TableCell>
                </TableRow>
                )}
                {renderTableContent()}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
  