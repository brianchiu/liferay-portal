<%--
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
--%>

<%@ include file="/init.jsp" %>

<%
String redirect = ParamUtil.getString(request, "redirect");

LayoutPageTemplateDisplayContext layoutPageTemplateDisplayContext = new LayoutPageTemplateDisplayContext(renderRequest, renderResponse, request);

FragmentsEditorDisplayContext fragmentsEditorDisplayContext = new FragmentsEditorDisplayContext(request, renderResponse, LayoutPageTemplateEntry.class.getName(), layoutPageTemplateDisplayContext.getLayoutPageTemplateEntryId(), layoutPageTemplateDisplayContext.isDisplayPage());

portletDisplay.setShowBackIcon(true);
portletDisplay.setURLBack(redirect);

renderResponse.setTitle(layoutPageTemplateDisplayContext.getLayoutPageTemplateEntryTitle());
%>

<liferay-editor:resources
	editorName="alloyeditor"
/>

<soy:component-renderer
	componentId='<%= renderResponse.getNamespace() + "fragmentsEditor" %>'
	context="<%= fragmentsEditorDisplayContext.getEditorContext() %>"
	module='<%= layoutsAdminDisplayContext.getModuleName() + "/js/fragments_editor/FragmentsEditor.es" %>'
	templateNamespace="com.liferay.layout.admin.web.FragmentsEditor.render"
/>

<%
JSONSerializer jsonSerializer = JSONFactoryUtil.createJSONSerializer();

StringBundler sb = new StringBundler(16);

sb.append(layoutsAdminDisplayContext.getModuleName());
sb.append("/js/fragments_editor/reducers/changes.es as ChangesReducerModule, ");
sb.append(layoutsAdminDisplayContext.getModuleName());
sb.append("/js/fragments_editor/reducers/fragments.es as FragmentsReducerModule, ");
sb.append(layoutsAdminDisplayContext.getModuleName());
sb.append("/js/fragments_editor/reducers/placeholders.es as PlaceholdersReducerModule, ");
sb.append(layoutsAdminDisplayContext.getModuleName());
sb.append("/js/fragments_editor/reducers/translations.es as TranslationsReducerModule, ");
sb.append(layoutsAdminDisplayContext.getModuleName());
sb.append("/js/fragments_editor/reducers/sidebar.es as SidebarReducerModule, ");
sb.append(layoutsAdminDisplayContext.getModuleName());
sb.append("/js/fragments_editor/store/store.es as StoreModule, ");
sb.append(layoutsAdminDisplayContext.getModuleName());
sb.append("/js/fragments_editor/reducers/dialogs.es as DialogsReducerModule, ");
sb.append(layoutsAdminDisplayContext.getModuleName());
sb.append("/js/fragments_editor/reducers/sections.es as SectionsReducerModule");
%>

<aui:script require="<%= sb.toString() %>">
	StoreModule.createStore(
		<%= jsonSerializer.serializeDeep(fragmentsEditorDisplayContext.getEditorContext()) %>,
		[
			ChangesReducerModule.saveChangesReducer,
			DialogsReducerModule.hideMappingDialogReducer,
			DialogsReducerModule.hideMappingTypeDialogReducer,
			DialogsReducerModule.openAssetTypeDialogReducer,
			DialogsReducerModule.openMappingFieldsDialogReducer,
			DialogsReducerModule.selectMappeableTypeReducer,
			FragmentsReducerModule.addFragmentEntryLinkReducer,
			FragmentsReducerModule.moveFragmentEntryLinkReducer,
			FragmentsReducerModule.removeFragmentEntryLinkReducer,
			FragmentsReducerModule.updateEditableValueReducer,
			PlaceholdersReducerModule.updateActiveItemReducer,
			PlaceholdersReducerModule.updateDropTargetReducer,
			PlaceholdersReducerModule.updateHighlightMappingReducer,
			PlaceholdersReducerModule.updateHoveredItemReducer,
			SidebarReducerModule.hideFragmentsEditorSidebarReducer,
			SidebarReducerModule.toggleFragmentsEditorSidebarReducer,
			SectionsReducerModule.addSectionReducer,
			SectionsReducerModule.moveSectionReducer,
			SectionsReducerModule.removeSectionReducer,
			TranslationsReducerModule.languageIdReducer,
			TranslationsReducerModule.translationStatusReducer
		],
		[
			'<portlet:namespace />fragmentsEditor'
		]
	);
</aui:script>