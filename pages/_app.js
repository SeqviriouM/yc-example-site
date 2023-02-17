import React from 'react';

import '@gravity-ui/uikit/styles/styles.css';
// eslint-disable-next-line import/order
import '../styles/globals.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({Component, pageProps}) {
    return <Component {...pageProps} />;
}
