import { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import ClientGymDashboard from "./ClientGymDashboard";
import ClientClassesDashboard from "./ClientClassesDashboard";

const ClientBothDashboard = () => {
  const [activeTab, setActiveTab] = useState("gym");

  return (
    <Container className="mt-3">
      <Tabs
        id="gym-dashboard-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3 d-flex justify-content-center"
      >
        <Tab eventKey="gym" title="🏋️ Gimnasio">
            <ClientGymDashboard/>
        </Tab>
        <Tab eventKey="classes" title="🎟️ Clases Extra">
            <ClientClassesDashboard/>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default ClientBothDashboard;