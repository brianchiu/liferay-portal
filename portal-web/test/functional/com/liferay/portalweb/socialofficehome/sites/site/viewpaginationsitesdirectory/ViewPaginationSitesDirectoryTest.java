/**
 * Copyright (c) 2000-2013 Liferay, Inc. All rights reserved.
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

package com.liferay.portalweb.socialofficehome.sites.site.viewpaginationsitesdirectory;

import com.liferay.portalweb.portal.BaseTestCase;
import com.liferay.portalweb.portal.util.RuntimeVariables;

/**
 * @author Brian Wing Shun Chan
 */
public class ViewPaginationSitesDirectoryTest extends BaseTestCase {
	public void testViewPaginationSitesDirectory() throws Exception {
		selenium.selectWindow("null");
		selenium.selectFrame("relative=top");
		selenium.open("/user/joebloggs/so/dashboard/");
		selenium.waitForVisible("//li[contains(@class, 'selected')]/a/span");
		assertEquals(RuntimeVariables.replace("Dashboard"),
			selenium.getText("//li[contains(@class, 'selected')]/a/span"));
		selenium.waitForVisible("link=View All (12)");
		assertEquals(RuntimeVariables.replace("View All (12)"),
			selenium.getText("link=View All (12)"));
		selenium.clickAt("link=View All (12)",
			RuntimeVariables.replace("View All (12)"));
		Thread.sleep(1000);
		selenium.waitForVisible("xPath=(//h1[@class='header-title']/span)[1]");
		assertEquals(RuntimeVariables.replace("Directory"),
			selenium.getText("xPath=(//h1[@class='header-title']/span)[1]"));
		assertEquals(RuntimeVariables.replace("Liferay, Inc."),
			selenium.getText("xPath=(//span[4]/a)"));
		assertEquals(RuntimeVariables.replace("Liferay"),
			selenium.getText("xPath=(//span[4]/a)[2]"));
		assertEquals(RuntimeVariables.replace("Open Site1 Name"),
			selenium.getText("xPath=(//span[4]/a)[3]"));
		assertEquals(RuntimeVariables.replace("Open Site10 Name"),
			selenium.getText("xPath=(//span[4]/a)[4]"));
		assertEquals(RuntimeVariables.replace("Open Site2 Name"),
			selenium.getText("xPath=(//span[4]/a)[5]"));
		assertEquals(RuntimeVariables.replace("Open Site3 Name"),
			selenium.getText("xPath=(//span[4]/a)[6]"));
		assertEquals(RuntimeVariables.replace("Open Site4 Name"),
			selenium.getText("xPath=(//span[4]/a)[7]"));
		assertEquals(RuntimeVariables.replace("Open Site5 Name"),
			selenium.getText("xPath=(//span[4]/a)[8]"));
		assertEquals(RuntimeVariables.replace("Open Site6 Name"),
			selenium.getText("xPath=(//span[4]/a)[9]"));
		assertEquals(RuntimeVariables.replace("Open Site7 Name"),
			selenium.getText("xPath=(//span[4]/a)[10]"));
		assertEquals(RuntimeVariables.replace("Page 1 of 2"),
			selenium.getText("//div[3]/div/span[@class='page-indicator']"));
		selenium.clickAt("//span[2]/span/input",
			RuntimeVariables.replace("Next"));
		Thread.sleep(1000);
		assertEquals(RuntimeVariables.replace("Open Site8 Name"),
			selenium.getText("xPath=(//span[4]/a)"));
		assertEquals(RuntimeVariables.replace("Open Site9 Name"),
			selenium.getText("xPath=(//span[4]/a)[2]"));
		assertEquals(RuntimeVariables.replace("Page 2 of 2"),
			selenium.getText("//div[3]/div/span[@class='page-indicator']"));
	}
}