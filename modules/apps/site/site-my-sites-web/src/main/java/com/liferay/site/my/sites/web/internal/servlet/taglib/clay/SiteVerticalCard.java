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

package com.liferay.site.my.sites.web.internal.servlet.taglib.clay;

import com.liferay.frontend.taglib.clay.servlet.taglib.soy.VerticalCard;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.model.BaseModel;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.WebKeys;

import java.util.Objects;

import javax.portlet.RenderRequest;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Eudaldo Alonso
 */
public class SiteVerticalCard implements VerticalCard {

	public SiteVerticalCard(
		BaseModel<?> baseModel, RenderRequest renderRequest, String tabs1,
		int groupUsersCount) {

		_tabs1 = tabs1;
		_groupUsersCount = groupUsersCount;

		_group = (Group)baseModel;
		_request = PortalUtil.getHttpServletRequest(renderRequest);
		_themeDisplay = (ThemeDisplay)renderRequest.getAttribute(
			WebKeys.THEME_DISPLAY);
	}

	@Override
	public String getHref() {
		if (_group.getPublicLayoutsPageCount() > 0) {
			return _group.getDisplayURL(_themeDisplay, false);
		}

		if (Objects.equals(_tabs1, "my-sites") &&
			(_group.getPrivateLayoutsPageCount() > 0)) {

			return _group.getDisplayURL(_themeDisplay, true);
		}

		return null;
	}

	@Override
	public String getIcon() {
		return "sites";
	}

	@Override
	public String getImageSrc() {
		return _group.getLogoURL(_themeDisplay, false);
	}

	@Override
	public String getSubtitle() {
		return LanguageUtil.get(_request, "members") + ": " + _groupUsersCount;
	}

	@Override
	public String getTitle() {
		try {
			return _group.getDescriptiveName(_themeDisplay.getLocale());
		}
		catch (Exception e) {
		}

		return _group.getName(_themeDisplay.getLocale());
	}

	@Override
	public boolean isSelectable() {
		return false;
	}

	private final Group _group;
	private final int _groupUsersCount;
	private final HttpServletRequest _request;
	private final String _tabs1;
	private final ThemeDisplay _themeDisplay;

}