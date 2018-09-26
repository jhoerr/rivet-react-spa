import * as React from 'react'
import { List } from "rivet-react";
import { IProfile } from "../store/profile/types";

const ReadOnlyProfile : React.SFC<IProfile> = 
({ netId, name, department, expertise }) => (
        <List>
            <li><strong>Username:</strong> {netId}</li>
            <li><strong>Display Name:</strong> {name}</li>
            <li><strong>Department:</strong> {department}</li>
            <li><strong>Expertise:</strong> {expertise}</li>
        </List>
)
export default ReadOnlyProfile
