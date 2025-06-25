import commonAPI from "./apiCommon";
import { server_url } from "./server_url";

// Register API
export const registerAPI = async (user) => {
    return await commonAPI('POST', `${server_url}/register`, user, "");
};

// Login API
export const loginAPI = async (user) => {
    return await commonAPI('POST', `${server_url}/login`, user, "");
};

// Post Job API
export const postJobAPI = async (job, token) => {
    return await commonAPI('POST', `${server_url}/jobs`, job, {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });
};

// Get Jobs API
export const getJobsAPI = async () => {
    return await commonAPI('GET', `${server_url}/jobs`, null, {
        "Content-Type": "application/json",
    });
};
//deletejobbyid
export const deleteJobAPI = async (id, token) => {
  return await commonAPI('DELETE', `${server_url}/jobs/${id}`, null, {
    "Authorization": `Bearer ${token}`,
  });
};

// Fetch Users by Role API
export const fetchUsersAPI = async (role = "",token) => {
    return await commonAPI('GET',`${server_url}/users${role ? `?role=${role}` : ""}`,null,{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    );
};
// Apply to Job API
export const applyJobAPI = async (jobId, token, applicationData) => {
    return await commonAPI('POST', `${server_url}/jobs/${jobId}/apply`, applicationData, {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });
};
//get applications
export const getApplicationsAPI = async (token, jobId = null) => {
  const url = jobId
    ? `${server_url}/jobs/${jobId}/applications`
    : `${server_url}/applications`;

  return await commonAPI('GET', url, null, {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  });
};
//get stats
export const getStatsAPI = async (token) => {
  return await commonAPI('GET', `${server_url}/dashboard/stats`, null, {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  });
};

//postprofile
export const saveProfileAPI = async (token, profileData) => {
  return await commonAPI('POST', `${server_url}/profile`, profileData, {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  });
};
//getprofile
export const getProfileAPI = async (token) => {
  return await commonAPI('GET', `${server_url}/profile`, null, {
    "Authorization": `Bearer ${token}`
  });
};



