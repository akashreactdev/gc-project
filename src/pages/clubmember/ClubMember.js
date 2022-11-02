import React, { useEffect, useState } from "react";
import { BiBriefcase } from "react-icons/bi";
import LOGO from "../../assets/images/logogc.png"
import "../../App.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  DashboardOutlined,
  BarsOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Space,
  Table,
  Dropdown,
  Avatar,
  Select,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import Logout from "../../component/logout/Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../helper/Helper";

const { Option } = Select;

const { Header, Sider, Content } = Layout;

const ClubMember = () => {
  const { ids } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreateMember, setIsCreateMember] = useState(false);
  const [logOutModal, setLogOutModal] = useState(false);
  const [data, setData] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );
  const [loading, setLoading] = useState(false);
  const [removeMemberId, setRemoveMemberId] = useState("");

  const [leader, setLeader] = useState([]);
  const [leaderData, setLeaderData] = useState("");
  const [selectLeader, setSelectLeader] = useState([]);

  //modal
  const [visibleRemoveModal, setVisibleRemoveModal] = useState(false);
  const [visibleSetAsLeaderModal, setVisibleSetAsLeaderModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    getMemberData();
  }, []);

  console.log("leader++++",leader)

  //GET MEMBER API
  const getMemberData = () => {
    setLoading(true);
    fetch(`${API_URL}/api/member/getClubWiseMembers/${ids}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((item) => {
        setData(
          item.data.map((e, i) => {
            return {
              id: e._id,
              s_no: i + 1,
              name: (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <p>{e.name}</p>
                  {e.isLeader === 1 && (
                    <span
                      style={{
                        position: "absolute",
                        right: 0,
                        top: -10,
                        color: "green",
                        zIndex: 99,
                        fontSize: "12px",
                      }}
                    >
                      Leader
                    </span>
                  )}
                </div>
              ),
              filtercname: e.name,
              title: e.title,
              avtar: (
                <div>
                  <Avatar src={`${API_URL}/${e.profilepic}`}></Avatar>
                </div>
              ),
              idcard: (
                <div>
                  <Avatar src={`${API_URL}/${e.idcard}`}></Avatar>
                </div>
              ),
              phoneNo: e.phoneno,
              isLeader: e.isLeader,
            };
          })
        );
        setLoading(false);
      });
  };

  const setAsLeaderModal = (record) => {
    setLeaderData(record.id);
    setVisibleSetAsLeaderModal(true);
  };

  const onClickRemove = (record) => {
    setRemoveMemberId(record.id);
    setVisibleRemoveModal(true);
  };

  //REMOVE MEMBER API
  const onClickMember = () => {
    var urlencoded = new URLSearchParams();
    urlencoded.append("MemberId", removeMemberId);
    fetch(`${API_URL}/api/club/RemoveMemberInClub/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: urlencoded,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status === 200) {
          getMemberData();
          setVisibleRemoveModal(false);
          toast.success(data.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error(data.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //SET LEADER API
  const onclickSetLeader = () => {
    var urlencoded = new URLSearchParams();
    urlencoded.append("LeaderId", leaderData);
    urlencoded.append("ClubId", ids);

    fetch(`${API_URL}/api/club/SetMemberAsLeader`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: urlencoded,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status === 200) {
          getMemberData();
          setVisibleSetAsLeaderModal(false);
          toast.success(data.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error(data.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = [
    {
      title: "S.no",
      dataIndex: "s_no",
      sorter: {
        compare: (a, b) => a.s_no - b.s_no,
        multiple: 5,
      },
    },
    {
      title: "Member Name",
      dataIndex: "name",
      sorter: {
        compare: (c, d) => (c.name < d.name ? 1 : -1),
        multiple: 5,
      },
    },
    {
      title: "Member Title",
      dataIndex: "title",
      sorter: {
        compare: (e, f) => (e.title < f.title ? 1 : -1),
        multiple: 5,
      },
    },
    {
      title: "Profile Image",
      dataIndex: "avtar",
      // sorter: {
      //   compare: (c, d) => (c.cname < d.cname ? 1 : -1),
      //   multiple: 5,
      // },
    },
    {
      title: "Id Card",
      dataIndex: "idcard",
      // sorter: {
      //   compare: (c, d) => (c.cname < d.cname ? 1 : -1),
      //   multiple: 5,
      // },
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNo",
      sorter: {
        compare: (g, h) => g.phoneNo - h.phoneNo,
        multiple: 5,
      },
    },
    {
      title: "Operation",
      fixed: "right",
      width: 100,
      dataIndex: "action",
      render: (index, record) => (
        <Dropdown
          // onMenuClick={(e) => handleMenuClick(record, e)}
          overlay={
            <Menu
              // onClick={(e) => handleMenuClick(record, e)}
              items={[
                {
                  key: "1",
                  label: (
                    <>
                    {!record.isLeader &&
                    <Button
                      style={{ border: "none" }}
                      onClick={() => setAsLeaderModal(record)}
                      // disabled={record.isLeader === 1 && true}
                    >
                      Set As Leader
                    </Button>
                    }
                    </>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <Button
                      style={{ border: "none" }}
                      onClick={() => onClickRemove(record)}
                    >
                      Remove
                    </Button>
                  ),
                },
              ]}
            />
          }
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Button style={{ border: "none" }}>
                <BarsOutlined style={{ marginRight: 2 }} />
                <DownOutlined />
              </Button>
            </Space>
          </a>
        </Dropdown>
      ),
    },
  ];

  //FILTER MEMBER DATA
  const filterdata = data.filter((item) => {
    return (
      item.filtercname.toLocaleLowerCase().indexOf(search.toLowerCase()) !==
        -1 ||
      item.phoneNo.toLocaleLowerCase().indexOf(search.toLowerCase()) !== -1
    );
  });

  const onClickLogOutModal = () => {
    setLogOutModal(true);
  };

  const searchChangehandler = (events) => {
    setSearch(events.target.value);
  };

  const AddshowModal = () => {
    getMemberApi();
    setIsCreateMember(true);
  };


  //GET MEMBER API
  const getMemberApi = () => {
    fetch(`${API_URL}/api/member/getMembers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((item) => {
        setLeader(item.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const createMemberOk = () => {
    setIsCreateMember(false);
  };

  const createMemberCancel = () => {
    setSelectLeader([]);
    setIsCreateMember(false);
  };

  const onClickMemberModalClose = () => {
    setIsCreateMember(false);
  };

  //ADD MEMBER API
  const onClickCreateMember = () => {
    var raw = JSON.stringify({
      clubid: ids,
      MemberId: selectLeader,
    });

    fetch(`${API_URL}/api/club/AddMemberInClub`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: raw,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status === 200) {
          setIsCreateMember(false);
          toast.success(data.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setSelectLeader([]);
          getMemberData();
        } else {
          toast.error(data.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
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
          defaultSelectedKeys={["3"]}
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
              key: "5",
              icon: <BiBriefcase style={{fontSize:"18px"}} />,
              label: <Link to="/work">Work</Link>,
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: (
                <a href="javascript:void(0)" onClick={onClickLogOutModal}>
                  Logout
                </a>
              ),
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
              <Link>
                <TeamOutlined />
                &nbsp; Club Member
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              // minHeight: 360,
            }}
          >
            <span>
              <b style={{ fontSize: "15px", marginBottom: "20px" }}>Search</b>{" "}
              (Member name):
            </span>
            <div
              style={{
                display: "flex",
                marginBottom: "20px",
                marginTop: "10px",
              }}
            >
              <Input
                onChange={searchChangehandler}
                placeholder="Search team"
                value={search}
                style={{ marginRight: "10px" }}
              />
              <Button
                type="primary"
                onClick={AddshowModal}
                style={{ float: "right" }}
              >
                Add Member
              </Button>
            </div>
            <Table
              tableLayout="auto"
              scroll="unset"
              columns={columns}
              simple
              loading={loading}
              bordered
              style={{ overflowX: "scroll" }}
              dataSource={filterdata}
              pagination={{
                ...filterdata.pagination,
                showTotal: (total) => `Total ${total} Items:`,
              }}
            ></Table>
          </div>
        </Content>
      </Layout>
      <Modal
        title="Add Member"
        visible={isCreateMember}
        onOk={createMemberOk}
        onCancel={createMemberCancel}
        footer={null}
      >
        <Form labelCol={{ span: 6 }}>
          <Form.Item label="Select Member">
            <Select
              value={selectLeader}
              mode="tags"
              allowClear
              style={{
                width: "100%",
              }}
              onChange={(e) => setSelectLeader(e)}
            >
              {leader.map((item, index) => {
                return (
                  <>
                    <Option value={item._id} key={index}>
                      {item.name}
                    </Option>
                  </>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            // wrapperCol={{ offset: 8, span: 16 }}
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0",
              marginTop: "20px",
            }}
          >
            <Button type="default" onClick={onClickMemberModalClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginLeft: "10px",
              }}
              onClick={onClickCreateMember}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* component model */}
      <Logout
        visibleLogOutModal={logOutModal}
        onClickLogOutModelCancel={() => setLogOutModal(false)}
      />

      {/* set ad leader Modal */}
      <Modal
        title="Set Leader"
        visible={visibleSetAsLeaderModal}
        onOk={() => setVisibleSetAsLeaderModal(false)}
        onCancel={() => setVisibleSetAsLeaderModal(false)}
        footer={null}
      >
        <Form>
          <h4>Are you sure set leader</h4>
          <Form.Item
            // wrapperCol={{ offset: 8, span: 16 }}-
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0",
              marginTop: "20px",
            }}
          >
            <Button
              type="default"
              onClick={() => setVisibleSetAsLeaderModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginLeft: "10px",
              }}
              onClick={onclickSetLeader}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* remove Modal */}
      <Modal
        title="Remove Leader"
        visible={visibleRemoveModal}
        onOk={() => setVisibleRemoveModal(false)}
        onCancel={() => setVisibleRemoveModal(false)}
        footer={null}
      >
        <Form>
          <h4>Are you sure remove leader</h4>
          <Form.Item
            // wrapperCol={{ offset: 8, span: 16 }}
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0",
              marginTop: "20px",
            }}
          >
            <Button type="default" onClick={() => setVisibleRemoveModal(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginLeft: "10px",
              }}
              onClick={onClickMember}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ClubMember;
