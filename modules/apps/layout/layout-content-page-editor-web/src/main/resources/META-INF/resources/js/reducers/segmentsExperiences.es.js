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

import {
	CREATE_SEGMENTS_EXPERIENCE,
	DELETE_SEGMENTS_EXPERIENCE,
	EDIT_SEGMENTS_EXPERIENCE,
	SELECT_SEGMENTS_EXPERIENCE,
	UPDATE_SEGMENTS_EXPERIENCE_PRIORITY
} from '../actions/actions.es';
import {
	removeExperience,
	updatePageEditorLayoutData
} from '../utils/FragmentsEditorFetchUtils.es';
import {
	deepClone,
	getRowFragmentEntryLinkIds
} from '../utils/FragmentsEditorGetUtils.es';
import {setIn} from '../utils/FragmentsEditorUpdateUtils.es';
import {
	containsFragmentEntryLinkId,
	getEmptyLayoutData
} from '../utils/LayoutDataList.es';
import {EDITABLE_FRAGMENT_ENTRY_PROCESSOR} from '../utils/constants';
import {getFragmentEntryLinkContent} from './fragments.es';
import {prefixSegmentsExperienceId} from '../utils/prefixSegmentsExperienceId.es';

const CREATE_SEGMENTS_EXPERIENCE_URL =
	'/segments.segmentsexperience/add-segments-experience';

const EDIT_SEGMENTS_EXPERIENCE_URL =
	'/segments.segmentsexperience/update-segments-experience';

const UPDATE_SEGMENTS_EXPERIENCE_PRIORITY_URL =
	'/segments.segmentsexperience/update-segments-experience-priority';

/**
 * Stores a the layout data of a new experience in layoutDataList
 * @param {object} state
 * @param {Array<{segmentsExperienceId: string}>} state.layoutDataList
 * @param {object} state.layoutData
 * @param {string} state.defaultSegmentsExperienceId
 * @param {string} segmentsExperienceId The segmentsExperience id that owns this LayoutData
 * @returns {Promise}
 */
function _storeNewLayoutData(state, segmentsExperienceId) {
	const nextState = state;

	return new Promise((resolve, reject) => {
		let baseLayoutData = null;

		if (
			nextState.defaultSegmentsExperienceId ===
				nextState.segmentsExperienceId ||
			!nextState.segmentsExperienceId
		) {
			baseLayoutData = deepClone(nextState.layoutData);
		} else {
			const defaultExperienceLayoutListItem = nextState.layoutDataList.find(
				segmentedLayout => {
					return (
						segmentedLayout.segmentsExperienceId ===
						nextState.defaultSegmentsExperienceId
					);
				}
			);

			baseLayoutData =
				defaultExperienceLayoutListItem &&
				deepClone(defaultExperienceLayoutListItem.layoutData);
		}

		updatePageEditorLayoutData(baseLayoutData, segmentsExperienceId)
			.then(() => {
				nextState.layoutDataList.push({
					layoutData: baseLayoutData,
					segmentsExperienceId
				});

				return resolve(nextState);
			})
			.catch(e => {
				reject(e);
			});
	});
}

/**
 *
 * @param {object} state
 * @param {object} state.layoutData
 * @param {Array<{segmentsExperienceId: string ,layoutData: object}>} state.layoutDataList
 * @param {string} segmentsExperienceId
 * @returns {Promise}
 */
function _switchLayoutDataList(state, segmentsExperienceId) {
	let nextState = state;

	return new Promise((resolve, reject) => {
		try {
			updatePageEditorLayoutData(
				state.layoutData,
				state.segmentsExperienceId || state.defaultSegmentsExperienceId
			)
				.then(() => {
					const prevLayout = nextState.layoutData;
					const prevSegmentsExperienceId =
						state.segmentsExperienceId ||
						nextState.defaultSegmentsExperienceId;

					let layoutData = {};

					if (segmentsExperienceId === prevSegmentsExperienceId) {
						layoutData = nextState.layoutData;
					} else {
						const layoutDataItem = nextState.layoutDataList.find(
							segmentedLayout => {
								return (
									segmentedLayout.segmentsExperienceId ===
									segmentsExperienceId
								);
							}
						);

						layoutData = layoutDataItem
							? layoutDataItem.layoutData
							: getEmptyLayoutData();
					}

					nextState = setIn(nextState, ['layoutData'], layoutData);

					const newlayoutDataList = nextState.layoutDataList.map(
						segmentedLayout => {
							return segmentedLayout.segmentsExperienceId ===
								prevSegmentsExperienceId
								? Object.assign({}, segmentedLayout, {
										layoutData: prevLayout
								  })
								: segmentedLayout;
						}
					);

					nextState = setIn(
						nextState,
						['layoutDataList'],
						newlayoutDataList
					);

					resolve(nextState);
				})
				.catch(error => {
					reject(error);
				});
		} catch (e) {
			reject(e);
		}
	});
}

