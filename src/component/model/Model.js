import React from 'react'
import { Button, Form } from "antd";
import Modal from "antd/lib/modal/Modal";

const DeleteModal = ({visibleModal,modalOk,modalCancel,onClickDeleteBtn,text}) => {
  return (
    <Modal
      title="Logout"
      visible={visibleModal}
      onOk={modalOk}
      onCancel={modalCancel}
      footer={null}
    >
      <Form>
        <h4>{text}</h4>
        <Form.Item
          // wrapperCol={{ offset: 8, span: 16 }}
          style={{
            display: "flex",
            justifyContent: "end",
            marginBottom: "0",
            marginTop: "20px",
          }}
        >
          <Button type="default" onClick={modalCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginLeft: "10px",
            }}
            onClick={onClickDeleteBtn}
          >
            DELETE
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DeleteModal