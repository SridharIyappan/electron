import React from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { HiOutlineMail } from "react-icons/hi";
import { BiPhoneCall } from "react-icons/bi";

const AddEvent = ({ allEvents, addEvent, eventImageShow, leftIcon }) => {
  return (
    <div style={{ display: "flex" }}>
      <div class="home-body p-3" style={{ width: "46vw" }}>
        <div class="card-body event-section">
          <div>
            <BsArrowLeftCircle className="lelt-icon" onClick={leftIcon} />
          </div>
          <h5>{allEvents[0].projectName}</h5>
          <div>
            <button className="addEvent-btn" onClick={addEvent}>
              Add Event
            </button>
          </div>
        </div>
        {allEvents.map((eventMap) => {
          var newDate = eventMap.createdAt.toString();
          var lastDate = new Date(newDate);
          var d = lastDate.toString();
          var resultDate = d.split(" ", 4);

          return (
            <div
              className="event-main"
              onClick={() => eventImageShow(eventMap._id)}
              key={eventMap._id}
            >
              <div className="event-page">
                <div>
                  <p>{eventMap.eventName}</p>
                </div>
                <div>
                  <p>
                    {resultDate[1]} {resultDate[2]} {resultDate[3]}
                  </p>
                </div>
              </div>
              <hr />
              <div className="event-body">
                <div>
                  All Photos
                  <p>{eventMap.uploadedImages.length}</p>
                </div>
                <div>
                  Selected Photos
                  <p>{eventMap.selectedImages.length}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div class="home-body p-3" style={{ width: "25vw" }}>
        <ul class="list-group list-group-flush">
          <h5 class="card-title client-home">Client Details</h5>
          <li class="list-group-item">
            <CgProfile className="event-icons" />{" "}
            {allEvents.length > 0 ? allEvents[0].clientName : ""}
          </li>
          <li class="list-group-item">
            <HiOutlineMail className="event-icons" />{" "}
            {allEvents.length > 0 ? allEvents[0].clientEmail : ""}
          </li>
          <li class="list-group-item">
            <BiPhoneCall className="event-icons" />
            {allEvents.length > 0 ? allEvents[0].clientMobile : ""}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddEvent;
