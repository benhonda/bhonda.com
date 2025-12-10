# RR7 Stack Guide for Claude

**Complete reference for building React Router v7 applications with type-safe actions, forms, and auto-generated routing.**

---

## 1. Critical Policies

### File Modification Policy

**DO NOT MODIFY** any files in `/workspace/registry/misc/blocks/rr7-stack/` unless explicitly instructed by the user. These files are registry source code.

When asked for changes:
1. Confirm they want to modify their local copy (not registry source)
2. Ask which specific file to change
3. Only make requested changes to specified files

### Component Creation Policy

**NEVER CREATE CUSTOM UI COMPONENTS** unless explicitly approved. Always use:
1. Components from `~/components/ui/` (enhanced shadcn)
2. Components from `~/components/misc/` (Text, Spacer utilities)
3. Check shadcn docs for additional components
4. Ask user before creating custom components

### TypeScript Rules

**NEVER use `as any`** without explicit permission. Instead:
1. Understand the type error
2. Explain the issue clearly
3. Propose type-safe solutions
4. Ask permission only if `as any` is truly the last resort

### Server Module Import Rules

**Code imported from `.server.ts` files can ONLY be used in loaders, actions, or other `.server.ts` files.** Using server code in components or client code will cause runtime errors.

```typescript
// ✅ ALLOWED - used in loader/action
import { someServerFunction } from "~/lib/utils.server";
export const loader = () => someServerFunction();

// ❌ FORBIDDEN - used in component
import { someServerFunction } from "~/lib/utils.server";
export default function MyComponent() {
  someServerFunction(); // Runtime error
}
```

---

## 2. Architecture Overview

### Core Systems

- **Actions System** - Type-safe server-side form handling
- **Forms System** - Dynamic form generation with validation
- **Generouted System** - Auto-generated type-safe routing
- **Environment Management** - Client/server env var handling
- **Database** - Drizzle ORM + Neon serverless (optional)
- **EventBridge Jobs** - AWS async job processing (optional)
- **i18n** - Internationalization support (optional)
- **Auth** - Session-based authentication (optional)

### File Structure

```
app/
├── components/
│   ├── ui/           # Enhanced shadcn components
│   └── misc/         # Utility components (Text, Spacer)
├── hooks/
│   ├── use-action.ts         # Client action integration
│   └── use-form-generator.tsx # Dynamic form generation
├── lib/
│   ├── actions/
│   │   ├── [action-name]/
│   │   │   ├── action-definition.ts
│   │   │   └── action-handler.server.ts
│   │   └── _core/
│   │       └── action-map.ts  # AUTO-GENERATED
│   ├── router/
│   │   └── routes.ts          # AUTO-GENERATED
│   ├── env/
│   │   ├── env.defaults.server.ts
│   │   ├── env.defaults.client.ts
│   │   └── all-server-env.ts  # AUTO-GENERATED
│   ├── form/
│   │   └── configs/           # Form configuration files
│   ├── db/
│   │   └── schema.ts          # AUTO-GENERATED
│   └── eventbridge-api-jobs/  # (optional)
│       └── _core/
│           └── eventbridge-job-map.ts  # AUTO-GENERATED
├── routes/                    # Route files (auto-discovered)
└── root.tsx
```

---

## 3. Core Systems & Patterns

### Actions System

Type-safe server actions with **phantom types** for end-to-end type safety from database to UI.

#### Action Definition (Phantom Types)

Create `app/lib/actions/[action-name]/action-definition.ts`:

```typescript
import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";

// Define output type using phantom types (compile-time only, zero runtime cost)
export const myActionDefinition = defineAction<{
  success: boolean;
  message: string;
}>()({
  actionDirectoryName: "my-action",
  inputDataSchema: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
});
```

**Key Benefits:**
- ✅ Full type safety - output types flow to components
- ✅ Zero runtime cost - phantom types compile away
- ✅ No `z.any()` - preserve actual types (e.g., from SDK)
- ✅ Curried syntax - `defineAction<Output>()({ config })`

#### Action Handler (Type-Checked Returns)

Create `app/lib/actions/[action-name]/action-handler.server.ts`:

```typescript
import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { myActionDefinition } from "./action-definition";

export default createActionHandler(
  myActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    // Type-safe input parsing
    const parsedData = parseActionInput(myActionDefinition, unsafeInputData);

    // Server-side logic here
    const result = await doSomething(parsedData);

    // Return is type-checked against definition output type
    return {
      success: true,
      message: "Operation completed",
    };
  }
);
```

