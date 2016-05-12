import { combineReducers } from 'redux';
import assign from 'lodash/assign';
import omitBy from 'lodash/omitBy';

import {
	READER_FEED_REQUEST,
	READER_FEED_REQUEST_SUCCESS,
	READER_FEED_REQUEST_FAILURE,
	DESERIALIZE,
	SERIALIZE
} from 'state/action-types';

import { isValidStateWithSchema } from 'state/utils';
import { itemsSchema } from './schema';

const actionMap = {
	[ SERIALIZE ]: handleSerialize,
	[ DESERIALIZE ]: handleDeserialize,
	[ READER_FEED_REQUEST_SUCCESS ]: handleRequestSuccess,
	[ READER_FEED_REQUEST_FAILURE ]: handleRequestFailure
};

function defaultHandler( state ) {
	return state;
}

function handleSerialize( state ) {
	// remove errors from the serialized state
	return omitBy( state, 'is_error' );
}

function handleDeserialize( state ) {
	if ( isValidStateWithSchema( state, itemsSchema ) ) {
		return state;
	}
	return {};
}

function handleRequestFailure( state, action ) {
	// new object proceeds current state to prevent new errors from overwriting existing values
	return assign( {
		[ action.meta.feed_ID ]: {
			feed_ID: action.meta.feed_ID,
			is_error: true
		}
	}, state );
}

function handleRequestSuccess( state, action ) {
	return assign( {}, state, {
		[ action.payload.feed_ID ]: action.payload
	} );
}

export function items( state = {}, action ) {
	const handler = actionMap[ action.type ] || defaultHandler;
	return handler( state, action );
}

export function queuedRequests( state = {}, action ) {
	switch ( action.type ) {
		case READER_FEED_REQUEST:
		case READER_FEED_REQUEST_SUCCESS:
		case READER_FEED_REQUEST_FAILURE:
			return assign( {}, state, {
				[ action.payload.feed_ID ]: action.type === READER_FEED_REQUEST
			} );
	}
}

export default combineReducers( {
	items,
	queuedRequests
} );
