import React, { useEffect, useState } from "react";
import "../../App.css";
import LOGO from "../../assets/images/logogc.png"
import { BiBriefcase } from "react-icons/bi";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Card, Col, Layout, Menu, Row } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Logout from "../../component/logout/Logout";
import { API_URL } from "../../helper/Helper";
const { Header, Sider, Content } = Layout;

//icon

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [logOutModal, setLogOutModal] = useState(false);
  
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );
  const [totalData, setTotalData] = useState({
    club: "",
    member: "",
    work: "",
  });

  const navigate = useNavigate()

  useEffect(()=>{
    if(!token){
      navigate("/login")
    }
  },[])

  useEffect(() => {
    getTotal();
  }, []);

  const getTotal = () => {
    fetch(`${API_URL}/api/work/getTotalWorkMember`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((e) => {
        e.data.map((item) => {
          setTotalData({
            club: item.clubs,
            member: item.members,
            work: item.works,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onClickLogOutModal = () => {
    setLogOutModal(true);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{ position: "sticky", height: "100vh", top: "0" }}
      >
        <div className="logo">
          {/* <p className="logoText">GC</p> */}
          <img src={LOGO} height={30} width={30} className="logoText"/>
        </div>
        <Menu
          style={{ padding: "24px 0px" }}
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: "2",
              icon: <TeamOutlined />,
              label: <Link to="/club">Club</Link>,
            },
            {
              key: "3",
              icon: <UserOutlined />,
              label: <Link to="/member">Member</Link>,
            },
            {
              key: "4",
              icon: <BiBriefcase style={{fontSize:"18px"}}/>,
              label: <Link to="/work">Work</Link>,
            },
            {
              key: "5",
              icon: <LogoutOutlined />,
              label: <a onClick={onClickLogOutModal}>Logout</a>
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: "0px 20px",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content className="main-content">
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>
              <Link to="/">
                <DashboardOutlined />
                &nbsp; Dashboard
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-card-wrapper">
            <Row gutter={24}>
              <Col lg={6} md={12} sm={12}>
                <Card hoverable bordered={false} style={{marginTop:"10px",padding:"10px"}}>
                  <Link to="/club">
                    <div style={{ display: "flex" }}>
                      <div>
                        {" "}
                        <UserOutlined style={{ fontSize: "54px" }} />
                      </div>  
                      <div style={{ marginLeft: "15px", color: "#929292d9" }}>
                        <h2 style={{ color: "#929292d9" }}>Club</h2>
                        <p className="text-overflow-p">{totalData.club}</p>
                      </div>
                    </div>
                  </Link>
                </Card>
              </Col>
              <Col lg={6} md={12} sm={12}>
                <Card hoverable bordered={false} style={{marginTop:"10px",padding:"10px"}}>
                  <Link to="/member">
                    <div style={{ display: "flex" }}>
                      <div>
                        <TeamOutlined style={{ fontSize: "54px" }} />
                      </div>
                      <div style={{ marginLeft: "15px", color: "#929292d9" }}>
                        <h2 style={{ color: "#929292d9" }}>Member</h2>
                        <p className="text-overflow-p">{totalData.member}</p>
                      </div>
                    </div>
                  </Link>
                </Card>
              </Col>
              <Col lg={6} md={12} sm={12}>
                <Card hoverable bordered={false} style={{marginTop:"10px",padding:"10px"}}>
                  <Link to="/work">
                    <div style={{ display: "flex" }}>
                      <div>
                        <BiBriefcase style={{ fontSize: "50px" }} />
                      </div>
                      <div style={{ marginLeft: "15px", color: "#929292d9" }}>
                        <h2 style={{ color: "#929292d9" }}>Work</h2>
                        <p className="text-overflow-p">{totalData.work}</p>
                      </div>
                    </div>
                  </Link>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
      <Logout
        visibleLogOutModal={logOutModal}
        onClickLogOutModelCancel={() => setLogOutModal(false)}
      />
    </Layout>
  );
};

export default Dashboard;
