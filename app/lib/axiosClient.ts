import axios from "axios";

const axiosClient = axios.create({ baseURL: "https://api.bitpin.ir" });

export default axiosClient;
