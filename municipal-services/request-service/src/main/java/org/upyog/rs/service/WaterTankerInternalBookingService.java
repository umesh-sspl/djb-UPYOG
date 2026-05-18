package org.upyog.rs.service;

import org.egov.common.contract.request.RequestInfo;
import org.upyog.rs.web.models.waterTanker.WaterTankerBookingRequest;

/**
 * Adapter service for calling existing booking creation logic internally.
 */
public interface WaterTankerInternalBookingService {

    RequestInfo buildSystemRequestInfo(String tenantId);

    void createBooking(WaterTankerBookingRequest request);
}