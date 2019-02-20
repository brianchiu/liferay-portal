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
AssetEntryResult assetEntryResult = (AssetEntryResult)request.getAttribute("view.jsp-assetEntryResult");

Group stageableGroup = themeDisplay.getScopeGroup();

if (stageableGroup.isLayout()) {
	stageableGroup = layout.getGroup();
}
%>

<div class="sheet">
	<c:if test="<%= Validator.isNotNull(assetEntryResult.getTitle()) %>">
		<div class="sheet-header">
			<h4 class="sheet-title">
				<%= assetEntryResult.getTitle() %>
			</h4>
		</div>
	</c:if>

	<div class="sheet-section">
		<div class="table-responsive">
			<table class="table table-autofit">
				<thead>
					<tr>
						<th class="table-cell-expand table-title">
							<liferay-ui:message key="title" />
						</th>

						<%
						for (String metadataField : assetPublisherDisplayContext.getMetadataFields()) {
						%>

							<th class="table-cell-expand">
								<liferay-ui:message key="<%= metadataField %>" />
							</th>

						<%
						}
						%>

						<c:if test="<%= !stageableGroup.hasStagingGroup() %>">
							<th></th>
						</c:if>
					</tr>
				</thead>

				<tbody>

					<%
					for (AssetEntry assetEntry : assetEntryResult.getAssetEntries()) {
						AssetRendererFactory<?> assetRendererFactory = AssetRendererFactoryRegistryUtil.getAssetRendererFactoryByClassNameId(assetEntry.getClassNameId());

						if (assetRendererFactory == null) {
							continue;
						}

						AssetRenderer<?> assetRenderer = null;

						try {
							assetRenderer = assetRendererFactory.getAssetRenderer(assetEntry.getClassPK());
						}
						catch (Exception e) {
							if (_log.isWarnEnabled()) {
								_log.warn(e, e);
							}
						}

						if ((assetRenderer == null) || !assetRenderer.isDisplayable()) {
							continue;
						}

						String viewURL = assetPublisherHelper.getAssetViewURL(liferayPortletRequest, liferayPortletResponse, assetRenderer, assetEntry, assetPublisherDisplayContext.isAssetLinkBehaviorViewInPortlet());
					%>

						<tr>
							<td class="table-cell-expand table-title">
								<span class="asset-anchor lfr-asset-anchor" id="<%= assetEntry.getEntryId() %>"></span>

								<c:choose>
									<c:when test="<%= Validator.isNotNull(viewURL) %>">
										<a class="text-truncate-inline" href="<%= viewURL %>">
											<span class="text-truncate"><%= HtmlUtil.escape(assetRenderer.getTitle(locale)) %></span>
										</a>
									</c:when>
									<c:otherwise>
										<span class="text-truncate-inline">
											<span class="text-truncate"><%= HtmlUtil.escape(assetRenderer.getTitle(locale)) %></span>
										</span>
									</c:otherwise>
								</c:choose>
							</td>

							<%
							for (String metadataField : assetPublisherDisplayContext.getMetadataFields()) {
							%>

								<c:choose>
									<c:when test='<%= Objects.equals(metadataField, "author") %>'>
										<td class="table-cell-expand">
											<%= HtmlUtil.escape(PortalUtil.getUserName(assetRenderer.getUserId(), assetRenderer.getUserName())) %>
										</td>
									</c:when>
									<c:when test='<%= Objects.equals(metadataField, "categories") %>'>
										<td class="table-cell-expand">
											<liferay-asset:asset-categories-summary
												className="<%= assetEntry.getClassName() %>"
												classPK="<%= assetEntry.getClassPK() %>"
												displayStyle="simple-category"
												portletURL="<%= renderResponse.createRenderURL() %>"
											/>
										</td>
									</c:when>
									<c:when test='<%= Objects.equals(metadataField, "tags") %>'>
										<td class="table-cell-expand">
											<liferay-asset:asset-tags-summary
												className="<%= assetEntry.getClassName() %>"
												classPK="<%= assetEntry.getClassPK() %>"
												portletURL="<%= renderResponse.createRenderURL() %>"
											/>
										</td>
									</c:when>
									<c:otherwise>

										<%
										String value = null;

										if (Objects.equals(metadataField, "create-date")) {
											value = dateFormatDate.format(assetEntry.getCreateDate());
										}
										else if (Objects.equals(metadataField, "modified-date")) {
											value = dateFormatDate.format(assetEntry.getModifiedDate());
										}
										else if (Objects.equals(metadataField, "publish-date")) {
											if (assetEntry.getPublishDate() == null) {
												value = StringPool.BLANK;
											}
											else {
												value = dateFormatDate.format(assetEntry.getPublishDate());
											}
										}
										else if (Objects.equals(metadataField, "expiration-date")) {
											if (assetEntry.getExpirationDate() == null) {
												value = StringPool.BLANK;
											}
											else {
												value = dateFormatDate.format(assetEntry.getExpirationDate());
											}
										}
										else if (Objects.equals(metadataField, "priority")) {
											value = String.valueOf(assetEntry.getPriority());
										}
										else if (Objects.equals(metadataField, "view-count")) {
											value = String.valueOf(assetEntry.getViewCount());
										}
										%>

										<td class="table-cell-expand-smallest">
											<liferay-ui:message key="<%= value %>" />
										</td>
									</c:otherwise>
								</c:choose>

							<%
							}
							%>

							<c:if test="<%= !stageableGroup.hasStagingGroup() %>">

								<%
								AssetEntryActionDropdownItemsProvider assetEntryActionDropdownItemsProvider = new AssetEntryActionDropdownItemsProvider(assetRenderer, assetPublisherDisplayContext.getAssetEntryActions(assetEntry.getClassName()), StringPool.BLANK, liferayPortletRequest, liferayPortletResponse);
								%>

								<td>
									<span class="table-action-link">
										<clay:dropdown-actions
											defaultEventHandler="<%= com.liferay.asset.publisher.web.internal.constants.AssetPublisherWebKeys.ASSET_ENTRY_DROPDOWN_DEFAULT_EVENT_HANDLER %>"
											dropdownItems="<%= assetEntryActionDropdownItemsProvider.getActionDropdownItems() %>"
											elementClasses="visible-interaction"
										/>
									</span>
								</td>
							</c:if>
						</tr>

					<%
					}
					%>

				</tbody>
			</table>
		</div>
	</div>
</div>

<liferay-frontend:component
	componentId="<%= com.liferay.asset.publisher.web.internal.constants.AssetPublisherWebKeys.ASSET_ENTRY_DROPDOWN_DEFAULT_EVENT_HANDLER %>"
	module="js/AssetPublisherDropdownDefaultEventHandler.es"
/>

<%!
private static Log _log = LogFactoryUtil.getLog("com_liferay_asset_publisher_web.view_asset_entry_title_list_jsp");
%>