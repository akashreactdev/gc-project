import React from 'react'
import { toast } from "react-toastify";


const ErrorToast = (props) => {
  console.log("message",props.message)
  return (
    toast.error(props.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
  )
}

export default ErrorToast