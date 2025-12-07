import { useFetcher, useNavigate, type SubmitOptions } from "react-router";
import type {
  ActionHandlerReturnType,
  ActionPayloadError,
  ActionDefinition,
  ActionDefinitionData,
} from "~/lib/actions/_core/action-utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { logDebug, logError } from "~/lib/logger";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { actionCacheManager } from "~/lib/actions/_core/action-cache-manager";

/**
 * Track action call frequency to detect performance issues
 */
const actionCallTracker = new Map<string, number[]>();

function trackActionCall(actionName: string) {
  if (!import.meta.env.DEV) return;

  const now = Date.now();
  const calls = actionCallTracker.get(actionName) || [];

  // Keep only calls from last 5 seconds
  const recentCalls = calls.filter((t) => now - t < 5000);
  recentCalls.push(now);
  actionCallTracker.set(actionName, recentCalls);

  // Warn if same action called 5+ times in 5 seconds
  if (recentCalls.length >= 5) {
    console.warn(`⚠️ Performance: "${actionName}" called ${recentCalls.length}x in 5s`, recentCalls);
  }
}

/**
 * Submit to action handler
 *
 */
export function useAction<T extends ActionDefinition>(
  // type: T,
  actionDefinition: T,
  extra?: {
    /*
     * The route to submit the action to. Defaults to "." (current route).
     */
    route?: string;
    onSuccess?: (data: ActionDefinitionData<T>["outputData"]) => void;
    onSuccessRedirectTo?: (data: ActionDefinitionData<T>["outputData"]) => string;
    onError?: (error: ActionPayloadError) => void;
    toastOnSuccess?: {
      message: string;
    };
    toastOnError?: {
      message?: string;
    };
  }
) {
  type ActionDefinitionData_ = ActionDefinitionData<T>;

  // a ref to track if we've handled the action
  const actionIdRef = useRef<string | null>(null);
  // Track current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);
  // Track last inputData for cache storage
  const lastInputDataRef = useRef<ActionDefinitionData_["inputData"] | null>(null);
  // Track render-time calls (detect infinite loops)
  const renderCallCountRef = useRef(0);
  // Track last focus revalidation (cooldown)
  const lastFocusRevalidateRef = useRef(0);

  // track the action return data
  const [actionDataThisActionOnly, setActionDataThisActionOnly] = useState<
    ActionHandlerReturnType<ActionDefinitionData_> | undefined
  >(undefined);

  // track the state of the action
  const [actionState, setActionState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Native fetcher function - always use fetcher for concurrent action support
  const nativeFetcher = useFetcher();

  // get the fetcher data
  const fetcherData = nativeFetcher.data as ActionHandlerReturnType<ActionDefinitionData_> | undefined;

  // Get the navigate function
  const nativeNavigate = useNavigate();

  // Reset render call count after each render
  useEffect(() => {
    renderCallCountRef.current = 0;
  });

  // Cancel previous requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  //
  // handle success
  //
  const handleSuccess = useCallback(
    (data: ActionDefinitionData_["outputData"]) => {
      // console.log("handleSuccess", data);

      extra?.onSuccess?.(data);
      setActionState("success");

      if (extra?.toastOnSuccess) {
        toast.success(extra.toastOnSuccess.message);
      }

      if (extra?.onSuccessRedirectTo) {
        const redirectTo = extra.onSuccessRedirectTo(data);
        // console.log("redirectTo", redirectTo);

        if (!redirectTo) {
          toast.error("No redirect to provided");
          return;
        }

        // window.location.href = redirectTo;
        nativeNavigate(redirectTo);
      }
    },
    [extra, nativeNavigate]
  );

  //
  // handle error
  //
  const handleError = useCallback(
    (error: ActionPayloadError) => {
      extra?.onError?.(error);
      setActionState("error");

      // if (extra?.toastOnError) {
      toast.error(extra?.toastOnError?.message ?? error.message_unsafe);
      // }
    },
    [extra]
  );

  //
  // use effect to provide success and error callbacks
  //
  useEffect(() => {
    const actionDataToUse = fetcherData;

    if (!actionDataToUse) {
      return;
    }

    // if we don't have an action id, return
    if (!actionDataToUse?._id) {
      return;
    }

    // if we've already handled the action, return
    if (actionIdRef.current === actionDataToUse._id) return;

    // set the action id
    actionIdRef.current = actionDataToUse._id;

    // If the action data is not the same as the type, this is not for us, return
    if (actionDataToUse?.currentAction !== actionDefinition.actionDirectoryName) return;

    // Extract the nested data for this specific action
    const extractedData = actionDataToUse.data?.[
      actionDefinition.actionDirectoryName as keyof typeof actionDataToUse.data
    ] as ActionDefinitionData_["outputData"];

    // Create a new object with the extracted data (avoid mutation)
    const normalizedActionData = {
      ...actionDataToUse,
      data: extractedData,
    };

    // Log action completion in dev mode
    if (import.meta.env.DEV) {
      console.log(`[Action:${actionDefinition.actionDirectoryName}]`, {
        success: actionDataToUse.success,
        data: extractedData,
      });
    }

    // set the action data this action only
    // we can do this type assertion because we know the action data is for this action
    setActionDataThisActionOnly(normalizedActionData as ActionHandlerReturnType<ActionDefinitionData_>);

    // If the action is successful, call the onSuccess callback
    if (actionDataToUse.success) {
      // Store in cache if type is "query" (unless explicitly disabled)
      const isQuery = actionDefinition.type === "query";
      const cacheConfig = actionDefinition.cache ?? {};
      const cacheEnabled = isQuery && cacheConfig.enabled !== false;

      if (cacheEnabled && extractedData && lastInputDataRef.current) {
        actionCacheManager.set(
          actionDefinition.actionDirectoryName,
          lastInputDataRef.current,
          extractedData,
          cacheConfig
        );
      }

      // Auto-invalidate actions if this is a mutation with invalidatesActions
      if (actionDefinition.invalidatesActions && actionDefinition.invalidatesActions.length > 0) {
        for (const actionName of actionDefinition.invalidatesActions) {
          actionCacheManager.invalidate(actionName);
        }
      }

      handleSuccess(extractedData);
      return;
    }

    if (actionDataToUse.error) {
      // If the action is not successful, call the onError callback
      handleError(actionDataToUse.error);
      return;
    }

    // This should never happen, so it's also an error
    logError("useAction: unknown action state", {
      actionData: actionDataToUse,
    });
    setActionState("error");
  }, [fetcherData, actionDefinition.actionDirectoryName, extra, handleError, handleSuccess]);

  //
  // Submit the action payload
  //
  /**
   * Submit the action payload, with caching support
   */
  const submitActionPayload = useDebouncedCallback(
    (inputData: ActionDefinitionData_["inputData"], submitOptions: SubmitOptions = {}) => {
      try {
        const actionName = actionDefinition.actionDirectoryName;
        const isQuery = actionDefinition.type === "query";
        const cacheConfig = actionDefinition.cache ?? {};
        // Cache enabled if type is "query" (unless explicitly disabled)
        const cacheEnabled = isQuery && cacheConfig.enabled !== false;

        // Detect render-time calls (DEV only)
        if (import.meta.env.DEV) {
          renderCallCountRef.current++;
          if (renderCallCountRef.current > 1) {
            console.error(
              `⚠️ INFINITE LOOP DETECTED: ${actionName}.submit() called during render.\n` +
                `Move the submit() call inside useEffect or an event handler.`
            );
          }
        }

        // Store inputData for cache storage after request completes
        lastInputDataRef.current = inputData;

        // Track action call for performance monitoring
        trackActionCall(actionName);

        // Check cache if enabled (default: true)
        if (cacheEnabled) {
          const cached = actionCacheManager.get(actionName, inputData);

          if (cached) {
            // Return cached data immediately
            const cachedPayload: ActionHandlerReturnType<ActionDefinitionData_> = {
              _id: Math.random().toString(36).substring(7),
              success: true,
              currentAction: actionName,
              data: cached.data,
            };

            setActionDataThisActionOnly(cachedPayload);
            setActionState("success");

            if (import.meta.env.DEV) {
              console.log(`[Action:${actionName}] CACHED`, { isStale: cached.isStale });
            }

            // If stale, revalidate in background
            if (cached.isStale) {
              logDebug(`[Action:${actionName}] Revalidating stale cache`);
              // Continue to submit fresh request below
            } else {
              // Fresh cache, return early
              handleSuccess(cached.data);
              return;
            }
          }

          // Note: In-flight request deduplication is handled by debouncing
          // and React's concurrent rendering. More complex deduplication
          // can be added later if needed.
        }

        // Cancel any previous requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create a new AbortController
        abortControllerRef.current = new AbortController();

        // Set the action state to submitting
        setActionState("submitting");

        // Add the signal to the options
        const options = {
          ...submitOptions,
          method: "post" as const,
          encType: "application/json" as const,
          signal: abortControllerRef.current.signal,
        };

        // Submit the action payload
        const payload = {
          actionDirectoryName: actionName,
          inputData,
        };

        // Always use fetcher with default route "." for concurrent action support
        const route = extra?.route ?? ".";
        nativeFetcher.submit(payload as any, { ...options, action: route });
      } catch (error) {
        // Ignore aborted requests
        if (error instanceof DOMException && error.name === "AbortError") {
          logDebug("Request aborted in submitActionPayload");
        } else {
          console.error("Error submitting action:", error);
          setActionState("error");
        }
      }
    },
    // 1000,
    500,
    { leading: true, trailing: false }
  );

  // Keep stable ref to submitActionPayload for event listeners
  const submitActionPayloadRef = useRef(submitActionPayload);
  useEffect(() => {
    submitActionPayloadRef.current = submitActionPayload;
  });

  // Revalidate on focus (useSWR behavior)
  useEffect(() => {
    const isQuery = actionDefinition.type === "query";
    const cacheConfig = actionDefinition.cache ?? {};
    const cacheEnabled = isQuery && cacheConfig.enabled !== false;
    const revalidateOnFocus = cacheConfig.revalidateOnFocus ?? true; // Default: true

    if (!cacheEnabled || !revalidateOnFocus) return;

    const handleFocus = () => {
      // Cooldown: only revalidate if >5s since last revalidation (prevent tab-switch spam)
      const now = Date.now();
      if (now - lastFocusRevalidateRef.current < 5000) {
        return; // Silent skip
      }

      // Only revalidate if we have cached data and input data
      if (lastInputDataRef.current && actionDataThisActionOnly) {
        lastFocusRevalidateRef.current = now;
        logDebug(`[Action:${actionDefinition.actionDirectoryName}] Revalidating on focus`);
        // Resubmit to get fresh data (using stable ref)
        submitActionPayloadRef.current(lastInputDataRef.current);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [actionDefinition.cache, actionDefinition.actionDirectoryName, actionDataThisActionOnly]);

  // useSWR-style state separation
  const data = actionDataThisActionOnly?.data;
  const error = actionDataThisActionOnly?.error;
  const isValidating = actionState === "submitting"; // Fetching (any time)
  const isLoading = isValidating && !actionDataThisActionOnly; // No data yet (initial load only)

  return {
    submit: submitActionPayload,
    // useSWR-style states
    data,
    error,
    isLoading,
    isValidating,
  };
}
