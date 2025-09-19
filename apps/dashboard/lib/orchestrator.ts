import { spawn, ChildProcess } from 'child_process';

const serviceCommands: Record<string, { start: string[]; cwd: string }> = {
  'Studio': {
    start: ['npm', 'run', 'dev:studio'],
    cwd: process.cwd(),
  },
  'Sentient Developer': {
    start: ['npm', 'run', 'dev:deploy'],
    cwd: process.cwd(),
  },
  'Pathways': {
    start: ['npm', 'run', 'dev:pathways'],
    cwd: process.cwd(),
  },
};

const runningProcesses: Record<string, ChildProcess | null> = {
  'Studio': null,
  'Sentient Developer': null,
  'Pathways': null,
};

export async function orchestrateService(action: string, name: string, user: { id: string; name: string }) {
  const config = serviceCommands[name];
  if (!config) throw new Error('Unknown service');

  switch (action) {
    case 'start': {
      if (runningProcesses[name]) {
        throw new Error(`${name} is already running.`);
      }
      const [cmd, ...args] = config.start;
      const proc = spawn(cmd, args, { cwd: config.cwd, shell: true });
      runningProcesses[name] = proc;
      proc.on('exit', () => {
        runningProcesses[name] = null;
      });
      return `${name} started by ${user.name}. PID: ${proc.pid}`;
    }
    case 'stop': {
      const proc = runningProcesses[name];
      if (!proc) throw new Error(`${name} is not running.`);
      proc.kill();
      runningProcesses[name] = null;
      return `${name} stopped by ${user.name}.`;
    }
    case 'restart': {
      const proc = runningProcesses[name];
      if (proc) {
        proc.kill();
        runningProcesses[name] = null;
      }
      const [cmd, ...args] = config.start;
      const newProc = spawn(cmd, args, { cwd: config.cwd, shell: true });
      runningProcesses[name] = newProc;
      newProc.on('exit', () => {
        runningProcesses[name] = null;
      });
      return `${name} restarted by ${user.name}. PID: ${newProc.pid}`;
    }
    default:
      throw new Error('Unknown action');
  }
}
