import React, { forwardRef, useCallback, useMemo } from "react";
import { type NavigateOptions as NavOptions, type NavigateProps as NavProps } from "react-router";
import {
  type LinkProps as _LinkProps,
  Link as RouterLink,
  type NavLinkProps as _NavLinkProps,
  NavLink as RouterNavLink,
  generatePath as _generatePath,
  Navigate,
  useNavigate,
  useParams,
  redirect,
} from "react-router";

function generatePath(path_: string, params?: Record<string, any>) {
  const path = _generatePath(path_, params || ({} as any));

  // remove the /en from the path if it's there
  if (path.startsWith("/en/")) {
    return path.slice(3);
  }

  if (path === "/en") {
    return "/";
  }

  return path;
}

/**
 * Types
 */
export type To<Pathname = string> = {
  pathname: Pathname;
  search?: string;
  hash?: string;
};

export type ComponentProps<Path extends string | To, Params extends Record<string, any>> = Path extends keyof Params
  ? { to: Path; params: Params[Path] }
  : Path extends { pathname: infer Pathname }
    ? Pathname extends keyof Params
      ? { to: To<Pathname>; params: Params[Pathname] } // original
      : // { to: To<Pathname>; params: Params[any] } // modified
        { to: To<Pathname>; params?: any }
    : { to: Path; params?: any };

export type LinkProps<Path extends string | To, Params extends Record<string, any>> = Omit<_LinkProps, "to"> &
  ComponentProps<Path, Params>;

export type NavLinkProps<Path extends string | To, Params extends Record<string, any>> = Omit<_NavLinkProps, "to"> &
  ComponentProps<Path, Params>;

export type NavigateProps<Path extends string | To, Params extends Record<string, any>> = Omit<NavProps, "to"> &
  ComponentProps<Path, Params>;

export type NavigateOptions<Path extends string | To | number, Params extends Record<string, any>> = Path extends number
  ? []
  : Path extends keyof Params
    ? [NavOptions & { params: Params[Path] }]
    : Path extends { pathname: infer Pathname }
      ? Pathname extends keyof Params
        ? [NavOptions & { params: Params[Pathname] }]
        : [NavOptions & { params?: never }] | []
      : [NavOptions & { params?: never }] | [];

/**
 * components
 */
export const components = <Path extends string, Params extends Record<string, any>>() => {
  // link component
  const Link = forwardRef<HTMLAnchorElement, LinkProps<Path | To<Path>, Params>>(({ to, params, ...props }, ref) => {
    const path = generatePath(typeof to === "string" ? to : to.pathname, params || ({} as any));
    return (
      <RouterLink
        {...props}
        to={typeof to === "string" ? path : { pathname: path, search: to.search, hash: to.hash }}
        ref={ref}
      />
    );
  });
  Link.displayName = "Link";

  // navlink component
  const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps<Path | To<Path>, Params>>(
    ({ to, params, ...props }, ref) => {
      const path = generatePath(typeof to === "string" ? to : to.pathname, params || ({} as any));
      return (
        <RouterNavLink
          {...props}
          to={typeof to === "string" ? path : { pathname: path, search: to.search, hash: to.hash }}
          ref={ref}
        />
      );
    }
  );
  NavLink.displayName = "NavLink";

  // navigate component
  const NavigateComponent = <P extends Path | To<Path>>({ to, params, ...props }: LinkProps<P, Params>) => {
    const path = generatePath(typeof to === "string" ? to : to.pathname, params || ({} as any));
    return (
      <Navigate {...props} to={typeof to === "string" ? path : { pathname: path, search: to.search, hash: to.hash }} />
    );
  };

  return {
    Link,
    NavLink,
    Navigate: NavigateComponent,
  };
};

/**
 * hooks (no modals)
 */
export const hooks = <Path extends string, Params extends Record<string, any>>() => {
  // export const hooks = <Path extends string, Params extends Record<string, any>, ModalPath extends string>() => {
  return {
    useParams: <P extends keyof Params>(path: P) => useParams<Params[typeof path]>() as Params[P],
    useNavigate: () => {
      const navigate = useNavigate();

      return useCallback(
        <P extends Path | To<Path> | number>(to: P, ...[options]: NavigateOptions<P, Params>) => {
          if (typeof to === "number") return navigate(to);
          const path = generatePath(typeof to === "string" ? to : to.pathname, options?.params || ({} as any));
          return navigate(
            typeof to === "string" ? path : { pathname: path, search: to.search, hash: to.hash },
            options
          );
        },
        [navigate]
      );
    },
    // useModals: () => {
    //   const location = useLocation();
    //   const navigate = useNavigate();

    //   type Options<P> = NavOptions &
    //     (P extends keyof Params ? { at?: P; params: Params[P] } : { at?: P; params?: never });

    //   return useMemo(() => {
    //     return {
    //       current: location.state?.modal || "",
    //       open: <P extends Path>(path: ModalPath, options?: Options<P>) => {
    //         const { at, state, ...opts } = options || {};
    //         const pathname = options?.params ? generatePath(at || "", options.params || {}) : at;
    //         navigate(pathname || location.pathname, { ...opts, state: { ...location.state, ...state, modal: path } });
    //       },
    //       close: <P extends Path>(options?: Options<P>) => {
    //         const { at, state, ...opts } = options || {};
    //         const pathname = options?.params ? generatePath(at || "", options.params || {}) : at;
    //         navigate(pathname || location.pathname, { ...opts, state: { ...location.state, ...state, modal: "" } });
    //       },
    //     };
    //   }, [location, navigate]);
    // },
  };
};

/**
 * utils
 */
export const utils = <Path extends string, Params extends Record<string, any>>() => {
  type Init = number | ResponseInit;
  type RedirectOptions<P> = P extends keyof Params ? [Init & { params: Params[P] }] : [Init & { params?: never }] | [];

  return {
    redirect: <P extends Path>(url: P, ...[options]: RedirectOptions<P>) => {
      return redirect(options?.params ? generatePath(url, options.params) : url, options);
    },
    generatePath: <P extends Path>(url: P, params?: Params[P]) => {
      return generatePath(url, params || ({} as any));
    },
  };
};
