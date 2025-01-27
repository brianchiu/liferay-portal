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

import Component from 'metal-jsx';
import Position from 'metal-position';
import {Config} from 'metal-state';
import {Drag} from 'metal-drag-drop';
import {
	focusedFieldStructure,
	pageStructure,
	ruleStructure
} from '../../util/config.es';

const withResizeableColumns = ChildComponent => {
	class ResizeableColumns extends Component {
		attached() {
			this._createResizeDrag();
		}

		disposeInternal() {
			super.disposeInternal();

			if (this._resizeDrag) {
				this._resizeDrag.dispose();
			}
		}

		isResizeEnabled() {
			const {defaultLanguageId, editingLanguageId} = this.props;

			return defaultLanguageId === editingLanguageId;
		}

		render() {
			return (
				<div class={this.isResizeEnabled() ? 'resizeable' : ''}>
					{this.renderResizeReferences()}

					<ChildComponent {...this.props} />
				</div>
			);
		}

		renderResizeReferences() {
			return [...Array(12)].map((element, index) => {
				return (
					<div
						class='ddm-resize-column'
						data-resize-column={index}
						key={index}
						ref={`resizeColumn${index}`}
					/>
				);
			});
		}

		_createResizeDrag() {
			this._resizeDrag = new Drag({
				axis: 'x',
				sources: '.resizeable .ddm-resize-handle',
				useShim: true
			});

			this._resizeDrag.on(
				Drag.Events.START,
				this._handleResizeDragStartEvent.bind(this)
			);
			this._resizeDrag.on(
				Drag.Events.DRAG,
				this._handleResizeDragEvent.bind(this)
			);
		}

		_handleResizeDragEvent(event) {
			const columnNodes = Object.keys(this.refs)
				.filter(key => key.indexOf('resizeColumn') === 0)
				.map(key => this.refs[key]);
			const {source, x} = event;
			const {store} = this.context;

			let distance = Infinity;
			let nearest;

			columnNodes.forEach(node => {
				const region = Position.getRegion(node);

				const currentDistance = Math.abs(x - region.left);

				if (currentDistance < distance) {
					distance = currentDistance;
					nearest = node;
				}
			});

			if (nearest) {
				const column = Number(nearest.dataset.resizeColumn);
				const direction = source.classList.contains(
					'ddm-resize-handle-left'
				)
					? 'left'
					: 'right';

				if (this._lastResizeColumn !== column) {
					this._lastResizeColumn = column;

					store.emit('columnResized', {
						column,
						direction,
						source
					});
				}
			}
		}

		_handleResizeDragStartEvent() {
			this._lastResizeColumn = -1;
		}
	}

	ResizeableColumns.PROPS = {
		/**
		 * @default
		 * @instance
		 * @memberof FormBuilder
		 * @type {?number}
		 */

		activePage: Config.number().value(0),

		/**
		 * @default undefined
		 * @instance
		 * @memberof FormBuilder
		 * @type {?string}
		 */

		defaultLanguageId: Config.string(),

		/**
		 * @default undefined
		 * @instance
		 * @memberof FormBuilder
		 * @type {?string}
		 */

		editingLanguageId: Config.string(),

		/**
		 * @default []
		 * @instance
		 * @memberof Sidebar
		 * @type {?(array|undefined)}
		 */

		fieldTypes: Config.array().value([]),

		/**
		 * @default {}
		 * @instance
		 * @memberof FormBuilder
		 * @type {?object}
		 */

		focusedField: focusedFieldStructure.value({}),

		/**
		 * @default []
		 * @instance
		 * @memberof FormBuilder
		 * @type {?array<object>}
		 */

		pages: Config.arrayOf(pageStructure).value([]),

		/**
		 * @instance
		 * @memberof FormBuilder
		 * @type {string}
		 */

		paginationMode: Config.string().required(),

		/**
		 * @instance
		 * @memberof FormBuilder
		 * @type {string}
		 */

		portletNamespace: Config.string().required(),

		/**
		 * @instance
		 * @memberof FormBuilder
		 * @type {string}
		 */

		rules: Config.arrayOf(ruleStructure).required(),

		/**
		 * @default undefined
		 * @instance
		 * @memberof FormRenderer
		 * @type {!string}
		 */

		spritemap: Config.string().required()
	};

	return ResizeableColumns;
};

export default withResizeableColumns;
