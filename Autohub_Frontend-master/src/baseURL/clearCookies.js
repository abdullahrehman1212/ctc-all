import Cookies from 'js-cookie';

const ClearCookies = async () => {
	Cookies.remove('name');
	Cookies.remove('email');
	Cookies.remove('role');
	Cookies.remove('userToken');
	Cookies.remove('id');
	Cookies.remove('Data');
	Cookies.remove('last_login');
	Cookies.remove('roleId');
	Cookies.remove('userID');
	Cookies.remove('companyID');
	Cookies.remove('rolesList');
};
export default ClearCookies;
