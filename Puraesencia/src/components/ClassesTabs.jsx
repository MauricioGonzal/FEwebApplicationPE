import { Tab, Nav, Container } from "react-bootstrap";
import AdminScheduleGrid from "../pages/AdminScheduleGrid";
import ClassesPage from "../pages/ClassesPage";
import { useState } from "react";

function ClassesTabs() {
  const [refreshClassSchedule, setRefreshClassSchedule] = useState(false);

  return (
    <Container className="mt-4">
      <Tab.Container defaultActiveKey="musculacion">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="musculacion">Clases</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="clases">Grilla</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="musculacion">
            <ClassesPage setRefreshClassSchedule={setRefreshClassSchedule}/>
          </Tab.Pane>
          <Tab.Pane eventKey="clases">
            <AdminScheduleGrid refreshClassSchedule={refreshClassSchedule}/>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default ClassesTabs;