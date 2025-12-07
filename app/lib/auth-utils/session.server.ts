import { createCookieSessionStorage } from "react-router";
import { dbEnv } from "~/lib/env/db-env.server";
import { serverEnv } from "~/lib/env/env.defaults.server";
import type { UserFromSession } from "~/lib/types/user";

type SessionData = {
  user: UserFromSession;
  oauth2state?: string;
};

export const cookieSessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "_xsession", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [dbEnv.SESSION_SECRET], // replace this with an actual secret
    secure: serverEnv.NODE_ENV === "production", // enable this in prod only
  },
});
