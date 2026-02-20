import React, { createContext, useState } from "react";

export const JobContext = createContext(null);

const JobContextProvider = ({ children }) => {
  /* APP */
  const [appName] = useState("JobScribe");

  /* JD DATA (GLOBAL) */
  const [jdData, setJdData] = useState({
    text: "",
    matchedSkills: [],
    missingSkills: [],
  });

  const value = {
    appName,

    jdData,
    setJdData,
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContextProvider;