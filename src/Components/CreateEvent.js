import React from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineEmail } from "react-icons/md";
import { BiPhoneCall } from "react-icons/bi";

const CreateEvent = ({
  createEvent,
  projectName,
  setEventName,
  error,
  eventName,
  name,
  email,
  mobile,
}) => {
  return (
    <div className="mx-2" style={{ display: "flex" }}>
      <div className="Event-body-second p-4">
        <form onSubmit={createEvent}>
          <h4>{projectName}</h4>
          <br />
          <div class="form-outline mb-4">
            <input
              type="text"
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Event Name"
              class="form-control"
            />
            {error && eventName === "" ? (
              <span className="error-msg">This field is required.</span>
            ) : (
              <></>
            )}
          </div>
          <br />
          <button type="submit">Create Event</button>
        </form>
      </div>
      <div className="Event-body p-4">
        <p>Client Details</p>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <CgProfile className="event-icons" /> {name}
          </li>
          <li class="list-group-item">
            <MdOutlineEmail className="event-icons" />
            {email}
          </li>
          <li class="list-group-item">
            <BiPhoneCall className="event-icons" /> {mobile}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CreateEvent;
