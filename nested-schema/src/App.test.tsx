import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import Page from "./Page";

describe("App", () => {
    it("should render the Page component without error", () => {
        const wrapper = shallow(<App />);

        expect(wrapper.find(Page).length).toBe(1);
    });
});
