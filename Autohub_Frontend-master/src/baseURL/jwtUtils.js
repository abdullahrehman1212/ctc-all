import axios from 'axios';

import jwtDecode from 'jwt-decode';

export const setAuthToken = (token) => {
	return new Promise((resolve) => {
		if (token) {
			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
		} else {
			delete axios.defaults.headers.common.Authorization;
		}
		resolve();
	});
};

export const decodeToken = (token) => {
	return jwtDecode(token);
};
