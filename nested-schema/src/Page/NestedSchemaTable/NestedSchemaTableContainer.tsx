import * as React from "react";
import { Field } from "../data";
import NestedSchemaTableView from "./NestedSchemaTableView";

export enum Status {
    ADD,
    DELETE,
    REMAIN,
}

export interface DisplayedRow extends Field {
    children: string[];
    status: Status;
}

interface Props {
    schemaA: Field[];
    schemaB: Field[];
}

function NestedSchemaTableContainer(props: Props) {
    const { schemaA, schemaB } = props;

    const displayedRows: { [key: string]: DisplayedRow } = {};
    const schemaAFields = new Set<string>();

    schemaA.forEach((field) => {
        schemaAFields.add(field.fieldPath);
        updateOrPopulateEntry(field, displayedRows, Status.ADD);
        updateOrPopulateParentEntry(field, displayedRows, Status.ADD);
    });

    schemaB.forEach((field) => {
        const status = schemaAFields.has(field.fieldPath)
            ? Status.REMAIN
            : Status.DELETE;
        updateOrPopulateEntry(field, displayedRows, status);
        updateOrPopulateParentEntry(field, displayedRows, status);
    });

    const differentRows: string[] = [];
    const rootRows: string[] = [];
    Object.keys(displayedRows).forEach((key) => {
        if (!displayedRows[key].fieldPath.includes(".")) {
            rootRows.push(displayedRows[key].fieldPath);
        }
        if (displayedRows[key].status !== Status.REMAIN) {
            differentRows.push(displayedRows[key].fieldPath);
        }
    });

    return (
        <NestedSchemaTableView
            displayedRows={displayedRows}
            rootRows={rootRows}
            differentRows={differentRows}
        />
    );
}

function updateOrPopulateEntry(
    field: Field,
    displayedRows: { [key: string]: DisplayedRow },
    status: Status
) {
    if (field.fieldPath in displayedRows) {
        //happens when a child already populated its parent to add itself as a child
        displayedRows[field.fieldPath] = {
            ...displayedRows[field.fieldPath],
            ...field,
            status,
        };
    } else {
        displayedRows[field.fieldPath] = {
            ...field,
            children: [],
            status,
        };
    }
}

function updateOrPopulateParentEntry(
    field: Field,
    displayedRows: { [key: string]: DisplayedRow },
    status: Status
) {
    const pathArray = field.fieldPath.split(".");
    const directParent = pathArray.slice(0, pathArray.length - 1).join(".");

    if (directParent) {
        if (directParent in displayedRows) {
            if (
                !displayedRows[directParent].children.includes(field.fieldPath)
            ) {
                displayedRows[directParent].children.push(field.fieldPath);
            }
        } else {
            displayedRows[directParent] = {
                fieldPath: directParent,
                children: [field.fieldPath],
                type: "",
                status,
            };
        }
    }
}

export default NestedSchemaTableContainer;
