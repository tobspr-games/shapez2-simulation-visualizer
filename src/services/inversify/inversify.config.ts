import { Container } from "inversify";
import { TYPES } from "@/services/inversify/type";
import { ApiGithubService } from "@/services/ApiGithubService";

const container = new Container();
container.bind<ApiGithubService>(TYPES.ApiGitHubService).to(ApiGithubService);

export { container };
