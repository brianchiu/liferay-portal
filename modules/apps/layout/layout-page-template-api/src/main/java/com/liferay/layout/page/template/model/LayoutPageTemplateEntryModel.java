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

package com.liferay.layout.page.template.model;

import aQute.bnd.annotation.ProviderType;

import com.liferay.expando.kernel.model.ExpandoBridge;

import com.liferay.portal.kernel.bean.AutoEscape;
import com.liferay.portal.kernel.model.BaseModel;
import com.liferay.portal.kernel.model.CacheModel;
import com.liferay.portal.kernel.model.ShardedModel;
import com.liferay.portal.kernel.model.StagedGroupedModel;
import com.liferay.portal.kernel.model.TypedModel;
import com.liferay.portal.kernel.model.WorkflowedModel;
import com.liferay.portal.kernel.service.ServiceContext;

import java.io.Serializable;

import java.util.Date;

/**
 * The base model interface for the LayoutPageTemplateEntry service. Represents a row in the &quot;LayoutPageTemplateEntry&quot; database table, with each column mapped to a property of this class.
 *
 * <p>
 * This interface and its corresponding implementation {@link com.liferay.layout.page.template.model.impl.LayoutPageTemplateEntryModelImpl} exist only as a container for the default property accessors generated by ServiceBuilder. Helper methods and all application logic should be put in {@link com.liferay.layout.page.template.model.impl.LayoutPageTemplateEntryImpl}.
 * </p>
 *
 * @author Brian Wing Shun Chan
 * @see LayoutPageTemplateEntry
 * @see com.liferay.layout.page.template.model.impl.LayoutPageTemplateEntryImpl
 * @see com.liferay.layout.page.template.model.impl.LayoutPageTemplateEntryModelImpl
 * @generated
 */
