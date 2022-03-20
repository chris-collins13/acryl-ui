import React from "react";
import { shallow } from "enzyme";
import NestedSchemaTableView from "./NestedSchemaTableView";
import {
    Status,
    updateOrPopulateEntry,
    updateOrPopulateParentEntry,
    updateRootRows,
    updateDefaultOpenRows,
    getParentFieldPath,
} from "./NestedSchemaTableContainer";
import { item1, item2, item3 } from "./fixtures";
import Row from "./Row";

describe("NestedSchemaTableView", () => {
    it("should render a Row for every rootRow", () => {
        const rootRows = ["test", "another", "third"];
        const wrapper = shallow(
            <NestedSchemaTableView
                displayedRows={{}}
                rootRows={rootRows}
                defaultOpenRows={new Set()}
                areAllExpanded={null}
            />
        );

        expect(wrapper.find(Row).length).toBe(rootRows.length);
    });
});

describe("updateOrPopulateEntry", () => {
    it("should add the item to displayedRows if it wasn't there before with the correct status and empty children", () => {
        const displayedRows = {};
        const status = Status.ADD;
        updateOrPopulateEntry(item2, displayedRows, status);

        expect(displayedRows).toMatchObject({
            [item2.fieldPath]: { ...item2, status, children: [] },
        });
    });

    it("should only update an item's status if it exists and shouldOverwriteItemValues is false", () => {
        const displayedRows = {
            [item2.fieldPath]: {
                ...item2,
                status: Status.ADD,
                children: ["item_info.item_name.test"],
            },
        };
        const status = Status.REMAIN;
        updateOrPopulateEntry(item2, displayedRows, status, false);

        expect(displayedRows).toMatchObject({
            [item2.fieldPath]: {
                ...item2,
                status,
                children: ["item_info.item_name.test"],
            },
        });
    });

    it("should update the whole item if it exists and shouldOverwriteItemValues is true", () => {
        const displayedRows = {
            [item2.fieldPath]: {
                ...item2,
                description: "this description should be overwritten",
                status: Status.ADD,
                children: [],
            },
        };
        const status = Status.REMAIN;
        updateOrPopulateEntry(item2, displayedRows, status, true);

        expect(displayedRows).toMatchObject({
            [item2.fieldPath]: { ...item2, status, children: [] },
        });
    });
});

describe("updateOrPopulateParentEntry", () => {
    it("should add the item's parent to displayedRows with itself as a child if the direct parent does not exist", () => {
        const displayedRows = {};
        const status = Status.ADD;
        updateOrPopulateParentEntry(item2, displayedRows, status);

        expect(displayedRows).toMatchObject({
            item_info: {
                fieldPath: "item_info",
                children: [item2.fieldPath],
                type: "",
                status,
            },
        });
    });

    it("should add the item's parent to displayedRows with itself as a child if the direct parent does not exist - multiple levels", () => {
        const childOfItem = { ...item2, fieldPath: item2.fieldPath + ".test" };
        const displayedRows = {};
        const status = Status.ADD;
        updateOrPopulateParentEntry(childOfItem, displayedRows, status);

        expect(displayedRows).toMatchObject({
            [item2.fieldPath]: {
                fieldPath: item2.fieldPath,
                children: [childOfItem.fieldPath],
                type: "",
                status,
            },
        });
    });

    it("should add itself to its direct parents children list if the parent is already in displayed rows", () => {
        const status = Status.ADD;
        const parentOfItem = {
            ...item2,
            fieldPath: "item_info",
            children: ["item_info.testing"],
            status,
        };
        const displayedRows = { [parentOfItem.fieldPath]: parentOfItem };
        updateOrPopulateParentEntry(item2, displayedRows, Status.REMAIN);

        expect(displayedRows).toMatchObject({
            [parentOfItem.fieldPath]: {
                ...parentOfItem,
                children: ["item_info.testing", item2.fieldPath],
            },
        });
    });

    it("should not add itself to its direct parents children list if the item is already there", () => {
        const status = Status.ADD;
        const parentOfItem = {
            ...item2,
            fieldPath: "item_info",
            children: [item2.fieldPath],
            status,
        };
        const displayedRows = { [parentOfItem.fieldPath]: parentOfItem };
        updateOrPopulateParentEntry(item2, displayedRows, Status.REMAIN);

        expect(displayedRows).toMatchObject({
            [parentOfItem.fieldPath]: {
                ...parentOfItem,
                children: [item2.fieldPath],
            },
        });
    });
});

describe("updateRootRows", () => {
    it("should add the item to root rows if it is a parent root", () => {
        const rootRows: string[] = [];
        updateRootRows(rootRows, item1.fieldPath);

        expect(rootRows).toMatchObject([item1.fieldPath]);
    });

    it("should not add the item to root rows if it is not a parent root", () => {
        const rootRows: string[] = [];
        updateRootRows(rootRows, item2.fieldPath);

        expect(rootRows).toMatchObject([]);
    });
});

describe("updateDefaultOpenRows", () => {
    const displayedRows = {
        [item1.fieldPath]: {
            ...item1,
            status: Status.REMAIN,
            children: [item2.fieldPath],
        },
        [item2.fieldPath]: {
            ...item2,
            status: Status.REMAIN,
            children: [item3.fieldPath],
        },
        [item3.fieldPath]: {
            ...item3,
            status: Status.DELETE,
            children: [],
        },
    };

    it("should add the item's parent and its parents recursively to defaultOpenRows if they have different statuses", () => {
        const defaultOpenRows = new Set<string>();
        updateDefaultOpenRows(defaultOpenRows, displayedRows, item3.fieldPath);

        expect(defaultOpenRows).toMatchObject(
            new Set([item1.fieldPath, item2.fieldPath])
        );
    });

    it("should not add the item's parent to defaultOpenRows if they have the same status", () => {
        const defaultOpenRows = new Set<string>();
        updateDefaultOpenRows(defaultOpenRows, displayedRows, item2.fieldPath);

        expect(defaultOpenRows).toMatchObject(new Set());
    });

    it("should not add anything to defaultOpenRows if they have no parent", () => {
        const defaultOpenRows = new Set<string>();
        updateDefaultOpenRows(defaultOpenRows, displayedRows, item1.fieldPath);

        expect(defaultOpenRows).toMatchObject(new Set());
    });
});

describe("getParentFieldPath", () => {
    it("should properly get the parent field path", () => {
        let parentFieldPath = getParentFieldPath(item2.fieldPath);
        expect(parentFieldPath).toBe(item1.fieldPath);

        parentFieldPath = getParentFieldPath(item3.fieldPath);
        expect(parentFieldPath).toBe(item2.fieldPath);
    });

    it("should return an empty string if there is no parent", () => {
        const parentFieldPath = getParentFieldPath(item1.fieldPath);
        expect(parentFieldPath).toBe("");
    });
});
