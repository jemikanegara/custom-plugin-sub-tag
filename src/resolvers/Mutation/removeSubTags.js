import ReactionError from "@reactioncommerce/reaction-error";
import SimpleSchema from "simpl-schema";
import { decodeShopOpaqueId, decodeTagOpaqueId } from "../../xforms/id.js";

const inputSchema = new SimpleSchema({
  "subTagIds": { type: Array, optional: false },
  "subTagIds.$": String
})

/**
 * @name Mutation.removeSubTags
 * @method
 * @memberof Routes/GraphQL
 * @summary Update a specified redirect rule
 * @param {Object} parentResult - unused
 * @param {Object} args.input - ModifySubTagInput
 * @param {String} [args.input.clientMutationId] - An optional string identifying the mutation call
 * @param {Object} context - an object containing the per-request state
 * @returns {Promise<Object>} ModifySubTagPayload
 */
export default async function removeSubTags(parentResult, { input }, context) {
  const { appEvents, collections } = context;
  const { Tags } = collections;
  const {
    clientMutationId = null,
    id: opaqueTagId,
    shopId: opaqueShopId,
    subTagIds: opaqueSubTagIds,
  } = input;

  const shopId = decodeShopOpaqueId(opaqueShopId);
  const tagId = decodeTagOpaqueId(opaqueTagId);
  const subTagIds = opaqueSubTagIds.map(decodeTagOpaqueId);

  await context.validatePermissions(`reaction:legacy:tags:${tagId}`, "update", { shopId });

  const params = {
    subTagIds
  }
  inputSchema.validate(params);
  params.updatedAt = new Date();

  try {
    const { result } = await Tags.updateOne(
      { _id: tagId, shopId },
      { $pullAll : {
          relatedTagIds: subTagIds
        }
      }
    );
    if (result.n === 0) {
      throw new ReactionError("not-found", "Tag couldn't be updated, or doesn't exist");
    }

    const tag = await Tags.findOne({ _id: tagId, shopId });

    await appEvents.emit("afterTagUpdate", tag);
    
    return {
      clientMutationId,
      tag
    };
  } catch ({ message }) {
    throw new ReactionError("error", message);
  }
}