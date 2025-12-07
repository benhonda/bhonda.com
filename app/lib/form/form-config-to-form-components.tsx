import { FormDescription, FormItem, FormMessage, FormControl, FormField } from "~/components/ui/form";
import { FormLabel, Label } from "~/components/ui/label";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import {
  type ObjectConfigValues,
  type FormConfig,
  type I18NFunction,
  type FormKeys,
  type RatingMatrixConfig,
} from "./form-config-types";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { z } from "zod/v3";
import { Checkbox } from "~/components/ui/checkbox";
import { match } from "ts-pattern";
import { getFieldsWithDependencies } from "./form-data-utils";
import { Text } from "~/components/misc/text";
import { Switch } from "~/components/ui/switch";
import { testFieldAgainstAllDependencies } from "./form-config-utils";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { Button } from "~/components/ui/button";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { useCommandState } from "cmdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "~/components/ui/select";
import { renderHtmlContent } from "./form-utils";
import { RankingInput } from "~/components/misc/ranking-input";

/**
 * RadioGroupField - uses local state for immediate UI response
 * Syncs to form state asynchronously to avoid blocking the UI
 */
function RadioGroupField({
  form,
  configKey,
  config,
  labelContainerClassName,
  l,
  propertyHasNotApplicableOption,
  objectHasNotApplicableOption,
  objectHasNotApplicableChecked,
}: {
  form: UseFormReturn<any>;
  configKey: string;
  config: any;
  labelContainerClassName?: string;
  l: I18NFunction;
  propertyHasNotApplicableOption: boolean;
  objectHasNotApplicableOption?: boolean;
  objectHasNotApplicableChecked?: boolean;
}) {
  const formValue: string = form.watch(configKey) ?? "";
  const [localValue, setLocalValue] = useState<string>(formValue);

  // Sync from form when it changes externally (e.g., form.reset())
  useEffect(() => {
    setLocalValue(formValue);
  }, [formValue]);

  const handleValueChange = useCallback(
    (value: string) => {
      setLocalValue(value);
      setTimeout(() => {
        form.setValue(configKey, value, { shouldDirty: true });
        form.clearErrors(configKey);
      }, 0);
    },
    [form, configKey]
  );

  const fieldValueIsNotApplicable = localValue === "not_applicable";

  if (objectHasNotApplicableOption && objectHasNotApplicableChecked && fieldValueIsNotApplicable) {
    return <></>;
  }

  return (
    <FormField
      control={form.control}
      name={configKey as any}
      render={({ field }) => (
        <FormItem>
          <div className={cn("mb-2.5", labelContainerClassName)}>
            {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
            {config.description && <FormDescription>{renderHtmlContent(config.description)}</FormDescription>}
            {config.helpText && (
              <Text as="p" variant="body-sm" className="text-muted-foreground">
                {config.helpText}
              </Text>
            )}
          </div>

          {propertyHasNotApplicableOption && !config.hideNotApplicableCheckbox && (
            <NotApplicableCheckbox field={field} configKey={configKey} />
          )}

          {propertyHasNotApplicableOption && fieldValueIsNotApplicable ? null : (
            <FormControl>
              <RadioGroup
                onValueChange={handleValueChange}
                value={localValue}
                className="gap-2"
                style={{
                  gridTemplateColumns: `repeat(${config.cols ?? 1}, minmax(0, 1fr))`,
                }}
              >
                {config.options.map((option: any) => {
                  const isChecked = localValue === option;
                  return (
                    <FormItem key={option}>
                      <FormLabel
                        className={cn(
                          "flex items-start space-x-3 border border-border rounded-full p-3 cursor-pointer",
                          "transition-opacity hover:opacity-80",
                          isChecked && "bg-primary/10 border-primary/30"
                        )}
                      >
                        <FormControl>
                          <RadioGroupItem value={option} />
                        </FormControl>
                        <Text as="p" variant="body-sm">
                          {config.mapToLabels ? config.mapToLabels(option, l) : option}
                        </Text>
                      </FormLabel>
                    </FormItem>
                  );
                })}
              </RadioGroup>
            </FormControl>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/**
 * CheckboxGroupField - uses local state for immediate UI response
 * Syncs to form state asynchronously to avoid blocking the UI
 */
function CheckboxGroupField({
  form,
  configKey,
  config,
  customComponents,
  labelContainerClassName,
  l,
}: {
  form: UseFormReturn<any>;
  configKey: string;
  config: any;
  customComponents?: any;
  labelContainerClassName?: string;
  l: I18NFunction;
}) {
  const formValues: string[] = form.watch(configKey) ?? [];
  const [localValues, setLocalValues] = useState<string[]>(formValues);
  const lastFormValuesRef = useRef<string>(JSON.stringify(formValues));

  // Sync from form when it changes externally (e.g., form.reset())
  // Use JSON comparison to avoid infinite loops from array reference changes
  useEffect(() => {
    const formValuesStr = JSON.stringify(formValues);
    if (formValuesStr !== lastFormValuesRef.current) {
      lastFormValuesRef.current = formValuesStr;
      setLocalValues(formValues);
    }
  }, [formValues]);

  const handleCheckedChange = useCallback(
    (option: string, checked: boolean) => {
      let newValue: string[];

      // Handle exclusive options (e.g., "None of the above")
      const exclusiveOptions = config.exclusiveOptions || [];
      const isExclusiveOption = exclusiveOptions.includes(option);
      const hasExclusiveSelected = localValues.some((v) => exclusiveOptions.includes(v));

      if (checked) {
        if (isExclusiveOption) {
          // If checking an exclusive option, clear all other options
          newValue = [option];
        } else {
          // If checking a normal option, remove any exclusive options and add this one
          newValue = [...localValues.filter((v) => !exclusiveOptions.includes(v)), option];
        }
      } else {
        // Unchecking - just remove this option
        newValue = localValues.filter((v) => v !== option);
      }

      setLocalValues(newValue);

      // Defer form state update to next tick
      setTimeout(() => {
        form.setValue(configKey, newValue, { shouldDirty: true });
        form.clearErrors(configKey);
      }, 0);
    },
    [localValues, form, configKey, config.exclusiveOptions]
  );

  const hasCustom = !!customComponents?.["checkboxGroup"];

  return (
    <FormField
      control={form.control}
      name={configKey as any}
      render={() => (
        <FormItem>
          <div className={cn("mb-2.5", labelContainerClassName)}>
            {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
            {config.description && <FormDescription>{renderHtmlContent(config.description)}</FormDescription>}
            {config.showSelectedCount && (
              <div className="text-sm text-muted-foreground">{localValues.length} selected</div>
            )}
            {config.helpText && (
              <Text as="p" variant="body-sm" className="text-muted-foreground">
                {config.helpText}
              </Text>
            )}
          </div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${config.cols ?? 1}, minmax(0, 1fr))`,
            }}
          >
            {config.options.map((option: any) => {
              const isChecked = localValues.includes(option);
              return (
                <FormItem key={option}>
                  <FormLabel
                    className={
                      hasCustom
                        ? "relative"
                        : cn(
                            "relative flex items-start space-x-3 border border-border rounded-md p-3 cursor-pointer",
                            "transition-opacity hover:opacity-80",
                            isChecked && "bg-primary/10 border-primary/30"
                          )
                    }
                  >
                    <FormControl>
                      <Checkbox
                        className={cn(hasCustom ? "absolute top-0 left-0 opacity-0" : "mr-2")}
                        checked={isChecked}
                        onCheckedChange={(checked: boolean) => handleCheckedChange(option, checked)}
                      />
                    </FormControl>
                    {customComponents?.["checkboxGroup"]?.({ value: localValues, onChange: () => {} }, option) ?? (
                      <Text as="p" variant="body-sm">
                        {config.mapToLabels ? config.mapToLabels(option, l) : option}
                      </Text>
                    )}
                  </FormLabel>
                </FormItem>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/**
 * Debounced Input - updates local state immediately, syncs to form after delay
 */
function DebouncedInput({
  value,
  onChange,
  debounceMs = 150,
  ...props
}: React.ComponentProps<typeof Input> & {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Sync from form state when it changes externally (e.g., form.reset())
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  // Cleanup timeout on unmount
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return <Input {...props} value={localValue} onChange={handleChange} />;
}

/**
 * Debounced Textarea - updates local state immediately, syncs to form after delay
 */
function DebouncedTextarea({
  value,
  onChange,
  debounceMs = 150,
  ...props
}: React.ComponentProps<typeof Textarea> & {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Sync from form state when it changes externally (e.g., form.reset())
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  // Cleanup timeout on unmount
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return <Textarea {...props} value={localValue} onChange={handleChange} />;
}

/**
 * This function takes a zod object and for each field, it returns a form component.
 *
 * If the field is a string, it returns a text input.
 * If the field is a boolean, it returns a checkbox.
 * If the field is an enum, it returns a select.
 * If the field is an object, it returns a nested form.
 * If the field is an array, it returns a list of the same form component.
 */
export function formConfigToFormComponents<T extends FormConfig>({
  form,
  config,
  customComponents,
  l,
  labelContainerClassName,
}: {
  form: UseFormReturn<any>;
  config: T;
  customComponents?: Partial<
    Record<
      "text" | "textarea" | "switch" | "checkboxGroup",
      (field: ControllerRenderProps<any, any>, option?: string) => React.ReactNode
    >
  >;
  l: I18NFunction;
  labelContainerClassName?: string;
}): Record<FormKeys<T>, React.ReactNode> {
  type K = FormKeys<T>;
  let formComponents: Record<K, React.ReactNode> = {} as Record<K, React.ReactNode>;

  const watchedFields = getFieldsWithDependencies({ config });
  const watchedValues = form.watch(watchedFields);
  // map Record<watchedFields, watchedValues>
  // const watchedValuesMap = Object.fromEntries(watchedFields.map((field, index) => [field, watchedValues[index]]));

  // console.log(watchedValuesMap);

  function getFormComponent({
    configKey,
    config,
    objectHasNotApplicableOption,
    objectHasNotApplicableChecked,
  }: {
    configKey: string;
    config: ObjectConfigValues;
    objectHasNotApplicableOption?: boolean;
    objectHasNotApplicableChecked?: boolean;
  }) {
    //
    // unwrap, if necessary
    //
    // Use any for schema since we're doing runtime instanceof checks
    // and Zod v4 types don't narrow well through these transformations
    let schema: any = config.schema;
    let propertyHasNotApplicableOption = false;

    // console.log("schema", schema);
    // Now we can safely unwrap the schema
    // NOTE: No ZodEffects in Zod v4
    // if (schema instanceof z.ZodEffects) {
    //   //
    //   // zod effects
    //   //
    //   schema = (schema as z.ZodEffects<any>).innerType();
    // } else
    if (schema instanceof z.ZodOptional) {
      //
      // zod optional
      //
      schema = (schema as z.ZodOptional<any>).unwrap();
      if (schema instanceof z.ZodNullable) {
        schema = (schema as z.ZodNullable<any>).unwrap();
      }
    } else if (schema instanceof z.ZodNullable) {
      //
      // zod nullable
      //
      schema = (schema as z.ZodNullable<any>).unwrap();
    } else if (schema instanceof z.ZodUnion) {
      //
      // zod union of enum and something else
      //
      if (schema.options[0]) {
        const notApplicableSchema = schema.options[1];
        schema = schema.options[0];

        if (notApplicableSchema instanceof z.ZodLiteral && notApplicableSchema.value === "not_applicable") {
          propertyHasNotApplicableOption = true;
        }
      }
    }

    //
    // check if the field should be hidden
    //
    // if (config.hideIf) {
    //   const [pathToDependency, operator, valueToCheckAgainst] = config.hideIf;
    //   const indexOfDependency = watchedFields.indexOf(pathToDependency);

    //   const dependencyValue = watchedValues[indexOfDependency];

    //   const doesFieldPassDependencyCheck = testFieldAgainstDependencyOperator({
    //     operator,
    //     valueToCheckAgainst,
    //     dependencyValue,
    //   });

    //   // return if the field should be hidden
    //   if (doesFieldPassDependencyCheck) {
    //     return;
    //   }
    // }

    //
    // check if the field should be hidden
    //
    if (config.dependencies) {
      const doesFieldPassAllDependencies = testFieldAgainstAllDependencies({
        testFor: "hide",
        dependencies: config.dependencies,
        getDependencyValue: (pathToDependency: string) => {
          // console.log(
          //   "pathToDependency",
          //   pathToDependency,
          //   "watchedValues[watchedFields.indexOf(pathToDependency)]",
          //   watchedValues[watchedFields.indexOf(pathToDependency)]
          // );
          return watchedValues[watchedFields.indexOf(pathToDependency)];
        },
      });

      // console.log(configKey, "doesFieldPassAllDependencies", doesFieldPassAllDependencies);

      if (doesFieldPassAllDependencies) {
        return;
      }
    }

    const fieldValueIsNotApplicable = (fieldValue: any) => fieldValue === "not_applicable";

    match(config)
      /**
       *
       * Text
       *
       */
      .with({ type: "text" }, (config) => {
        formComponents[configKey as K] = (
          <FormField
            control={form.control}
            name={configKey as any}
            render={({ field }) =>
              objectHasNotApplicableOption &&
              objectHasNotApplicableChecked &&
              fieldValueIsNotApplicable(field.value) ? (
                <></>
              ) : (
                <FormItem className={cn("relative", config.formItemClassName)}>
                  <div className={cn("mb-2.5", labelContainerClassName)}>
                    {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
                    {config.description && <FormDescription>{config.description}</FormDescription>}
                  </div>
                  <FormControl>
                    {customComponents?.["text"]?.(field) ?? (
                      <DebouncedInput
                        value={field.value ?? ""}
                        placeholder={config.placeholder}
                        onChange={(value) => {
                          field.onChange(value);
                          form.clearErrors(configKey);
                        }}
                      />
                    )}
                  </FormControl>
                  {config.helpText && (
                    <Text as="p" variant="body-sm" className="text-muted-foreground">
                      {config.helpText}
                    </Text>
                  )}
                  {/* {config.autocomplete && field.value && (
                    <Autocomplete searchValue={field.value} options={config.autocomplete.options} />
                  )} */}
                  <FormMessage />
                </FormItem>
              )
            }
          />
        );
      })
      /**
       *
       * Number
       *
       */
      .with({ type: "number" }, (config) => {
        formComponents[configKey as K] = (
          <FormField
            control={form.control}
            name={configKey as any}
            render={({ field }) =>
              objectHasNotApplicableOption &&
              objectHasNotApplicableChecked &&
              fieldValueIsNotApplicable(field.value) ? (
                <></>
              ) : (
                <FormItem className={cn("relative", config.formItemClassName)}>
                  <div className={cn("mb-2.5", labelContainerClassName)}>
                    {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
                    {config.description && <FormDescription>{config.description}</FormDescription>}
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder={config.placeholder}
                      min={config.min}
                      max={config.max}
                      step={config.step}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Convert to number or undefined if empty
                        field.onChange(value === "" ? undefined : Number(value));
                        form.clearErrors(configKey);
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  {config.helpText && (
                    <Text as="p" variant="body-sm" className="text-muted-foreground">
                      {config.helpText}
                    </Text>
                  )}
                  <FormMessage />
                </FormItem>
              )
            }
          />
        );
      })
      /**
       *
       * Autocomplete
       *
       */
      .with({ type: "autocomplete" }, (config) => {
        formComponents[configKey as K] = (
          <FormField
            control={form.control}
            name={configKey as any}
            render={({ field }) => {
              if (
                objectHasNotApplicableOption &&
                objectHasNotApplicableChecked &&
                fieldValueIsNotApplicable(field.value)
              ) {
                return <></>;
              }

              return (
                <FormItem className={cn("relative", config.formItemClassName)}>
                  <div className={cn("mb-2.5", labelContainerClassName)}>
                    {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
                    {config.description && <FormDescription>{config.description}</FormDescription>}
                  </div>

                  <Autocomplete
                    value={field.value}
                    placeholder={config.placeholder || "Select..."}
                    options={config.options}
                    mapToLabels={config.mapToLabels || ((option) => option)}
                    onSelect={(value) => {
                      form.setValue(configKey, value);
                      form.clearErrors(configKey);
                    }}
                  />

                  {config.helpText && (
                    <Text as="p" variant="body-sm" className="text-muted-foreground">
                      {config.helpText}
                    </Text>
                  )}

                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      })
      /**
       *
       * Textarea
       *
       */
      .with({ type: "textarea" }, (config) => {
        // const indexOfNotApplicable = watchedFields.indexOf(`${key}NotApplicable`);
        // const notApplicableValue = watchedValues[indexOfNotApplicable];
        formComponents[configKey as K] = (
          <FormField
            control={form.control}
            name={configKey as any}
            render={({ field }) =>
              objectHasNotApplicableOption &&
              objectHasNotApplicableChecked &&
              fieldValueIsNotApplicable(field.value) ? (
                <></>
              ) : (
                <FormItem className={cn(config.formItemClassName)}>
                  <div className={cn("mb-2.5", labelContainerClassName)}>
                    {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
                    {config.description && <FormDescription>{config.description}</FormDescription>}
                  </div>
                  <div className="space-y-2">
                    {propertyHasNotApplicableOption && !config.hideNotApplicableCheckbox && (
                      <NotApplicableCheckbox field={field} configKey={configKey} />
                    )}

                    {propertyHasNotApplicableOption && fieldValueIsNotApplicable(field.value) ? null : (
                      <FormControl>
                        {customComponents?.["textarea"]?.(field) ?? (
                          <DebouncedTextarea
                            value={field.value ?? ""}
                            placeholder={config.placeholder || l("Enter answer here...", "Saisir la réponse ici...")}
                            onChange={(value) => {
                              field.onChange(value);
                              form.clearErrors(configKey);
                            }}
                          />
                        )}
                      </FormControl>
                    )}
                    {config.helpText && (
                      <Text as="p" variant="body-sm" className="text-muted-foreground">
                        {config.helpText}
                      </Text>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )
            }
          />
        );
      })
      /**
       *
       * Radio Group
       *
       */
      .with({ type: "radioGroup" }, (config) => {
        formComponents[configKey as K] = (
          <RadioGroupField
            form={form}
            configKey={configKey}
            config={config}
            labelContainerClassName={labelContainerClassName}
            l={l}
            propertyHasNotApplicableOption={propertyHasNotApplicableOption}
            objectHasNotApplicableOption={objectHasNotApplicableOption}
            objectHasNotApplicableChecked={objectHasNotApplicableChecked}
          />
        );
      })
      /**
       *
       * Checkbox Group
       *
       */
      .with({ type: "checkboxGroup" }, (config) => {
        formComponents[configKey as K] = (
          <CheckboxGroupField
            form={form}
            configKey={configKey}
            config={config}
            customComponents={customComponents}
            labelContainerClassName={labelContainerClassName}
            l={l}
          />
        );
      })
      /**
       *
       * Switch
       *
       */
      .with({ type: "switch" }, (config) => {
        formComponents[configKey as K] = (
          <FormField
            control={form.control}
            name={configKey as any}
            render={({ field }) => (
              <FormItem>
                <div className={cn("mb-2.5", labelContainerClassName)}>
                  {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
                  {config.description && <FormDescription>{config.description}</FormDescription>}
                </div>
                <FormControl>
                  {customComponents?.["switch"]?.(field) ?? (
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        form.clearErrors(configKey);
                      }}
                    />
                  )}
                </FormControl>
                {config.helpText && (
                  <Text as="p" variant="body-sm" className="text-muted-foreground">
                    {config.helpText}
                  </Text>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })
      /**
       *
       * Single Checkbox
       *
       */
      .with({ type: "singleCheckbox" }, (config) => {
        formComponents[configKey as K] = (
          <FormField
            control={form.control}
            name={configKey as any}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        form.clearErrors(configKey);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
                    {config.description && <FormDescription>{config.description}</FormDescription>}
                  </div>
                </div>
                {config.helpText && (
                  <Text as="p" variant="body-sm" className="text-muted-foreground">
                    {config.helpText}
                  </Text>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })
      /**
       *
       * Hidden
       *
       */
      .with({ type: "hidden" }, (config) => {
        formComponents[configKey as K] = (
          <FormField
            control={form.control}
            name={configKey as any}
            render={({ field }) => <Input {...field} type="hidden" className="absolute opacity-0" />}
          />
        );
      })

      /**
       *
       * Select
       *
       */
      .with({ type: "select" }, (config) => {
        formComponents[configKey as K] = (
          <FormField
            control={form.control}
            name={configKey as any}
            render={({ field }) => (
              <FormItem>
                <div className={cn("mb-2.5", labelContainerClassName)}>
                  {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
                  {config.description && <FormDescription>{config.description}</FormDescription>}
                </div>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.clearErrors(configKey);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={config.placeholder || l("Select an option", "Sélectionner une option")}
                      />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {/* <SelectItem value="m@example.com">m@example.com</SelectItem>
                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                    <SelectItem value="m@support.com">m@support.com</SelectItem> */}
                    {config.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {config.mapToLabels ? config.mapToLabels(option, l) : option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {config.helpText && (
                  <Text as="p" variant="body-sm" className="text-muted-foreground">
                    {config.helpText}
                  </Text>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })
      /**
       *
       * Rating Matrix
       *
       */
      .with({ type: "rating-matrix" }, (config) => {
        formComponents[configKey as K] = (
          <RatingMatrix
            form={form}
            configKey={configKey}
            config={config}
            l={l}
            labelContainerClassName={labelContainerClassName}
          />
        );
      })
      /**
       *
       * Ranking (drag-and-drop priority ranking)
       *
       */
      .with({ type: "ranking" }, (config) => {
        formComponents[configKey as K] = (
          <FormField
            control={form.control}
            name={configKey as any}
            render={({ field }) => (
              <FormItem className={cn(config.formItemClassName)}>
                <div className={cn("mb-2.5", labelContainerClassName)}>
                  {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
                  {config.description && <FormDescription>{config.description}</FormDescription>}
                </div>
                <FormControl>
                  <RankingInput
                    {...field}
                    items={config.items}
                    onChange={(value) => {
                      field.onChange(value);
                      form.clearErrors(configKey);
                    }}
                  />
                </FormControl>
                {config.helpText && (
                  <Text as="p" variant="body-sm" className="text-muted-foreground">
                    {config.helpText}
                  </Text>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })
      .exhaustive();
  }

  //
  // get the form components
  //
  Object.entries(config).forEach(([key, value]) => {
    //
    // if this is an object, we need to go in!
    //
    if (value.type === "object") {
      //
      // if all values in the object are "not_applicable", then we check the checkbox
      //
      const allValuesAreNotApplicable = watchedFields
        .filter((field) => field.startsWith(`${key}.`))
        .every((field, index) => watchedValues[index] === "not_applicable");

      formComponents[key as K] = (
        <div>
          {/* // (maybe) add a label, if it is not empty // */}
          {value.label && <FormLabel>{value.label}</FormLabel>}
          {value.offerNotApplicableForEntireObject && (
            <div className="mt-3 flex items-start space-x-3 space-y-0">
              <Checkbox
                id={`${key}NotApplicableGroup`}
                checked={allValuesAreNotApplicable}
                onCheckedChange={(checked: boolean) => {
                  // field.onChange(checked ? "not_applicable" : "");
                  Object.entries(value.properties).forEach(([keyInObject, valueInObject]) => {
                    form.setValue(`${key}.${keyInObject}`, checked ? "not_applicable" : null);
                  });
                }}
              />

              <div className="space-y-1 leading-none">
                <Label htmlFor={`${key}NotApplicableGroup`}>{l("Not Applicable", "Ne s'applique pas")}</Label>
              </div>
            </div>
          )}
        </div>
      );

      //
      // get the inner form components
      //
      Object.entries(value.properties).forEach(([keyInObject, valueInObject]) => {
        getFormComponent({
          configKey: `${key}.${keyInObject}`,
          config: valueInObject,
          objectHasNotApplicableOption: !!value.offerNotApplicableForEntireObject,
          objectHasNotApplicableChecked: allValuesAreNotApplicable,
        });
      });
    } else {
      getFormComponent({
        configKey: key,
        config: value,
      });
    }
  });

  // console.log(formComponents);

  return formComponents;
}

function NotApplicableCheckbox({ field, configKey }: { field: ControllerRenderProps<any, any>; configKey: string }) {
  // const { l } = useI18n();

  return (
    <div className="flex items-start space-x-3 space-y-0">
      <Checkbox
        id={`${configKey}NotApplicable`}
        checked={field.value === "not_applicable"}
        onCheckedChange={(checked: boolean) => {
          field.onChange(checked ? "not_applicable" : "");
        }}
      />
      <div className="space-y-1 leading-none">
        <Label htmlFor={`${configKey}NotApplicable`}>
          {/* {l("Not Applicable", "Ne s'applique pas")} */}
          Not Applicable
        </Label>
      </div>
    </div>
  );
}

function Autocomplete({
  value,
  placeholder,
  options,
  mapToLabels,
  onSelect,
}: {
  value: string;
  placeholder: string;
  options: string[] | readonly string[];
  mapToLabels: (option: string) => string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const displayValue = value || placeholder || "Select...";

  function handleOnSelect(value: string) {
    onSelect(value);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="primary-outline"
            role="combobox"
            className={cn("w-[300px] justify-between", !value && "text-muted-foreground")}
          >
            {displayValue}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command
          filter={(value, search, keywords) => {
            if (value === "add") {
              return 1;
            }

            if (value.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }

            return 0;
          }}
        >
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            {/* <CommandEmpty>No framework found.</CommandEmpty> */}
            <CommandGroup>
              {options.map((option) => {
                const optionValue = mapToLabels ? mapToLabels(option) : option;
                const isChecked = optionValue === value;
                return (
                  <CommandItem
                    //
                    // for an autocomplete feature, value is the label
                    value={optionValue}
                    key={option}
                    onSelect={() => {
                      handleOnSelect(optionValue);
                    }}
                  >
                    {optionValue}
                    <Check className={cn("ml-auto", isChecked ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                );
              })}

              {/* add new option */}
              <AddNewCommandItem onSelect={handleOnSelect} />
              {/*  */}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function AddNewCommandItem({ onSelect }: { onSelect: (value: string) => void }) {
  const search = useCommandState((state) => state.search);

  if (!search) {
    return null;
  }

  return (
    <CommandItem
      value="add"
      onSelect={() => {
        onSelect(search);
      }}
    >
      <PlusIcon className="size-4" />
      Add new option
    </CommandItem>
  );
}

/**
 * Rating Matrix Component - uses local state for immediate UI response
 *
 * Renders a matrix where rows are items and columns are scales.
 * Desktop: Radio buttons in a table layout
 * Mobile: Dropdowns for each scale
 */
function RatingMatrix({
  form,
  configKey,
  config,
  l,
  labelContainerClassName,
}: {
  form: UseFormReturn<any>;
  configKey: string;
  config: RatingMatrixConfig;
  l: I18NFunction;
  labelContainerClassName?: string;
}) {
  const { scales, items, labelDisplay = "legend" } = config;

  type MatrixValues = Record<string, Record<string, number | string>>;
  const formValues: MatrixValues = form.watch(configKey) || {};
  const [localValues, setLocalValues] = useState<MatrixValues>(formValues);

  // Use JSON string as dependency for reliable content-based comparison
  // Object reference comparison ([formValues]) fails when form.reset() is called
  const formValuesStr = JSON.stringify(formValues);

  useEffect(() => {
    setLocalValues(formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- formValuesStr is the serialized formValues
  }, [formValuesStr]);

  // Get current value for an item+scale combination
  const getValue = (itemKey: string, scaleKey: string) => {
    return localValues[itemKey]?.[scaleKey];
  };

  // Set value for an item+scale combination
  const setValue = useCallback(
    (itemKey: string, scaleKey: string, value: number | string) => {
      // Coerce value to match original option type (RadioGroup/Select always return strings)
      const scale = scales.find((s) => s.key === scaleKey);
      const originalType = typeof scale?.options[0]?.value;
      const coercedValue = originalType === "number" ? Number(value) : value;

      // Update local state immediately
      setLocalValues((prev) => ({
        ...prev,
        [itemKey]: {
          ...(prev[itemKey] || {}),
          [scaleKey]: coercedValue,
        },
      }));

      // Defer form state update
      setTimeout(() => {
        const current = form.getValues(configKey) || {};
        const newValue = {
          ...current,
          [itemKey]: {
            ...(current[itemKey] || {}),
            [scaleKey]: coercedValue,
          },
        };
        form.setValue(configKey, newValue, { shouldDirty: true });

        // Only clear errors when ALL cells are filled
        const allFilled = items.every((item) =>
          scales.every((scale) => {
            const cellValue = newValue[item.key]?.[scale.key];
            return cellValue !== undefined && cellValue !== null;
          })
        );
        if (allFilled) {
          form.clearErrors(configKey);
        }
      }, 0);
    },
    [form, configKey, items, scales]
  );

  return (
    <FormField
      control={form.control}
      name={configKey as any}
      render={({ fieldState }) => {
        // Check if a specific cell is missing (for highlighting)
        const isCellMissing = (itemKey: string, scaleKey: string) => {
          if (!fieldState.error) return false;
          const value = getValue(itemKey, scaleKey);
          return value === undefined || value === null || value === "";
        };

        return (
          <FormItem className={config.formItemClassName}>
            {/* Header */}
            <div className={cn("mb-4", labelContainerClassName)}>
              {config.label && <FormLabel>{renderHtmlContent(config.label)}</FormLabel>}
              {config.description && <FormDescription>{renderHtmlContent(config.description)}</FormDescription>}
              {config.helpText && (
                <Text as="p" variant="body-sm" className="text-muted-foreground mt-1">
                  {renderHtmlContent(config.helpText)}
                </Text>
              )}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden md:block">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  {/* Scale labels row */}
                  <tr>
                    <th className={cn("text-left w-[35%] max-w-[280px]", scales[0].label && "p-2")} />
                    {scales.map((scale, scaleIndex) => (
                      <th
                        key={scale.key}
                        colSpan={scale.options.length}
                        className={cn(
                          "text-center border-t border-l bg-black/10 dark:bg-white/10",
                          // only add padding if label is not empty,
                          scale.label && "p-2 border-b",
                          scaleIndex === scales.length - 1 && "border-r",
                          scaleIndex % 2 === 0 && "bg-background/40"
                        )}
                      >
                        <div className="font-medium text-sm">{renderHtmlContent(scale.label)}</div>
                      </th>
                    ))}
                  </tr>
                  {/* Option labels row - conditional display based on labelDisplay */}
                  {labelDisplay === "angled" ? (
                    (() => {
                      // row height = longest label length * 6px

                      // get the longest label length
                      const longestLabelLength = scales.reduce((max, scale) => {
                        return Math.max(
                          max,
                          scale.options.reduce((max, option) => {
                            return Math.max(max, option.label?.length || 0);
                          }, 0)
                        );
                      }, 0);

                      const rowHeight = longestLabelLength * 6 + 40;

                      return (
                        <tr>
                          <th className="text-left p-2 w-[35%] max-w-[280px]" style={{ height: rowHeight }} />
                          {scales.map((scale, scaleIndex) =>
                            scale.options.map((option, optionIndex) => {
                              const isFirstOption = optionIndex === 0;
                              const isLastScale = scaleIndex === scales.length - 1;
                              const isLastOption = optionIndex === scale.options.length - 1;
                              const isLastCell = isLastScale && isLastOption;
                              return (
                                <th
                                  key={`${scale.key}-${option.value}`}
                                  className={cn(
                                    "border-b min-w-[48px] align-bottom relative p-0",
                                    isFirstOption && "border-l",
                                    isLastCell && "border-r",
                                    scaleIndex % 2 === 0 && "bg-background/40"
                                  )}
                                  style={{ height: rowHeight }}
                                >
                                  {option.label && (
                                    <>
                                      {/* Connector line */}
                                      <div
                                        className="absolute bg-border"
                                        style={{
                                          bottom: "22px",
                                          left: "50%",
                                          width: "2px",
                                          height: "8px",
                                          transform: "translateX(-50%)",
                                        }}
                                      />
                                      {/* Angled label */}
                                      <div
                                        className="absolute text-xs text-muted-foreground whitespace-nowrap"
                                        style={{
                                          bottom: "30px",
                                          left: "50%",
                                          transform: "rotate(-55deg)",
                                          transformOrigin: "left bottom",
                                        }}
                                        title={option.label}
                                      >
                                        {option.label}
                                      </div>
                                    </>
                                  )}
                                  <div className="absolute bottom-1 left-0 right-0 text-center">
                                    <span className="text-sm text-muted-foreground font-medium">{option.value}</span>
                                  </div>
                                </th>
                              );
                            })
                          )}
                        </tr>
                      );
                    })()
                  ) : (
                    // Legend display
                    <>
                      {/* Legend row - stacked vertically */}
                      <tr>
                        <th className="text-left p-2 w-[35%] max-w-[280px]" />
                        {scales.map((scale, scaleIndex) => {
                          const isLastScale = scaleIndex === scales.length - 1;
                          return (
                            <th
                              key={scale.key}
                              colSpan={scale.options.length}
                              className={cn(
                                "p-3 text-left border-b border-l text-xs text-muted-foreground font-normal",
                                isLastScale && "border-r",
                                scaleIndex % 2 === 0 && "bg-background/40"
                              )}
                            >
                              <div className="space-y-1">
                                {scale.options
                                  .filter((opt) => opt.label)
                                  .map((opt) => (
                                    <div key={opt.value}>
                                      {opt.value} = {opt.label}
                                    </div>
                                  ))}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                      {/* Number row - shows values above each column */}
                      <tr>
                        <th className="text-left p-2 w-[35%] max-w-[280px]" />
                        {scales.map((scale, scaleIndex) =>
                          scale.options.map((option, optionIndex) => {
                            const isFirstOption = optionIndex === 0;
                            const isLastScale = scaleIndex === scales.length - 1;
                            const isLastOption = optionIndex === scale.options.length - 1;
                            const isLastCell = isLastScale && isLastOption;
                            return (
                              <th
                                key={`${scale.key}-${option.value}`}
                                className={cn(
                                  "border-b min-w-[48px] p-2 text-center text-sm text-muted-foreground font-medium",
                                  isFirstOption && "border-l",
                                  isLastCell && "border-r",
                                  scaleIndex % 2 === 0 && "bg-background/40"
                                )}
                              >
                                {option.value}
                              </th>
                            );
                          })
                        )}
                      </tr>
                    </>
                  )}
                </thead>
                <tbody>
                  {items.map((item, itemIndex) => (
                    <tr key={item.key} className="border-b">
                      <td
                        className={cn(
                          "p-3 text-sm font-medium w-[35%] max-w-[280px] border-l",
                          itemIndex === 0 && "border-t"
                        )}
                      >
                        {renderHtmlContent(item.label)}
                      </td>
                      {scales.map((scale, scaleIndex) => {
                        const currentValue = getValue(item.key, scale.key);
                        const missing = isCellMissing(item.key, scale.key);
                        const isLastScale = scaleIndex === scales.length - 1;
                        return scale.options.map((option, optionIndex) => {
                          const isSelected = currentValue?.toString() === option.value.toString();
                          const isFirstOption = optionIndex === 0;
                          const isLastOption = optionIndex === scale.options.length - 1;
                          const isLastCell = isLastScale && isLastOption;
                          return (
                            <td
                              key={`${scale.key}-${option.value}`}
                              className={cn(
                                "p-0 text-center h-full group hover:bg-black/5 dark:hover:bg-white/5 relative",
                                missing && "bg-destructive/10",
                                isFirstOption && "border-l",
                                isLastCell && "border-r",
                                itemIndex === 0 && "border-t",
                                scaleIndex % 2 === 0 && !missing && "bg-background/40"
                              )}
                            >
                              <label
                                htmlFor={`${configKey}-${item.key}-${scale.key}-${option.value}`}
                                className={cn(
                                  "absolute inset-0 flex items-center justify-center cursor-pointer transition-colors",
                                  isSelected && "bg-primary/10"
                                )}
                              >
                                <RadioGroup
                                  value={currentValue?.toString()}
                                  onValueChange={(val) => {
                                    // Guard: ensure we don't set empty values on re-render
                                    if (val) setValue(item.key, scale.key, val);
                                  }}
                                >
                                  <RadioGroupItem
                                    value={option.value.toString()}
                                    id={`${configKey}-${item.key}-${scale.key}-${option.value}`}
                                  />
                                </RadioGroup>
                              </label>
                            </td>
                          );
                        });
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Card layout with dropdowns */}
            <div className="md:hidden space-y-4">
              {items.map((item) => (
                <div key={item.key} className="border rounded-lg p-4 space-y-3">
                  <div className="font-medium text-sm">{renderHtmlContent(item.label)}</div>
                  {scales.map((scale) => {
                    const currentValue = getValue(item.key, scale.key);
                    const missing = isCellMissing(item.key, scale.key);
                    return (
                      <div key={scale.key} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{renderHtmlContent(scale.label)}</Label>
                        <Select
                          value={currentValue?.toString()}
                          onValueChange={(val) => {
                            // Guard: Radix Select may fire onValueChange with "" on re-render
                            if (val) setValue(item.key, scale.key, val);
                          }}
                        >
                          <SelectTrigger className={cn("w-full", missing && "border-destructive bg-destructive/10")}>
                            <SelectValue placeholder={l("Select", "Sélectionner")} />
                          </SelectTrigger>
                          <SelectContent>
                            {scale.options.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label ? `${option.value} - ${option.label}` : option.value.toString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Custom error - FormMessage doesn't work for nested object errors */}
            {fieldState.error && (
              <p className="text-sm font-medium text-destructive pt-1" data-slot="form-message">
                {l("Please complete all ratings", "Veuillez compléter toutes les évaluations")}
              </p>
            )}
          </FormItem>
        );
      }}
    />
  );
}
