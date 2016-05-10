/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import includes from 'lodash/includes';

/**
 * Internal dependencies
 */
import localize from 'lib/mixins/i18n/localize';
import EmptyContent from 'components/empty-content';
import { getSelectedSiteId } from 'state/ui/selectors';
import {
	isJetpackSite,
	isCurrentUserCapableForSite,
	getSiteSlug
} from 'state/sites/selectors';

/**
 * Constants
 */
const CONFIGURABLE_TYPES = [ 'jetpack-portfolio', 'jetpack-testimonial' ];

function PostTypeUnsupported( { translate, canManage, siteSlug, type } ) {
	const isConfigurableType = includes( CONFIGURABLE_TYPES, type );
	let title, line, action, actionUrl;

	if ( isConfigurableType && canManage ) {
		switch ( type ) {
			case 'jetpack-portfolio':
				title = translate( 'Portfolios are not enabled' );
				break;

			case 'jetpack-testimonial':
				title = translate( 'Testimonials are not enabled' );
				break;
		}

		line = translate( 'Activate custom content types in your site settings' );
		action = translate( 'Manage Settings' );
		actionUrl = '/settings/writing/' + siteSlug;
	} else {
		title = translate( 'Content type unsupported' );
		line = translate( 'Your site does not support this content type' );
	}

	return <EmptyContent { ...{ title, line, action, actionURL: actionUrl } } />;
}

PostTypeUnsupported.propTypes = {
	translate: PropTypes.func,
	jetpack: PropTypes.bool,
	canManage: PropTypes.bool,
	siteSlug: PropTypes.string,
	adminUrl: PropTypes.string,
	type: PropTypes.string
};

export default connect( ( state ) => {
	const siteId = getSelectedSiteId( state );

	return {
		jetpack: isJetpackSite( state, siteId ),
		canManage: isCurrentUserCapableForSite( state, siteId, 'manage_options' ),
		siteSlug: getSiteSlug( state, siteId )
	};
} )( localize( PostTypeUnsupported ) );
