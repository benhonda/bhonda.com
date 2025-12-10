import { BasicRateLimit } from "./rateLimit.server";
import { cookieSessionStorage } from "./session.server";
import { serverRedirect } from "~/lib/router/server-responses.server";
import type { UserFromSession } from "~/lib/types/user";

const ADMIN_EMAIL = "ben@theadpharm.com";

/**
 *
 * Rate limit for user login
 */
export const userLoginRateLimit = new BasicRateLimit<string>(10, 60 * 10);

/**
 *
 * Get a user or null
 */
export const getUser = async (request: Request) => {
  // get the session from the request
  const session = await cookieSessionStorage.getSession(request.headers.get("Cookie"));

  // get the user from the session
  const user = session.get("user");

  return user;
};

/**
 *
 *  Require user
 */
export const requireUserAndRedirect = async (request: Request) => {
  const user = await getUser(request);

  // if there is no user, redirect to the login page
  if (!user) {
    throw serverRedirect({ to: "/login" });
  }

  return user;
};

/**
 *
 * Require a user or throw
 */
export const requireUser = async (request: Request) => {
  const user = await getUser(request);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * Check if user is admin
 */
export const isAdmin = (user: UserFromSession | null | undefined): boolean => {
  return user?.email === ADMIN_EMAIL;
};

/**
 * Require admin or throw
 */
export const requireAdmin = async (request: Request) => {
  const user = await getUser(request);

  if (!isAdmin(user)) {
    throw new Error("Admin access required");
  }

  return user;
};
