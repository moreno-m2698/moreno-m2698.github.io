export interface SiteContact { linkedinUrl: string, githubUrl: string, email: string }
export interface Site { name: string, jobTitle: string, tagline: string, description: string, origin: string, contact: SiteContact }
// PLACEHOLDER values (spec Q14): replace before launch.
export const site: Site = {
  name: 'Michael Moreno',
  jobTitle: 'Full-stack developer',
  tagline: 'PLACEHOLDER: one-line tagline.',
  description: 'Portfolio, projects and articles of a full-stack developer.',
  origin: 'https://moreno-m2698.github.io',
  contact: {
    linkedinUrl: 'https://www.linkedin.com/in/michael-moreno-dev',
    githubUrl: 'https://github.com/moreno-m2698',
    email: 'moreno.m2698@gmail.com',
  },
}
