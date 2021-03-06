/**
 * External dependencies
 */
import React from 'react';
import ReactDom from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';

/**
 * Internal dependencies
 */
import i18n from 'lib/mixins/i18n';
import { trackPageLoad, setPageTitle } from 'reader/controller-helper';

const analyticsPageTitle = 'Reader';

export function start( context ) {
	const startComponent = require( 'reader/start/main' ),
		basePath = '/read/start',
		fullAnalyticsPageTitle = analyticsPageTitle + ' > Start',
		mcKey = 'start';

	setPageTitle( i18n.translate( 'Start' ) );

	trackPageLoad( basePath, fullAnalyticsPageTitle, mcKey );

	ReactDom.render(
		React.createElement( ReduxProvider, { store: context.store },
			React.createElement( startComponent, {
				key: 'start'
			} )
		),
		document.getElementById( 'primary' )
	);
}
