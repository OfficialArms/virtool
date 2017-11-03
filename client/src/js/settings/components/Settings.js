/**
 *
 *
 * @copyright 2017 Government of Canada
 * @license MIT
 * @author igboyes
 *
 */

import React from "react";
import { connect } from "react-redux";
import { Switch, Redirect, Route } from "react-router-dom";
import { Nav, NavItem } from "react-bootstrap";
import { ClipLoader } from "halogenium";
import { LinkContainer } from "react-router-bootstrap";

import SourceTypes from "./General/SourceTypes";
import InternalControl from "./General/InternalControl";
import UniqueNames from "./General/UniqueNames";
import SamplePermissions from "./General/SamplePermissions";
import HTTP from "./Server/HTTP";
import SSL from "./Server/SSL";
import Data from "./Data";
import Resources from "./Jobs/Resources";
import Tasks from "./Jobs/Tasks";
import Users from "../../users/components/Users";
import Updates from "../../updates/components/Viewer";

const General = () => (
    <div>
        <SourceTypes />
        <InternalControl />
        <UniqueNames />
        <SamplePermissions />
    </div>
);

const Server = () => (
    <div>
        <HTTP />
        <SSL />
    </div>
);

const Jobs = () => (
    <div>
        <Resources />
        <Tasks />
    </div>
);

const Settings = ({ settings }) => {
    let content;

    if (settings === null) {
        content = (
            <div className="text-center" style={{marginTop: "220px"}}>
                <ClipLoader color="#3c8786" />
            </div>
        )
    } else {
        content = (
            <Switch>
                <Redirect from="/settings" to="/settings/general" exact />
                <Route path="/settings/general" component={General} />
                <Route path="/settings/server" component={Server} />
                <Route path="/settings/data" component={Data} />
                <Route path="/settings/jobs" component={Jobs} />
                <Route path="/settings/users" component={Users} />
                <Route path="/settings/updates" component={Updates} />
            </Switch>
        );
    }

    return (
        <div className="container">
            <h3 className="view-header">
                <strong>
                    Settings
                </strong>
            </h3>

            <Nav bsStyle="tabs">
                <LinkContainer to="/settings/general">
                    <NavItem>General</NavItem>
                </LinkContainer>

                <LinkContainer to="/settings/server">
                    <NavItem>Server</NavItem>
                </LinkContainer>

                <LinkContainer to="/settings/data">
                    <NavItem>Data</NavItem>
                </LinkContainer>

                <LinkContainer to="/settings/jobs">
                    <NavItem>Jobs</NavItem>
                </LinkContainer>

                <LinkContainer to="/settings/users">
                    <NavItem>Users</NavItem>
                </LinkContainer>

                <LinkContainer to="/settings/updates">
                    <NavItem>Updates</NavItem>
                </LinkContainer>
            </Nav>

            {content}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        settings: state.settings.data
    };
};

const Container = connect(mapStateToProps)(Settings);

export default Container;