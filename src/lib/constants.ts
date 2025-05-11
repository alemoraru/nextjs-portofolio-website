import packageJson from '../../package.json';

/**
 * Array of navigation items for the website (i.e. paths/pages to navigate to).
 */
export const navItems = [
    {name: 'Home', path: '/'},
    {name: 'Work', path: '/work'},
    {name: 'Projects', path: '/projects'},
    {name: 'Blog', path: '/blog'}
]

/**
 * Temporary mapping for tech stack icons.
 */
export const techStackMap: Record<string, string> = {
    'React': 'reactjs',
    'TypeScript': 'typescript',
    'TailwindCSS': 'tailwindcss',
    'Node.js': 'nodejs',
    'NextJS': 'nextjs',
    'aws': 'aws',
    'MongoDB': 'mongodb',
    'PostgreSQL': 'postgresql',
    'Python': 'python',
    'Flask': 'flask',
    'Solidity': 'solidity',
    'C#': 'csharp',
    'Firebase': 'firebase',
    'AWS IoT': 'aws',
    'AWS': 'aws',
    'C++': 'c++',
    'Azure': 'azure',
    'Redis': 'redis',
    'GraphQL': 'graphql',
    'Docker': 'docker',
    'Java': 'java',
    'MySQL': 'mysql',
    'Spring': 'spring',
    'Spring Boot': 'spring',
    'Git': 'git',
    'GitLab': 'gitlab'
}

/**
 * Version of the application from package.json.
 */
export const appVersion = packageJson.version
