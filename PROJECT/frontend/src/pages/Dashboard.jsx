import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup, Image } from "react-bootstrap";
import { FaUser, FaSignOutAlt, FaCog, FaChartLine, FaUsers, FaTasks, FaDollarSign, FaClipboardList } from "react-icons/fa";
import Chart from "react-apexcharts"; // Import ApexCharts for graphs
import "./Dashboard.css"; // Custom styling

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Container fluid className="dashboard_container">
    {/* Sidebar */}
    <div className="sidebar fixed-sidebar">
      <h4 className="text-center">Dashboard</h4>
      <ListGroup variant="flush" className="mt-3">
        <ListGroup.Item action>
          <FaChartLine className="me-2" /> Overview
        </ListGroup.Item>
        <ListGroup.Item action>
          <FaUsers className="me-2" /> Users
        </ListGroup.Item>
        <ListGroup.Item action>
          <FaTasks className="me-2" /> Tasks
        </ListGroup.Item>
        <ListGroup.Item action>
          <FaCog className="me-2" /> Settings
        </ListGroup.Item>
        <ListGroup.Item action className="text-danger" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Logout
        </ListGroup.Item>
      </ListGroup>
    </div>
  
    {/* Main Dashboard Content */}
    <Container className="dashboard-content" style={{ paddingLeft: `calc(var(--bs-gutter-x) * 3.2)` }}>
      <Row>
        <Col md={12}>
          <h2 className="mb-3">Welcome, {user?.email}!</h2>
        </Col>
      </Row>

        {/* Stats Section */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <FaUsers className="fs-2 text-primary" />
                <h5 className="mt-2">Total Users</h5>
                <p className="fs-4">1,245</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <FaChartLine className="fs-2 text-success" />
                <h5 className="mt-2">Monthly Growth</h5>
                <p className="fs-4">+12.8%</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <FaTasks className="fs-2 text-warning" />
                <h5 className="mt-2">Tasks Completed</h5>
                <p className="fs-4">328</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <FaDollarSign className="fs-2 text-danger" />
                <h5 className="mt-2">Revenue</h5>
                <p className="fs-4">$5,730</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5>User Growth</h5>
                <Chart
                  type="line"
                  options={{
                    chart: { id: "user-growth" },
                    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May"] },
                  }}
                  series={[{ name: "Users", data: [500, 750, 900, 1200, 1500] }]}
                  height={250}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5>Revenue Breakdown</h5>
                <Chart
                  type="pie"
                  options={{ labels: ["Product A", "Product B", "Product C"] }}
                  series={[40, 30, 30]}
                  height={250}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Profile & Quick Actions */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <Image
                  src={user?.photoURL || "https://via.placeholder.com/80"}
                  roundedCircle
                  width={80}
                  height={80}
                  className="me-3"
                />
                <div>
                  <h5>{user?.displayName || "User"}</h5>
                  <p className="text-muted">{user?.email}</p>
                  <Button variant="outline-primary" size="sm" onClick={() => navigate("/profile")}>
                    Update Profile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5>Quick Actions</h5>
                <div className="d-flex gap-2">
                  <Button variant="success" size="sm">
                    Add User
                  </Button>
                  <Button variant="info" size="sm">
                    View Reports
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Dashboard;
