import React from "react";
import styled from "styled-components";
import { borderRadius } from "../../../../app/theme";
import { Box } from "../../../../base";
import SampleLabels from "./Labels";

const StyledSidebar = styled(Box)`
    align-items: stretch;
    background-color: #f8f9fa;
    border: none;
    border-radius: ${borderRadius.lg};
    flex-direction: column;
    display: flex;
    min-width: 320px;
`;

export const Sidebar = () => (
    <StyledSidebar>
        <SampleLabels />
    </StyledSidebar>
);
