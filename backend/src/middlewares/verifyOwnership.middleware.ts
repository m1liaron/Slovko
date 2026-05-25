import type { Includeable, Model, ModelStatic } from "sequelize";

import { ownershipPolicies } from "../common/enums/constants/ownershipPolicies.js";
import type {
  AuthRequest,
  AuthRequestHandler,
} from "../common/types/AuthRequest.type.js";

type VerifyOwnershipOptions<TModel extends Model> = {
  Model: ModelStatic<TModel>;
  param?: string;
  ownerField?: string;
  ownerPath?: string;
  include?: Includeable[];
  getOwnerId?: (
    resource: TModel,
    req: AuthRequest,
  ) =>
    | string
    | number
    | null
    | undefined
    | Promise<string | number | null | undefined>;
};

type VerifyOwnershipFactoryOptions<TModel extends Model> = {
  Model: ModelStatic<TModel>;
  param?: string;
};

const getValueByPath = (value: unknown, path: string) =>
  path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, value);

const verifyOwnershipMiddleware =
  <TModel extends Model>({
    Model,
    param = "id",
    ownerField = "userId",
    ownerPath,
    include = [],
    getOwnerId,
  }: VerifyOwnershipOptions<TModel>): AuthRequestHandler<TModel> =>
  async (req, res, next) => {
    try {
      const resourceId = req.params[param];
      const userId = req.user.id;

      const resource = await Model.findByPk(resourceId, { include });

      if (!resource) {
        res.status(404).json({ message: "Not found" });
        return;
      }

      const ownerId = getOwnerId
        ? await getOwnerId(resource, req)
        : ownerPath
          ? getValueByPath(resource.get({ plain: true }), ownerPath)
          : resource.get(ownerField as string);

      if (!ownerField) {
        res.status(500).json({
          message: "Ownership is not configured correctly for this resource",
        });
        return;
      }

      if (String(ownerId) !== String(userId)) {
        res.status(403).json({ message: "Forbidden. You are not owner" });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };

const verifyOwnership = <TModel extends Model>(
  resource: keyof typeof ownershipPolicies,
  options: VerifyOwnershipFactoryOptions<TModel>,
) => {
  return verifyOwnershipMiddleware<TModel>({
    ...ownershipPolicies[resource],
    ...options,
  });
};

export { verifyOwnership };
