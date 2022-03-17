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

    return (
        <>
            <RowWrapper>
                <TableData>
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
            </RowWrapper>
            {isExpanded &&
                row.children.map((child) => (
                    <Row
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

const TableData = styled.td`
    padding: 10px;
`;

const Description = styled.span`
    color: #262626;
    font-size: 12px;
    line-height: 20px;
`;

export default Row;
