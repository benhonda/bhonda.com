//
//
// ⚠️ AUTO-GENERATED — DO NOT EDIT
//
//

import contactForm from "~/lib/actions/contact-form/action-handler.server";
import authLoginWithForm from "~/lib/actions/auth-login-with-form/action-handler.server";
import authLogout from "~/lib/actions/auth-logout/action-handler.server";
import authRegisterWithForm from "~/lib/actions/auth-register-with-form/action-handler.server";
import exampleAction from "~/lib/actions/example-action/action-handler.server";
import authLoginWithGoogle from "~/lib/actions/auth-login-with-google/action-handler.server";

export type ActionName = "contact-form" | "auth-login-with-form" | "auth-logout" | "auth-register-with-form" | "example-action" | "auth-login-with-google";

const handlerMap: Record<ActionName, any> = {
  "contact-form": contactForm,
  "auth-login-with-form": authLoginWithForm,
  "auth-logout": authLogout,
  "auth-register-with-form": authRegisterWithForm,
  "example-action": exampleAction,
  "auth-login-with-google": authLoginWithGoogle,
};

export default handlerMap;
