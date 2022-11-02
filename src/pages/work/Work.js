import React, { useEffect, useRef, useState } from "react";
import LOGO from "../../assets/images/logogc.png";
import { BiBriefcase } from "react-icons/bi";
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
  Table,
  Dropdown,
  Space,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../../component/logout/Logout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../component/model/Model";
import ReactHtmlParser from "react-html-parser";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { API_URL } from "../../helper/Helper";

const { Header, Sider, Content } = Layout;
// const { Option, OptGroup } = Select;

const Work = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [workname, setWorkName] = useState("");
  const [workVideo, setWorkVideo] = useState(null);
  const [workhtml, setWorkHtml] = useState("");
  const [logOutModal, setLogOutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );
  const [isCreateWorkModal, setIsWorkModal] = useState(false);
  const [data, setData] = useState([]);
  const [visibelDeleteModal, setVisibleDaleteModal] = useState(false);
  const [deleteWorkId, setDeleteWorkId] = useState("");
  const [isUpdateWork, setIsUpdateWork] = useState(false);
  const [editWorkId, setEditWorkId] = useState("");
  const [editWorkName, setEditWorkName] = useState("");
  const [editWorkVideo, setEditWorkVideo] = useState("");
  const [editWorkHtml, setEditWorkHtml] = useState("");
  const [editVideo, setEditVideo] = useState(null);

  const [updateVideoPreview, setUpdateVideoPreview] = useState("");
  const [viewContentModal, setViewContentModal] = useState(false);
  const [viewHtmlContent, setViewHtmlContent] = useState("");
  const updateVideoRef = useRef();
  const videoRef = useRef();
  const [videoPreview, setVidePreview] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    getWorkData();
  }, []);

  useEffect(() => {
    if (!workVideo) {
      setVidePreview(undefined);
      return;
    }
    const object = window.URL.createObjectURL(workVideo);
    setVidePreview(object);
    return () => window.URL.revokeObjectURL(object);
  }, [workVideo]);

  useEffect(() => {
    if (!editVideo) {
      setUpdateVideoPreview(undefined);
      return;
    }
    const object = window.URL.createObjectURL(editVideo);
    setUpdateVideoPreview(object);
    return () => window.URL.revokeObjectURL(object);
  }, [editVideo]);

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
      title: "Work Name",
      dataIndex: "wname",
      sorter: {
        compare: (c, d) => (c.cname < d.cname ? 1 : -1),
        multiple: 5,
      },
    },
    {
      title: "Work Video",
      dataIndex: "wvideo",
      // sorter: {
      //   compare: (c, d) => (c.cname < d.cname ? 1 : -1),
      //   multiple: 5,
      // },
    },
    {
      title: "Html Content",
      dataIndex: "whtml",
      // sorter: {
      //   compare: (c, d) => (c.cname < d.cname ? 1 : -1),
      //   multiple: 5,
      // },
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
                {
                  key: "1",
                  label: (
                    <Button
                      style={{ border: "none" }}
                      onClick={() => onClickUpdateWork(record)}
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
                      onClick={() => onClickDeleteWork(record)}
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

  const onClickViewContent = (content) => {
    setViewHtmlContent(content);
    setViewContentModal(true);
  };

  const getWorkData = async () => {
    setLoading(true);
    await fetch(`${API_URL}/api/work/getAllAdminWorks`, {
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
              wname: e.name,
              wvideo: (
                <>
                  {e.video ? (
                    <video height={100} width={200} controls key={e.video}>
                      <source src={`${API_URL}/${e.video}`} type="video/mp4" />
                    </video>
                  ) : (
                    "No Video Found"
                  )}
                </>
              ),
              video: e.video,
              html: e.htmlContant,
              whtml: (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* {ReactHtmlParser(e.htmlContant)} */}
                    <Button onClick={() => onClickViewContent(e.htmlContant)}>
                      View Content
                    </Button>
                  </div>
                </>
              ),
            };
          })
        );
        setLoading(false);
      });
  };

  const filterData = data.filter((item) => {
    return item.wname.toLocaleLowerCase().indexOf(search.toLowerCase()) !== -1;
  });

  const onClickUpdateWork = (record) => {
    setIsUpdateWork(true);
    setEditWorkId(record.id);
    setEditWorkName(record.wname);
    setEditWorkVideo(record.video);
    setEditWorkHtml(record.html);
  };

  const onClickDeleteWork = (record) => {
    setDeleteWorkId(record.id);
    setVisibleDaleteModal(true);
  };

  const onClickLogOutModal = () => {
    setLogOutModal(true);
  };

  const AddshowModal = () => {
    setIsWorkModal(true);
  };

  const searchChangehandler = (events) => {
    setSearch(events.target.value);
  };

  const createClubModalOk = () => {
    setIsWorkModal(false);
  };

  const createClubModalCancel = () => {
    setWorkName("");
    setWorkHtml("");
    videoRef.current.value = "";
    setVidePreview(null);
    setIsWorkModal(false);
  };

  const onChangeVideoUpload = (e) => {
    setWorkVideo(e.target.files[0]);
  };

  const onClickCancelUpdateWork = () => {
    setEditWorkName("");
    setEditWorkHtml("");
    updateVideoRef.current.value = "";
    setUpdateVideoPreview("");
    setIsUpdateWork(false);
  };

  const handleUpdateWork = () => {
    if (editWorkName.trim().length === 0) {
      toast.error("Please Input Work Name", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (editWorkHtml.trim().length == 0) {
      toast.error("Please Input Html Content", {
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
      formdata.append("name", editWorkName);
      formdata.append("video", editVideo);
      formdata.append("htmlContant", editWorkHtml);

      fetch(`${API_URL}/api/work/EditWork/${editWorkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formdata,
      })
        .then((res) => {
          return res.json();
        })
        .then((e) => {
          if (e.status === 200) {
            setIsUpdateWork(false);
            getWorkData();
            toast.success(e.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            // if(window.location.reload(true)){
            setEditWorkName("");
            setEditWorkHtml("");
            updateVideoRef.current.value = "";
            setUpdateVideoPreview("");
            // }
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

  const onChangeUpdateVideo = (e) => {
    setEditVideo(e.target.files[0]);
  };

  //CREATE WORK API
  const onClickSubmitCreateWorkModal = () => {
    if (workname.trim().length === 0) {
      toast.error("Please Input Work Name", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (workhtml == "") {
      toast.error("Please Input Html Content", {
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
      formdata.append("name", workname);
      formdata.append("video", workVideo);
      formdata.append("htmlContant", workhtml);
      fetch(`${API_URL}/api/work/CreateWork`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formdata,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === 200) {
            setIsWorkModal(false);
            getWorkData();

            toast.success(data.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setWorkName("");
            setWorkHtml("");
            videoRef.current.value = "";
            setVidePreview("");
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
    }
  };

  const onClickDeleteButton = () => {
    fetch(`${API_URL}/api/work/DeleteWork/${deleteWorkId}`, {
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
          setVisibleDaleteModal(false);
          getWorkData();
          toast.success(e.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
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
      });
  };

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("Image", file);
            // let headers = new Headers();
            // headers.append("Origin", "http://localhost:3000");
            fetch(`${API_URL}/api/work/AddImageCkEditor`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              method: "post",
              body: body,
              // mode: "no-cors"
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({
                  default: `${API_URL}/${res.data}`,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      let data = uploadAdapter(loader);
      return data;
    };
  }

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
          <img src={LOGO} height={30} width={30} className="logoText" />
        </div>
        <Menu
          style={{ padding: "24px 0px" }}
          mode="inline"
          defaultSelectedKeys={["4"]}
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
              icon: <BiBriefcase style={{ fontSize: "18px" }} />,
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
            <Breadcrumb.Item className="workflow">
              <BiBriefcase style={{ fontSize: "18px" }} />
              &nbsp; Work
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
              (Work name):
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
                Create Work
              </Button>
            </div>
            <Table
              tableLayout="auto"
              scroll="unset"
              simple
              bordered
              loading={loading}
              columns={columns}
              dataSource={filterData}
              pagination={{
                ...filterData.pagination,
                showTotal: (total) => `Total ${total} Items`,
              }}
            ></Table>
          </div>
        </Content>
      </Layout>

      {/* CREATE WORK */}
      <Modal
        title="Create Work"
        visible={isCreateWorkModal}
        onOk={createClubModalOk}
        onCancel={createClubModalCancel}
        footer={null}
      >
        <Form
          labelCol={{ span: 6 }}
          //   wrapperCol={{ span: 18 }}
        >
          <Form.Item label="Name" style={{ width: "100%" }}>
            <Input
              value={workname}
              onChange={(e) => setWorkName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Upload Video" style={{ width: "100%" }}>
            <div>
              <input
                type="file"
                ref={videoRef}
                onChange={onChangeVideoUpload}
              />
              {videoPreview && (
                <video
                  width={"100%"}
                  height={100}
                  controls
                  style={{ cursor: "pointer", marginTop: "10px" }}
                  key={videoPreview}
                >
                  <source src={videoPreview} type="video/mp4" />
                </video>
              )}
            </div>
          </Form.Item>

          <Form.Item label="HTML Content" style={{ width: "100%" }}></Form.Item>
          <CKEditor
            config={{
              extraPlugins: [uploadPlugin],
            }}
            editor={Editor}
            data={workhtml}
            style={{ height: "200px" }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setWorkHtml(data);
              // setWorkInput({...workInput,html:data})
            }}
          />
          <Form.Item
            // wrapperCol={{ offset: 8, span: 16 }}
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0",
              marginTop: "20px",
            }}
          >
            <Button type="default" onClick={createClubModalCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginLeft: "10px",
              }}
              onClick={onClickSubmitCreateWorkModal}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* UPDATE WORK */}
      {/* updateModel start */}
      <Modal
        title="Update Work"
        visible={isUpdateWork}
        onOk={() => setIsUpdateWork(false)}
        onCancel={onClickCancelUpdateWork}
        footer={null}
      >
        <Form labelCol={{ span: 6 }}>
          <Form.Item label="Name" style={{ width: "100%" }}>
            <Input
              value={editWorkName}
              onChange={(e) =>
                setEditWorkName(e.target.value)
              }
            />
          </Form.Item>

          <Form.Item label="Upload Video" style={{ width: "100%" }}>
            <div>
              <input
                type="file"
                ref={updateVideoRef}
                onChange={onChangeUpdateVideo}
              />
              <video
                width={"100%"}
                height={100}
                controls
                style={{ cursor: "pointer", marginTop: "10px" }}
                key={updateVideoPreview ? updateVideoPreview : editWorkVideo}
              >
                <source
                  src={
                    updateVideoPreview
                      ? updateVideoPreview
                      : `${API_URL}/${editWorkVideo}`
                  }
                  type="video/mp4"
                />
              </video>
            </div>
          </Form.Item>

          <Form.Item label="HTML Content" style={{ width: "100%" }}></Form.Item>
          <CKEditor
            config={{
              extraPlugins: [uploadPlugin],
            }}
            editor={Editor}
            data={editWorkHtml}
            style={{ height: "200px" }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditWorkHtml(data);
            }}
          />
          <Form.Item
            // wrapperCol={{ offset: 8, span: 16 }}
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0",
              marginTop: "20px",
            }}
          >
            <Button type="default" onClick={onClickCancelUpdateWork}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginLeft: "10px",
              }}
              onClick={handleUpdateWork}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* updateModel end */}

      {/* View Html Content in Modal */}
      <Modal
        title="View Html Content"
        visible={viewContentModal}
        onCancel={() => setViewContentModal(false)}
        onOk={() => setViewContentModal(false)}
        footer={null}
      >
        <Form>
          {ReactHtmlParser(viewHtmlContent)}
          <Form.Item
            // wrapperCol={{ offset: 8, span: 16 }}
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0",
              marginTop: "20px",
            }}
          >
            <Button type="default" onClick={() => setViewContentModal(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
      <Logout
        visibleLogOutModal={logOutModal}
        onClickLogOutModelCancel={() => setLogOutModal(false)}
      />
      <DeleteModal
        modalCancel={() => setVisibleDaleteModal(false)}
        modalOk={() => setVisibleDaleteModal(false)}
        onClickDeleteBtn={onClickDeleteButton}
        text="Are You Sure Delete Work"
        visibleModal={visibelDeleteModal}
      />
    </Layout>
  );
};

export default Work;
