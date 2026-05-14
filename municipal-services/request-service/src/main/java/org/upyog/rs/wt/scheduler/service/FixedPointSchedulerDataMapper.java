package org.upyog.rs.wt.scheduler.service;

import org.springframework.stereotype.Component;
import org.upyog.rs.fixedpoint.web.model.FixedPointTimeTableDetail;
import org.upyog.rs.wt.scheduler.model.FixedPointScheduleData;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Converts existing FixedPointTimeTableDetail model into scheduler DTO.
 *
 * Adjust getter names if your FixedPointTimeTableDetail fields are different.
 */
@Component
public class FixedPointSchedulerDataMapper {

    public List<FixedPointScheduleData> toSchedulerDataList(
            List<FixedPointTimeTableDetail> details
    ) {
        return details.stream()
                .map(this::toSchedulerData)
                .collect(Collectors.toList());
    }

    private FixedPointScheduleData toSchedulerData(FixedPointTimeTableDetail detail) {

        FixedPointScheduleData data = new FixedPointScheduleData();

//        data.setScheduleId(detail.getId());
        data.setTenantId(detail.getTenantId());

        data.setFillingPointId(detail.getFillingPointId());
        data.setFixedPointId(detail.getFixedPointId());
        data.setFixedPointCode(detail.getFixedPointId());

//        if (detail.getDeliveryTime() != null) {
//            data.setDeliveryTime(LocalTime.parse(detail.getDeliveryTime()));
//        }
//
//        if (detail.getWaterQuantity() != null) {
//            data.setWaterQuantity(Integer.parseInt(detail.getWaterQuantity()));
//        }

//        data.setApplicantId(detail.getApplicantId());
//        data.setFixedPointName(detail.getName());
//        data.setMobileNumber(detail.getMobileNumber());
//        data.setAlternateNumber(detail.getAlternateNumber());
//        data.setEmailId(detail.getEmailId());
//
//        data.setAddressId(detail.getAddressId());
//        data.setPincode(detail.getPincode());
//        data.setCity(detail.getCity());
//        data.setCityCode(detail.getCityCode());
//        data.setAddressLine1(detail.getAddressLine1());
//        data.setAddressLine2(detail.getAddressLine2());
//        data.setLocality(detail.getLocality());
//        data.setLocalityCode(detail.getLocalityCode());
//        data.setStreetName(detail.getStreetName());
//        data.setHouseNo(detail.getHouseNo());
//        data.setLandmark(detail.getLandmark());
//        data.setLatitude(detail.getLatitude());
//        data.setLongitude(detail.getLongitude());
//        data.setWard(detail.getWard());
//        data.setZone(detail.getZone());
//        data.setConstituency(detail.getConstituency());

        return data;
    }
}