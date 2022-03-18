import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { schemaA, schemaB } from "./data";
import NestedSchemaTable from "./NestedSchemaTable";

function Page() {
    const [areAllExpanded, setAreAllExpanded] = useState<boolean | null>(null);

    function expandAll() {
        setAreAllExpanded(true);
    }

    function collapseAll() {
        setAreAllExpanded(false);
    }

    useEffect(() => {
        if (areAllExpanded !== null) {
            const timeout = setTimeout(() => {
                setAreAllExpanded(null);
            }, 0);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [areAllExpanded]);

    return (
        <div>
            <PageHeader>
                <Button onClick={expandAll}>Expand All</Button>
                <Button onClick={collapseAll}>Collapse All</Button>
            </PageHeader>
            <NestedSchemaTable
                schemaA={schemaA}
                schemaB={schemaB}
                areAllExpanded={areAllExpanded}
            />
        </div>
    );
}

const PageHeader = styled.div`
    border-bottom: 1px solid #e9e9e9;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
    padding: 8px 18px;
`;

const Button = styled.button`
    background-color: #1890ff;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    padding: 5px 25px;
    margin-right: 13px;
`;

export default Page;
