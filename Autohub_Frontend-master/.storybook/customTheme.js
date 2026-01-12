import { create } from '@storybook/theming';
let data;
try {
	const dataString = Cookies.get('Data1');
	data = dataString ? JSON.parse(dataString) : null;
} catch (error) {
	console.error('Failed to parse cookie data:', error);
	data = null;
}

export default create({
	base: 'dark',
	brandTitle: data?.user?.company_name,
	brandImage: 'https://facit-story.omtanke.studio/logo-light.svg',
});
