import decodeOpaqueIdForNamespace from "@reactioncommerce/api-utils/decodeOpaqueIdForNamespace.js";

const namespaces = {
  Shop: "reaction/shop",
  Tag: "reaction/tag"
};

export const decodeShopOpaqueId = decodeOpaqueIdForNamespace(namespaces.Shop);
export const decodeTagOpaqueId = decodeOpaqueIdForNamespace(namespaces.Tag);
