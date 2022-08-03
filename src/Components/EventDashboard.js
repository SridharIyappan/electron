import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import axios from "axios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import { CgProfile } from "react-icons/cg";
import { MdOutlineEmail } from "react-icons/md";
import { BiPhoneCall } from "react-icons/bi";
import { BsFillCameraFill } from "react-icons/bs";
import ImageCarousel from "./ImageCarousel";
import ReactLoading from "react-loading";
import JSZip from "jszip";
import { saveAs } from "file-saver";
const fs = window.require("fs");
const path = window.require("path");
const log = window.require("electron-log");
const userlog = log.scope("Client Email");
const download = log.scope("Download Image");
const accessClient = log.scope("Access to client");

const EventDashboard = (state) => {
  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const [token, setToken] = useState("");
  const [selectedImg, setSelectedImg] = useState([]);
  const [showSelectedImages, setShowSelectedImages] = useState(false);
  const [allImgColor, setAllImgColor] = useState(true);
  const [clientDetails, setClientDetails] = useState("");
  const [clientImgCount, setClientImgCount] = useState("");
  const [imageCarousel, setImagesCarousel] = useState(false);
  const [index, setIndex] = useState();
  const [eventId, setEventId] = useState("");
  const [selectionAccessBtn, setSelectionAccessBtn] = useState(false);
  // const [loading, setLoading] = useState(false);

  const closePopupCircle = (state) => {
    setImagesCarousel(false);
  };

  let navigate = useNavigate();
  let location = useLocation();
  const event = location.state;

  const leftIcon = () => {
    navigate("/allproject", { state: event });
  };

  useEffect(() => {
    console.log(project);
    console.log(location.state);
    if (location.state !== null) {
      // setClientDetails();
    }
  }, [project]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("we are running on the client");
      let tok = localStorage.getItem("token");
      setToken(tok);
      let pId = localStorage.getItem("projectId");
      getProject(tok, pId);
    } else {
      console.log("we are running on the server");
    }
  }, []);

  const handleCarousel = (item) => {
    let i = images.indexOf(item);
    setIndex(i);
    setImagesCarousel(true);
  };

  // {selectedImg.map((selectImg) => {
  // let img = `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${selectImg}`;
  const zip = async () => {
    let imagesArray = [];
    selectedImg.map((img) => {
      let url = `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${img}`;
      imagesArray.push(url);
    });
    console.log(imagesArray);
    const zip = new JSZip();
    const folder = zip.folder(clientDetails.eventName);
    imagesArray.forEach((u) => {
      const blobPromise = fetch(u).then(function (response) {
        console.log({ response });
        if (response.status === 200 || response.status === 0) {
          return Promise.resolve(response.blob());
        } else {
          return Promise.reject(new Error(response.statusText));
        }
      });
      const name = u.substring(u.lastIndexOf("/"));
      folder.file(name, blobPromise);
    });
    zip
      .generateAsync({ type: "blob" })
      .then((blob) => saveAs(blob, clientDetails.eventName))
      .catch((e) => console.log(e));
    // Fetch the image and parse the response stream as a blob
    // for (var i = 0; i < selectedImg.length; i++) {
    //   const imageBlob = await fetch(
    //     `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${selectedImg[i]}`
    //   ).then((response) => response.blob());

    //   // create a new file from the blob object
    //   const imgData = new File([imageBlob], "1.jpg");

    //   // Copy-pasted from JSZip documentation
    //   var zip = new JSZip();
    //   // zip.file("Hello.txt", "Hello World\n");
    //   var img = zip.folder("images");
    //   img.file(selectedImg[i], imgData, { base64: true });
    // }
    // zip.generateAsync({ type: "blob" }).then(function (content) {
    //   saveAs(content, "Ashok.zip");
    // });
  };

  // Get Project Function
  const getProject = async (tok, projectId) => {
    console.log(projectId);
    try {
      const { data } = await axios.get(
        `https://beta.imageproof.ai/api/get-unique-event/${tok}/${projectId}`
      );
      console.log(data);
      let d = JSON.stringify(data.projectEvent);
      localStorage.setItem("event", d);
      console.log(data.projectEvent.uploadedImages);
      setClientDetails(data.projectEvent);
      console.log(data.projectEvent._id);
      setEventId(data.projectEvent._id);
      if (data.projectEvent.uploadedImages != 0) {
        setImages(data.projectEvent.uploadedImages);
      }
      if (data.projectEvent.selectedImages !== 0) {
        setSelectedImg(data.projectEvent.selectedImages);
      }
      setClientImgCount(data.projectEvent);
      if (data.projectEvent.selection === false) {
        setSelectionAccessBtn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Goto Upload Images Page
  const goToUploadPage = (projectId) => {
    navigate("/upload-photos", { state: projectId });
    console.log(projectId);
  };
  // Selected Images Tab Function
  const selectedImagesShow = () => {
    setShowSelectedImages(true);
    setAllImgColor(false);
    console.log(clientImgCount);
  };
  // Show All Images Tab Function
  const showAllImages = () => {
    setShowSelectedImages(false);
    setAllImgColor(true);
  };

  // Send Email to Client Function
  const sendMailtoClient = async () => {
    const clientEmail = clientDetails.clientEmail;
    const pin = clientDetails.pin;

    const d = {
      clientEmail,
      pin,
      eventId: clientDetails._id,
    };
    console.log(d);
    if (clientDetails !== null) {
      if (clientDetails.uploadedImages.length > 0) {
        try {
          console.log(token);
          const { data } = await axios.post(
            `https://beta.imageproof.ai/api/send-email-to-client/${token}`,
            d
          );
          console.log(data);
          if (data.success) {
            swal({
              title: "success",
              text: data.msg,
              button: "Ok!",
              icon: "success",
            });
            const clientInfo = JSON.stringify(d);
            userlog.info();
            log.info(`Client Email Send Successfully: ${clientInfo}`);
          } else {
            log.error(`${data.msg}`);
            swal({
              title: "Error",
              text: data.msg,
              button: "Ok!",
              icon: "error",
            });
          }
        } catch (error) {
          console.log(error);
          log.error(`${error}`);
        }
      } else {
        swal({
          title: "error",
          text: "Please Upload Images!",
          button: "Ok!",
          icon: "error",
        });
      }
    }
  };

  //handle Download
  const handleDownload = async () => {
    // setLoading(true);
    function mkdirp(dir) {
      console.log(dir);

      // const dirname = path.dirname(dir);
      // console.log(dirname);
      // mkdirp(dirname);
      fs.mkdirSync(dir);
    }
    let pathArray = selectedImg[0].split("/");
    console.log(selectedImg[0].split("/"));
    let selectedImagesPath = `${pathArray[0]}/${pathArray[1]}/${pathArray[2]}/${pathArray[3]}/Selected Images/`;
    console.log(
      `${pathArray[0]}/${pathArray[1]}/${pathArray[2]}/${pathArray[3]}/`
    );
    if (fs.existsSync(selectedImagesPath)) {
      fs.rmSync(selectedImagesPath, { recursive: true });
      console.log(true);
      // return true;
    }
    mkdirp(selectedImagesPath);
    selectedImg.map((image) => {
      const filePath = `${image}`;
      const fileName = path.basename(filePath);
      console.log(filePath);
      console.log(fileName);
      console.log(selectedImagesPath);
      fs.copyFile(filePath, selectedImagesPath + "/" + fileName, (err) => {
        if (err) throw err;
        console.log("Image " + fileName + " stored.");
        // At that point, store some information like the file name for later use
      });
      swal({
        titile: "success",
        text: "Selected Image folder Downloaded",
        icon: "success",
        button: "Ok!",
      });
    });
    // setLoading(false);
    // try {
    //   let imagesArray = [];
    //   selectedImg.map((img) => {
    //     let url = `https://beta.imageproof.ai/api/photographer/get-images/${img}`;
    //     imagesArray.push(url);
    //   });
    //   console.log(imagesArray);
    //   const zip = new JSZip();
    //   const folder = zip.folder(clientDetails.eventName);
    //   imagesArray.forEach((u) => {
    //     const blobPromise = fetch(u).then(function (response) {
    //       console.log({ response });
    //       if (response.status === 200 || response.status === 0) {
    //         return Promise.resolve(response.blob());
    //       } else {
    //         return Promise.reject(new Error(response.statusText));
    //       }
    //     });
    //     const name = u.substring(u.lastIndexOf("/"));
    //     folder.file(name, blobPromise);
    //   });
    //   zip
    //     .generateAsync({ type: "blob" })
    //     .then((blob) => saveAs(blob, clientDetails.projectName))
    //     .catch((e) => console.log(e));
    //   setLoading(false);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const selectionAccess = async (eventId) => {
    try {
      const { data } = await axios.put(
        `https://beta.imageproof.ai/api/photographer/selection-access`,
        { eventId: eventId }
      );
      console.log(data.msg);
      if (data.success) {
        swal({
          title: "success",
          text: data.msg,
          button: "Ok!",
          icon: "success",
        });
        const d = JSON.stringify(data);
        accessClient.info();
        log.info(`Access to Client: ${d}`);
        log.info(`Client Email: ${clientDetails.clientEmail}`);
      }
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
          <div className="img-show-last p-4">
            <div>
              <p>Client Details</p>
              <div>
                {clientDetails != null ? (
                  <button
                    className="upload-img-direct"
                    onClick={() => goToUploadPage(clientDetails._id)}
                  >
                    Upload Image
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <br />
            <h6>{clientDetails != null ? clientDetails.projectName : ""}</h6>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <BsFillCameraFill className="event-icons" />
                <span>
                  {clientDetails != null ? clientDetails.eventName : ""}
                </span>
              </li>
              <li class="list-group-item">
                <CgProfile className="event-icons" />
                <span>
                  {clientDetails != null ? clientDetails.clientName : ""}
                </span>
              </li>

              <li class="list-group-item">
                <MdOutlineEmail className="event-icons" />
                <span>
                  {clientDetails != null ? clientDetails.clientEmail : ""}
                </span>
              </li>
              <li class="list-group-item">
                <BiPhoneCall className="event-icons" />{" "}
                <span>
                  {" "}
                  {clientDetails != null ? clientDetails.clientMobile : ""}
                </span>
              </li>
            </ul>
            <br />
            <button onClick={() => sendMailtoClient()}>
              Send to Client Email
            </button>
            {selectionAccessBtn && (
              <div className="mt-3">
                <button onClick={() => selectionAccess(eventId)}>
                  Access to Client
                </button>
              </div>
            )}
          </div>

          {/* Photo section */}
          <div className="img-show-last-second">
            <div className="img-show-count">
              <div className="left-right-arrow mr-3">
                <BsArrowLeftCircle className="lelt-icon" onClick={leftIcon} />
              </div>
              <div className="img-show-heading">
                <th
                  scope="col"
                  className={!allImgColor ? "" : "show-img-back"}
                  onClick={showAllImages}
                >
                  All Photos -{" "}
                  {clientImgCount.length !== 0
                    ? clientImgCount.uploadedImages.length
                    : ""}
                </th>
              </div>
              <div className="img-show-heading">
                <th
                  scope="col"
                  className={allImgColor ? "" : "show-img-back"}
                  onClick={selectedImagesShow}
                >
                  Selected Photos -{" "}
                  {clientImgCount.length !== 0
                    ? clientImgCount.selectedImages.length
                    : ""}
                </th>
              </div>
              <div>
                {showSelectedImages &&
                clientImgCount.selectedImages.length !== 0 ? (
                  <th scope="col">
                    <button className="btn btn-primary" onClick={zip}>
                      Download Low Quality
                    </button>
                  </th>
                ) : (
                  <></>
                )}
              </div>
              <div>
                {showSelectedImages &&
                clientImgCount.selectedImages.length !== 0 ? (
                  <th scope="col">
                    <button
                      className="btn btn-primary"
                      onClick={handleDownload}
                    >
                      Download
                    </button>
                  </th>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {/* Loading icons */}
            {/* {loading && (
              <div className="loader-icon">
                <ReactLoading type="spokes" color="#30eded" />
                Downloading Please wait..!
              </div>
            )} */}

            {/* Images show sections  */}
            <div style={{ position: "relative" }}>
              {imageCarousel && (
                <ImageCarousel
                  closePopupCircle={closePopupCircle}
                  index={index}
                  images={images}
                  eventId={eventId}
                />
              )}
              {!showSelectedImages ? (
                <div>
                  {images != null ? (
                    images.map((imgId) => {
                      let img = `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${imgId}`;
                      return (
                        <img
                          src={img}
                          alt="..."
                          className="get-image-page"
                          loading="lazy"
                          onClick={() => handleCarousel(imgId)}
                        />
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <div>
                  {selectedImg.map((selectImg) => {
                    let img = `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${selectImg}`;
                    return (
                      <img
                        src={img}
                        className="get-image-page"
                        loading="lazy"
                        alt="selectImg"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDashboard;
