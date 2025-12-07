import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { exampleActionDefinition } from "./action-definition";

export default createActionHandler(
  exampleActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    const parsedInputData = parseActionInput(exampleActionDefinition, unsafeInputData);

    // Simulate creating an item with the form data
    // In a real application, you would save this to a database
    const newItemId = `item-${Date.now()}`;

    console.log("Creating item with data:", parsedInputData);

    return {
      id: newItemId,
      success: true,
    };
  }
);
