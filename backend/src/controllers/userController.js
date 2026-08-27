import {
  createUser,
  getUserById,
  listUsers,
  updateUser,
  updateUserRole,
  updateUserStatus,
  resetUserPassword,
} from "../services/userService.js";

export async function listUsersController(req, res, next) {
  try {
    const users = await listUsers({
      page: req.query.page,
      pageSize: req.query.pageSize,
      search: req.query.search,
      status: req.query.status,
    });

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserController(req, res, next) {
  try {
    const user = await getUserById(req.params.id);

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUserController(req, res, next) {
  try {
    const user = await createUser({
      username: req.body.username,
      displayName: req.body.displayName,
      password: req.body.password,
      roleId: req.body.roleId,
    });

    return res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserController(req, res, next) {
  try {
    const user = await updateUser({
      id: req.params.id,
      displayName: req.body.displayName,
    });

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatusController(req, res, next) {
  try {
    const user = await updateUserStatus({
      id: req.params.id,
      status: req.body.status,
    });

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRoleController(req, res, next) {
  try {
    const user = await updateUserRole({
      id: req.params.id,
      roleId: req.body.roleId,
    });

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetUserPasswordController(req, res, next) {
  try {
    const user = await resetUserPassword({
      id: req.params.id,
      password: req.body.password,
    });

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
