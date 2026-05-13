package org.egov.vendor.supervisor.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.vendor.supervisor.web.model.Supervisor;
import org.egov.vendor.supervisor.web.model.SupervisorRequest;
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
public class SupervisorEnrichmentService {

    @Autowired
    private VendorUtil vendorUtil;

    @Autowired
    private SupervisorUserService userService;

    public void enrichCreate(SupervisorRequest request) {
        Supervisor supervisor = request.getSupervisor();
        RequestInfo requestInfo = request.getRequestInfo();

        supervisor.setStatus(Supervisor.StatusEnum.ACTIVE);

        AuditDetails auditDetails = null;
        if (requestInfo.getUserInfo() != null && requestInfo.getUserInfo().getUuid() != null) {
            auditDetails = vendorUtil.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
            supervisor.setAuditDetails(auditDetails);
        }

        supervisor.setId(UUID.randomUUID().toString());
        supervisor.setName(supervisor.getOwner().getName());
        supervisor.setOwnerId(supervisor.getOwner().getUuid());
        // Denormalize mobile from owner into supervisor row
        supervisor.setMobileNo(supervisor.getOwner().getMobileNumber());
    }

    public void enrichUpdate(SupervisorRequest request) {
        Supervisor supervisor = request.getSupervisor();
        RequestInfo requestInfo = request.getRequestInfo();

        AuditDetails auditDetails = null;
        if (requestInfo.getUserInfo() != null && requestInfo.getUserInfo().getUuid() != null) {
            auditDetails = vendorUtil.getAuditDetails(requestInfo.getUserInfo().getUuid(), false);
            auditDetails.setCreatedBy(supervisor.getAuditDetails().getCreatedBy());
            auditDetails.setCreatedTime(supervisor.getAuditDetails().getCreatedTime());
            supervisor.setAuditDetails(auditDetails);
        }

        supervisor.setName(supervisor.getOwner().getName());
        supervisor.setOwnerId(supervisor.getOwner().getUuid());
        supervisor.setMobileNo(supervisor.getOwner().getMobileNumber());
    }

    public void enrichSearch(List<Supervisor> supervisors, RequestInfo requestInfo, String tenantId) {
        if (CollectionUtils.isEmpty(supervisors)) return;

        List<String> ownerIds = supervisors.stream()
                .map(Supervisor::getOwnerId)
                .collect(Collectors.toList());

        UserDetailResponse userResponse = userService.getUsers(ownerIds, tenantId, requestInfo);

        Map<String, User> ownerMap = new HashMap<>();
        if (userResponse != null && !CollectionUtils.isEmpty(userResponse.getUser())) {
            userResponse.getUser().forEach(u -> ownerMap.put(u.getUuid(), u));
        }

        supervisors.forEach(s -> s.setOwner(ownerMap.get(s.getOwnerId())));
    }
}