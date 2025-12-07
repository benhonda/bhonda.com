import { useForm, type ControllerRenderProps, type DefaultValues, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExtractZodSchemas, FormConfig, FormKeys } from "../lib/form/form-config-types";
import { formConfigToZodSchemas } from "../lib/form/form-config-to-zod-schema";
import { formConfigToFormComponents } from "../lib/form/form-config-to-form-components";
// import { useI18n } from "./use-i18n";

export const useFormGenerator = <T extends FormConfig>(args: {
  formConfig: T;
  onSubmit: (data: z.infer<z.ZodObject<ExtractZodSchemas<T>>>) => void;
  customComponents?: Partial<
    Record<
      "text" | "textarea" | "switch" | "checkboxGroup",
      (field: ControllerRenderProps<any, any>, option?: string) => React.ReactNode
    >
  >;
  defaultValues?: DefaultValues<z.infer<z.ZodObject<ExtractZodSchemas<T>>>>;
}) => {
  const l = (key: string) => key;

  const { default: formSchema } = formConfigToZodSchemas(args.formConfig, l);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: args.defaultValues,
  });

  const onSubmit = form.handleSubmit(
    (data) => args.onSubmit(data as z.infer<z.ZodObject<ExtractZodSchemas<T>>>),
    (e) => console.error("rhf error", e)
  );

  const formComponents = formConfigToFormComponents({
    form,
    config: args.formConfig,
    customComponents: args.customComponents,
    l,
  });

  return { form, formSchema, onSubmit, formComponents };
};
