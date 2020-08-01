import pkg from "../package.json";
import resolvers from "./resolvers/index.js";
import schemas from "./schemas/index.js";

/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "Sub Tag",
    name: "subTag",
    version: pkg.version,
    graphQL: {
      resolvers,
      schemas
    },
  });
}
