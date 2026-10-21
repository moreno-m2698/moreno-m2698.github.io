export interface ProjectImage { src: string, alt: string, width: number, height: number } // src relative to public/, e.g. '/images/x.webp'
export interface Project { name: string, summary: string, stack: string[], repoUrl: string, demoUrl?: string, image?: ProjectImage }
// PLACEHOLDER (spec Q14 style): replace with real projects.
export const projects: Project[] = [
  {
    name: 'Example project (placeholder)',
    summary: 'PLACEHOLDER: 1–3 sentences on role, dates, problem solved and outcome.',
    stack: ['Vue', 'TypeScript'],
    repoUrl: 'https://github.com/moreno-m2698',
  },
]
