/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	READER_FEED_REQUEST,
	READER_FEED_REQUEST_SUCCESS,
	READER_FEED_REQUEST_FAILURE
} from 'state/action-types';

import {
	entries
} from '../reducer';

describe( 'reducer', () => {
	it( 'should return an empty map by default', () => {
		expect( entries( undefined, {} ) ).to.equal( {} );
	} );

	it( 'should update the state when receiving a feed', () => {
		expect(
			entries( {}, {
				type: READER_FEED_REQUEST_SUCCESS,
				payload: {
					feed_ID: 1,
					blog_ID: 2
				}
			} ).get( 1 )
		).to.equal( {
			feed_ID: 1,
			blog_ID: 2
		} );
	} );

	it( 'should serialize feed entries', () => {

	} );

	it( 'should stash an error object in the map if the request fails', () => {
	} );

	it( 'should overwrite an existing entry on receiving a new feed', () => {

	} );

	it( 'should leave an existing entry alone if an error is received', () => {

	} );

	it( 'should ', () => {

	} );
} );
