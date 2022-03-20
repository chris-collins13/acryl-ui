import { SchemaMetadata } from "../data";
import { DisplayedRow, Status } from "./NestedSchemaTableContainer";

export const item1: SchemaMetadata = {
    fieldPath: "item_info",
    type: "Struct",
    tags: ["Item"],
};

export const item2: SchemaMetadata = {
    fieldPath: "item_info.item_name",
    type: "String",
    description: "The name of the item",
};

export const item3: SchemaMetadata = {
    fieldPath: "item_info.item_name.test",
    type: "String",
    description: "Testing a 3rd level",
};

export const displayedItem1: DisplayedRow = {
    ...item1,
    children: [item2.fieldPath, "item_info.testing"],
    status: Status.REMAIN,
};

export const displayedItem2: DisplayedRow = {
    ...item2,
    children: [item3.fieldPath],
    status: Status.ADD,
};

export const displayedItem3: DisplayedRow = {
    ...item3,
    children: [],
    status: Status.DELETE,
};
