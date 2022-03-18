import React, { useState } from "react";
import styled from "styled-components";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import { DisplayedRow, Status } from "../NestedSchemaTableContainer";

interface Props {
    fieldPath: string;
    displayedRows: { [key: string]: DisplayedRow };
    differentRows: string[];
}

function Row(props: Props) {
    const { fieldPath, displayedRows, differentRows } = props;

    const [isExpanded, setIsExpanded] = useState(false);

    const row = displayedRows[fieldPath];

    function toggleIsExpanded() {
        setIsExpanded(!isExpanded);
    }

    const numIndents = fieldPath.split(".").length - 1;

    return (
        <>
            <RowWrapper>
                <TableData numIndents={numIndents}>
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
                    <FieldPath>{row.fieldPath}</FieldPath>
                    <TypeTag>{row.type}</TypeTag>
                </TableData>
                <TableData>
                    <Description>{row.description}</Description>
                </TableData>
                <TableData>
                    <Description>
                        {row.tags &&
                            row.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                    </Description>
                </TableData>
            </RowWrapper>
            {isExpanded &&
                row.children.map((child) => (
                    <Row
                        key={child}
                        fieldPath={child}
                        displayedRows={displayedRows}
                        differentRows={differentRows}
                    />
                ))}
        </>
    );
}

const RowWrapper = styled.tr`
    border-bottom: 1px solid #f0f0f0;
    min-height: 50px;
`;

const Indent = styled.div<{ indentIndex: number }>`
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

const FieldPath = styled.span`
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

const StyledRightArrow = styled(RightOutlined)`
    cursor: pointer;

    svg {
        height: 9px;
    }
`;

const StyledDownArrow = styled(DownOutlined)`
    cursor: pointer;

    svg {
        height: 9px;
    }
`;

const TableData = styled.td<{ numIndents?: number }>`
    border-bottom: 1px solid #f0f0f0;
    padding: 15px;
    position: relative;

    ${(props) =>
        props.numIndents
            ? `padding-left: calc(15px + ${props.numIndents} * 19px);`
            : ""}
`;

const Description = styled.span`
    color: #262626;
    font-size: 12px;
    line-height: 20px;
`;

const Tag = styled.span`
    border: 1px solid #d9d9d9;
    border-radius: 25px;
    color: #262626;
    font-size: 12px;
    line-height: 20px;
    padding: 2px 12px;
`;

export default Row;
