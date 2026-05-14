package org.upyog.rs.constant;

import javax.validation.constraints.NotNull;

public class WaterTankerConstants {

	public static final String TANKER_TYPE = "TANKER";
	public static final String WATER_TYPE = "DRINKING_WATER";

	public static final int TANKER_QUANTITY = 1;

	public static final String BOOKING_STATUS_CREATED = "BOOKING_CREATED";

	public static final String WORKFLOW_ACTION_CREATE = "CREATE";
	public static final String WORKFLOW_BUSINESS_SERVICE_FIXED_POINT = "watertanker-fixedpoint";
	public static final String WORKFLOW_MODULE_NAME = "request-service.water_tanker";

	public static final String APPLICANT_TYPE_FIXED_POINT = "FIXED-POINT";
	public static final String APPLICATION_TYPE_FIXED_POINT = "FIXED_POINT";

	public static final String ADDRESS_TYPE_PERMANENT = "PERMANENT";
	public static final String BOOKING_CREATED_BY_SYSTEM = "SYSTEM";

	public static final String ROLE_SYSTEM = "SYSTEM";
	public static final String ROLE_WT_CEMP = "WT_CEMP";

	public static final @NotNull int WATER_QUANTITY = 4000;
}
