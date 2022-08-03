import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { MdOutlineEmail } from "react-icons/md";
import { BiPhoneCall } from "react-icons/bi";
import axios from "axios";
import swal from "sweetalert";
import { ProgressBar } from "react-bootstrap";
import { BsFillCameraFill } from "react-icons/bs";
import { FcOpenedFolder } from "react-icons/fc";
const shell = window.require("electron").shell;
const nodeDiskInfo = window.require("node-disk-info");
const fs = window.require("fs");
const path = window.require("path");
const log = window.require("electron-log");
const uploadimg = log.scope("Upload Image");

const Uploadphotos = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImages, setShowImages] = useState([]);
  const [apiImages, setApiImages] = useState([]);
  const [token, setToken] = useState("");
  const [eventId, setEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientDetail, setClientDetail] = useState([]);
  const [progress, setProgress] = useState(0);
  const [subscribeValidated, setSubscribeValidated] = useState("");
  const [diskInfo, setDiskInfo] = useState([]);
  const [allDiskInfo, setAllDiskInfo] = useState([]);
  const [showDisks, setShowDisks] = useState(false);

  let navigate = useNavigate();
  let location = useLocation();
  const event = location.state;

  const leftIcon = () => {
    navigate("/allproject");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("we are running on the client");
      setToken(localStorage.getItem("token"));
      let event = JSON.parse(localStorage.getItem("event"));
      let tok = localStorage.getItem("token");
      console.log(tok);
      console.log(event);
      getPackageAccount(tok);
      if (event !== null) {
        console.log(event._id);
        setEventId(event._id);
      }
      let user = JSON.parse(localStorage.getItem("client"));
      console.log(user);
      if (location.state !== null) {
        getUploadPhotos(localStorage.getItem("token"), location.state);
        console.log(location.state);
      } else {
        getUploadPhotos(localStorage.getItem("token"), event._id);
      }
      if (location.state !== null) {
        setEventId(location.state);
      }
    } else {
      console.log("we are running on the server");
    }
  }, [eventId]);

  useEffect(
    () => () => {
      showImages.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [showImages]
  );

  // Image Change Function
  const imageHandleChange = (e) => {
    console.log(e.target.files);
    if (subscribeValidated == false) {
      if (e.target.files.length <= 1000) {
        const fileArray = Array.from(e.target.files).map((file) => file);
        const showImageArray = Array.from(e.target.files).map((file) =>
          URL.createObjectURL(file)
        );
        console.log(fileArray);
        setShowImages(showImageArray);
        setSelectedImages((prevIages) => prevIages.concat(fileArray));
        setShowImages((prevIages) => prevIages.concat(showImages));
        Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
      } else {
        log.warn(
          `Only 1000 images Allowed... Please Subscribe to Upload a more Images`
        );
        swal({
          title: "warning",
          text: "Only 1000 images Allowed... Please Subscribe to Upload a more Images",
          icon: "warning",
          button: "OK!",
        });
        setTimeout(() => {
          shell.openExternal("http://imageproof.ai/");
        }, 3000);
      }
    } else {
      const fileArray = Array.from(e.target.files).map((file) => file);
      const showImageArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      console.log(fileArray);
      setShowImages(showImageArray);
      setSelectedImages((prevIages) => prevIages.concat(fileArray));
      setShowImages((prevIages) => prevIages.concat(showImages));
      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }
  };

  const uploadPhotosDisclaimerConfirm = (e) => {
    e.preventDefault();
    const message = `Please note that, if the path of the images is changed, or the name of the image is changed after uploading has been completed, we will not be able to recover the same. We request you to maintain the same path.<hr><p><strong>Team Image Proof</p></strong>`;
    swal({
      title: "Dear User",
      content: {
        element: "div",
        attributes: {
          innerHTML: `${message}`,
        },
      },
      icon: "info",
      // showCancelButton: true,
      // confirmButtonClass: "btn-danger",
      confirmButtonText: "Confirm",
      // cancelButtonText: "No, cancel plx!",
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((isConfirm) => {
      if (isConfirm) {
        console.log("Disclaimer confirmed");
        log.info(`Photos Uploaded Successfully`);
        uploadPhotos();
      } else {
        log.info("Didn't confirmed the disclaimer");
        console.log("Didn't confirmed the disclaimer");
      }
    });
  };

  // Upload Function
  const uploadPhotos = async () => {
    console.log("after confirm is running");
    const images = selectedImages;
    uploadimg.info();
    setLoading(true);
    console.log(images);
    log.info("Path disclaimer accepted");
    if (images.length > 0) {
      log.info(
        `Event Name: ${clientDetail.eventName} - Event id: ${clientDetail._id} - Project id: ${clientDetail.projectId} - Client Email:${clientDetail.clientEmail}`
      );
      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append(`files`, images[i]);
        let path = images[i].path;

        path = path.split(`Original`);
        console.log(path);
        try {
          const { data } = await axios.put(
            `https://beta.imageproof.ai/api/upload_images/${token}/${eventId}/${path[0]}Original`,
            formData
          );
          if (data.success) {
            console.log(`image uploaded ${i}`);
            let p = Math.round(((i + 1) * 100) / images.length);
            log.info(`Image Uploaded: ${i + 1}`);
            setProgress(p);
            setApiImages(data.event.uploadedImages);
          }
        } catch (error) {
          console.log(error);
          log.error(`${error}`);
        }
      }
      apiImages.map((img) => {
        return log.info(`${img}`);
      });
      swal({
        title: "Success",
        text: "Images Uploaded Successfully",
        icon: "success",
        button: "OK",
      });
      setLoading(false);
      setProgress(0);
      setSelectedImages([]);
    } else {
      swal({
        title: "error",
        text: "Please Upload a Image...!",
        icon: "error",
        button: "Ok!",
      });
      setLoading(false);
    }
  };

  // Get Upload Images Function
  const getUploadPhotos = async (tok, id) => {
    console.log(id);
    const d = {
      eventId: id,
    };
    console.log(tok, "evevt token");
    try {
      const { data } = await axios.get(
        `https://beta.imageproof.ai/api/get-unique-event/${tok}/${id}`,
        d
      );
      console.log(data);
      console.log(data.projectEvent);
      setClientDetail(data.projectEvent);
      setApiImages(data.projectEvent.uploadedImages);
    } catch (error) {
      console.log(error);
    }
  };
  // Get Account Package
  const getPackageAccount = async (tok) => {
    try {
      const { data } = await axios.get(
        `https://beta.imageproof.ai/api/account/${tok}`
      );
      console.log(data);
      setSubscribeValidated(data.photographer.subscribedValidity);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="projects-page"
        style={{ backgroundColor: "hsl(0, 0%, 96%)", height: "90vh" }}
      >
        <div className="mx-3" style={{ display: "flex" }}>
          {/* Client Details*/}
          <div className="Upload-Event-body p-4">
            <p>Client Details</p>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <BsFillCameraFill className="event-icons" />
                {clientDetail.eventName}
              </li>

              <li class="list-group-item">
                <CgProfile className="event-icons" />
                {clientDetail.clientName}
              </li>

              <li class="list-group-item">
                <MdOutlineEmail className="event-icons" />
                {clientDetail.clientEmail}
              </li>
              <li class="list-group-item">
                <BiPhoneCall className="event-icons" />{" "}
                {clientDetail.clientMobile}
              </li>
            </ul>
          </div>
          {/* Upload sections */}
          <div className="upload-body-section p-3">
            <div className="Upload-page">
              <form onSubmit={uploadPhotosDisclaimerConfirm}>
                <div className="upload-img-body">
                  <div
                    className="left-right-arrow"
                    style={{ marginRight: "220px" }}
                  >
                    <BsArrowLeftCircle
                      className="lelt-icon"
                      onClick={leftIcon}
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      id="file"
                      multiple
                      onChange={imageHandleChange}
                    />
                  </div>

                  <div>
                    <button type="submit">Upload Images</button>
                  </div>
                </div>
              </form>
              <br />
              <div className="d-flex justify-content-center align-items-center">
                {loading && (
                  <div className="image-loading">
                    <div className="loader">
                      <ProgressBar
                        animated
                        now={progress}
                        label={`${progress}%`}
                      />
                    </div>
                    Uploading Images Please wait...!
                  </div>
                )}
              </div>
              {apiImages.map((img) => {
                if (img !== null) {
                  let imgSrc = `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${img}`;
                  return (
                    <img
                      src={imgSrc}
                      className="get-image-page"
                      key={img}
                      loading="lazy"
                      alt="img"
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Uploadphotos;
