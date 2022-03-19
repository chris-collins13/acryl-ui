import React from "react";
import { shallow } from "enzyme";
import { schemaA, schemaB } from "../data";
import NestedSchemaTableView from "./NestedSchemaTableView";
import {
    Status,
    updateOrPopulateEntry,
    updateOrPopulateParentEntry,
    updateRootRows,
    updateDifferentRows,
} from "./NestedSchemaTableContainer";
import Row from "./Row";

describe("updateOrPopulateEntry", () => {
    const item = {
        fieldPath: "item_info.item_name",
        type: "String",
        description: "The name of the item",
    };

    it("should add the item to displayedRows if it wasn't there before with the correct status and empty children", () => {
        const displayedRows = {};
        const status = Status.ADD;
        updateOrPopulateEntry(item, displayedRows, status);

        expect(displayedRows).toMatchObject({
            [item.fieldPath]: { ...item, status, children: [] },
        });
    });

    it("should only update an item's status if it exists and shouldOverwriteItemValues is false", () => {
        const displayedRows = {
            [item.fieldPath]: {
                ...item,
                status: Status.ADD,
                children: ["item_info.item_name.test"],
            },
        };
        const status = Status.REMAIN;
        updateOrPopulateEntry(item, displayedRows, status, false);

        expect(displayedRows).toMatchObject({
            [item.fieldPath]: {
                ...item,
                status,
                children: ["item_info.item_name.test"],
            },
        });
    });

    it("should update the whole item if it exists and shouldOverwriteItemValues is true", () => {
        const displayedRows = {
            [item.fieldPath]: {
                ...item,
                description: "this description should be overwritten",
                status: Status.ADD,
                children: [],
            },
        };
        const status = Status.REMAIN;
        updateOrPopulateEntry(item, displayedRows, status, true);

        expect(displayedRows).toMatchObject({
            [item.fieldPath]: { ...item, status, children: [] },
        });
    });
});

describe("updateOrPopulateParentEntry", () => {
    const item = {
        fieldPath: "item_info.item_name",
        type: "String",
        description: "The name of the item",
    };

    it("should add the item's parent to displayedRows with itself as a child if the direct parent does not exist", () => {
        const displayedRows = {};
        const status = Status.ADD;
        updateOrPopulateParentEntry(item, displayedRows, status);

        expect(displayedRows).toMatchObject({
            item_info: {
                fieldPath: "item_info",
                children: [item.fieldPath],
                type: "",
                status,
            },
        });
    });

    it("should add the item's parent to displayedRows with itself as a child if the direct parent does not exist - multiple levels", () => {
        const childOfItem = { ...item, fieldPath: item.fieldPath + ".test" };
        const displayedRows = {};
        const status = Status.ADD;
        updateOrPopulateParentEntry(childOfItem, displayedRows, status);

        expect(displayedRows).toMatchObject({
            [item.fieldPath]: {
                fieldPath: item.fieldPath,
                children: [childOfItem.fieldPath],
                type: "",
                status,
            },
        });
    });

    it("should add itself to its direct parents children list if the parent is already in displayed rows", () => {
        const status = Status.ADD;
        const parentOfItem = {
            ...item,
            fieldPath: "item_info",
            children: ["testing"],
            status,
        };
        const displayedRows = { [parentOfItem.fieldPath]: parentOfItem };
        updateOrPopulateParentEntry(item, displayedRows, Status.REMAIN);

        expect(displayedRows).toMatchObject({
            [parentOfItem.fieldPath]: {
                ...parentOfItem,
                children: ["testing", item.fieldPath],
            },
        });
    });

    it("should not add itself to its direct parents children list if the item is already there", () => {
        const status = Status.ADD;
        const parentOfItem = {
            ...item,
            fieldPath: "item_info",
            children: [item.fieldPath],
            status,
        };
        const displayedRows = { [parentOfItem.fieldPath]: parentOfItem };
        updateOrPopulateParentEntry(item, displayedRows, Status.REMAIN);

        expect(displayedRows).toMatchObject({
            [parentOfItem.fieldPath]: {
                ...parentOfItem,
                children: [item.fieldPath],
            },
        });
    });
});

describe("updateRootRows", () => {
    it("should add the item to root rows if it is a parent root", () => {
        const item = {
            fieldPath: "item_info",
            type: "String",
            description: "",
        };
        const displayedRows = {
            [item.fieldPath]: {
                ...item,
                status: Status.ADD,
                children: ["item_info.item_name"],
            },
        };
        const rootRows: string[] = [];
        updateRootRows(rootRows, displayedRows, item.fieldPath);

        expect(rootRows).toMatchObject([item.fieldPath]);
    });

    it("should not add the item to root rows if it is not a parent root and has a parent itself", () => {
        const item = {
            fieldPath: "item_info.item_name",
            type: "String",
            description: "The name of the item",
        };
        const displayedRows = {
            [item.fieldPath]: {
                ...item,
                status: Status.ADD,
                children: ["item_info.item_name"],
            },
        };
        const rootRows: string[] = [];
        updateRootRows(rootRows, displayedRows, item.fieldPath);

        expect(rootRows).toMatchObject([]);
    });
});

describe("updateDifferentRows", () => {
    const item = {
        fieldPath: "item_info",
        type: "String",
        description: "",
    };

    it("should add the item to differentRows if the status is ADD", () => {
        const displayedRows = {
            [item.fieldPath]: {
                ...item,
                status: Status.ADD,
                children: ["item_info.item_name"],
            },
        };
        const differentRows = new Set<string>();
        updateDifferentRows(differentRows, displayedRows, item.fieldPath);

        expect(differentRows).toMatchObject(new Set([item.fieldPath]));
    });

    it("should add the item to differentRows if the status is DELETE", () => {
        const displayedRows = {
            [item.fieldPath]: {
                ...item,
                status: Status.DELETE,
                children: ["item_info.item_name"],
            },
        };
        const differentRows = new Set<string>();
        updateDifferentRows(differentRows, displayedRows, item.fieldPath);

        expect(differentRows).toMatchObject(new Set([item.fieldPath]));
    });

    it("should not add the item to differentRows if the status is REMAIN", () => {
        const displayedRows = {
            [item.fieldPath]: {
                ...item,
                status: Status.REMAIN,
                children: ["item_info.item_name"],
            },
        };
        const differentRows = new Set<string>();
        updateDifferentRows(differentRows, displayedRows, item.fieldPath);

        expect(differentRows).toMatchObject(new Set());
    });
});

describe("NestedSchemaTableView", () => {
    it("should render a Row for every rootRow", () => {
        const rootRows = ["test", "another", "third"];
        const wrapper = shallow(
            <NestedSchemaTableView
                displayedRows={{}}
                rootRows={rootRows}
                differentRows={new Set()}
                areAllExpanded={null}
            />
        );

        expect(wrapper.find(Row).length).toBe(rootRows.length);
    });
});
