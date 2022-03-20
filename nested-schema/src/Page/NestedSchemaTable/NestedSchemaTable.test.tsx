import React from "react";
import { shallow } from "enzyme";
import NestedSchemaTableView from "./NestedSchemaTableView";
import {
    Status,
    updateOrPopulateEntry,
    updateOrPopulateParentEntry,
    updateRootRows,
    updateDifferentRows,
} from "./NestedSchemaTableContainer";
import { item1, item2 } from "./fixtures";
import Row from "./Row";

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
        const displayedRows = {
            [item1.fieldPath]: {
                ...item1,
                status: Status.ADD,
                children: ["item_info.item_name"],
            },
        };
        const rootRows: string[] = [];
        updateRootRows(rootRows, displayedRows, item1.fieldPath);

        expect(rootRows).toMatchObject([item1.fieldPath]);
    });

    it("should not add the item to root rows if it is not a parent root", () => {
        const displayedRows = {
            [item2.fieldPath]: {
                ...item2,
                status: Status.ADD,
                children: ["item_info.item_name"],
            },
        };
        const rootRows: string[] = [];
        updateRootRows(rootRows, displayedRows, item2.fieldPath);

        expect(rootRows).toMatchObject([]);
    });
});

describe("updateDifferentRows", () => {
    it("should add the item to differentRows if the status is ADD", () => {
        const displayedRows = {
            [item1.fieldPath]: {
                ...item1,
                status: Status.ADD,
                children: ["item_info.item_name"],
            },
        };
        const differentRows = new Set<string>();
        updateDifferentRows(differentRows, displayedRows, item1.fieldPath);

        expect(differentRows).toMatchObject(new Set([item1.fieldPath]));
    });

    it("should add the item to differentRows if the status is DELETE", () => {
        const displayedRows = {
            [item1.fieldPath]: {
                ...item1,
                status: Status.DELETE,
                children: ["item_info.item_name"],
            },
        };
        const differentRows = new Set<string>();
        updateDifferentRows(differentRows, displayedRows, item1.fieldPath);

        expect(differentRows).toMatchObject(new Set([item1.fieldPath]));
    });

    it("should not add the item to differentRows if the status is REMAIN", () => {
        const displayedRows = {
            [item1.fieldPath]: {
                ...item1,
                status: Status.REMAIN,
                children: ["item_info.item_name"],
            },
        };
        const differentRows = new Set<string>();
        updateDifferentRows(differentRows, displayedRows, item1.fieldPath);

        expect(differentRows).toMatchObject(new Set());
    });
});
