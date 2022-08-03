import React from "react";

const CreateProject = ({
  createProject,
  projectName,
  setProjectName,
  error,
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientMobile,
  setClientMobile,
}) => {
  return (
    <div className="home-body-second">
      <p className="your-project-tag">Create New Projects</p>
      <form style={{ padding: "15px" }} onSubmit={createProject}>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label>Project Name</label>
            <input
              type="text"
              class="form-control"
              value={projectName}
              placeholder="Project Name"
              onChange={(e) => setProjectName(e.target.value)}
            />
            {error && projectName === "" ? (
              <span className="error-msg">This field is required.</span>
            ) : (
              <></>
            )}
          </div>
          <div class="form-group col-md-6">
            <label>Client Name</label>
            <input
              type="text"
              class="form-control"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            {error && clientName === "" ? (
              <span className="error-msg">This field is required.</span>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label>Client Email</label>
            <input
              type="email"
              class="form-control"
              placeholder="Client Email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
            {error && clientEmail === "" ? (
              <span className="error-msg">This field is required.</span>
            ) : (
              <></>
            )}
          </div>
          <div class="form-group col-md-6">
            <label>Client Mobile</label>
            <input
              type="text"
              class="form-control"
              placeholder="Client Mobile"
              maxLength={10}
              value={clientMobile}
              onChange={(e) => setClientMobile(e.target.value)}
            />
            {error && clientMobile === "" ? (
              <span className="error-msg">This field is required.</span>
            ) : (
              <></>
            )}
            {error && clientMobile.length > 10 ? (
              <span className="error-msg">Please Enter 10 Digits number</span>
            ) : (
              <></>
            )}
          </div>
        </div>
        <button type="submit" className="addEvent-btn">
          Save
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