/**
 *
 * @param {object} state
 * @param {Array<{segmentsExperienceId: string}>} state.layoutDataList
 * @param {string} state.defaultSegmentsExperienceId
 * @returns {object}
 */
function _switchLayoutDataToDefault(state) {
	let nextState = state;

	const baseLayoutData = nextState.layoutDataList.find(layoutDataItem => {
		return (
			layoutDataItem.segmentsExperienceId ===
			nextState.defaultSegmentsExperienceId
		);
	});

	nextState = setIn(nextState, ['layoutData'], baseLayoutData.layoutData);

	return nextState;
}

/**
 *
 * @param {object} state
 * @param {Array<{segmentsExperienceId: string}>} state.layoutDataList
 * @param {string} segmentsExperienceId
 * @returns {object}
 */
function _removeLayoutDataItem(state, segmentsExperienceId) {
	let nextState = state;

	nextState = setIn(
		nextState,
		['layoutDataList'],
		nextState.layoutDataList.filter(layoutDataItem => {
			return layoutDataItem.segmentsExperienceId !== segmentsExperienceId;
		})
	);

	return nextState;
}

/**
 *
 * @param {object} state
 * @param {string} segmentsExperienceId
 * @returns {object}
 */
function _updateFragmentEntryLinks(state, segmentsExperienceId) {
	const fragmentEntryLinkIds = Object.keys(state.fragmentEntryLinks);

	const promises = fragmentEntryLinkIds.map(fragmentEntryLinkId => {
		let fragmentEntryLink = state.fragmentEntryLinks[fragmentEntryLinkId];

		return getFragmentEntryLinkContent(
			state.renderFragmentEntryURL,
			fragmentEntryLink,
			state.portletNamespace,
			segmentsExperienceId
		).then(response => {
			fragmentEntryLink = response;

			state = setIn(
				state,
				['fragmentEntryLinks', fragmentEntryLinkId],
				fragmentEntryLink
			);
		});
	});

	return Promise.all(promises).then(() => state);
}

/**
 * @param {object} state
 * @param {string} state.classNameId
 * @param {string} state.classPK
 * @param {string} state.defaultLanguageId
 * @param {string} state.defaultSegmentsExperienceId
 * @param {Array} state.layoutData
 * @param {Array<{segmentsExperienceId: string}>} state.layoutDataList
 * @param {object} action
 * @param {string} action.segmentsEntryId
 * @param {string} action.name
 * @param {string} action.type
 * @return {Promise}
 * @review
 */
function createSegmentsExperienceReducer(state, action) {
	return new Promise((resolve, reject) => {
		let nextState = state;

		if (action.type === CREATE_SEGMENTS_EXPERIENCE) {
			const {classNameId, classPK} = nextState;
			const {name, segmentsEntryId} = action;

			const nameMap = JSON.stringify({
				[state.defaultLanguageId]: name
			});

			Liferay.Service(
				CREATE_SEGMENTS_EXPERIENCE_URL,
				{
					active: true,
					classNameId,
					classPK,
					nameMap,
					segmentsEntryId,
					serviceContext: JSON.stringify({
						scopeGroupId: themeDisplay.getScopeGroupId(),
						userId: themeDisplay.getUserId()
					})
				},
				obj => {
					const {
						active,
						nameCurrentValue,
						priority,
						segmentsEntryId,
						segmentsExperienceId
					} = obj;

					nextState = setIn(
						nextState,
						['availableSegmentsExperiences', segmentsExperienceId],
						{
							active,
							name: nameCurrentValue,
							priority,
							segmentsEntryId,
							segmentsExperienceId
						}
					);

					_storeNewLayoutData(nextState, segmentsExperienceId).then(
						response => {
							_switchLayoutDataList(
								response,
								segmentsExperienceId
							)
								.then(newState => {
									let nextNewState = setIn(
										newState,
										['segmentsExperienceId'],
										segmentsExperienceId
									);

									nextNewState = _provideDefaultValueToFragments(
										nextNewState,
										segmentsExperienceId
									);

									return nextNewState;
								})
								.then(nextNewState =>
									_updateFragmentEntryLinks(
										nextNewState,
										segmentsExperienceId
									)
								)
								.then(nextNewState => resolve(nextNewState))
								.catch(e => {
									reject(e);
								});
						}
					);
				},
				error => {
					reject(error);
				}
			);
		} else {
			resolve(nextState);
		}
	});
}

