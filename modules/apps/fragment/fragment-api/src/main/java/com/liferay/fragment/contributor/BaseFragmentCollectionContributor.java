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

package com.liferay.fragment.contributor;

import com.liferay.fragment.constants.FragmentConstants;
import com.liferay.fragment.constants.FragmentExportImportConstants;
import com.liferay.fragment.model.FragmentEntry;
import com.liferay.fragment.model.FragmentEntryLink;
import com.liferay.fragment.service.FragmentEntryLinkLocalService;
import com.liferay.fragment.service.FragmentEntryLocalService;
import com.liferay.petra.io.StreamUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.util.FileUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;

import java.net.URL;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Jürgen Kappler
 */
public abstract class BaseFragmentCollectionContributor
	implements FragmentCollectionContributor {

	@Override
	public List<FragmentEntry> getFragmentEntries(int type) {
		return _fragmentEntries.getOrDefault(type, Collections.emptyList());
	}

	@Override
	public String getName() {
		return _name;
	}

	public abstract ServletContext getServletContext();

	@Activate
	protected void activate(BundleContext bundleContext) {
		_bundle = bundleContext.getBundle();

		readAndCheckFragmentCollectionStructure();
	}

	protected void readAndCheckFragmentCollectionStructure() {
		try {
			String name = _getContributedCollectionName();

			Enumeration<URL> enumeration = _bundle.findEntries(
				StringPool.BLANK,
				FragmentExportImportConstants.FILE_NAME_FRAGMENT_CONFIG, true);

			if (Validator.isNull(name) || !enumeration.hasMoreElements()) {
				return;
			}

			_name = name;

			while (enumeration.hasMoreElements()) {
				URL url = enumeration.nextElement();

				FragmentEntry fragmentEntry = _getFragmentEntry(url);

				_updateFragmentEntryLinks(fragmentEntry);

				List<FragmentEntry> fragmentEntryList =
					_fragmentEntries.computeIfAbsent(
						fragmentEntry.getType(), type -> new ArrayList<>());

				fragmentEntryList.add(fragmentEntry);
			}
		}
		catch (Exception e) {
			if (_log.isDebugEnabled()) {
				_log.debug(e, e);
			}
		}
	}

	@Reference
	protected FragmentEntryLinkLocalService fragmentEntryLinkLocalService;

	@Reference
	protected FragmentEntryLocalService fragmentEntryLocalService;

	private String _getContributedCollectionName() throws Exception {
		Class<?> clazz = getClass();

		String json = StreamUtil.toString(
			clazz.getResourceAsStream(
				"dependencies/" +
					FragmentExportImportConstants.FILE_NAME_COLLECTION_CONFIG));

		JSONObject jsonObject = JSONFactoryUtil.createJSONObject(json);

		return jsonObject.getString("name");
	}

	private String _getFileContent(String path, String fileName)
		throws Exception {

		Class<?> clazz = getClass();

		StringBundler sb = new StringBundler(3);

		sb.append(path);
		sb.append("/");
		sb.append(fileName);

		return StringUtil.read(clazz.getResourceAsStream(sb.toString()));
	}

	private FragmentEntry _getFragmentEntry(URL url) throws Exception {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject(
			StreamUtil.toString(url.openStream()));

		String name = jsonObject.getString("name");
		String fragmentEntryKey = StringBundler.concat(
			getFragmentCollectionKey(), StringPool.DASH,
			jsonObject.getString("fragmentEntryKey"));

		String path = FileUtil.getPath(url.getPath());

		String css = _getFileContent(path, jsonObject.getString("cssPath"));
		String html = _getFileContent(path, jsonObject.getString("htmlPath"));
		String js = _getFileContent(path, jsonObject.getString("jsPath"));
		String configuration = _getFileContent(
			path, jsonObject.getString("configurationPath"));

		String thumbnailURL = _getImagePreviewURL(
			jsonObject.getString("thumbnail"));
		int type = FragmentConstants.getTypeFromLabel(
			jsonObject.getString("type"));

		FragmentEntry fragmentEntry =
			fragmentEntryLocalService.createFragmentEntry(0L);

		fragmentEntry.setFragmentEntryKey(fragmentEntryKey);
		fragmentEntry.setName(name);
		fragmentEntry.setCss(css);
		fragmentEntry.setHtml(html);
		fragmentEntry.setJs(js);
		fragmentEntry.setConfiguration(configuration);
		fragmentEntry.setType(type);
		fragmentEntry.setImagePreviewURL(thumbnailURL);

		return fragmentEntry;
	}

	private String _getImagePreviewURL(String fileName) {
		URL url = _bundle.getResource(
			"META-INF/resources/thumbnails/" + fileName);

		if (url == null) {
			return StringPool.BLANK;
		}

		ServletContext servletContext = getServletContext();

		return servletContext.getContextPath() + "/thumbnails/" + fileName;
	}

	private void _updateFragmentEntryLinks(FragmentEntry fragmentEntry) {
		List<FragmentEntryLink> fragmentEntryLinks =
			fragmentEntryLinkLocalService.getFragmentEntryLinks(
				fragmentEntry.getFragmentEntryKey());

		for (FragmentEntryLink fragmentEntryLink : fragmentEntryLinks) {
			fragmentEntryLink.setCss(fragmentEntry.getCss());
			fragmentEntryLink.setHtml(fragmentEntry.getHtml());
			fragmentEntryLink.setJs(fragmentEntry.getJs());
			fragmentEntryLink.setConfiguration(
				fragmentEntry.getConfiguration());

			fragmentEntryLinkLocalService.updateFragmentEntryLink(
				fragmentEntryLink);
		}
	}

	private static final Log _log = LogFactoryUtil.getLog(
		BaseFragmentCollectionContributor.class);

	private Bundle _bundle;
	private final Map<Integer, List<FragmentEntry>> _fragmentEntries =
		new HashMap<>();
	private String _name;

}