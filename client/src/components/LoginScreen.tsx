import axios from "axios";
import React, { PureComponent, SyntheticEvent } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";

export class LoginScreenComponent extends PureComponent<RouteComponentProps> {
    private readonly username = React.createRef<HTMLInputElement>()
    private readonly password = React.createRef<HTMLInputElement>()

    public render() {
        return <Container>
            <Row>
                <Col>
                    <h1>Login</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={this.login}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" ref={this.username} placeholder="Username" required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={this.username} placeholder="Password" required/>
                        </Form.Group>
                        <Button type="submit" variant="success" style={{marginTop: 50}} onClick={this.login}>Login</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    }

    private login = async (e: SyntheticEvent) => {
        e.preventDefault();
        const username = this.username.current?.value ?? "";
        const password = this.password.current?.value ?? "";
        try {
            await axios.post("http://localhost:50001/api/v1.0/user/login", {username, password},  {headers: {
                accept: "*/*",
                "cache-Control": "no-cache",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
            }}
)
            toast("Login successful", {type: "success"})
            this.props.history.push("robot")
        }catch(ex) {
            console.log(ex)
            toast("Failed to login, please try again", {type: "error"})
        }
    }
}

export const LoginScreen = withRouter(LoginScreenComponent)