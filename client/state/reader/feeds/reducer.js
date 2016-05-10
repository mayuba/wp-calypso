import { combineReducers } from 'redux';
import assign from 'lodash/assign';

import {
	READER_FEED_REQUEST,
	READER_FEED_REQUEST_SUCCESS,
	READER_FEED_REQUEST_FAILURE
} from 'state/action-types';

const actionMap = {
	[ READER_FEED_REQUEST_SUCCESS ]: handleRequestSuccess,
	[ READER_FEED_REQUEST_FAILURE ]: handleRequestFailure
};

function defaultHandler( state ) {
	return state;
}

function handleRequestFailure( state, action ) {
	return state;
}

function handleRequestSuccess( state, action ) {
	return assign( {
		[ action.payload.feed_ID ]: action.payload
	}, state );
}

export function entries( state = {}, action ) {
	const handler = actionMap[ action.type ] || defaultHandler;
	return handler( state, action );
}

export default combineReducers( {
	entries
} );
