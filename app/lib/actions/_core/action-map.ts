//
//
// ⚠️ AUTO-GENERATED — DO NOT EDIT
//
//

import authLoginWithForm from "~/lib/actions/auth-login-with-form/action-handler.server";
import authLogout from "~/lib/actions/auth-logout/action-handler.server";
import fetchShiplogs from "~/lib/actions/fetch-shiplogs/action-handler.server";
import authRegisterWithForm from "~/lib/actions/auth-register-with-form/action-handler.server";
import exampleAction from "~/lib/actions/example-action/action-handler.server";
import authLoginWithGoogle from "~/lib/actions/auth-login-with-google/action-handler.server";

export type ActionName = "auth-login-with-form" | "auth-logout" | "fetch-shiplogs" | "auth-register-with-form" | "example-action" | "auth-login-with-google";

const handlerMap: Record<ActionName, any> = {
  "auth-login-with-form": authLoginWithForm,
  "auth-logout": authLogout,
  "fetch-shiplogs": fetchShiplogs,
  "auth-register-with-form": authRegisterWithForm,
  "example-action": exampleAction,
  "auth-login-with-google": authLoginWithGoogle,
};

export default handlerMap;
