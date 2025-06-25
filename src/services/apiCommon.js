import axios from 'axios';

export const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
    const reqConfig = {
        method: httpMethod,
        url,
        data: reqBody,
        headers: reqHeader ? reqHeader : { "Content-Type": "application/json" },
    };

    try {
        // console.log("Sending headers:", reqConfig.headers);
        const res = await axios(reqConfig);


        return res;
    } catch (err) {
        // You can choose to throw or return the error here
        throw err;
    }
};

export default commonAPI;