@ProviderType
public interface LayoutPageTemplateEntryModel extends BaseModel<LayoutPageTemplateEntry>,
	ShardedModel, StagedGroupedModel, TypedModel, WorkflowedModel {
	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. All methods that expect a layout page template entry model instance should use the {@link LayoutPageTemplateEntry} interface instead.
	 */

	/**
	 * Returns the primary key of this layout page template entry.
	 *
	 * @return the primary key of this layout page template entry
	 */
	public long getPrimaryKey();

	/**
	 * Sets the primary key of this layout page template entry.
	 *
	 * @param primaryKey the primary key of this layout page template entry
	 */
	public void setPrimaryKey(long primaryKey);

	/**
	 * Returns the uuid of this layout page template entry.
	 *
	 * @return the uuid of this layout page template entry
	 */
	@AutoEscape
	@Override
	public String getUuid();

	/**
	 * Sets the uuid of this layout page template entry.
	 *
	 * @param uuid the uuid of this layout page template entry
	 */
	@Override
	public void setUuid(String uuid);

	/**
	 * Returns the layout page template entry ID of this layout page template entry.
	 *
	 * @return the layout page template entry ID of this layout page template entry
	 */
	public long getLayoutPageTemplateEntryId();

	/**
	 * Sets the layout page template entry ID of this layout page template entry.
	 *
	 * @param layoutPageTemplateEntryId the layout page template entry ID of this layout page template entry
	 */
	public void setLayoutPageTemplateEntryId(long layoutPageTemplateEntryId);

	/**
	 * Returns the group ID of this layout page template entry.
	 *
	 * @return the group ID of this layout page template entry
	 */
	@Override
	public long getGroupId();

	/**
	 * Sets the group ID of this layout page template entry.
	 *
	 * @param groupId the group ID of this layout page template entry
	 */
	@Override
	public void setGroupId(long groupId);

	/**
	 * Returns the company ID of this layout page template entry.
	 *
	 * @return the company ID of this layout page template entry
	 */
	@Override
	public long getCompanyId();

	/**
	 * Sets the company ID of this layout page template entry.
	 *
	 * @param companyId the company ID of this layout page template entry
	 */
	@Override
	public void setCompanyId(long companyId);

	/**
	 * Returns the user ID of this layout page template entry.
	 *
	 * @return the user ID of this layout page template entry
	 */
	@Override
	public long getUserId();

	/**
	 * Sets the user ID of this layout page template entry.
	 *
	 * @param userId the user ID of this layout page template entry
	 */
	@Override
	public void setUserId(long userId);

	/**
	 * Returns the user uuid of this layout page template entry.
	 *
	 * @return the user uuid of this layout page template entry
	 */
	@Override
	public String getUserUuid();

	/**
	 * Sets the user uuid of this layout page template entry.
	 *
	 * @param userUuid the user uuid of this layout page template entry
	 */
	@Override
	public void setUserUuid(String userUuid);

	/**
	 * Returns the user name of this layout page template entry.
	 *
	 * @return the user name of this layout page template entry
	 */
	@AutoEscape
	@Override
	public String getUserName();

	/**
	 * Sets the user name of this layout page template entry.
	 *
	 * @param userName the user name of this layout page template entry
	 */
	@Override
	public void setUserName(String userName);

	/**
	 * Returns the create date of this layout page template entry.
	 *
	 * @return the create date of this layout page template entry
	 */
	@Override
	public Date getCreateDate();

	/**
	 * Sets the create date of this layout page template entry.
	 *
	 * @param createDate the create date of this layout page template entry
	 */
	@Override
	public void setCreateDate(Date createDate);

	/**
	 * Returns the modified date of this layout page template entry.
	 *
	 * @return the modified date of this layout page template entry
	 */
	@Override
	public Date getModifiedDate();

	/**
	 * Sets the modified date of this layout page template entry.
	 *
	 * @param modifiedDate the modified date of this layout page template entry
	 */
	@Override
	public void setModifiedDate(Date modifiedDate);

	/**
	 * Returns the layout page template collection ID of this layout page template entry.
	 *
	 * @return the layout page template collection ID of this layout page template entry
	 */
	public long getLayoutPageTemplateCollectionId();

	/**
	 * Sets the layout page template collection ID of this layout page template entry.
	 *
	 * @param layoutPageTemplateCollectionId the layout page template collection ID of this layout page template entry
	 */
	public void setLayoutPageTemplateCollectionId(
		long layoutPageTemplateCollectionId);

	/**
	 * Returns the fully qualified class name of this layout page template entry.
	 *
	 * @return the fully qualified class name of this layout page template entry
	 */
	@Override
	public String getClassName();

	public void setClassName(String className);

	/**
	 * Returns the class name ID of this layout page template entry.
	 *
	 * @return the class name ID of this layout page template entry
	 */
	@Override
	public long getClassNameId();

	/**
	 * Sets the class name ID of this layout page template entry.
	 *
	 * @param classNameId the class name ID of this layout page template entry
	 */
	@Override
	public void setClassNameId(long classNameId);

	/**
	 * Returns the class type ID of this layout page template entry.
	 *
	 * @return the class type ID of this layout page template entry
	 */
	public long getClassTypeId();

	/**
	 * Sets the class type ID of this layout page template entry.
	 *
	 * @param classTypeId the class type ID of this layout page template entry
	 */
	public void setClassTypeId(long classTypeId);

	/**
	 * Returns the name of this layout page template entry.
	 *
	 * @return the name of this layout page template entry
	 */
	@AutoEscape
	public String getName();

	/**
	 * Sets the name of this layout page template entry.
	 *
	 * @param name the name of this layout page template entry
	 */
	public void setName(String name);

	/**
	 * Returns the type of this layout page template entry.
	 *
	 * @return the type of this layout page template entry
	 */
	public int getType();

	/**
	 * Sets the type of this layout page template entry.
	 *
	 * @param type the type of this layout page template entry
	 */
	public void setType(int type);

	/**
	 * Returns the preview file entry ID of this layout page template entry.
	 *
	 * @return the preview file entry ID of this layout page template entry
	 */
	public long getPreviewFileEntryId();

	/**
	 * Sets the preview file entry ID of this layout page template entry.
	 *
	 * @param previewFileEntryId the preview file entry ID of this layout page template entry
	 */
	public void setPreviewFileEntryId(long previewFileEntryId);

	/**
	 * Returns the default template of this layout page template entry.
	 *
	 * @return the default template of this layout page template entry
	 */
	public boolean getDefaultTemplate();

	/**
	 * Returns <code>true</code> if this layout page template entry is default template.
	 *
	 * @return <code>true</code> if this layout page template entry is default template; <code>false</code> otherwise
	 */
	public boolean isDefaultTemplate();

	/**
	 * Sets whether this layout page template entry is default template.
	 *
	 * @param defaultTemplate the default template of this layout page template entry
	 */
	public void setDefaultTemplate(boolean defaultTemplate);

	/**
	 * Returns the layout prototype ID of this layout page template entry.
	 *
	 * @return the layout prototype ID of this layout page template entry
	 */
	public long getLayoutPrototypeId();

	/**
	 * Sets the layout prototype ID of this layout page template entry.
	 *
	 * @param layoutPrototypeId the layout prototype ID of this layout page template entry
	 */
	public void setLayoutPrototypeId(long layoutPrototypeId);

	/**
	 * Returns the last publish date of this layout page template entry.
	 *
	 * @return the last publish date of this layout page template entry
	 */
	@Override
	public Date getLastPublishDate();

	/**
	 * Sets the last publish date of this layout page template entry.
	 *
	 * @param lastPublishDate the last publish date of this layout page template entry
	 */
	@Override
	public void setLastPublishDate(Date lastPublishDate);

	/**
	 * Returns the status of this layout page template entry.
	 *
	 * @return the status of this layout page template entry
	 */
	@Override
	public int getStatus();

	/**
	 * Sets the status of this layout page template entry.
	 *
	 * @param status the status of this layout page template entry
	 */
	@Override
	public void setStatus(int status);

	/**
	 * Returns the status by user ID of this layout page template entry.
	 *
	 * @return the status by user ID of this layout page template entry
	 */
	@Override
	public long getStatusByUserId();

	/**
	 * Sets the status by user ID of this layout page template entry.
	 *
	 * @param statusByUserId the status by user ID of this layout page template entry
	 */
	@Override
	public void setStatusByUserId(long statusByUserId);

	/**
	 * Returns the status by user uuid of this layout page template entry.
	 *
	 * @return the status by user uuid of this layout page template entry
	 */
	@Override
	public String getStatusByUserUuid();

	/**
	 * Sets the status by user uuid of this layout page template entry.
	 *
	 * @param statusByUserUuid the status by user uuid of this layout page template entry
	 */
	@Override
	public void setStatusByUserUuid(String statusByUserUuid);

	/**
	 * Returns the status by user name of this layout page template entry.
	 *
	 * @return the status by user name of this layout page template entry
	 */
	@AutoEscape
	@Override
	public String getStatusByUserName();

	/**
	 * Sets the status by user name of this layout page template entry.
	 *
	 * @param statusByUserName the status by user name of this layout page template entry
	 */
	@Override
	public void setStatusByUserName(String statusByUserName);

	/**
	 * Returns the status date of this layout page template entry.
	 *
	 * @return the status date of this layout page template entry
	 */
	@Override
	public Date getStatusDate();

	/**
	 * Sets the status date of this layout page template entry.
	 *
	 * @param statusDate the status date of this layout page template entry
	 */
	@Override
	public void setStatusDate(Date statusDate);

	/**
	 * Returns the plid of this layout page template entry.
	 *
	 * @return the plid of this layout page template entry
	 */
	public long getPlid();

	/**
	 * Sets the plid of this layout page template entry.
	 *
	 * @param plid the plid of this layout page template entry
	 */
	public void setPlid(long plid);

	/**
	 * Returns <code>true</code> if this layout page template entry is approved.
	 *
	 * @return <code>true</code> if this layout page template entry is approved; <code>false</code> otherwise
	 */
	@Override
	public boolean isApproved();

	/**
	 * Returns <code>true</code> if this layout page template entry is denied.
	 *
	 * @return <code>true</code> if this layout page template entry is denied; <code>false</code> otherwise
	 */
	@Override
	public boolean isDenied();

	/**
	 * Returns <code>true</code> if this layout page template entry is a draft.
	 *
	 * @return <code>true</code> if this layout page template entry is a draft; <code>false</code> otherwise
	 */
	@Override
	public boolean isDraft();

	/**
	 * Returns <code>true</code> if this layout page template entry is expired.
	 *
	 * @return <code>true</code> if this layout page template entry is expired; <code>false</code> otherwise
	 */
	@Override
	public boolean isExpired();

	/**
	 * Returns <code>true</code> if this layout page template entry is inactive.
	 *
	 * @return <code>true</code> if this layout page template entry is inactive; <code>false</code> otherwise
	 */
	@Override
	public boolean isInactive();

	/**
	 * Returns <code>true</code> if this layout page template entry is incomplete.
	 *
	 * @return <code>true</code> if this layout page template entry is incomplete; <code>false</code> otherwise
	 */
	@Override
	public boolean isIncomplete();

	/**
	 * Returns <code>true</code> if this layout page template entry is pending.
	 *
	 * @return <code>true</code> if this layout page template entry is pending; <code>false</code> otherwise
	 */
	@Override
	public boolean isPending();

	/**
	 * Returns <code>true</code> if this layout page template entry is scheduled.
	 *
	 * @return <code>true</code> if this layout page template entry is scheduled; <code>false</code> otherwise
	 */
	@Override
	public boolean isScheduled();

	@Override
	public boolean isNew();

	@Override
	public void setNew(boolean n);

	@Override
	public boolean isCachedModel();

	@Override
	public void setCachedModel(boolean cachedModel);

	@Override
	public boolean isEscapedModel();

	@Override
	public Serializable getPrimaryKeyObj();

	@Override
	public void setPrimaryKeyObj(Serializable primaryKeyObj);

	@Override
	public ExpandoBridge getExpandoBridge();

	@Override
	public void setExpandoBridgeAttributes(BaseModel<?> baseModel);

	@Override
	public void setExpandoBridgeAttributes(ExpandoBridge expandoBridge);

	@Override
	public void setExpandoBridgeAttributes(ServiceContext serviceContext);

	@Override
	public Object clone();

	@Override
	public int compareTo(LayoutPageTemplateEntry layoutPageTemplateEntry);

	@Override
	public int hashCode();

	@Override
	public CacheModel<LayoutPageTemplateEntry> toCacheModel();

	@Override
	public LayoutPageTemplateEntry toEscapedModel();

	@Override
	public LayoutPageTemplateEntry toUnescapedModel();

	@Override
	public String toString();

	@Override
	public String toXmlString();
}