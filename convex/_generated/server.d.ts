/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated server utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 *
 * @module
 */

import type {
  ActionBuilder,
  HttpActionBuilder,
  MutationBuilder,
  QueryBuilder,
  InternalActionBuilder,
  InternalMutationBuilder,
  InternalQueryBuilder,
} from "convex/server";
import type { DataModel } from "./dataModel.js";
import type { Api } from "./api.js";

/**
 * These are helpers for building Convex functions.
 *
 * @public
 */
export declare const query: QueryBuilder<DataModel, "public">;
export declare const mutation: MutationBuilder<DataModel, "public">;
export declare const action: ActionBuilder<Api, "public">;
export declare const httpAction: HttpActionBuilder;
export declare const internalQuery: InternalQueryBuilder<DataModel>;
export declare const internalMutation: InternalMutationBuilder<DataModel>;
export declare const internalAction: InternalActionBuilder<Api>;

/**
 * Re-export of convex/server Auth
 */
export type { Auth } from "convex/server";