/**
 * Adds content to each fragmentEntryLink editable value
 * based on the defaultSegment values, or on the defaultValue
 *
 * @param {object} state
 * @param {string} state.defaultSegmentsExperienceId
 * @param {object} state.fragmentEntryLinks
 * @param {object} state.layoutData
 * @param {string} incomingExperienceId
 * @returns {object}
 */
function _provideDefaultValueToFragments(state, incomingExperienceId) {
	const nextState = state;

	const defaultSegmentsExperienceKey = prefixSegmentsExperienceId(
		nextState.defaultSegmentsExperienceId
	);
	const incomingExperienceKey = prefixSegmentsExperienceId(
		incomingExperienceId
	);

	const newFragmentEntryLinks = Object.entries(
		nextState.fragmentEntryLinks
	).reduce((acc, entry) => {
		const [fragmentEntryLinkId, fragmentEntryLink] = entry;
		let newAcc = acc;

		const newEditableValues = Object.assign(
			{},
			fragmentEntryLink.editableValues,
			{
				[EDITABLE_FRAGMENT_ENTRY_PROCESSOR]: Object.entries(
					fragmentEntryLink.editableValues[
						EDITABLE_FRAGMENT_ENTRY_PROCESSOR
					]
				).reduce((editableAcc, editableEntry) => {
					const [editableKey, editableValue] = editableEntry;
					let newEditableValue = editableValue;

					if (editableValue[defaultSegmentsExperienceKey]) {
						newEditableValue = Object.assign({}, editableValue, {
							[incomingExperienceKey]: deepClone(
								editableValue[defaultSegmentsExperienceKey]
							)
						});
					} else {
						newEditableValue = Object.assign({}, editableValue, {
							[incomingExperienceKey]: {
								defaultValue: editableValue.defaultValue
							}
						});
					}

					return Object.assign({}, editableAcc, {
						[editableKey]: newEditableValue
					});
				}, {})
			}
		);

		const newFragmentEntryLink = Object.assign({}, fragmentEntryLink, {
			editableValues: newEditableValues
		});

		newAcc = Object.assign({}, acc, {
			[fragmentEntryLinkId]: newFragmentEntryLink
		});

		return newAcc;
	}, {});

	return setIn(nextState, ['fragmentEntryLinks'], newFragmentEntryLinks);
}

/**
 * @param {object} state
 * @param {Array} state.availableSegmentsExperiences
 * @param {string} state.defaultSegmentsExperienceId
 * @param {{structure: Array}} state.layoutData
 * @param {array} state.layoutDataList
 * @param {string} state.segmentsExperienceId
 * @param {object} action
 * @param {string} action.segmentsExperienceId
 * @param {string} action.type
 * @returns {Promise}
 */
function deleteSegmentsExperienceReducer(state, action) {
	return new Promise((resolve, reject) => {
		try {
			let nextState = state;
			if (action.type === DELETE_SEGMENTS_EXPERIENCE) {
				const {segmentsExperienceId} = action;

				const fragmentEntryLinkIds = nextState.layoutData.structure
					.reduce(
						(allFragmentEntryLinkIds, row) => [
							...allFragmentEntryLinkIds,
							...getRowFragmentEntryLinkIds(row)
						],
						[]
					)
					.filter(
						fragmentEntryLinkId =>
							!containsFragmentEntryLinkId(
								nextState.layoutDataList,
								fragmentEntryLinkId,
								segmentsExperienceId
							)
					);

				removeExperience(
					segmentsExperienceId,
					fragmentEntryLinkIds
				).then(
					() => {
						const priority =
							nextState.availableSegmentsExperiences[
								segmentsExperienceId
							].priority;

						const availableSegmentsExperiences = Object.assign(
							{},
							nextState.availableSegmentsExperiences
						);

						delete availableSegmentsExperiences[
							segmentsExperienceId
						];

						const experienceIdToSelect =
							segmentsExperienceId ===
							nextState.segmentsExperienceId
								? nextState.defaultSegmentsExperienceId
								: nextState.segmentsExperienceId;

						Object.values(availableSegmentsExperiences).forEach(
							experience => {
								const segmentExperiencePriority =
									experience.priority;

								if (segmentExperiencePriority > priority) {
									experience.priority =
										segmentExperiencePriority - 1;
								}
							}
						);

						nextState = _removeLayoutDataItem(
							nextState,
							segmentsExperienceId
						);

						nextState = _switchLayoutDataToDefault(nextState);

						nextState = setIn(
							nextState,
							['availableSegmentsExperiences'],
							availableSegmentsExperiences
						);

						nextState = setIn(
							nextState,
							['segmentsExperienceId'],
							experienceIdToSelect
						);

						resolve(nextState);
					},
					error => {
						reject(error);
					}
				);
			} else {
				resolve(nextState);
			}
		} catch (e) {
			reject(e);
		}
	});
}

