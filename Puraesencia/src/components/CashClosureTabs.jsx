import { Tab, Nav, Container } from "react-bootstrap";
import CreateMonthlyClosure from "../pages/CreateMonthlyCashClosure";
import MonthlyClosures from "../pages/MonthlyClosures"

function CashClosureTabs() {
  return (
    <Container className="mt-4">
      <Tab.Container defaultActiveKey="musculacion">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="musculacion">Crear</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="clases">Cierres Mensuales</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="musculacion">
            <CreateMonthlyClosure/>
          </Tab.Pane>
          <Tab.Pane eventKey="clases">
            <MonthlyClosures />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default CashClosureTabs;