import { listRoles } from "../services/roleService.js";

export async function listRolesController(req, res, next) {
  try {
    const roles = await listRoles();

    return res.status(200).json({
      data: roles,
    });
  } catch (error) {
    next(error);
  }
}