/**
 *
 *
 * @export
 * @param {object} state
 * @param {object} state.layoutData
 * @param {object} state.layoutDataList
 * @param {string} state.segmentsExperienceId
 * @param {object} action
 * @param {string} action.segmentsExperienceId
 * @param {string} action.type
 * @returns {Promise}
 */
function selectSegmentsExperienceReducer(state, action) {
	return new Promise((resolve, reject) => {
		const nextState = state;
		if (action.type === SELECT_SEGMENTS_EXPERIENCE) {
			_switchLayoutDataList(nextState, action.segmentsExperienceId)
				.then(newState => {
					const nextNewState = setIn(
						newState,
						['segmentsExperienceId'],
						action.segmentsExperienceId
					);

					return nextNewState;
				})
				.then(nextNewState =>
					_updateFragmentEntryLinks(
						nextNewState,
						action.segmentsExperienceId
					)
				)
				.then(nextNewState => resolve(nextNewState))
				.catch(e => {
					reject(e);
				});
		} else {
			resolve(nextState);
		}
	});
}

/**
 * @param {object} state
 * @param {object} action
 * @param {string} action.segmentsEntryId
 * @param {string} action.name
 * @param {string} action.segmentsExperienceId
 * @param {string} action.type
 * @return {Promise}
 * @review
 */
function editSegmentsExperienceReducer(state, action) {
	return new Promise((resolve, reject) => {
		let nextState = state;
		if (action.type === EDIT_SEGMENTS_EXPERIENCE) {
			const {name, segmentsEntryId, segmentsExperienceId} = action;

			const nameMap = JSON.stringify({
				[state.defaultLanguageId]: name
			});

			Liferay.Service(
				EDIT_SEGMENTS_EXPERIENCE_URL,
				{
					active: true,
					nameMap,
					segmentsEntryId,
					segmentsExperienceId
				},
				obj => {
					const {
						active,
						nameCurrentValue,
						priority,
						segmentsEntryId,
						segmentsExperienceId
					} = obj;

					nextState = setIn(
						nextState,
						['availableSegmentsExperiences', segmentsExperienceId],
						{
							active,
							name: nameCurrentValue,
							priority,
							segmentsEntryId,
							segmentsExperienceId
						}
					);

					resolve(nextState);
				},
				error => {
					reject(error);
				}
			);
		} else {
			resolve(nextState);
		}
	});
}

/**
 *
 *
 * @param {object} state
 * @param {Array} state.availableSegmentsExperiences
 * @param {object} action
 * @param {('up' | 'down')} action.direction
 * @param {string} action.segmentsExperienceId
 * @param {number|string} action.priority
 * @param {string} action.type
 * @return {Promise}
 */
function updateSegmentsExperiencePriorityReducer(state, action) {
	return new Promise((resolve, reject) => {
		let nextState = state;

		if (action.type === UPDATE_SEGMENTS_EXPERIENCE_PRIORITY) {
			const {
				direction,
				priority: oldPriority,
				segmentsExperienceId
			} = action;

			const priority =
				typeof oldPriority === 'number'
					? oldPriority
					: parseInt(oldPriority, 10);

			const newPriority =
				direction === 'up' ? priority + 1 : priority - 1;

			Liferay.Service(UPDATE_SEGMENTS_EXPERIENCE_PRIORITY_URL, {
				newPriority,
				segmentsExperienceId
			})
				.then(() => {
					const availableSegmentsExperiencesArray = Object.values(
						nextState.availableSegmentsExperiences
					);

					const subTargetExperience = availableSegmentsExperiencesArray.find(
						experience => {
							return experience.priority === newPriority;
						}
					);

					const targetExperience = availableSegmentsExperiencesArray.find(
						experience => {
							return experience.priority === priority;
						}
					);

					nextState = setIn(
						nextState,
						[
							'availableSegmentsExperiences',
							targetExperience.segmentsExperienceId,
							'priority'
						],
						newPriority
					);

					nextState = setIn(
						nextState,
						[
							'availableSegmentsExperiences',
							subTargetExperience.segmentsExperienceId,
							'priority'
						],
						priority
					);

					resolve(nextState);
				})
				.catch(error => {
					reject(error);
				});
		} else {
			resolve(nextState);
		}
	});
}

export {
	createSegmentsExperienceReducer,
	deleteSegmentsExperienceReducer,
	editSegmentsExperienceReducer,
	updateSegmentsExperiencePriorityReducer,
	selectSegmentsExperienceReducer
};
