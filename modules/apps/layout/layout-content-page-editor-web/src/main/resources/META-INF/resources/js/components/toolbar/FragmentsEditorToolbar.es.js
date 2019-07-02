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

import Component from 'metal-component';
import {Config} from 'metal-state';
import Soy from 'metal-soy';

import './TranslationStatus.es';
import './SegmentsExperienceSelector.es';
import getConnectedComponent from '../../store/ConnectedComponent.es';
import templates from './FragmentsEditorToolbar.soy';
import {TOGGLE_SIDEBAR} from '../../actions/actions.es';

/**
 * FragmentsEditorToolbar
 * @review
 */
class FragmentsEditorToolbar extends Component {
	/**
	 * @inheritdoc
	 * @review
	 */
	created() {
		this._handleWindowOnline = this._handleWindowOnline.bind(this);
		this._handleWindowOffline = this._handleWindowOffline.bind(this);

		window.addEventListener('online', this._handleWindowOnline);
		window.addEventListener('offline', this._handleWindowOffline);
	}

	/**
	 * @inheritdoc
	 * @review
	 */
	disposed() {
		window.removeEventListener('online', this._handleWindowOnline);
		window.removeEventListener('offline', this._handleWindowOffline);
	}

	/**
	 * Handles discard draft form submit action.
	 * @private
	 * @review
	 */
	_handleDiscardDraft(event) {
		if (
			!confirm(
				Liferay.Language.get(
					'are-you-sure-you-want-to-discard-current-draft-and-apply-latest-published-changes'
				)
			)
		) {
			event.preventDefault();
		}
	}

	/**
	 * @private
	 * @review
	 */
	_handleToggleContextualSidebarButtonClick() {
		this.store.dispatch({
			type: TOGGLE_SIDEBAR
		});
	}

	/**
	 * Sets online status to true
	 */
	_handleWindowOnline() {
		this._online = true;
	}

	/**
	 * Sets online status to false
	 */
	_handleWindowOffline() {
		this._online = false;
	}
}

FragmentsEditorToolbar.STATE = {
	/**
	 * If fragments editor is online
	 * @default true
	 * @instance
	 * @memberof FragmentsEditorToolbar
	 * @private
	 * @review
	 * @type {boolean}
	 */
	_online: Config.bool()
		.internal()
		.value(true)
};

const ConnectedFragmentsEditorToolbar = getConnectedComponent(
	FragmentsEditorToolbar,
	[
		'classPK',
		'discardDraftRedirectURL',
		'discardDraftURL',
		'lastSaveDate',
		'portletNamespace',
		'publishURL',
		'redirectURL',
		'savingChanges',
		'selectedSidebarPanelId',
		'spritemap'
	]
);

Soy.register(ConnectedFragmentsEditorToolbar, templates);

export {ConnectedFragmentsEditorToolbar, FragmentsEditorToolbar};
export default ConnectedFragmentsEditorToolbar;
