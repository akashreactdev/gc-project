import React from "react";
import { Button, Form } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useNavigate } from "react-router-dom";

const Logout = ({ visibleLogOutModal, onClickLogOutModelCancel }) => {
  const navigate = useNavigate();

  const onClickSubmitBtn = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Modal
      title="Logout"
      visible={visibleLogOutModal}
      onOk={onClickLogOutModelCancel}
      onCancel={onClickLogOutModelCancel}
      footer={null}
    >
      <Form>
        <h4>Are you sure logout</h4>
        <Form.Item
          // wrapperCol={{ offset: 8, span: 16 }}
          style={{
            display: "flex",
            justifyContent: "end",
            marginBottom: "0",
            marginTop: "20px",
          }}
        >
          <Button type="default" onClick={onClickLogOutModelCancel}>
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
            Logout
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Logout;
