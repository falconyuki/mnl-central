import {
  getWebsiteAuthorization,
  authorizeWebsiteView,
  authorizeWebsiteCreate,
  authorizeWebsiteUpdate,
  authorizeWebsiteDisable,
  getAuthorizedWebsiteIds,
} from "../services/authorizations/websiteAuthorizationService.js";

import {
  getWebsiteById,
  listWebsites,
  createWebsite,
  updateWebsite,
  disableWebsite,
} from "../services/websiteService.js";

export async function getWebsites(req, res, next) {
  try {
    const authorizationContext = await getWebsiteAuthorization(req.user);
    const websiteIds = getAuthorizedWebsiteIds(authorizationContext);

    const result = await listWebsites({
      page: req.query.page ?? 1,
      pageSize: req.query.pageSize ?? 20,
      search: req.query.search ?? null,
      status: req.query.status ?? null,
      websiteIds,
    });

    return res.status(200).json({
      data: result.rows,
      pagination: {
        page: Number(req.query.page ?? 1),
        pageSize: Number(req.query.pageSize ?? 20),
        total: result.total,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getWebsite(req, res, next) {
  try {
    const authorizationContext = await getWebsiteAuthorization(req.user);
    authorizeWebsiteView(authorizationContext, req.params.id);

    const website = await getWebsiteById(req.params.id);
    if (!website) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Website not found",
        },
      });
    }

    return res.status(200).json({
      data: website,
    });
  } catch (error) {
    return next(error);
  }
}

export async function postWebsite(req, res, next) {
  try {
    const authorizationContext = await getWebsiteAuthorization(req.user);
    authorizeWebsiteCreate(authorizationContext);

    const website = await createWebsite({
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
      status: req.body.status,
    });

    return res.status(201).json({
      data: website,
    });
  } catch (error) {
    return next(error);
  }
}

export async function patchWebsite(req, res, next) {
  try {
    const authorizationContext = await getWebsiteAuthorization(req.user);
    authorizeWebsiteUpdate(authorizationContext, req.params.id);

    const website = await updateWebsite(req.params.id, {
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
    });

    return res.status(200).json({
      data: website,
    });
  } catch (error) {
    return next(error);
  }
}

export async function postDisableWebsite(req, res, next) {
  try {
    const authorizationContext = await getWebsiteAuthorization(req.user);
    authorizeWebsiteDisable(authorizationContext, req.params.id);

    const website = await disableWebsite(req.params.id);

    return res.status(200).json({
      data: website,
    });
  } catch (error) {
    return next(error);
  }
}
