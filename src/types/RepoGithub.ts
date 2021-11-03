export default interface RepoGithub {
  id: number;
  name?: string;
  full_name?: string;
  html_url?: string;
  description?: string;
  open_issues_count?: number;
  forks_count?: number;
  is_template?: boolean;
}
