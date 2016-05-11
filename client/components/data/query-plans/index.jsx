/**
 * External dependencies
 */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/**
 * Internal dependencies
 */
import { isRequestingPlans } from 'state/plans/selectors';
import { requestPlans } from 'state/plans/actions';

class QueryPlans extends Component {

	constructor( props ) {
		super( props );
		this.requestPlans = this.requestPlans.bind( this );
	}

	componentWillMount() {
		this.requestPlans();
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.requestingPlans ) {
			return;
		}
		this.requestPlans( nextProps );
	}

	requestPlans( props = this.props ) {
		console.log( `-> requestingPlans -> `, props.requestingPlans );
		console.log( `-> props.requestPlans -> `, props.requestPlans );
		console.trace();

		if ( ! props.requestingPlans ) {
			props.requestPlans();
		}
	}

	render() {
		return null;
	}
}

QueryPlans.propTypes = {
	requestingPlans: PropTypes.bool,
	requestPlans: PropTypes.func
};

QueryPlans.defaultProps = {
	requestPlans: () => {}
};

export default connect(
	state => {
		return {
			requestingPlans: isRequestingPlans( state )
		};
	},
	dispatch => {
		return bindActionCreators( { requestPlans }, dispatch );
	}
)( QueryPlans );
