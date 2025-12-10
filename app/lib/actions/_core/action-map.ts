//
//
// ⚠️ AUTO-GENERATED — DO NOT EDIT
//
//

import toggleShiplogReaction from "~/lib/actions/toggle-shiplog-reaction/action-handler.server";
import fetchShiplogReactions from "~/lib/actions/fetch-shiplog-reactions/action-handler.server";
import restoreShiplogVersion from "~/lib/actions/restore-shiplog-version/action-handler.server";
import authLoginWithForm from "~/lib/actions/auth-login-with-form/action-handler.server";
import authLogout from "~/lib/actions/auth-logout/action-handler.server";
import fetchShiplogVersions from "~/lib/actions/fetch-shiplog-versions/action-handler.server";
import editShiplog from "~/lib/actions/edit-shiplog/action-handler.server";
import fetchShiplogs from "~/lib/actions/fetch-shiplogs/action-handler.server";
import authRegisterWithForm from "~/lib/actions/auth-register-with-form/action-handler.server";
import exampleAction from "~/lib/actions/example-action/action-handler.server";
import authLoginWithGoogle from "~/lib/actions/auth-login-with-google/action-handler.server";

export type ActionName = "toggle-shiplog-reaction" | "fetch-shiplog-reactions" | "restore-shiplog-version" | "auth-login-with-form" | "auth-logout" | "fetch-shiplog-versions" | "edit-shiplog" | "fetch-shiplogs" | "auth-register-with-form" | "example-action" | "auth-login-with-google";

const handlerMap: Record<ActionName, any> = {
  "toggle-shiplog-reaction": toggleShiplogReaction,
  "fetch-shiplog-reactions": fetchShiplogReactions,
  "restore-shiplog-version": restoreShiplogVersion,
  "auth-login-with-form": authLoginWithForm,
  "auth-logout": authLogout,
  "fetch-shiplog-versions": fetchShiplogVersions,
  "edit-shiplog": editShiplog,
  "fetch-shiplogs": fetchShiplogs,
  "auth-register-with-form": authRegisterWithForm,
  "example-action": exampleAction,
  "auth-login-with-google": authLoginWithGoogle,
};

export default handlerMap;
