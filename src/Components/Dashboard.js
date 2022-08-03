import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { CgProfile } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { BiSelectMultiple } from "react-icons/bi";
import { MdCreateNewFolder } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { ImMobile } from "react-icons/im";
import { BsFillCameraFill } from "react-icons/bs";
import { AiFillCamera } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
const shell = window.require("electron").shell;

const Dashboard = () => {
  const [photographerDetail, setPhotographerDetails] = useState("");
  const [dashboardDetails, setDashboardDetails] = useState("");
  const [packageDetails, setPackageDetails] = useState("");
  const [subscriptionBtn, setSubscriptionBtn] = useState(false);
  const [daysShow, setDaysShow] = useState("");

  // const user = useSelector((state) => state.user.user);
  // console.log(user);

  useEffect(() => {
    let tok = localStorage.getItem("token");
    let user = JSON.parse(localStorage.getItem("user"));
    setPhotographerDetails(user);

    console.log(tok);
    getDashboardDetails(tok);
    getPackageAccount(tok);
    let currentDateTime = new Date().getHours();
    console.log(currentDateTime);
    if (currentDateTime < 12) {
      setDaysShow("Good Morning..!");
    } else if (currentDateTime < 16) {
      setDaysShow("Good AfterNoon..!");
    } else if (currentDateTime < 19) {
      setDaysShow("Good Evening..!");
    } else {
      setDaysShow("Good Night..!");
    }
  }, []);

  // const date = new Date();
  // const packageStartDate = date.getFullYear() + "/" + String(date.getMonth() + 1).padStart(2, "0") + "/" + String(date.getDate()).padStart(2, "0");
  // console.log(packageStartDate, "this start date");
  // console.log(packageEndDate, "Its end date");

  const subscriptionOpen = () => {
    shell.openExternal("https://imageproof.ai/");
  };

  const getDashboardDetails = async (tok) => {
    try {
      const { data } = await axios.get(
        `https://beta.imageproof.ai/api/get-dashboard-details/${tok}`
      );
      console.log(data);
      setDashboardDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPackageAccount = async (tok) => {
    try {
      const { data } = await axios.get(
        `https://beta.imageproof.ai/api/account/${tok}`
      );
      console.log(data);
      setPackageDetails(data.photographer);
      if (data.photographer.subscribedValidity === false) {
        setSubscriptionBtn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main-dashboard" style={{ height: "90.91vh" }}>
        <div className="sub-dashboard">
          <Link to="/allproject">
            <MdCreateNewFolder className="create-folder-icons" />
          </Link>
        </div>
        <div className="body-dashboard">
          <h4>Dashboard</h4>
          <span className="days-show">{daysShow}</span>
          <div class="container mt-2">
            <div class="row">
              <div class="col-md-3">
                <Link to="/allproject">
                  <div class="card-counter">
                    <CgProfile className="dashboard-icon" />
                    <span class="count-numbers">
                      {dashboardDetails.projectsCount}
                    </span>
                    <span class="count-name">No.of Projects</span>
                  </div>
                </Link>
              </div>

              <div class="col-md-3">
                <div class="card-counter">
                  <BsFillCameraFill className="dashboard-icon" />
                  <span class="count-numbers">
                    {dashboardDetails.eventsCount}
                  </span>
                  <span class="count-name">No.of Events</span>
                </div>
              </div>

              <div class="col-md-3">
                <div class="card-counter">
                  <FaCloudUploadAlt className="dashboard-icon" />
                  <span class="count-numbers">
                    {dashboardDetails.uploadedImagesCount}
                  </span>
                  <span class="count-name">No.of uploadedImages</span>
                </div>
              </div>

              <div class="col-md-3">
                <div class="card-counter">
                  <BiSelectMultiple className="dashboard-icon" />
                  <span class="count-numbers">
                    {dashboardDetails.selectedImagesCount}
                  </span>
                  <span class="count-name">No.of selectedImages</span>
                </div>
              </div>
            </div>
            <br />

            {/* second Sectoin */}
            <div class="row">
              <div class="col-md-4">
                <div className="package">
                  <div className="sub-package p-4">
                    <h5>
                      <b>Packages</b>
                    </h5>
                    <p>{packageDetails.packageName}</p>
                    <div>
                      <MdDateRange className="event-icons" />
                      <span>Starting Date : </span>
                      <span>{packageDetails.packageStartDate}</span>
                    </div>
                    <br />
                    <div>
                      <MdDateRange className="event-icons" />
                      <span>Ending Date :</span>
                      <span>{packageDetails.packageEndDate}</span>
                    </div>
                    {subscriptionBtn && (
                      <div
                        className="subscription-btn mt-5"
                        onClick={subscriptionOpen}
                      >
                        <span>Subscription</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div class="col-md-8">
                <div className="photographer-detail p-4">
                  <h5>
                    <b>Photographer Details</b>
                  </h5>
                  <br />
                  <div>
                    <ImProfile className="event-icons" />
                    <span>Name :</span>
                    <span className="datas">{photographerDetail.name}</span>
                  </div>
                  <div>
                    <MdEmail className="event-icons" />
                    <span>Email :</span>
                    <span className="datas"> {photographerDetail.email}</span>
                  </div>
                  <div>
                    <ImMobile className="event-icons" />
                    <span>Mobile :</span>
                    <span className="datas">{photographerDetail.mobile}</span>
                  </div>
                  <div>
                    <AiFillCamera className="event-icons" />
                    <span>Studio Name : </span>
                    <span className="datas">
                      {photographerDetail.studioName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
