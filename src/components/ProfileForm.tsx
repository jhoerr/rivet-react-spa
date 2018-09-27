import * as React from 'react'
import { Field,InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Form, Input, List } from "rivet-react";
import { IApiState2 } from '../store/common';
import { profileUpdateRequest } from '../store/profile/actions';
import { IProfile } from "../store/profile/types";

interface IProfileFormProps {
    onSubmit: typeof profileUpdateRequest
}

const ix = (props:any) => (
    <Input {...props.input} {...props} />
)

const ProfileForm : React.SFC<IApiState2<IProfile> & IProfileFormProps & InjectedFormProps<{}, IProfile & IProfileFormProps>> = 
({ loading, error, data, onSubmit }) => {

    const handleSubmit = (e:any)=> {
        e.preventDefault();
        const id = data && data.user ? data.user.id : 0
        onSubmit({id});
    }

    return (
            <>
                { !data && loading && <p>Loading...</p>}
                { data && data.user && 
                  <>
                    <h2>User</h2>
                    <List>
                        <li><strong>NetId:</strong> {data.user.netId}</li>
                        <li><strong>Name:</strong> {data.user.name}</li>
                    </List>
                    <h2>Roles</h2>
                    <List>
                        {data.roles.map((r,i) => (<li key={i}><strong>{r.department}:</strong> {r.role}</li>))}
                    </List>
                    <Form  label="Profile update" labelVisibility="screen-reader-only" method="GET" onSubmit={handleSubmit}>
                        <Field type="text" name="expertise" component={ix} label="Expertise" margin={{ bottom: 'md' }}/>        
                        <Button type="submit" disabled={loading}>Update</Button>
                    </Form>
                  </>
                }
            </>
        )
    
}

export default reduxForm({form:'profile'})(ProfileForm)