**Handler with Redirect:**
```typescript
import { createActionHandler } from "~/lib/actions/_core/action-utils";
import { payloadRedirect } from "~/lib/actions/_core/action-utils.server";

export default createActionHandler(
  logoutActionDefinition,
  async ({ actionDirectoryName }, request) => {
    // Logout logic...
    return payloadRedirect(actionDirectoryName, { to: "/login" });
  }
);
```

#### Client Usage (Fully Typed)

```typescript
import { useAction } from "~/hooks/use-action";
import { myActionDefinition } from "~/lib/actions/my-action/action-definition";

function MyForm() {
  const { submit, state, actionData } = useAction(myActionDefinition, {
    // ✅ data is fully typed: { success: boolean, message: string }
    onSuccess: (data) => {
      toast.success(data.message); // ✅ TypeScript knows data.message exists
      console.log(data.success);    // ✅ Autocomplete works!
    },
    onError: (error) => toast.error(error.message_unsafe),
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      submit({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
      });
    }}>
      <button disabled={state === "submitting"}>Submit</button>

      {/* ✅ actionData.data is also fully typed */}
      {actionData?.data?.message && (
        <p>{actionData.data.message}</p>
      )}
    </form>
  );
}
```

**Type Safety Features:**
- ✅ `onSuccess(data)` - `data` has exact output type from definition
- ✅ `actionData.data` - Fully typed response data
- ✅ Autocomplete - IDE shows all available fields
- ✅ Compile errors - Accessing non-existent fields fails at compile time

---

### Forms System

Dynamic form generation from configuration with automatic validation and UI rendering.

#### Form Configuration

Define inline in your route:

```typescript
import { z } from "zod";
import type { FormConfig } from "~/lib/form/form-config-types";

const formConfig = {
  email: {
    type: "text",
    label: "Email Address",
    placeholder: "you@example.com",
    schema: z.string().email(),
  },
  message: {
    type: "textarea",
    label: "Message",
    schema: z.string().min(10),
  },
  subscribe: {
    type: "singleCheckbox",
    label: "Subscribe to newsletter",
    schema: z.boolean().optional(),
  },
} as const satisfies FormConfig;
```

#### Form Generator Usage

```typescript
import { useFormGenerator } from "~/hooks/use-form-generator";
import { Form } from "~/components/ui/form";
import { typedEntries } from "~/lib/types/type-utils";

const { form, formComponents, onSubmit } = useFormGenerator({
  formConfig,
  onSubmit: (data) => {
    console.log(data); // Type-safe data
  },
});

return (
  <Form {...form}>
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4">
        {typedEntries(formComponents).map(([key, component]) => (
          <div key={key}>{component}</div>
        ))}
      </div>
      <Button type="submit" variant="primary-filled">Submit</Button>
    </form>
  </Form>
);
```

#### Supported Field Types

- `text` - Text input
- `number` - Number input with min/max/step
- `textarea` - Multi-line text
- `select` - Dropdown select
- `autocomplete` - Searchable select with add new option
- `radioGroup` - Radio button group
- `checkboxGroup` - Multiple checkboxes
- `singleCheckbox` - Single checkbox
- `switch` - Toggle switch
- `hidden` - Hidden field

#### Field Dependencies

Hide/show fields based on other field values:

```typescript
const formConfig = {
  hasAddress: {
    type: "singleCheckbox",
    label: "I have an address",
    schema: z.boolean(),
  },
  address: {
    type: "text",
    label: "Address",
    schema: z.string(),
    dependencies: [
      {
        pathToDependency: "hasAddress",
        operator: "equals",
        valueToCheckAgainst: false,
        hide: true, // Hide address field when hasAddress is false
      },
    ],
  },
} as const satisfies FormConfig;
```

#### Form + Action Integration

```typescript
const myAction = useAction(myActionDefinition, {
  // ✅ data is fully typed from action definition
  onSuccess: (data) => {
    toast.success(data.message);
    navigate("/success");
  },
});

const { form, formComponents, onSubmit } = useFormGenerator({
  formConfig,
  onSubmit: (data) => myAction.submit(data), // ✅ Type-safe data passing
});

// Combine loading states
const isSubmitting = form.formState.isSubmitting || myAction.state === "submitting";
```

**Benefits:**
- Form data validated by Zod → passed to action → result fully typed in callbacks
- No type information lost at any step

