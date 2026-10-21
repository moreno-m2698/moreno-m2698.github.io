import { execFileSync } from 'node:child_process'
import { statSync } from 'node:fs'

// Date (YYYY-MM-DD) of the commit that first added the file. Falls back to the file's mtime when the
// file isn't committed yet or git is unavailable, and to today's date if even that fails. Never throws.
export function getFirstCommitDate(file: string, repoRoot: string): string {
  try {
    const output = execFileSync('git', ['log', '--follow', '--diff-filter=A', '--format=%as', '--', file], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    const dates = output.split('\n').map(line => line.trim()).filter(Boolean)
    const oldest = dates.at(-1)
    if (oldest) return oldest
  }
  catch {
    // Not a git checkout, or git isn't installed: use the file date below.
  }
  try {
    return statSync(file).mtime.toISOString().slice(0, 10)
  }
  catch {
    return new Date().toISOString().slice(0, 10)
  }
}
