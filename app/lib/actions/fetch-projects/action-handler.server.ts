import { createActionHandler } from "~/lib/actions/_core/action-utils";
import { fetchProjectsActionDefinition } from "./action-definition";
import { getAllProjects } from "~/lib/shiplog/project-db-service.server";

export default createActionHandler(
  fetchProjectsActionDefinition,
  async () => {
    const projects = await getAllProjects();
    return { projects };
  }
);
