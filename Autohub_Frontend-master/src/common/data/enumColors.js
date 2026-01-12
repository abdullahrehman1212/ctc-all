const COLORS = {
	PRIMARY: {
		name: 'primary',
		code:
			process.env.REACT_APP_PRIMARY_COLOR &&
			process.env.REACT_APP_PRIMARY_COLOR.toLowerCase() !== '#6c5dd3'
				? process.env.REACT_APP_PRIMARY_COLOR
				: '#f97316',
	},
	SECONDARY: {
		name: 'secondary',
		code:
			process.env.REACT_APP_SECONDARY_COLOR &&
			process.env.REACT_APP_SECONDARY_COLOR.toLowerCase() !== '#ffa2c0'
				? process.env.REACT_APP_SECONDARY_COLOR
				: '#f1f5f9',
	},
	SUCCESS: {
		name: 'success',
		code:
			process.env.REACT_APP_SUCCESS_COLOR &&
			process.env.REACT_APP_SUCCESS_COLOR.toLowerCase() !== '#46bcaa'
				? process.env.REACT_APP_SUCCESS_COLOR
				: '#22c55e',
	},
	INFO: {
		name: 'info',
		code:
			process.env.REACT_APP_INFO_COLOR &&
			process.env.REACT_APP_INFO_COLOR.toLowerCase() !== '#4d69fa'
				? process.env.REACT_APP_INFO_COLOR
				: '#0ea5e9',
	},
	WARNING: {
		name: 'warning',
		code:
			process.env.REACT_APP_WARNING_COLOR &&
			process.env.REACT_APP_WARNING_COLOR.toLowerCase() !== '#ffcf52'
				? process.env.REACT_APP_WARNING_COLOR
				: '#eab308',
	},
	DANGER: {
		name: 'danger',
		code:
			process.env.REACT_APP_DANGER_COLOR &&
			process.env.REACT_APP_DANGER_COLOR.toLowerCase() !== '#f35421'
				? process.env.REACT_APP_DANGER_COLOR
				: '#ef4444',
	},
	DARK: {
		name: 'dark',
		code:
			process.env.REACT_APP_DARK_COLOR &&
			process.env.REACT_APP_DARK_COLOR.toLowerCase() !== '#1f2128'
				? process.env.REACT_APP_DARK_COLOR
				: '#0f172a',
	},
	LIGHT: {
		name: 'light',
		code:
			process.env.REACT_APP_LIGHT_COLOR &&
			process.env.REACT_APP_LIGHT_COLOR.toLowerCase() !== '#e7eef8'
				? process.env.REACT_APP_LIGHT_COLOR
				: '#f1f5f9',
	},
};

export function getColorNameWithIndex(index) {
	/*
	 * The size has been reduced by one so that the LIGHT color does not come out.
	 */
	return COLORS[Object.keys(COLORS)[index % (Object.keys(COLORS).length - 1)]].name;
}

export default COLORS;
