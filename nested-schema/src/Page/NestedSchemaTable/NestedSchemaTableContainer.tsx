import * as React from "react";
import { SchemaMetadata } from "../data";
import NestedSchemaTableView from "./NestedSchemaTableView";

export enum Status {
    ADD,
    DELETE,
    REMAIN,
}

export interface DisplayedRow extends SchemaMetadata {
    children: string[];
    status: Status;
}

interface Props {
    schemaA: SchemaMetadata[];
    schemaB: SchemaMetadata[];
    areAllExpanded: boolean | null;
}

function NestedSchemaTableContainer(props: Props) {
    const { schemaA, schemaB, areAllExpanded } = props;

    const displayedRows: { [key: string]: DisplayedRow } = {};
    const schemaAFields = new Set<string>();

    schemaA.forEach((item) => {
        schemaAFields.add(item.fieldPath);
        updateOrPopulateEntry(item, displayedRows, Status.ADD);
        updateOrPopulateParentEntry(item, displayedRows, Status.ADD);
    });

    schemaB.forEach((item) => {
        const status = schemaAFields.has(item.fieldPath)
            ? Status.REMAIN
            : Status.DELETE;
        updateOrPopulateEntry(item, displayedRows, status, false);
        updateOrPopulateParentEntry(item, displayedRows, status);
    });

    const differentRows: Set<string> = new Set<string>();
    const rootRows: string[] = [];
    Object.keys(displayedRows).forEach((key) => {
        if (!displayedRows[key].fieldPath.includes(".")) {
            rootRows.push(displayedRows[key].fieldPath);
        }
        if (displayedRows[key].status !== Status.REMAIN) {
            differentRows.add(displayedRows[key].fieldPath);
        }
    });

    return (
        <NestedSchemaTableView
            displayedRows={displayedRows}
            rootRows={rootRows}
            differentRows={differentRows}
            areAllExpanded={areAllExpanded}
        />
    );
}

function updateOrPopulateEntry(
    item: SchemaMetadata,
    displayedRows: { [key: string]: DisplayedRow },
    status: Status,
    shouldOverwriteItemValues: boolean = true
) {
    if (item.fieldPath in displayedRows) {
        //happens when a child already populated its parent to add itself as a child
        const fieldValues = shouldOverwriteItemValues ? item : {};
        displayedRows[item.fieldPath] = {
            ...displayedRows[item.fieldPath],
            ...fieldValues,
            status,
        };
    } else {
        displayedRows[item.fieldPath] = {
            ...item,
            children: [],
            status,
        };
    }
}

function updateOrPopulateParentEntry(
    item: SchemaMetadata,
    displayedRows: { [key: string]: DisplayedRow },
    status: Status
) {
    const pathArray = item.fieldPath.split(".");
    const directParent = pathArray.slice(0, pathArray.length - 1).join(".");

    if (directParent) {
        if (directParent in displayedRows) {
            if (
                !displayedRows[directParent].children.includes(item.fieldPath)
            ) {
                displayedRows[directParent].children.push(item.fieldPath);
            }
        } else {
            displayedRows[directParent] = {
                fieldPath: directParent,
                children: [item.fieldPath],
                type: "",
                status,
            };
        }
    }
}

export default NestedSchemaTableContainer;
