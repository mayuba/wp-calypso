/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import {
	JETPACK_CONNECT_SSO_QUERY_SET,
	JETPACK_CONNECT_SSO_AUTHORIZE_REQUEST,
	JETPACK_CONNECT_SSO_AUTHORIZE_SUCCESS,
	JETPACK_CONNECT_SSO_AUTHORIZE_ERROR,
	JETPACK_CONNECT_SSO_VALIDATION_REQUEST,
	JETPACK_CONNECT_SSO_VALIDATION_SUCCESS,
	JETPACK_CONNECT_SSO_VALIDATION_ERROR,
	SERIALIZE,
} from 'state/action-types';
import reducer, {
	jetpackConnectAuthorize,
	jetpackSSO
} from '../reducer';

describe( 'reducer', () => {
	it( 'should export expected reducer keys', () => {
		expect( reducer( undefined, {} ) ).to.have.keys( [
			'jetpackConnectSite',
			'jetpackConnectAuthorize',
			'jetpackConnectSessions',
			'jetpackSSO'
		] );
	} );

	describe( '#jetpackConnectAuthorize()', () => {
		it( 'should default to an empty object', () => {
			const state = jetpackConnectAuthorize( undefined, {} );
			expect( state ).to.eql( {} );
		} );

		it( 'should set autoAuthorize to true when SSO authorized', () => {
			const state = jetpackConnectAuthorize( undefined, {
				type: JETPACK_CONNECT_SSO_AUTHORIZE_REQUEST
			} );

			expect( state ).to.have.property( 'autoAuthorize', true );
		} );

		it( 'should leave autoAuthorize as true when authorize successful', () => {
			const original = deepFreeze( {
				queryObject: {},
				isAuthorizing: false,
				authorizeSuccess: false,
				authorizeError: false,
				autoAuthorize: true
			} );

			const state = jetpackConnectAuthorize( original, {
				type: JETPACK_CONNECT_SSO_AUTHORIZE_SUCCESS
			} );

			expect( state ).to.have.property( 'autoAuthorize', true );
		} );

		it( 'should set autoAuthorize to false when authorize errors', () => {
			const original = deepFreeze( {
				queryObject: {},
				isAuthorizing: false,
				authorizeSuccess: false,
				authorizeError: false,
				autoAuthorize: true
			} );

			const state = jetpackConnectAuthorize( original, {
				type: JETPACK_CONNECT_SSO_AUTHORIZE_ERROR,
				error: {
					statusCode: 400
				}
			} );

			expect( state ).to.have.property( 'autoAuthorize', false );
		} );
	} );

	describe( '#jetpackSSO()', () => {
		it( 'should default to an empty object', () => {
			const state = jetpackSSO( undefined, {} );
			expect( state ).to.eql( {} );
		} );

		it( 'should not persist state', () => {
			const original = deepFreeze( {
				isAuthorizing: false,
				site_id: 0,
				authorizationError: false,
				ssoUrl: 'http://website.com'
			} );

			const state = jetpackSSO( original, { type: SERIALIZE } );

			expect( state ).to.eql( {} );
		} );

		it( 'should store query objct', () => {
			const queryObject = deepFreeze( {
				sso_nonce: '123456789',
				site_id: '123456'
			} );

			const state = jetpackSSO( undefined, {
				type: JETPACK_CONNECT_SSO_QUERY_SET,
				queryObject: queryObject
			} );

			expect( state ).to.eql( queryObject );
		} );

		it( 'should set isValidating to true when validating', () => {
			const state = jetpackSSO( undefined, {
				type: JETPACK_CONNECT_SSO_VALIDATION_REQUEST
			} );

			expect( state ).to.have.property( 'isValidating', true );
		} );

		it( 'should set isAuthorizing to true when authorizing', () => {
			const state = jetpackSSO( undefined, {
				type: JETPACK_CONNECT_SSO_AUTHORIZE_REQUEST
			} );

			expect( state ).to.have.property( 'isAuthorizing', true );
		} );

		it( 'should set isValidating to false after validation', () => {
			const actions = [
				{
					type: JETPACK_CONNECT_SSO_VALIDATION_SUCCESS,
					success: true
				},
				{
					type: JETPACK_CONNECT_SSO_VALIDATION_ERROR,
					error: {
						statusCode: 400
					}
				}
			];

			actions.forEach( ( action ) => {
				const state = jetpackSSO( undefined, action );
				expect( state ).to.have.property( 'isValidating', false );
			} );
		} );

		it( 'should store boolean nonceValid after validation', () => {
			const actions = [
				{
					type: JETPACK_CONNECT_SSO_VALIDATION_SUCCESS,
					success: true
				},
				{
					type: JETPACK_CONNECT_SSO_VALIDATION_SUCCESS,
					success: false
				}
			];

			actions.forEach( ( action ) => {
				const originalAction = deepFreeze( action );
				const state = jetpackSSO( undefined, originalAction );
				expect( state ).to.have.property( 'nonceValid', originalAction.success );
			} );
		} );

		it( 'should set isAuthorizing to false after authorization', () => {
			const actions = [
				{
					type: JETPACK_CONNECT_SSO_AUTHORIZE_SUCCESS,
					ssoUrl: 'http://website.com'
				},
				{
					type: JETPACK_CONNECT_SSO_AUTHORIZE_ERROR,
					error: {
						statusCode: 400
					},
				}
			];

			actions.forEach( ( action ) => {
				const state = jetpackSSO( undefined, action );
				expect( state ).to.have.property( 'isAuthorizing', false );
			} );
		} );

		it( 'should store sso_url after authorization', () => {
			const action = deepFreeze( {
				type: JETPACK_CONNECT_SSO_AUTHORIZE_SUCCESS,
				ssoUrl: 'http://website.com'
			} );

			const state = jetpackSSO( undefined, action );

			expect( state ).to.have.property( 'ssoUrl', action.sso_url );
		} );
	} );
} );
