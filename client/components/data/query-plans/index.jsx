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
import { fetchWordPressPlans as fetchPlans } from 'state/plans/actions';

class QueryPlans extends Component {

	constructor( props ) {
		super( props );
		this.requestPlans = this.requestPlans.bind( this );
	}

	requestPlans( props = this.props ) {
		if ( ! props.requestingPlans ) {
			props.fetchPlans();
		}
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

	render() {
		return null;
	}
}

QueryPlans.propTypes = {
	requestingPlans: PropTypes.bool,
	fetchPlans: PropTypes.func
};

QueryPlans.defaultProps = {
	fetchPlans: () => {}
};

export default connect(
	state => {
		return {
			requestingPlans: isRequestingPlans( state )
		};
	},
	dispatch => {
		return bindActionCreators( {
			fetchPlans
		}, dispatch );
	}
)( QueryPlans );
