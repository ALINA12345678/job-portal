import axios from 'axios';



export const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: httpMethod,
    url,
    headers: reqHeader || { "Content-Type": "application/json" },
    ...(reqBody && { data: reqBody }) // ✅ Only attach body if truthy
  };

  try {
    const res = await axios(reqConfig);
    return res;
  } catch (err) {
    throw err;
  }
};

export default commonAPI;