---

### Routing

Type-safe routing system with auto-generated utilities from `app/routes/`.

#### Core Principle

**NEVER use raw string paths or string interpolation:**

```typescript
// ❌ NEVER
redirect("/select-team");
redirect(`/t/${slug}/jobs`);

// ✅ ALWAYS use type-safe helpers
```

#### Server-Side Redirects (Loaders/Actions)

Use `serverRedirect` from `~/lib/router/server-responses.server.ts`:

```typescript
import { serverRedirect } from "~/lib/router/server-responses.server";

// With pathname, search, hash
serverRedirect({ to: {
  pathname: "/jobs",
  search: "?q=123",
  hash: "#hash",
} });

// With raw absolute path
serverRedirect({ rawAbsolutePath: "/jobs?q=123#hash" });

// External URL
serverRedirect({ externalUrl: "https://example.com/jobs?q=123#hash" });
```

**Note:** `.server.ts` imports only work in loaders/actions (see Server Module Import Rules in Critical Policies).

#### Client-Side Redirects

Use typed `redirect` from `~/lib/router/routes.ts`:

```typescript
import { redirect } from "~/lib/router/routes";

// With params
redirect("/t/:teamSlug/jobs", { teamSlug: team.slug });
```

#### Links

Use React Router's `Link` with `generatePathForLinkTo`:

```typescript
import { Link } from "react-router";
import { generatePathForLinkTo } from "~/lib/router/router-utils";

const path = generatePathForLinkTo({
  to: {
    pathname: "/t/:teamSlug/jobs",
    search: "?example=query",
    hash: "#example-hash",
  },
  params: {
    teamSlug: "my-team",
  }
});

<Link to={path}>My Team Jobs</Link>
```

**Reference:** See JSDoc in `server-responses.server.ts` and `router-utils.ts` for complete usage details.

---

### Environment Variables

Separate client/server environments with automatic consolidation.

#### Server Environment

`app/lib/env/env.defaults.server.ts`:

```typescript
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string(),
  SECRET_KEY: z.string(),
});

export const serverEnv = serverEnvSchema.parse(process.env);
```

#### Client Environment

`app/lib/env/env.defaults.client.ts`:

```typescript
import { z } from "zod";

const clientEnvSchema = z.object({
  PUBLIC_API_URL: z.string(),
});

export const clientEnv = clientEnvSchema.parse(window.ENV);
```

**Important:** `.defaults` files are templates that get overwritten by `shadcn@latest add`. Customize after installation.

#### Service-Specific Env Files

```
app/lib/env/
├── env.defaults.server.ts
├── auth-env.server.ts
├── stripe-env.server.ts
└── sendgrid-env.server.ts
```

Pattern: `{service}-env.server.ts`

#### Auto-Consolidation

Client env files with `@env` comments:

```typescript
// app/lib/env/stripe-env.client.ts
/**
 * @env PUBLIC_STRIPE_KEY - Stripe publishable key
 */
const stripeClientEnv = {
  PUBLIC_STRIPE_KEY: window.env?.PUBLIC_STRIPE_KEY || "",
};

export { stripeClientEnv };
```

Run `task generate:env` to generate:
- `all-server-env.ts` - Consolidated server env + `getAllPublicEnv()` function
- `all-client-env.ts` - Global `window.env` interface

Update root.tsx loader:

```typescript
import { getAllPublicEnv } from "~/lib/env/all-server-env";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return { publicEnv: getAllPublicEnv() };
};
```

---

### Database (Optional - rr7-db)

Drizzle ORM with Neon serverless Postgres.

- Schema files in `app/lib/db/schemas/`
- Auto-consolidated to `app/lib/db/schema.ts`
- Run `task db:push` after schema changes

---

### EventBridge Jobs (Optional - rr7-aws)

Async job processing similar to actions system.

#### Job Definition

`app/lib/eventbridge-api-jobs/[job-name]/job-definition.ts`:

```typescript
import { z } from "zod";
import { eventBridgeBaseDetailSchema } from "~/lib/aws/eventbridge/detail-schemas";

export const myJobDefinition = {
  jobDirectoryName: "my-job",
  eventbridgeEventDetailSchema: eventBridgeBaseDetailSchema.extend({
    data: z.object({
      resourceId: z.string(),
      action: z.string(),
    }),
  }),
} as const satisfies JobDefinition;
```

