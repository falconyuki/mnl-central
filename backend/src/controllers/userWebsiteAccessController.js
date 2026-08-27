import {
  listUserWebsiteAccess,
  grantUserWebsiteAccess,
  revokeUserWebsiteAccess,
} from "../services/userWebsiteAccessService.js";

export async function listUserWebsiteAccessController(req, res, next) {
  try {
    const data = await listUserWebsiteAccess(req.params.id);

    return res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function grantUserWebsiteAccessController(req, res, next) {
  try {
    const data = await grantUserWebsiteAccess({
      userId: req.params.id,
      websiteId: req.body.websiteId,
    });

    return res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function revokeUserWebsiteAccessController(req, res, next) {
  try {
    const data = await revokeUserWebsiteAccess({
      userId: req.params.id,
      websiteId: req.body.websiteId,
    });

    return res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
}
