import React, { createContext } from "react";

export const JobContext = createContext(null);

const JobContextProvider = (props) => {
  const value = {
    appName: "JobScribe"
  };

  return (
    <JobContext.Provider value={value}>
      {props.children}
    </JobContext.Provider>
  );
};

export default JobContextProvider;
