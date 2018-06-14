import React from "react";
import Semver from "semver";
import Marked from "marked";
import { filter, map, replace, sortBy } from "lodash-es";
import { Badge, ListGroup, Panel, Table, Well, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Link} from "react-router-dom";
import RemoveReference from "./RemoveReference";
import {
    Flex,
    FlexItem,
    Icon,
    ListGroupItem,
    LoadingPlaceholder,
    NoneFound,
    RelativeTime,
    Button
} from "../../../base";
import { checkUserRefPermission } from "../../../utils";
import { checkUpdates, updateRemoteReference } from "../../actions";

const Contributors = ({ contributors }) => {

    if (contributors.length) {
        const sorted = sortBy(contributors, ["id", "count"]);

        const contributorComponents = map(sorted, entry =>
            <ListGroupItem key={entry.id}>
                {entry.id} <Badge>{entry.count}</Badge>
            </ListGroupItem>
        );

        return (
            <ListGroup>
                {contributorComponents}
            </ListGroup>
        );
    }

    return <NoneFound noun="contributors" />;
};

const LatestBuild = ({ id, latestBuild }) => {
    if (latestBuild) {
        return (
            <ListGroupItem>
                <strong>
                    <Link to={`/refs/${id}/indexes/${latestBuild.id}`}>
                        Index {latestBuild.version}
                    </Link>
                </strong>
                <span>
                    &nbsp;/ Created <RelativeTime time={latestBuild.created_at} /> by {latestBuild.user.id}
                </span>
            </ListGroupItem>
        );
    }

    return <NoneFound noun="index builds" noListGroup />;
};

const Release = ({ lastChecked, release, updateAvailable, onCheckUpdates, isPending, onInstall, isUpdating }) => {

    let updateStats;

    if (updateAvailable) {
        updateStats = (
            <span> / {release.name} / Published <RelativeTime time={release.published_at} /></span>
        );
    }

    let updateDetail;

    if (updateAvailable) {
        const html = replace(
            Marked(release.body),
            /([0-9] +)/g,
            "<a target='_blank' href='https://github.com/virtool/virtool/issues/$1'>#$1</a>"
        );

        updateDetail = (
            <Well style={{marginTop: "10px"}}>
                <div dangerouslySetInnerHTML={{__html: html}} />
            </Well>
        );
    }

    return (
        <ListGroupItem>
            <div>
                <span className={updateAvailable ? "text-primary" : "text-success"}>
                    <Icon name={updateAvailable ? "arrow-alt-circle-up" : "check"} />
                    <strong>
                        &nbsp;{updateAvailable ? "Update Available" : "Up-to-date"}
                    </strong>
                </span>
                {updateStats}
                <span className="pull-right text-muted">
                    Last checked <RelativeTime time={lastChecked} />&nbsp;&nbsp;
                    {isPending
                        ? <div style={{display: "inline-block"}}><LoadingPlaceholder margin="0" size="14px" /></div>
                        : <Icon name="sync" tip="Check for Updates" tipPlacement="left" onClick={onCheckUpdates} />
                    }
                </span>
            </div>

            {updateDetail}
            {updateAvailable ? (
                <Row style={{margin: "0"}}>
                    <Button
                        icon={isUpdating ? null : "download"}
                        bsStyle="primary"
                        onClick={onInstall}
                        disabled={isUpdating}
                        pullRight
                    >
                        {isUpdating
                            ? (
                                <div>
                                    <LoadingPlaceholder
                                        margin="0"
                                        size="14px"
                                        color="#edf7f6"
                                        style={{display: "inline-block"}}
                                    /> Installing...
                                </div>
                            ) : "Install"}
                    </Button>
                </Row>
            ) : null}
        </ListGroupItem>
    );
};

