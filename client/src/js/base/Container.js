import styled from "styled-components";

export const Container = styled.div`
    align-items: stretch;
    display: flex;
    width: 100vw;
    max-width: 100%;
    padding: 0 35px 0 98px;
`;

export const NarrowContainer = styled.div`
    flex: 1 0 auto;
    max-width: 1150px;
`;

export const WideContainer = styled.div`
    position: absolute;
    left: 30px;
    right: 30px;
`;