#### Job Handler

`app/lib/eventbridge-api-jobs/[job-name]/job-handler.server.ts`:

```typescript
export default async function jobHandler(
  eventbridgeEventDetail_unsafe: z.infer<typeof eventBridgeBaseDetailSchema>,
  request: Request
): Promise<void> {
  const { data } = myJobDefinition.eventbridgeEventDetailSchema.parse(
    eventbridgeEventDetail_unsafe
  );

  await processEvent(data);
}
```

---

### i18n (Optional - rr7-i18n)

```typescript
import { useI18n } from "~/hooks/use-i18n";

const { l } = useI18n();
const text = l("English text", "Texte français");
```

---

### Auth (Optional - rr7-auth)

Session-based authentication with Drizzle.

- Requires `rr7-db` and `rr7-forms`
- Provides session actions and user management
- Database schema included

---

## 4. UI Component Reference

### MANDATORY Components

#### Text Component

**ALWAYS use for all text content.** NEVER use raw HTML elements.

```typescript
import { Text } from "~/components/misc/text";

// ❌ NEVER
<h1>Title</h1>
<p>Body text</p>

// ✅ ALWAYS
<Text as="h1" variant="display-lg">Title</Text>
<Text as="p" variant="body">Body text</Text>
```

**API:**

```tsx
<Text
  as="h1|h2|h3|h4|h5|h6|p|span|div"
  variant="display-xl|display-lg|display-md|display-sm|display-xs|
          heading-md|heading-sm|
          body-lg|body|body-sm|
          button-md|button-sm|
          microcopy|overline"
/>
```

**Variants:** `display-xl`, `display-lg`, `display-md`, `display-sm`, `display-xs`, `heading-md`, `heading-sm`, `body-lg`, `body`, `body-sm`, `button-md`, `button-sm`, `microcopy`, `overline`

#### Spacer Component

**MANDATORY for vertical spacing.** NEVER use margin/padding between components.

```typescript
import { Spacer } from "~/components/misc/spacer";

// ❌ NEVER
<div className="mb-4">Content</div>

// ✅ ALWAYS
<div>Content</div>
<Spacer size="md" />
<div>Next content</div>
```

**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

**Dividers:** `divider="middle"` adds a horizontal line

#### Button Component

```typescript
import { Button } from "~/components/ui/button";

<Button variant="primary-filled" size="lg">Save</Button>
<Button variant="secondary-outline" size="sm">Cancel</Button>
```

**Variants:** `primary-filled` (default), `primary-outline`, `primary-link`, `secondary-filled`, `secondary-outline`, `secondary-link`, `knockout-filled`, `knockout-outline`, `knockout-link`

**Sizes:** `sm`, `lg` (default)

---

### Component Hierarchy

When you need a UI element:

1. **Check `~/components/ui/`** - Enhanced shadcn components
2. **Check `~/components/misc/`** - Text, Spacer utilities
3. **Check shadcn docs** - https://ui.shadcn.com/docs/components
4. **Ask before creating** - Never create custom without approval

---

### Styling Rules

**NEVER hardcode colors.** Always use theme-compatible classes.

```typescript
// ❌ NEVER
<div className="bg-blue-500 text-white">

// ✅ ALWAYS
<div className="bg-primary text-primary-foreground">
<div className="bg-card text-card-foreground">
```

**Test in light AND dark mode.**

---

## 5. Build Process & Tooling

### Auto-Generators

Run automatically during `task dev` and `task build`: action-map, routes, env files, db schema (if rr7-db), job-map (if rr7-aws)

### Taskfile Commands

**ALWAYS use Taskfile, NOT package.json scripts.**

```bash
# Development
task dev                  # Start dev server
task start               # Alias for dev

# Building
task build               # Build application
task typecheck           # Run TypeScript checks

# Database (rr7-db)
task db:push             # Push schema changes

# Code Generation
task generate            # Run all generators
task generate:actions    # Generate action map
task generate:routes     # Generate routes
task generate:env        # Generate env files
task generate:db         # Generate DB schema
task generate:jobs       # Generate job map

# Testing
task test                # Run all tests
task test:watch          # Watch mode
task test:coverage       # With coverage
task test:unit           # Unit tests only
task test:integration    # Integration tests only

# Environment
task env                 # Pull from Vercel
task link                # Link to Vercel project
```

---

## 6. Best Practices & Rules

### Testing Philosophy

**Only create tests when explicitly requested.**