const Remote = ({ updates, release, remotesFrom, onCheckUpdates, isPending, onInstall, isUpdating }) => {

    const ready = filter(updates, {ready: true});

    const installed = ready.pop();

    if (!installed) {
        return null;
    }

    const updateAvailable = Semver.gt(Semver.coerce(release.name), Semver.coerce(installed.name));

    return (
        <Panel>
            <Panel.Heading>
                <Flex>
                    <FlexItem grow={1}>
                        Remote Reference
                    </FlexItem>
                    <FlexItem>
                        <a href={`https://github.com/${remotesFrom.slug}`} target="_blank">
                            <Icon faStyle="fab" name="github" /> {remotesFrom.slug}
                        </a>
                    </FlexItem>
                </Flex>
            </Panel.Heading>
            <ListGroup>
                <ListGroupItem>
                    <Icon name="hdd" /> <strong>Installed Version</strong>
                    <span> / {installed.name}</span>
                    <span> / Published <RelativeTime time={installed.published_at} /></span>
                </ListGroupItem>
                <Release
                    lastChecked={release.last_checked}
                    release={release}
                    updateAvailable={updateAvailable}
                    onCheckUpdates={onCheckUpdates}
                    isPending={isPending}
                    onInstall={onInstall}
                    isUpdating={isUpdating}
                />
            </ListGroup>
        </Panel>
    );
};

const Clone = ({ source }) => (
    <Panel>
        <Panel.Heading>Clone Reference</Panel.Heading>
        <ListGroup>
            <ListGroupItem>
                <strong>Source Reference</strong>
                <span>
                    {" / "}
                    <a href={`/refs/${source.id}`}>
                        {source.name}
                    </a>
                </span>
            </ListGroupItem>
        </ListGroup>
    </Panel>
);

class ReferenceManage extends React.Component {

    handleCheckUpdates = () => {
        this.props.onCheckUpdates(this.props.detail.id);
    };

    handleUpdateRemote = () => {
        this.props.onUpdate(this.props.detail.id);
    };

    render () {

        if (this.props.detail === null || this.props.detail.id !== this.props.match.params.refId) {
            return <LoadingPlaceholder />;
        }

        const {
            id,
            contributors,
            data_type,
            description,
            internal_control,
            latest_build,
            organism,
            release,
            remotes_from,
            cloned_from,
            updates,
            checkPending
        } = this.props.detail;

        let remote;
        let clone;

        if (remotes_from) {
            remote = (
                <Remote
                    release={release}
                    remotesFrom={remotes_from}
                    updates={updates}
                    onCheckUpdates={this.handleCheckUpdates}
                    isPending={checkPending}
                    onInstall={this.handleUpdateRemote}
                    isUpdating={this.props.isUpdating}
                />
            );
        }

        if (cloned_from) {
            clone = (
                <Clone source={cloned_from} />
            );
        }

        const hasRemove = checkUserRefPermission(this.props, "remove");

        return (
            <div>
                <Table bordered>
                    <tbody>
                        <tr>
                            <th className="col-xs-4">Description</th>
                            <td className="col-xs-8">{description}</td>
                        </tr>
                        <tr>
                            <th>Data Type</th>
                            <td>{data_type}</td>
                        </tr>
                        <tr>
                            <th>Organism</th>
                            <td>{organism}</td>
                        </tr>
                        <tr>
                            <th>Internal Control</th>
                            <td>{internal_control ? internal_control.name : null}</td>
                        </tr>
                    </tbody>
                </Table>

                {remote}
                {clone}

                <Panel>
                    <Panel.Heading>
                        Latest Index Build
                    </Panel.Heading>

                    <ListGroup>
                        <LatestBuild refId={id} latestBuild={latest_build} />
                    </ListGroup>
                </Panel>

                <Panel>
                    <Panel.Heading>
                        Contributors
                    </Panel.Heading>

                    <Contributors contributors={contributors} />
                </Panel>

                {hasRemove ? <RemoveReference /> : null}
            </div>
        );
    }

}

const mapStateToProps = state => ({
    detail: state.references.detail,
    isAdmin: state.account.administrator,
    userId: state.account.id,
    userGroups: state.account.groups
});

const mapDispatchToProps = dispatch => ({

    onCheckUpdates: (refId) => {
        dispatch(checkUpdates(refId));
    },

    onUpdate: (refId) => {
        dispatch(updateRemoteReference(refId));
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceManage);
