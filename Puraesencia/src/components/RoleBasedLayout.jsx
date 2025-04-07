import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';

import AdminNav from "./AdminNav";
import EmployeeNav from "./EmployeeNav";
import ClientClassesNav from "./ClientClassesNav";
import ClientBothNav from "./ClientBothNav";
import TrainerNav from "./TrainerNav";
import ClientGymNav from "./ClientGymNav";
import api from "../Api";

const RoleBasedLayout = () => {
  const navigate = useNavigate();
  const [clientArea, setClientArea] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
      setUserId(decoded.id);
      if (decoded.role !== "CLIENT") {
        setLoading(false);
      }
    } catch (error) {
      console.error("Token inválido", error);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchClientArea = async () => {
      if (role === "CLIENT" && userId) {
        try {
          const response = await api.get("/area/" + userId);
          const areas = response.data || [];
          const areaNames = areas.map(area => area.name);

          if (areaNames.includes("Musculacion") && areaNames.includes("Clases")) {
            setClientArea("CLIENT_BOTH");
          } else if (areaNames.includes("Musculacion")) {
            setClientArea("CLIENT_GYM");
          } else if (areaNames.includes("Clases")) {
            setClientArea("CLIENT_CLASSES");
          } else {
            setClientArea("NONE");
          }
        } catch (error) {
          console.error("Error al obtener área", error);
          setClientArea("NONE");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClientArea();
  }, [role, userId]);

  const getNavbar = () => {
    switch (role) {
      case "ADMIN":
        return <AdminNav />;
      case "RECEPTIONIST":
        return <EmployeeNav />;
      case "TRAINER":
        return <TrainerNav />;
      case "CLIENT":
        switch (clientArea) {
          case "CLIENT_GYM":
            return <ClientGymNav />;
          case "CLIENT_CLASSES":
            return <ClientClassesNav />;
          case "CLIENT_BOTH":
            return <ClientBothNav />;
          default:
            return null;
        }
      default:
        return null;
    }
  };

  if (loading || (role === "CLIENT" && clientArea === null)) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {getNavbar()}
      <Outlet />
    </div>
  );
};

export default RoleBasedLayout;
