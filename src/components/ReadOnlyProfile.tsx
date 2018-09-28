import * as React from 'react'
import { List } from "rivet-react";
import { IProps } from "../store/profile";

const ReadOnlyProfile : React.SFC<IProps> = 
({ user, roles }) => (
    <>
        <h2>User</h2>
        <List>
            <li><strong>NetId:</strong> {user.netId}</li>
            <li><strong>Name:</strong> {user.name}</li>
        </List>
        <h2>Roles</h2>
        <List>
            {roles.map(r => (<li><strong>{r.department}:</strong> {r.role}</li>))}
        </List>
    </>
)
export default ReadOnlyProfile
