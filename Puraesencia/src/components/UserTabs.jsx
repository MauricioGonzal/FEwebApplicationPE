import { Tab, Nav, Container } from "react-bootstrap";
import UserClassAttendance from "../pages/UserClassesTable";
import UserGymAttendance from "../pages/UserGymTable";

function UsersTabs() {
  return (
    <Container className="mt-4">
      <Tab.Container defaultActiveKey="musculacion">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="musculacion">Usuarios Musculación</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="clases">Usuarios Clases</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="musculacion">
            <UserGymAttendance/>
          </Tab.Pane>
          <Tab.Pane eventKey="clases">
            <UserClassAttendance/>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default UsersTabs;
