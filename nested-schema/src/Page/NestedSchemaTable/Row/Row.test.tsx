import React from "react";
import { shallow } from "enzyme";
import { displayedItem1, displayedItem2, displayedItem3 } from "../fixtures";
import { DisplayedRow } from "../NestedSchemaTableContainer";
import Row, {
    isDefaultStateOpen,
    Indent,
    StyledDownArrow,
    StyledRightArrow,
    Tag,
} from "./Row";

describe("Row", () => {
    const displayedRows: { [key: string]: DisplayedRow } = {
        [displayedItem1.fieldPath]: displayedItem1,
        [displayedItem2.fieldPath]: displayedItem2,
        [displayedItem3.fieldPath]: displayedItem3,
    };
    const defaultProps = {
        fieldPath: displayedItem2.fieldPath,
        displayedRows,
        defaultOpenRows: new Set<string>(),
        areAllExpanded: null,
    };

    it("should render an indent for every level down the field path tree it is", () => {
        let wrapper = shallow(<Row {...defaultProps} />);
        expect(wrapper.find(Indent).length).toBe(1);

        wrapper = shallow(
            <Row {...defaultProps} fieldPath={displayedItem3.fieldPath} />
        );
        expect(wrapper.find(Indent).length).toBe(2);
    });

    it("should not render an indent if it is a root node", () => {
        const wrapper = shallow(
            <Row {...defaultProps} fieldPath={displayedItem1.fieldPath} />
        );

        expect(wrapper.find(Indent).length).toBe(0);
    });

    it("should not render an arrow if the row has no children", () => {
        const wrapper = shallow(
            <Row {...defaultProps} fieldPath={displayedItem3.fieldPath} />
        );

        expect(wrapper.find(StyledRightArrow).length).toBe(0);
    });

    it("should render an arrow if the row has children", () => {
        const wrapper = shallow(
            <Row {...defaultProps} fieldPath={displayedItem1.fieldPath} />
        );

        expect(wrapper.find(StyledRightArrow).length).toBe(1);
    });

    it("should render a tag if for every tag", () => {
        const wrapper = shallow(
            <Row {...defaultProps} fieldPath={displayedItem1.fieldPath} />
        );

        expect(wrapper.find(Tag).length).toBe(1);
    });

    it("should render a down arrow if the row has children and is expanded", () => {
        const wrapper = shallow(
            <Row {...defaultProps} fieldPath={displayedItem1.fieldPath} />
        );

        const arrow = wrapper.find(StyledRightArrow);
        arrow.simulate("click");
        wrapper.update();

        expect(wrapper.find(StyledDownArrow).length).toBe(1);
    });

    it("should not render any children if it is not expanded", () => {
        const wrapper = shallow(
            <Row {...defaultProps} fieldPath={displayedItem1.fieldPath} />
        );

        expect(wrapper.find(Row).length).toBe(0);
    });

    it("should render all of the children if it is expanded", () => {
        const wrapper = shallow(
            <Row {...defaultProps} fieldPath={displayedItem1.fieldPath} />
        );

        const arrow = wrapper.find(StyledRightArrow);
        arrow.simulate("click");
        wrapper.update();

        expect(wrapper.find(Row).length).toBe(2);
    });
});

describe("isDefaultStateOpen", () => {
    it("should return false if hasBeeToggled is true", () => {
        const isOpen = isDefaultStateOpen(
            true,
            displayedItem1.fieldPath,
            new Set()
        );
        expect(isOpen).toBe(false);
    });

    it("should return true if hasBeeToggled is false and it is in defaultOpenRows", () => {
        const defaultOpenRows = new Set([displayedItem1.fieldPath]);
        const isOpen = isDefaultStateOpen(
            false,
            displayedItem1.fieldPath,
            defaultOpenRows
        );
        expect(isOpen).toBe(true);
    });

    it("should return false if hasBeeToggled is false and it is not in defaultOpenRows", () => {
        const defaultOpenRows = new Set([displayedItem2.fieldPath]);
        const isOpen = isDefaultStateOpen(
            false,
            displayedItem1.fieldPath,
            defaultOpenRows
        );
        expect(isOpen).toBe(false);
    });
});
