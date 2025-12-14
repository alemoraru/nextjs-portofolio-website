import { FiCpu } from "react-icons/fi"
import DevIcon from "@/components/DevIcon"

/**
 * Normalizes a technology name into a standardized format.
 * @param techName - The technology name to normalize.
 * @returns The normalized technology name.
 */
function normalizeTechName(techName: string): string {
  return techName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[._]/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Maps a technology name to its corresponding icon component.
 * @param techName - Name of the technology (e.g., "typescript").
 * @param iconClassName - Optional CSS class names for the icon.
 * @returns A React component representing the icon for the specified technology.
 */
export function techToIcon(techName: string, iconClassName?: string) {
  switch (techName) {
    case "typescript":
    case "TypeScript":
    case "ts":
      return <DevIcon name={"typescript"} iconClassName={iconClassName} />
    case "javascript":
    case "JavaScript":
    case "js":
      return <DevIcon name={"javascript"} iconClassName={iconClassName} />
    case "react":
    case "React":
    case "reactjs":
    case "ReactJS":
    case "react-native":
    case "React-Native":
    case "reactnative":
    case "ReactNative":
    case "react native":
    case "React Native":
      return <DevIcon name={"reactjs"} iconClassName={iconClassName} />
    case "nextjs":
    case "NextJS":
    case "next":
    case "Next":
      return <DevIcon name={"nextjs"} iconClassName={iconClassName} />
    case "nodejs":
    case "node.js":
    case "Node.js":
    case "NodeJS":
    case "node":
    case "Node":
      return <DevIcon name={"nodejs"} iconClassName={iconClassName} />
    case "python":
    case "Python":
      return <DevIcon name={"python"} iconClassName={iconClassName} />
    case "android":
    case "Android":
      return <DevIcon name={"android"} iconClassName={iconClassName} />
    case "docker":
    case "Docker":
      return <DevIcon name={"docker"} iconClassName={iconClassName} />
    case "kubernetes":
    case "Kubernetes":
      return <DevIcon name={"kubernetes"} iconClassName={iconClassName} />
    case "graphql":
    case "GraphQL":
      return <DevIcon name={"graphql"} iconClassName={iconClassName} />
    case "tailwindcss":
    case "TailwindCSS":
    case "tailwind":
    case "Tailwind":
      return <DevIcon name={"tailwindcss"} iconClassName={iconClassName} />
    case "jenkins":
    case "Jenkins":
      return <DevIcon name={"jenkins"} iconClassName={iconClassName} />
    case "aws":
    case "AWS":
    case "aws IOT":
    case "AWS IOT":
    case "AWS IoT":
    case "aws-iot":
    case "AWS-IOT":
      return <DevIcon name={"aws"} iconClassName={iconClassName} />
    case "azure":
    case "Azure":
      return <DevIcon name={"azure"} iconClassName={iconClassName} />
    case "gcp":
    case "GCP":
    case "google cloud":
    case "Google Cloud":
    case "google-cloud":
    case "Google-Cloud":
      return <DevIcon name={"google-cloud"} iconClassName={iconClassName} />
    case "redis":
    case "Redis":
      return <DevIcon name={"redis"} iconClassName={iconClassName} />
    case "mongodb":
    case "MongoDB":
      return <DevIcon name={"mongodb"} iconClassName={iconClassName} />
    case "postgresql":
    case "PostgreSQL":
    case "postgres":
    case "Postgres":
      return <DevIcon name={"postgresql"} iconClassName={iconClassName} />
    case "mysql":
    case "MySQL":
      return <DevIcon name={"mysql"} iconClassName={iconClassName} />
    case "flutter":
    case "Flutter":
      return <DevIcon name={"flutter"} iconClassName={iconClassName} />
    case "dart":
    case "Dart":
      return <DevIcon name={"dart"} iconClassName={iconClassName} />
    case "swift":
    case "Swift":
      return <DevIcon name={"swift"} iconClassName={iconClassName} />
    case "java":
    case "Java":
      return <DevIcon name={"java"} iconClassName={iconClassName} />
    case "spring":
    case "Spring":
    case "springboot":
    case "SpringBoot":
    case "spring boot":
    case "Spring Boot":
      return <DevIcon name={"spring"} iconClassName={iconClassName} />
    case "csharp":
    case "C#":
    case "CSharp":
    case "c#":
      return <DevIcon name={"csharp"} iconClassName={iconClassName} />
    case "php":
    case "PHP":
      return <DevIcon name={"php"} iconClassName={iconClassName} />
    case "flask":
    case "Flask":
      return <DevIcon name={"flask-dark"} iconClassName={iconClassName} />
    case "ruby":
    case "Ruby":
      return <DevIcon name={"ruby"} iconClassName={iconClassName} />
    case "rust":
    case "Rust":
      return <DevIcon name={"rust"} iconClassName={iconClassName} />
    case "go":
    case "Go":
    case "golang":
    case "Golang":
      return <DevIcon name={"golang"} iconClassName={iconClassName} />
    case "html":
    case "HTML":
    case "html5":
    case "HTML5":
      return <DevIcon name={"html5"} iconClassName={iconClassName} />
    case "css":
    case "CSS":
      return <DevIcon name={"css"} iconClassName={iconClassName} />
    case "css3":
    case "CSS3":
      return <DevIcon name={"css3"} iconClassName={iconClassName} />
    case "angular":
    case "Angular":
      return <DevIcon name={"angular"} iconClassName={iconClassName} />
    case "vue":
    case "Vue":
    case "vuejs":
    case "VueJS":
      return <DevIcon name={"vuejs"} iconClassName={iconClassName} />
    case "svelte":
    case "Svelte":
      return <DevIcon name={"svelte"} iconClassName={iconClassName} />
    case "git":
    case "Git":
      return <DevIcon name={"git"} iconClassName={iconClassName} />
    case "github":
    case "GitHub":
      return <DevIcon name={"github"} iconClassName={iconClassName} />
    case "Gitlab":
    case "gitlab":
    case "GitLab":
      return <DevIcon name={"gitlab"} iconClassName={iconClassName} />
    case "linux":
    case "Linux":
      return <DevIcon name={"linux"} iconClassName={iconClassName} />
    case "bash":
    case "Bash":
      return <DevIcon name={"bash"} iconClassName={iconClassName} />
    case "webpack":
    case "Webpack":
      return <DevIcon name={"webpack"} iconClassName={iconClassName} />
    case "babel":
    case "Babel":
      return <DevIcon name={"babel"} iconClassName={iconClassName} />
    case "eslint":
    case "ESLint":
      return <DevIcon name={"eslint"} iconClassName={iconClassName} />
    case "prettier":
    case "Prettier":
      return <DevIcon name={"prettier"} iconClassName={iconClassName} />
    case "jest":
    case "Jest":
      return <DevIcon name={"jest"} iconClassName={iconClassName} />
    case "solidity":
    case "Solidity":
      return <DevIcon name={"solidity"} iconClassName={iconClassName} />
    case "Grafana":
    case "grafana":
      return <DevIcon name={"grafana"} iconClassName={iconClassName} />
    default:
      // Try to use the provided tech name as a filename fallback. DevIcon will attempt to load
      // `/dev/{normalized}.svg` and will render FiCpu if the asset doesn't exist.
      const normalized = normalizeTechName(techName)
      if (normalized.length > 0) {
        return <DevIcon name={normalized} iconClassName={iconClassName} />
      }

      return <FiCpu className={iconClassName} />
  }
}
