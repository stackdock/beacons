/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 *
 * @module
 */

import type { ApiFromModules } from "convex/server";
import type * as actions from "../actions.js";
import type * as auth from "../auth.js";
import type * as beaconEndpoints from "../beaconEndpoints.js";
import type * as beaconRawData from "../beaconRawData.js";
import type * as http from "../http.js";
import type * as mutations from "../mutations.js";
import type * as organizations from "../organizations.js";
import type * as queries from "../queries.js";
import type * as rbac from "../rbac.js";
import type * as scheduled from "../scheduled.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * @typeParam TypeArg - The type of the api object.
 */
export type Api = ApiFromModules<{
  actions: typeof actions;
  auth: typeof auth;
  beaconEndpoints: typeof beaconEndpoints;
  beaconRawData: typeof beaconRawData;
  http: typeof http;
  mutations: typeof mutations;
  organizations: typeof organizations;
  queries: typeof queries;
  rbac: typeof rbac;
  scheduled: typeof scheduled;
  users: typeof users;
}>;

/* prettier-ignore-end */
