package org.upyog.rs.wt.scheduler.service;

import org.springframework.stereotype.Component;
import org.upyog.rs.fixedpoint.web.model.FixedPointTimeTableDetail;
import org.upyog.rs.wt.scheduler.model.FixedPointScheduleData;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Converts existing FixedPointTimeTableDetail model into scheduler DTO.
 */
@Component
public class FixedPointSchedulerDataMapper {

    public List<FixedPointScheduleData> toSchedulerDataList(List<FixedPointTimeTableDetail> details) {
        if (details == null) return List.of();

        return details.stream()
                .map(this::toSchedulerData)
                .collect(Collectors.toList());
    }

    private FixedPointScheduleData toSchedulerData(FixedPointTimeTableDetail detail) {

        FixedPointScheduleData data = new FixedPointScheduleData();

        // 1. Map Core Identifiers
        data.setScheduleId(detail.getSystemAssignedScheduleId());
        data.setTenantId(detail.getTenantId());
        data.setFillingPointId(detail.getFillingPointId());
        data.setFixedPointId(detail.getFixedPointId());
        data.setFixedPointCode(detail.getFixedPointCode());
        data.setFixedPointName(detail.getFixedPointName());

        // 2. Map the actual Time and Quantity fields from your class
        data.setDeliveryTime(detail.getArrivalTimeDeliveryPoint());
        data.setWaterQuantity(detail.getVolumeWaterTobeDelivery() != null ? detail.getVolumeWaterTobeDelivery() : "3000");

        // 3. Map pre-assigned vehicle if available in the timetable
        data.setVehicleId(detail.getVehicleId());

        /* * NOTE: Applicant details (applicantId, mobileNumber) and Address details
         * (pincode, city, street) are NOT present in FixedPointTimeTableDetail.
         * * They will remain null here. Your FixedPointBookingSchedulerService
         * will dynamically populate them from the logged-in system user during runtime.
         */

        return data;
    }
}