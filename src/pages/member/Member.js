import React, { useEffect, useRef, useState } from "react";
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
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../../component/logout/Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../component/model/Model";
import { API_URL } from "../../helper/Helper";

const { Header, Sider, Content } = Layout;

const Member = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreateMember, setIsCreateMember] = useState(false);
  const [isUpdateMember, setIsUpdateMember] = useState(false);
  const [memberModalInput, setMemberModalInput] = useState({
    mname: "",
    title: "",
    profileImage: null,
    idCardImage: null,
    phoneno: "",
  });
  const [editMemberModelInput, setEditMemberModalInput] = useState({
    id: "",
    ename: "",
    etitle: "",
    eprofilePic: "",
    eidCard: "",
    editProfilePic: null,
    editIdCardImage: null,
    ephoneno: "",
  });
  const [updateProfileImage, setUpdateProfileImage] = useState();
  const [updateIdCardImage, setUpdateIdCardImage] = useState();
  const updateProfileImageRef = useRef();
  const updateIdCardImageRef = useRef();
  const [logOutModal, setLogOutModal] = useState(false);
  const [data, setData] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState("");
  const [preview, setPreview] = useState();
  const [idCardImage, setIdCardImage] = useState();
  const profileImageRef = useRef();
  const IdCardImageRef = useRef();

  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate("/login")
    }
  },[])

  useEffect(() => {
    getMemberApi();
  }, []);

  useEffect(() => {
    if (!memberModalInput.profileImage) {
      setPreview(undefined);
      return;
    }
    const object = window.URL.createObjectURL(memberModalInput.profileImage);
    setPreview(object);
    return () => window.URL.revokeObjectURL(object);
  }, [memberModalInput.profileImage]);

  useEffect(() => {
    if (!memberModalInput.idCardImage) {
      setIdCardImage(undefined);
      return;
    }
    const object = window.URL.createObjectURL(memberModalInput.idCardImage);
    setIdCardImage(object);
    return () => window.URL.revokeObjectURL(object);
  }, [memberModalInput.idCardImage]);

  const getMemberApi = () => {
    setLoading(true);
    fetch(`${API_URL}/api/member/getMembersAdmin`, {
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
              name: e.name,
              title: e.title,
              avtar: (
                <div>
                  <Avatar
                    src={`${API_URL}/${e.profilepic}`}
                  ></Avatar>
                </div>
              ),
              idcard: (
                <div>
                  <Avatar
                    src={`${API_URL}/${e.idcard}`}
                  ></Avatar>
                </div>
              ),
              idCard: e.idcard,
              profilePic: e.profilepic,
              phoneNo: e.phoneno,
            };
          })
        );
        setLoading(false);
      });
  };

  const onChaneProfileImage = (e) => {
    setMemberModalInput({
      ...memberModalInput,
      profileImage: e.target.files[0],
    });
  };

  const onChangeIdCardImage = (e) => {
    setMemberModalInput({
      ...memberModalInput,
      idCardImage: e.target.files[0],
    });
  };

  useEffect(() => {
    if (!editMemberModelInput.editProfilePic) {
      setUpdateProfileImage(undefined);
      return;
    }
    const object = window.URL.createObjectURL(
      editMemberModelInput.editProfilePic
    );
    setUpdateProfileImage(object);
    return () => window.URL.revokeObjectURL(object);
  }, [editMemberModelInput.editProfilePic]);

  useEffect(() => {
    if (!editMemberModelInput.editIdCardImage) {
      setUpdateIdCardImage(undefined);
      return;
    }
    const object = window.URL.createObjectURL(
      editMemberModelInput.editIdCardImage
    );
    setUpdateIdCardImage(object);
    return () => window.URL.revokeObjectURL(object);
  }, [editMemberModelInput.editIdCardImage]);

  const onChangeUpdateProfileImage = (e) => {
    setEditMemberModalInput({
      ...editMemberModelInput,
      editProfilePic: e.target.files[0],
    });
  };

  const onChangeUpdateIdCardImage = (e) => {
    setEditMemberModalInput({
      ...editMemberModelInput,
      editIdCardImage: e.target.files[0],
    });
  };

  const updateModel = (record) => {
    setIsUpdateMember(true);
    setEditMemberModalInput({
      id: record.id,
      ename: record.name,
      etitle: record.title,
      eprofilePic: record.profilePic,
      eidCard: record.idCard,
      ephoneno: record.phoneNo,
    });
  };

  //OPEN DELETE MEMBER MODEL
  const onClickDeleteMember = (record) => {
    setVisible(true);
    setId(record.id);
  };

  //DELETE MEMBER
  const onClickDeleteBtn = () => {
    fetch(`${API_URL}/api/member/DeleteMember/${id}`, {
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
          toast.success(e.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          getMemberApi();
          setVisible(false);
        } else {
          toast.error(e.message, {
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
                    <Button
                      style={{ border: "none" }}
                      onClick={() => updateModel(record)}
                    >
                      Update
                    </Button>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <Button
                      style={{ border: "none" }}
                      onClick={() => onClickDeleteMember(record)}
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

  const filterdata = data.filter((item) => {
    return (item.name.toLocaleLowerCase().indexOf(search.toLowerCase()) !== -1 || 
     item.phoneNo.toLocaleLowerCase().indexOf(search.toLowerCase()) !== -1);
  });

  const onClickLogOutModal = () => {
    setLogOutModal(true);
  };

  const searchChangehandler = (events) => {
    setSearch(events.target.value);
  };

  const AddshowModal = () => {
    setIsCreateMember(true);
  };

  const createMemberOk = () => {
    setIsCreateMember(false);
    setMemberModalInput({
      mname: "",
      phoneno: "",
      title: "",
    });
    profileImageRef.current.value = "";
    IdCardImageRef.current.value = "";
    setPreview("");
    setIdCardImage("");
  };

  const createMemberCancel = () => {
    setIsCreateMember(false);
    setMemberModalInput({
      mname: "",
      phoneno: "",
      title: "",
    });
    profileImageRef.current.value = "";
    IdCardImageRef.current.value = "";
    setPreview("");
    setIdCardImage("");
  };

  const onClickMemberModalClose = () => {
    setIsCreateMember(false);
    setMemberModalInput({
      mname: "",
      phoneno: "",
      title: "",
    });
    profileImageRef.current.value = "";
    IdCardImageRef.current.value = "";
    setPreview("");
    setIdCardImage("");
  };

  const onChangeMemberName = (e) => {
    setMemberModalInput({ ...memberModalInput, mname: e.target.value });
  };

  const onChangeMemberTitle = (e) => {
    setMemberModalInput({ ...memberModalInput, title: e.target.value });
  };

  const onChangeMemberPhoneNo = (e) => {
    setMemberModalInput({ ...memberModalInput, phoneno: e.target.value });
  };

  const onClickSubmitBtn = () => {
    if (memberModalInput.mname.trim().length === 0) {
      toast.error("Please Input Member Name", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (memberModalInput.title.trim().length === 0) {
      toast.error("Please Input Member Title", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (memberModalInput.profileImage === null) {
      toast.error("Please Upload Profile image", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (memberModalInput.idCardImage === null) {
      toast.error("Please Upload Id Card image", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (memberModalInput.phoneno.length === 0) {
      toast.error("Please Input Member Phone Number", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      var formdata = new FormData();
      formdata.append("name", memberModalInput.mname);
      formdata.append("title", memberModalInput.title);
      formdata.append("profilepic", memberModalInput.profileImage);
      formdata.append("idcard", memberModalInput.idCardImage);
      formdata.append("phoneno", memberModalInput.phoneno);

      fetch(`${API_URL}/api/member/CreateMember`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formdata,
      })
        .then((res) => {
          return res.json();
        })
        .then((e) => {
          if (e.status === 200) {
            toast.success(e.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            getMemberApi();
            setIsCreateMember(false);
            setMemberModalInput({
              mname: "",
              phoneno: "",
              title: "",
            });
            profileImageRef.current.value = "";
            IdCardImageRef.current.value = "";
            setPreview("");
            setIdCardImage("");
          } else {
            toast.error(e.message, {
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
    }
  };

  const onClickUpdateMember = () => {
    if (editMemberModelInput.ename.trim().length === 0) {
      toast.error("Please Input Member Name", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (editMemberModelInput.etitle.trim().length === 0) {
      toast.error("Please Input Member Title", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } 
    // else if (editMemberModelInput.eprofilePic === ) {
    //   toast.error("Please Upload Profile image", {
    //     position: "top-right",
    //     autoClose: 1000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // } else if (editMemberModelInput.eidCard.length === 0) {
    //   toast.error("Please Upload Id Card image", {
    //     position: "top-right",
    //     autoClose: 1000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // } 
    else if (editMemberModelInput.ephoneno.length === 0) {
      toast.error("Please Input Member Phone Number", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      var formdata = new FormData();
      formdata.append("name", editMemberModelInput.ename);
      formdata.append("phoneno", editMemberModelInput.ephoneno);
      formdata.append("title", editMemberModelInput.etitle);
      {
        editMemberModelInput.editProfilePic &&
          formdata.append("profilepic", editMemberModelInput.editProfilePic);
      }
      {
        editMemberModelInput.editIdCardImage &&
          formdata.append("idcard", editMemberModelInput.editIdCardImage);
      }
    }
    fetch(
      `${API_URL}/api/member/EditMember/${editMemberModelInput.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formdata,
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((e) => {
        if (e.status === 200) {
          getMemberApi();
          toast.success(e.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setEditMemberModalInput({
            ename: "",
            etitle: "",
            ephoneno: "",
          });
          updateProfileImageRef.current.value = "";
          updateIdCardImageRef.current.value = "";
          setUpdateProfileImage("");
          setUpdateIdCardImage("");
          setIsUpdateMember(false);
        } else {
          toast.error(e.message, {
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

  const onClickCancelUpdateModel = () => {
    setEditMemberModalInput({
      ename: "",
      etitle: "",
      ephoneno: "",
    });
    updateProfileImageRef.current.value = "";
    updateIdCardImageRef.current.value = "";
    setUpdateProfileImage("");
    setUpdateIdCardImage("");
    setIsUpdateMember(false);
  };

  const onClickEditModalCancelBtn = () => {
    setEditMemberModalInput({
      ename: "",
      etitle: "",
      ephoneno: "",
    });
    updateProfileImageRef.current.value = "";
    updateIdCardImageRef.current.value = "";
    setUpdateProfileImage("");
    setUpdateIdCardImage("");
    setIsUpdateMember(false);
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
              <Link to="/">
                <UserOutlined />
                &nbsp; Member
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
            }}
          >
            <span>
              <b style={{ fontSize: "15px", marginBottom: "20px" }}>Search</b>{" "}
              (Member name, Phone No):
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
                Create Member
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
        title="Create Member"
        visible={isCreateMember}
        onOk={createMemberOk}
        onCancel={createMemberCancel}
        footer={null}
      >
        <Form labelCol={{ span: 6 }}>
          <Form.Item label="Name" style={{ width: "100%" }}>
            <Input
              value={memberModalInput.mname}
              onChange={onChangeMemberName}
            />
          </Form.Item>

          <Form.Item label="Title" style={{ width: "100%" }}>
            <Input
              value={memberModalInput.title}
              onChange={onChangeMemberTitle}
            />
          </Form.Item>

          <Form.Item label="Profile Image">
            <input
              type="file"
              onChange={onChaneProfileImage}
              ref={profileImageRef}
            />
            {preview && <img src={preview} height={30} width={30} />}
          </Form.Item>
          <Form.Item label="IdCard Image">
            <input
              type="file"
              onChange={onChangeIdCardImage}
              ref={IdCardImageRef}
            />
            {idCardImage && <img src={idCardImage} height={30} width={30} />}
          </Form.Item>
          <Form.Item label="Phone No" style={{ width: "100%" }}>
            <Input
              type="number"
              value={memberModalInput.phoneno}
              onChange={onChangeMemberPhoneNo}
            />
          </Form.Item>
          <Form.Item
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
              onClick={onClickSubmitBtn}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* updateModel start */}

      <Modal
        title="Update Member"
        visible={isUpdateMember}
        onOk={() => setIsUpdateMember(false)}
        onCancel={onClickCancelUpdateModel}
        footer={null}
      >
        <Form labelCol={{ span: 6 }}>
          <Form.Item label="Name" style={{ width: "100%" }}>
            <Input
              value={editMemberModelInput.ename}
              onChange={(e) =>
                setEditMemberModalInput({
                  ...editMemberModelInput,
                  ename: e.target.value,
                })
              }
            />
          </Form.Item>

          <Form.Item label="Title" style={{ width: "100%" }}>
            <Input
              value={editMemberModelInput.etitle}
              onChange={(e) =>
                setEditMemberModalInput({
                  ...editMemberModelInput,
                  etitle: e.target.value,
                })
              }
            />
          </Form.Item>

          <Form.Item label="Profile Image">
            <input
              type="file"
              onChange={onChangeUpdateProfileImage}
              ref={updateProfileImageRef}
            />
            <img
              src={
                updateProfileImage
                  ? updateProfileImage
                  : `${API_URL}/${editMemberModelInput.eprofilePic}`
              }
              height={30}
              width={30}
            />
          </Form.Item>
          <Form.Item label="IdCard Image">
            <input
              type="file"
              onChange={onChangeUpdateIdCardImage}
              ref={updateIdCardImageRef}
            />
            <img
              src={
                updateIdCardImage
                  ? updateIdCardImage
                  : `${API_URL}/${editMemberModelInput.eidCard}`
              }
              height={30}
              width={30}
            />
          </Form.Item>
          <Form.Item label="Phone No" style={{ width: "100%" }}>
            <Input
              type="number"
              value={editMemberModelInput.ephoneno}
              onChange={(e) =>
                setEditMemberModalInput({
                  ...editMemberModelInput,
                  ephoneno: e.target.value,
                })
              }
            />
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
            <Button type="default" onClick={onClickEditModalCancelBtn}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginLeft: "10px",
              }}
              onClick={onClickUpdateMember}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* updateModel end */}

      {/* component model */}
      <Logout
        visibleLogOutModal={logOutModal}
        onClickLogOutModelCancel={() => setLogOutModal(false)}
      />
      <DeleteModal
        visibleModal={visible}
        text="Are You Sure Delete Member "
        modalCancel={() => setVisible(false)}
        modalOk={() => setVisible(false)}
        onClickDeleteBtn={onClickDeleteBtn}
      />
    </Layout>
  );
};

export default Member;
