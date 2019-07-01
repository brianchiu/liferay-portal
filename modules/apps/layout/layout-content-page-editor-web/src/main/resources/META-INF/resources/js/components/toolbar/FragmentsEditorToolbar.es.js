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
}

const ConnectedFragmentsEditorToolbar = getConnectedComponent(
	FragmentsEditorToolbar,
	[
		'classPK',
		'discardDraftRedirectURL',
		'discardDraftURL',
		'lastSaveDate',
		'online',
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
