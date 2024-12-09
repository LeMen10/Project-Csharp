import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const token = Cookies.get('token_admin');

const request = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
    baseURL: `${process.env.REACT_APP_BASE_URL}`,
});

export const get = async (path, options = {}) => {
    const response = await request.get(path, options);
    return response.data;
}

export const post = async (path, options = {}) => {
    const response = await request.post(path, options);
    return response.data;
}

export const put = async (path, options = {}) => {
    const response = await request.put(path, options);
    return response.data;
}

export const delete_method = async (path, options = {}) => {
    const response = await request.delete(path, options);
    return response.data;
}

request.propTypes = {
    setHeaderVariable: PropTypes.func,
};
export default request;
