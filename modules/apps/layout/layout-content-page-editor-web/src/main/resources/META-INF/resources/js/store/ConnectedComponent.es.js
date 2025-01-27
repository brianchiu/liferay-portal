/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import React from 'react';
import {Config} from 'metal-state';
import {connect, disconnect, Store} from './store.es';
import INITIAL_STATE from './state.es';

/**
 * HOC that returns a component that connects automatically
 * to a Store parameter.
 * @param {Component} Component
 * @param {string[]} [properties=[]] List of properties to be fetched from store
 * @return {Component}
 */
const getConnectedComponent = (Component, properties) => {
	/**
	 * ConnectedComponent
	 */
	class ConnectedComponent extends Component {
		/**
		 * @inheritdoc
		 * @param {object} props
		 * @param  {...any} ...args
		 */
		constructor(props, ...args) {
			super(props, ...args);

			this.on('storeChanged', change => {
				const newStore = change.newVal;
				const prevStore = change.prevVal;

				if (newStore !== prevStore) {
					disconnect(this);

					if (newStore instanceof Store) {
						connect(
							this,
							newStore
						);
					}
				}
			});

			this.on('disposed', () => {
				disconnect(this);
			});

			if (props.store instanceof Store) {
				connect(
					this,
					props.store
				);
			}
		}
	}

	/**
	 * Connected component state
	 */
	ConnectedComponent.STATE = {
		store: Config.instanceOf(Store).value(null)
	};

	properties.forEach(property => {
		try {
			ConnectedComponent.STATE[property] = INITIAL_STATE[
				property
			].internal();
		} catch (e) {
			throw new Error(
				`${property} is not available from ${Component.name}`
			);
		}
	});

	return ConnectedComponent;
};

/**
 * Second order function to produce a Connected Component Wrapper
 *
 * @param {Function} mapStateToProps - Recieves the state and returns mapped version of it ready for consumption by the Wrapped Component
 * @param {Function} mapDispatchToProps - Recieves the dispatch and returns a set of component props that use it to call the modify the state tree
 * @param {Store} store
 * @returns
 */
function getConnectedReactComponent(
	mapStateToProps,
	mapDispatchToProps,
	store
) {
	/**
	 *
	 * @param {React.Component} WrappedComponent - The Component to connect to the store
	 * @returns {React.Component} - Wrapper Connected Component that propagates every store change mapped to the component
	 */
	return function _getConnectedWrapperComponent(WrappedComponent) {
		return class extends React.Component {
			render() {
				return (
					<WrappedComponent
						{...this.props}
						{...mapStateToProps(store.getState(), this.props)}
						{...mapDispatchToProps(store.dispatch, this.props)}
					/>
				);
			}

			componentDidMount() {
				this._subscriber = store.on(
					'change',
					this.handleChange.bind(this)
				);
			}

			componentWillUnmount() {
				this._subscriber.removeListener();
			}

			handleChange() {
				this.forceUpdate();
			}
		};
	};
}

export {getConnectedComponent, getConnectedReactComponent};
export default getConnectedComponent;
