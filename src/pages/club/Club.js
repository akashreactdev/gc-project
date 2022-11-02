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
  BarsOutlined,
  DownOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Input,
  Layout,
  Menu,
  Modal,
  Form,
  Select,
  Space,
  Table,
  Dropdown,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../../component/logout/Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../component/model/Model";
import { API_URL } from "../../helper/Helper";
import ErrorToast from "../../component/error/ErrorToast";

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const Club = () => {
  // console.log("props++",props)
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [clubInput, setClubInput] = useState({
    cname: "",
    // profileImage: null,
    leader: "",
  });

  const [logOutModal, setLogOutModal] = useState(false);

  const onClickLogOutModal = () => {
    setLogOutModal(true);
  };

  const [leader, setLeader] = useState([]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [isCreateClubModal, setIsCreateClubModel] = useState(false);
  const [isEditCreateModal, setIsEditCreateModel] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    getClubData();
  }, []);

  const onClickClubName = (cid) => {
    navigate(`/clubmember/${cid}`);
  };

  const getClubData = () => {
    setLoading(true);
    fetch(`${API_URL}/api/club/getClubs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((e) => {
        setData(
          e.data.map((item, i) => {
            return {
              id: item._id,
              s_no: i + 1,
              cname: (
                <div
                  style={{ cursor: "pointer", width: "100%" }}
                  onClick={() => onClickClubName(item._id)}
                >
                  <p>{item.name}</p>
                </div>
              ),
              filtercname: item.name,
              // datetime:item.LeaderId
            };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleUpdateBtn = (record) => {
  //   setIsEditCreateModel(true);
  //   setClubInput({ cname: record.cname });
  // };

  const onClickEditSubmitBtn = () => {
    console.log(clubInput);
    setIsEditCreateModel(false);
  };

  const onClickDelteBtn = (record) => {
    setId(record.id);
    setVisible(true);
  };

  const onClickDeleteBtn = () => {
    fetch(`${API_URL}/api/club/DeleteClub/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    })
      .then((res) => {
        return res.json();
      })
      .then((e) => {
        if (e.status === 200) {
          getClubData();
          toast.success(e.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setVisible(false);
        }
      })
      .catch((error) => {
        console.log(error);
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
      title: "Club Name",
      dataIndex: "cname",
      sorter: {
        compare: (c, d) => (c.cname < d.cname ? 1 : -1),
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
          // onMenuClick={(e) => handleUpdate(record, e)}
          overlay={
            <Menu
              // onClick={(e) => handleMenuClick(record, e)}
              items={[
                // {
                //   key: "1",
                //   label: (
                //     <Button
                //       style={{ border: "none" }}
                //       onClick={() => handleUpdateBtn(record)}
                //     >
                //       Update
                //     </Button>
                //   ),
                // },
                {
                  key: "2",
                  label: (
                    <Button
                      style={{ border: "none" }}
                      onClick={() => onClickDelteBtn(record)}
                    >
                      Delete
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

  const AddshowModal = () => {
    getMemberApi();
    setIsCreateClubModel(true);
  };

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

  const searchChangehandler = (events) => {
    setSearch(events.target.value);
  };

  const createClubModalOk = () => {
    setIsCreateClubModel(false);
  };

  const createClubModalCancel = () => {
    setIsCreateClubModel(false);
  };

  const crateClubNameModalCancel = () => {
    setIsCreateClubModel(false);
  };

  const onChangeClubNameInput = (e) => {
    setClubInput({ ...clubInput, cname: e.target.value });
  };

  const handleChangeLeader = (e) => {
    setClubInput({ ...clubInput, leader: e });
  };

  const onClickCreateClubSubmitBtn = async () => {
    if (clubInput.cname.trim().length === 0) {
      // console.log("gjh")
      // <ErrorToast message="Please Input Club Name" />;
      toast.error("Please Input Club Name", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (clubInput.leader.trim().length === 0) {
      toast.error("Please Input Select Leader Name", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      var urlencoded = new URLSearchParams();
      urlencoded.append("name", clubInput.cname);
      urlencoded.append("LeaderId", clubInput.leader);
      await fetch(`${API_URL}/api/club/CreateClub`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: urlencoded,
      })
        .then((res) => {
          return res.json();
        })
        .then((e) => {
          if (e.status === 200) {
            getClubData();
            setIsCreateClubModel(false);
            toast.success(e.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setClubInput({
              cname: "",
              leader: "",
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const filterdata = data.filter((item) => {
    return (
      item.filtercname.toLocaleLowerCase().indexOf(search.toLowerCase()) !== -1
    );
  });

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
          defaultSelectedKeys={["2"]}
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
              icon: <BiBriefcase style={{fontSize:"18px"}} />,
              label: <Link to="/work">Work</Link>,
            },
            {
              key: "5",
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
              <Link to="/">
                <TeamOutlined />
                &nbsp; Club
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
              (Club name):
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
                Create Club
              </Button>
            </div>
            <Table
              tableLayout="auto"
              scroll="unset"
              columns={columns}
              simple
              loading={loading}
              bordered
              dataSource={filterdata}
              pagination={{
                ...filterdata.pagination,
                showTotal: (total) => `Total ${total} Items`,
              }}
            ></Table>
          </div>
        </Content>
      </Layout>
      <Modal
        title="Create Club"
        visible={isCreateClubModal}
        onOk={createClubModalOk}
        onCancel={createClubModalCancel}
        footer={null}
      >
        <Form
          labelCol={{ span: 6 }}
          //   wrapperCol={{ span: 18 }}
        >
          <Form.Item label="Club Name" style={{ width: "100%" }}>
            <Input value={clubInput.cname} onChange={onChangeClubNameInput} />
          </Form.Item>

          <Form.Item label="Select Leader">
            <Select
              value={clubInput.leader}
              style={{
                width: "100%",
              }}
              onChange={handleChangeLeader}
            >
              {leader.map((item, index) => {
                console.log(item);
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
            <Button type="default" onClick={crateClubNameModalCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginLeft: "10px",
              }}
              onClick={onClickCreateClubSubmitBtn}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* update Model */}
      <Modal
        title="Update Club"
        visible={isEditCreateModal}
        onOk={() => setIsEditCreateModel(false)}
        onCancel={() => setIsEditCreateModel(false)}
        footer={null}
      >
        <Form
          labelCol={{ span: 5 }}
          //   wrapperCol={{ span: 18 }}
        >
          <Form.Item label="Club Name" style={{ width: "100%" }}>
            <Input value={clubInput.cname} onChange={onChangeClubNameInput} />
          </Form.Item>

          {/* <Form.Item label="Select Leader">
            <Select
              value={clubInput.leader}
              style={{
                width: "100%",
              }}  
              onChange={handleChangeLeader}
            >
              {leader.map((item, index) => {
                return (
                  <>
                    <Option value={item.name}>{item.name}</Option>
                  </>
                );
              })}
            </Select>
          </Form.Item> */}

          <Form.Item
            // wrapperCol={{ offset: 8, span: 16 }}
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0",
              marginTop: "20px",
            }}
          >
            <Button type="default" onClick={() => setIsEditCreateModel(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginLeft: "10px",
              }}
              onClick={onClickEditSubmitBtn}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* component */}
      <Logout
        visibleLogOutModal={logOutModal}
        onClickLogOutModelCancel={() => setLogOutModal(false)}
      />
      <DeleteModal
        visibleModal={visible}
        onClickDeleteBtn={onClickDeleteBtn}
        modalCancel={() => setVisible(false)}
        modalOk={() => setVisible(false)}
      />
    </Layout>
  );
};

export default Club;
