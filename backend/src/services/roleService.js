import { listRoles as listRolesRepository } from "../repositories/roleRepository.js";

export async function listRoles() {
  return listRolesRepository();
}