Focus on **business logic**, not framework processes:

```typescript
// ❌ Don't test the entire action handler framework
test("should handle action", async () => {
  const result = await actionHandler(mockData, mockRequest);
  expect(result.success).toBe(true);
});

// ✅ Extract and test business logic
// user-service.ts
export async function createUser(userData: CreateUserInput) {
  const existing = await findUserByEmail(userData.email);
  if (existing) throw new Error("User exists");
  return await db.users.create(userData);
}

// user-service.test.ts
test("should throw if user exists", async () => {
  await expect(createUser({ email: "test@test.com" }))
    .rejects.toThrow("User exists");
});
```

**Test placement:** Co-locate tests next to source files when possible.

```
app/lib/actions/register-user/
├── action-definition.ts
├── action-handler.server.ts
├── user-service.ts
└── user-service.test.ts  ← Co-located
```

**Use Bun test runner:** `bun test` or `task test`

---

### Type Safety Rules

1. **Use `as const satisfies`** for better inference:
   ```typescript
   const config = {
     field: { type: "text", schema: z.string() }
   } as const satisfies FormConfig;
   ```

2. **Never use `as any`** without permission - explain the issue first

3. **Use proper generic constraints**:
   ```typescript
   function process<T extends { id: string }>(data: T): T {
     return data;
   }
   ```

4. **Let TypeScript infer when possible** - avoid redundant annotations

---

### Accessibility Basics

1. Use semantic HTML via Text component's `as` prop
2. Maintain heading hierarchy (h1 → h2 → h3, never skip)
3. Include ARIA labels for interactive elements
4. Ensure keyboard navigation works
5. Provide alt text for images
6. Associate labels with form fields

---

### Decision Tree for UI Development

**What component do I need?**
→ Check `~/components/ui/` (enhanced shadcn)
→ Check `~/components/misc/` (Text, Spacer)
→ Check shadcn docs
→ Ask user if none exist

**How should I style it?**
→ Use component's built-in props first
→ Use theme-compatible Tailwind classes second
→ Never use inline styles or hardcoded colors

**How should I space it?**
→ Use Spacer for vertical spacing
→ Use gap utilities for flex/grid
→ Use padding for internal spacing

**Is it accessible?**
→ Semantic HTML via Text
→ Proper labels and ARIA
→ Keyboard navigable
→ Screen reader friendly

---

## 7. Quick Reference

### Key File Locations

```
app/
├── components/ui/         # Enhanced shadcn components
├── components/misc/       # Text, Spacer utilities
├── hooks/
│   ├── use-action.ts
│   └── use-form-generator.tsx
├── lib/
│   ├── actions/_core/     # Action system
│   ├── router/routes.ts   # AUTO-GENERATED routes
│   ├── env/               # Environment management
│   ├── form/configs/      # Form configurations
│   └── db/                # Database (optional)
└── routes/                # Route files (auto-discovered)
```

### Generated Files (DO NOT EDIT)

- `app/lib/actions/_core/action-map.ts`
- `app/lib/router/routes.ts`
- `app/lib/env/all-server-env.ts`
- `app/lib/env/all-client-env.ts`
- `app/lib/db/schema.ts` (if using rr7-db)
- `app/lib/eventbridge-api-jobs/_core/eventbridge-job-map.ts` (if using rr7-aws)

### Common Commands

```bash
task dev              # Development
task build           # Build
task typecheck       # Type checking
task db:push         # Database migration
task test            # Run tests
task generate        # All generators
```

### Import Aliases

```typescript
import { } from "~/components/ui/button";     # App components
import { } from "~/hooks/use-action";          # App hooks
import { } from "~/lib/utils";                 # App utilities
import { } from "~/...";          # Registry items
```

---

## Summary

The RR7 stack provides:

✅ **Type-safe actions** - Define once, use everywhere with full type safety
✅ **Dynamic forms** - Generate forms from config with auto-validation
✅ **Auto-generated routing** - Type-safe navigation from file structure
✅ **Environment management** - Separate client/server with auto-consolidation
✅ **Component system** - Enhanced shadcn/ui with Text/Spacer utilities
✅ **Modular architecture** - Install only what you need

**Remember:**
- Never modify registry files unless explicitly asked
- Never create custom UI components without approval
- Never use `as any` without permission
- Always use Text for text content
- Always use Spacer for vertical spacing
- Always use theme-compatible classes
- Always test in light and dark mode
