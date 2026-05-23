import { Axios } from '../utils/axiosInstance.js';

export const createVictimAPI = async (data) => {
    console.log("xoxo Creating job with data:", data);
  try {
    const response = await Axios.post("/victim", data);
    return {
      success: true,
      data: response.data
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      data: null
    }
  }
}

export const EditVictimAPI = async (id,body) => {
  try {
    const response = await Axios.patch(`/victim/${id}`, body);
    return {
      success: true,
      data: response.data
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      data: null
    }
  }
}

export const deleteVictimAPI = async (id) => {
  try {
    const response = await Axios.delete(`/victim/${id}`);
    return {
      success: true,
      data: response.data
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      data: null
    }
  }
}

export const getMyVictims = async () => {
  try {
    const response = await Axios.get(`/victim`);
    return {
      success: true,
      data: response.data
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      data: null
    }
  }
}

export const getVictimbyId = async (id) => {
  try {
    const response = await Axios.get(`/victim/${id}`);
    return {
      success: true,
      data: response.data
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      data: null
    }
  }
}

