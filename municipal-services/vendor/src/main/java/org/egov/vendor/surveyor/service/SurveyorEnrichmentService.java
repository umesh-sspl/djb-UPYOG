package org.egov.vendor.surveyor.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.vendor.surveyor.web.model.Surveyor;
import org.egov.vendor.surveyor.web.model.SurveyorRequest;
import org.egov.vendor.surveyor.web.model.SurveyorSearchCriteria;
import org.egov.vendor.util.VendorUtil;
import org.egov.vendor.web.model.AuditDetails;
import org.egov.vendor.web.model.user.User;
import org.egov.vendor.web.model.user.UserDetailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SurveyorEnrichmentService {

    @Autowired
    private VendorUtil vendorUtil;

    @Autowired
    private SurveyorUserService userService;

    public void enrichCreate(SurveyorRequest request) {
        Surveyor surveyor = request.getSurveyor();
        surveyor.setStatus(Surveyor.StatusEnum.ACTIVE);
        surveyor.setId(UUID.randomUUID().toString());
        surveyor.setName(surveyor.getOwner().getName());
        surveyor.setOwnerId(surveyor.getOwner().getUuid());
        surveyor.setMobileNo(surveyor.getOwner().getMobileNumber()); // Issue 3 fix

        if (request.getRequestInfo().getUserInfo() != null
                && request.getRequestInfo().getUserInfo().getUuid() != null) {
            surveyor.setAuditDetails(vendorUtil.getAuditDetails(
                    request.getRequestInfo().getUserInfo().getUuid(), true));
        }
    }

    public void enrichUpdate(SurveyorRequest request) {
        Surveyor surveyor = request.getSurveyor();
        if (request.getRequestInfo().getUserInfo() != null
                && request.getRequestInfo().getUserInfo().getUuid() != null) {
            AuditDetails updated = vendorUtil.getAuditDetails(
                    request.getRequestInfo().getUserInfo().getUuid(), false);

            // fix — null check before accessing existing auditDetails
            if (surveyor.getAuditDetails() != null) {
                updated.setCreatedBy(surveyor.getAuditDetails().getCreatedBy());
                updated.setCreatedTime(surveyor.getAuditDetails().getCreatedTime());
            }
            surveyor.setAuditDetails(updated);
        }
        surveyor.setName(surveyor.getOwner().getName());
        surveyor.setOwnerId(surveyor.getOwner().getUuid());
        surveyor.setMobileNo(surveyor.getOwner().getMobileNumber()); // Issue 3 fix
    }

    public void enrichSearch(List<Surveyor> surveyors, RequestInfo requestInfo, String tenantId) {
        if (CollectionUtils.isEmpty(surveyors)) return;
        List<String> ownerIds = surveyors.stream()
                .map(Surveyor::getOwnerId).collect(Collectors.toList());

        SurveyorSearchCriteria criteria = SurveyorSearchCriteria.builder()
                .ids(ownerIds)
                .tenantId(tenantId)
                .build();

        UserDetailResponse userResponse = userService.getUsers(criteria, requestInfo);
        Map<String, User> uuidToUser = new HashMap<>();
        if (userResponse != null && !CollectionUtils.isEmpty(userResponse.getUser())) {
            userResponse.getUser().forEach(u -> uuidToUser.put(u.getUuid(), u));
        }
        surveyors.forEach(s -> s.setOwner(uuidToUser.get(s.getOwnerId())));
    }
}