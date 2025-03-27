import { Tab, Nav, Container } from "react-bootstrap";
import OverduePayments from "../pages/OverduePayments";
import PaymentsList from "../pages/PaymentsList";

function PaymentTabs() {
  return (
    <Container className="mt-4">
      <Tab.Container defaultActiveKey="crear">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="crear">Abonadas</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="clases">Vencidas</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="crear">
            <PaymentsList/>
          </Tab.Pane>
          <Tab.Pane eventKey="clases">
            <OverduePayments/>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default PaymentTabs;