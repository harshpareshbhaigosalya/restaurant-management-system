import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Image, ListGroup, Badge, Table } from "react-bootstrap";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

const ProfileDashboard = () => {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState("Profile Info");
  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("Software Developer | Tech Enthusiast");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const joinedDate = user?.metadata?.creationTime || "N/A";

  // Orders Section
  const [orders, setOrders] = useState([
    { id: 1, name: "Order #1001", status: "Completed", date: "2024-03-20" },
    { id: 2, name: "Order #1002", status: "Pending", date: "2024-03-22" },
  ]);
  
  const [newOrder, setNewOrder] = useState("");

  const handleUpdate = async () => {
    try {
      await updateProfile(user, { displayName: name, photoURL: photo });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  const addProject = () => {
    if (newProject) {
      setProjects([...projects, newProject]);
      setNewProject("");
    }
  };

  const addOrder = () => {
    if (newOrder) {
      setOrders([...orders, { id: orders.length + 1, name: newOrder, status: "Pending", date: new Date().toISOString().split("T")[0] }]);
      setNewOrder("");
    }
  };

  return (
    <Container fluid className="d-flex">
      {/* Sidebar */}
      <Col md={3} className="bg-light p-4 mt-4 border-end">
        <h4 className="mb-4">Dashboard</h4>
        <ListGroup>
          {["Profile Info", "Settings", "Projects", "Security", "Order History"].map((section) => (
            <ListGroup.Item
              key={section}
              action
              active={selectedSection === section}
              onClick={() => setSelectedSection(section)}
            >
              {section}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>

      {/* Main Content */}
      <Col md={9} className="p-4 mt-4 ">
        {selectedSection === "Profile Info" && (
          <Card className="p-4 shadow-sm">
            <h4>Profile Information</h4>
            <div className="text-center">
              <Image src={photo || "https://via.placeholder.com/150"} roundedCircle width={100} />
            </div>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Bio</Form.Label>
                <Form.Control as="textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} disabled />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control value={location} onChange={(e) => setLocation(e.target.value)} />
              </Form.Group>
              <Button className="mt-3" onClick={handleUpdate}>Save Changes</Button>
            </Form>
          </Card>
        )}

        {selectedSection === "Projects" && (
          <Card className="p-4 shadow-sm">
            <h4>Your Projects</h4>
            <Form.Group>
              <Form.Control placeholder="Enter project name" value={newProject} onChange={(e) => setNewProject(e.target.value)} />
              <Button className="mt-2" onClick={addProject}>Add Project</Button>
            </Form.Group>
            <ListGroup className="mt-3">
              {projects.map((project, index) => (
                <ListGroup.Item key={index}>{project}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        )}

{selectedSection === "Settings" && (
  <Card className="p-4">
    <h4>Account Settings</h4>
    
    {/* Change Email */}
    <Form.Group>
      <Form.Label>Change Email</Form.Label>
      <Form.Control type="email" placeholder="Enter new email" />
      <Button className="mt-2">Update Email</Button>
    </Form.Group>

    {/* Change Password */}
    <Form.Group className="mt-3">
      <Form.Label>Change Password</Form.Label>
      <Form.Control type="password" placeholder="Enter new password" />
      <Button className="mt-2">Update Password</Button>
    </Form.Group>

    {/* Notification Preferences */}
    <Form.Group className="mt-3">
      <Form.Label>Notification Preferences</Form.Label>
      <Form.Check type="switch" label="Email Notifications" />
      <Form.Check type="switch" label="SMS Notifications" />
    </Form.Group>

    {/* Dark Mode Toggle */}
    <Form.Group className="mt-3">
      <Form.Label>Theme</Form.Label>
      <Form.Check type="switch" label="Enable Dark Mode" />
    </Form.Group>

    {/* Delete Account */}
    <Button variant="danger" className="mt-3">Delete Account</Button>
  </Card>
)}

{selectedSection === "Security" && (
  <Card className="p-4">
    <h4>Security Settings</h4>

    {/* Two-Factor Authentication */}
    <Form.Group>
      <Form.Label>Two-Factor Authentication</Form.Label>
      <Form.Check type="switch" label="Enable 2FA" />
    </Form.Group>

    {/* Recent Logins */}
    <h5 className="mt-3">Recent Logins</h5>
    <ListGroup>
      <ListGroup.Item>Device: Chrome - Windows | Location: India</ListGroup.Item>
      <ListGroup.Item>Device: Safari - MacOS | Location: USA</ListGroup.Item>
    </ListGroup>

    {/* Trusted Devices */}
    <h5 className="mt-3">Trusted Devices</h5>
    <ListGroup>
      <ListGroup.Item>My Laptop (Added on: 2024-03-20)</ListGroup.Item>
      <ListGroup.Item>My Mobile (Added on: 2024-02-15)</ListGroup.Item>
    </ListGroup>

    {/* Account Recovery */}
    <Form.Group className="mt-3">
      <Form.Label>Account Recovery</Form.Label>
      <Form.Control type="text" placeholder="Enter recovery email" />
      <Button className="mt-2">Update Recovery Email</Button>
    </Form.Group>
  </Card>
)}


        {selectedSection === "Order History" && (
          <Card className="p-4 shadow-sm">
            <h4>Order History</h4>
            <p>
              <Badge bg="success">{orders.filter(order => order.status === "Completed").length}</Badge> Orders Completed
            </p>
            <Form.Group>
              <Form.Control placeholder="Enter order name" value={newOrder} onChange={(e) => setNewOrder(e.target.value)} />
              <Button className="mt-2" onClick={addOrder}>Add Order</Button>
            </Form.Group>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order Name</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.name}</td>
                    <td>
                      <Badge bg={order.status === "Completed" ? "success" : "warning"}>{order.status}</Badge>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </Col>
    </Container>
  );
};

export default ProfileDashboard;
