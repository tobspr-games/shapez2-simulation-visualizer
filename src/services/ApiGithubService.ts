import http from "@/http-common";
import RepoGithub from "@/types/RepoGithub";
import { injectable } from "inversify";

@injectable()
class ApiGithubService {
  getOneRepository(username: string, repository: string): Promise<RepoGithub> {
    return http.get(`/repos/${username}/${repository}`);
  }

  getAllRepositories(username: string): Promise<RepoGithub[]> {
    return http.get(`/users/${username}/repos`);
    /*
    // TODO: Try / Catch
    const repoG: RepoGithub[] = [];
    try {
      const repoG = http.get<RepoGithub[]>(`/users/${username}/repos`);
    } catch (error) {
      console.log(error);
    }
    return repoG;
    */
  }
}

export { ApiGithubService };
