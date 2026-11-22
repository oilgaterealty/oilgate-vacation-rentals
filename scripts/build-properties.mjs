import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
// Default property builds are preview-only pending owner sign-off.
const python = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const result = spawnSync(python, ['-B', fileURLToPath(new URL('./ovr-v3/build.py',import.meta.url))], {stdio:'inherit'});
if(result.error) throw result.error;
process.exit(result.status ?? 1);
