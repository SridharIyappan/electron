import React from "react";
import { FcFolder } from "react-icons/fc";

const AllProjectsSection = ({ allProjects, getAllEvents }) => {
  return (
    <div className="home-body">
      <p className="your-project-show">Your projects</p>
      {allProjects.map((allProjectsMap) => {
        return (
          <div
            className="all-project-body"
            onClick={() => getAllEvents(allProjectsMap)}
          >
            <FcFolder className="folder-icon" />
            <h4>{allProjectsMap.projectName}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default AllProjectsSection;
