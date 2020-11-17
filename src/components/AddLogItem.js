import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const AddLogItem = ({ addItem }) => {
  const [text, setText] = useState("");
  const [user, setUser] = useState("");
  const [priority, setPriority] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    addItem({ text, user, priority });
    setText("");
    setUser("");
    setPriority("");
  };
  return (
    <div>
      <Card className="mt-5 mb-3">
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Row className="my-3">
              <Col>
                <Form.Control
                  placeholder="Log"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="my-3">
              <Col>
                <Form.Control
                  placeholder="User"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  as="select"
                  placeholder="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="0">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </Form.Control>
              </Col>
            </Row>
            <Row className="my-3">
              <Col>
                <Button type="submit" variant="secondary" block>
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddLogItem;
