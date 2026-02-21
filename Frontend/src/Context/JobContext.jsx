import React, { createContext, useState } from "react";

export const JobContext = createContext(null);

const JobContextProvider = ({ children }) => {
  /* APP */
  const [appName] = useState("JobScribe");

  /* JD DATA */
  const [jdData, setJdData] = useState({
    text: "",
    matchedSkills: [],
    missingSkills: [],
  });

  /* 🔥 RESUME DATA (NEW & REQUIRED) */
  const [resumeData, setResumeData] = useState({
    file: null,
    atsScore: 0,
    skills: [],
  });

  const value = {
    appName,

    jdData,
    setJdData,

    resumeData,
    setResumeData,
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContextProvider;