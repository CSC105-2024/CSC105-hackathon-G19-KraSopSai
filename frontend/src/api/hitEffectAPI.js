// import { data } from "react-router-dom";
import { Axios } from "../utils/axiosInstance";

export const getAllHitEffects = async () => {
    try {
        const response = await Axios.get(`/hitEffect`);
        return {
            success: true,
            data: response.data,
        }
    } catch (e) {
        console.log('Error fetching All hit effects:', e);
        return {
            success: false,
            data: null
        }
    }
}

export const getOneEffect = async (id) => {
    try {
        const response = await Axios.get(`/hitEffect/${id}`);
        return {
            success: true,
            data: response.data,
        }
    } catch (e) {
        console.log('Error fetching getOne hit effect:', e);
        return {
            success: false,
            data: null
        }
    }
}

export const createHitEffect = async (data) => {
    try {
        const response = await Axios.post(`/hitEffect`, data);
        return {
            success: true,
            data: response.data,
        };
    } catch (e) {
        console.error('Error creating hit effect:', e?.response?.data || e.message);
        return {
            success: false,
            data: null,
        };
    }
};

export const editHitEffect = async (id, data) => {
    try {
        const response = await Axios.put(`/hitEffect/${id}`, data);
        return {
            success: true,
            data: response.data,
        };
    } catch (e) {
        console.error('Error editing hit effect:', e?.response?.data || e.message);
        return {
            success: false,
            data: null,
        };
    }
};

export const deleteHitEffect = async (id) => {
    try {
        const response = await Axios.delete(`/hitEffect/${id}`);
        return {
            success: true,
            data: response.data,
        }
    } catch (e) {
        console.log('Error deleting hit effect:', e);
        return {
            success: false,
            data: null
        }
    }
}