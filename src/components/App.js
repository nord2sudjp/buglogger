import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import AddLogItem from "./AddLogItem";
import LogItem from "./LogItem";
const App = () => {
  const [logs, setLogs] = useState([
    {
      _id: 1,
      text: "This is log one",
      priority: "low",
      user: "Brad",
      created: new Date().toString(),
    },
    {
      _id: 2,
      text: "This is log two",
      priority: "moderate",
      user: "Kate",
      created: new Date().toString(),
    },
    {
      _id: 3,
      text: "This is log three",
      priority: "high",
      user: "John",
      created: new Date().toString(),
    },
  ]);

  function addItem(item) {
    console.log(item)
  }


  return (
    <Container>
      <AddLogItem addItem={addItem} />
      <Table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Log Text</th>
            <th>User</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <LogItem key={log._id} log={log} />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default App;
