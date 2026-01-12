import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
// New UI stack styles (Tailwind + compat layer). Bootstrap/SASS removed.
import './tailwind.css';
import './styles/bootstrap-compat.css';

import store from './redux/store';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import { ThemeContextProvider } from './contexts/themeContext';
import './i18n';

function applyRuntimeHtmlMetaFromEnv() {
	// Keep CRA-style env naming to avoid touching existing configuration.
	const siteName = process.env.REACT_APP_SITE_NAME;
	const metaDesc = process.env.REACT_APP_META_DESC;
	const themeColor = process.env.REACT_APP_THEME_COLOR;

	if (siteName) document.title = siteName;

	if (metaDesc) {
		const meta = document.querySelector('meta[name="description"]');
		if (meta) meta.setAttribute('content', metaDesc);
	}

	if (themeColor) {
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) meta.setAttribute('content', themeColor);
	}
}

applyRuntimeHtmlMetaFromEnv();

const children = (
	<Router>
		<Provider store={store}>
			<ThemeContextProvider>
				<App />
			</ThemeContextProvider>
		</Provider>
	</Router>
);

const container = document.getElementById('root');
createRoot(container).render(children);

reportWebVitals();

