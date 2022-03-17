import * as React from "react";
import styled from "styled-components";
import Page from "./Page";

function App() {
    return (
        <FontWrapper>
            <Page />
        </FontWrapper>
    );
}

const FontWrapper = styled.div`
    font-family: "Manrope";
`;

export default App;
