import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import { DisplayedRow, Status } from "../NestedSchemaTableContainer";

interface Props {
    fieldPath: string;
    displayedRows: { [key: string]: DisplayedRow };
    defaultOpenRows: Set<string>;
    areAllExpanded: boolean | null;
    hasParentBeenToggled?: boolean;
}

function Row(props: Props) {
    const {
        fieldPath,
        displayedRows,
        defaultOpenRows,
        areAllExpanded,
        hasParentBeenToggled,
    } = props;

    const [hasBeenToggled, setHasBeenToggled] = useState(
        !!hasParentBeenToggled
    );
    const [isExpanded, setIsExpanded] = useState(
        isDefaultStateOpen(hasBeenToggled, fieldPath, defaultOpenRows)
    );

    useEffect(() => {
        if (areAllExpanded !== null) {
            setIsExpanded(areAllExpanded);
        }
    }, [areAllExpanded]);

    function toggleIsExpanded() {
        setIsExpanded(!isExpanded);
        setHasBeenToggled(true);
    }

    const row = displayedRows[fieldPath];
    const fieldName = row.fieldPath.split(".").pop();
    const numIndents = fieldPath.split(".").length - 1;

    return (
        <>
            <RowWrapper>
                <TableData
                    numIndents={numIndents}
                    status={row.status}
                    isLeftEnd
                >
                    {[...Array(numIndents)].map((_indent, index) => (
                        <Indent key={index} indentIndex={index} />
                    ))}
                    {!!row.children.length && (
                        <>
                            {isExpanded ? (
                                <StyledDownArrow onClick={toggleIsExpanded} />
                            ) : (
                                <StyledRightArrow onClick={toggleIsExpanded} />
                            )}
                        </>
                    )}
                    <FieldName>{fieldName}</FieldName>
                    <TypeTag>{row.type}</TypeTag>
                </TableData>
                <TableData status={row.status}>
                    <Description>{row.description}</Description>
                </TableData>
                <TableData status={row.status} isRightEnd>
                    {row.tags &&
                        row.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                </TableData>
            </RowWrapper>
            {isExpanded &&
                row.children.map((child) => (
                    <Row
                        key={child}
                        fieldPath={child}
                        displayedRows={displayedRows}
                        defaultOpenRows={defaultOpenRows}
                        areAllExpanded={areAllExpanded}
                        hasParentBeenToggled={hasBeenToggled}
                    />
                ))}
        </>
    );
}

export function isDefaultStateOpen(
    hasBeenToggled: boolean,
    fieldPath: string,
    defaultOpenRows: Set<string>
) {
    if (hasBeenToggled) return false;

    return defaultOpenRows.has(fieldPath);
}

const RowWrapper = styled.tr`
    border-bottom: 1px solid #f0f0f0;
    min-height: 50px;
`;

export const Indent = styled.div<{ indentIndex: number }>`
    background-color: white;
    border-right: 2px solid #f0f0f0;
    display: inline-block;
    height: calc(100% + 2px);
    position: absolute;
    top: -1px;
    left: calc(
        ${(props) => `${props.indentIndex} * 19px + ${props.indentIndex}px`}
    );
    width: 18px;
`;

const FieldName = styled.span`
    color: #262626;
    font-family: "Roboto Mono";
    font-size: 12px;
    line-height: 22px;
    margin-left: 8px;
`;

const TypeTag = styled.span`
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    color: #8c8c8c;
    font-size: 10px;
    margin-left: 40px;
    padding: 2px 8px;
`;

const arrowStyles = `
    cursor: pointer;
    padding-left: 2px;

    svg {
        height: 10px;
    }
`;

export const StyledRightArrow = styled(RightOutlined)`
    ${arrowStyles}
`;

export const StyledDownArrow = styled(DownOutlined)`
    ${arrowStyles}
`;

const TableData = styled.td<{
    numIndents?: number;
    status?: Status;
    isLeftEnd?: boolean;
    isRightEnd?: boolean;
}>`
    padding: 15px;
    position: relative;

    ${(props) =>
        props.numIndents
            ? `padding-left: calc(15px + ${props.numIndents} * 19px);`
            : ""}

    &:after {
        content: "";
        height: 80%;
        left: 0;
        position: absolute;
        top: 10%;
        width: 100%;
        z-index: -1;

        ${(props) =>
            props.numIndents
                ? `width: calc(100% - (15px + ${props.numIndents} * 19px));`
                : ""}
        ${(props) =>
            props.isLeftEnd &&
            "border-radius: 5px 0 0 5px; left: auto; right: 0;"}
        ${(props) =>
            props.isRightEnd &&
            "border-radius: 0 5px 5px 0; width: calc(100% - 10px);"}
        ${(props) =>
            props.status === Status.ADD &&
            "background-color: rgba(51, 255, 0, 0.15);"}
        ${(props) =>
            props.status === Status.DELETE &&
            "background-color: rgba(255, 0, 0, 0.15);"}
    }
`;

const Description = styled.span`
    color: #262626;
    font-size: 12px;
    line-height: 20px;
`;

export const Tag = styled.span`
    border: 1px solid #d9d9d9;
    border-radius: 25px;
    color: #262626;
    font-size: 12px;
    line-height: 20px;
    padding: 2px 12px;
`;

export default Row;
