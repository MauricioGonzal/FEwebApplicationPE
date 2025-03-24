import { Tab, Nav, Container } from "react-bootstrap";
import GymRoutineForm from "../pages/CreateRoutine";
import RoutineList from "./RoutineList";

function RoutineTabs() {
  return (
    <Container className="mt-4">
      <Tab.Container defaultActiveKey="crear">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="crear">Crear</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="clases">Rutinas</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="crear">
            <GymRoutineForm isCustomParam={0}/>
          </Tab.Pane>
          <Tab.Pane eventKey="clases">
            <RoutineList/>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default RoutineTabs;