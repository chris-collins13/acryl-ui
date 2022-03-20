import * as React from "react";
import styled from "styled-components";
import { DisplayedRow } from "./NestedSchemaTableContainer";
import Row from "./Row";

interface Props {
    displayedRows: { [key: string]: DisplayedRow };
    rootRows: string[];
    defaultOpenRows: Set<string>;
    areAllExpanded: boolean | null;
}

function NestedSchemaTableView(props: Props) {
    const { displayedRows, rootRows, defaultOpenRows, areAllExpanded } = props;

    return (
        <Table>
            <thead>
                <tr>
                    <TableHeader>Field</TableHeader>
                    <TableHeader>Description</TableHeader>
                    <TableHeader>Tags</TableHeader>
                </tr>
            </thead>
            <TableBody>
                {rootRows.map((fieldPath) => (
                    <Row
                        key={fieldPath}
                        fieldPath={fieldPath}
                        displayedRows={displayedRows}
                        defaultOpenRows={defaultOpenRows}
                        areAllExpanded={areAllExpanded}
                    />
                ))}
            </TableBody>
        </Table>
    );
}

const TableBody = styled.tbody``;

const Table = styled.table`
    border-collapse: collapse;
    font-weight: 500;
    width: 100%;
`;

const TableHeader = styled.th`
    border-bottom: 1px solid #f0f0f0;
    color: #000000;
    font-family: "Manrope";
    padding: 13px 21px;
    position: relative;
    font-size: 12px;
    line-height: 20px;
    text-align: left;
    width: 33%;

    ::after {
        border: 1px solid #f0f0f0;
        content: "";
        height: 21px;
        position: absolute;
        right: 0;
    }
`;

export default NestedSchemaTableView;
