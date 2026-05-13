package org.egov.vendor.supervisor.web.controller;

import java.util.Collections;

import javax.validation.Valid;

import org.egov.vendor.supervisor.service.SupervisorService;
import org.egov.vendor.supervisor.web.model.Supervisor;
import org.egov.vendor.supervisor.web.model.SupervisorRequest;
import org.egov.vendor.supervisor.web.model.SupervisorResponse;
import org.egov.vendor.supervisor.web.model.SupervisorSearchCriteria;
import org.egov.vendor.util.ResponseInfoFactory;
import org.egov.vendor.util.VendorUtil;
import org.egov.vendor.web.model.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/supervisor/v1")
public class SupervisorController {

    @Autowired private SupervisorService supervisorService;
    @Autowired private VendorUtil vendorUtil;
    @Autowired private ResponseInfoFactory responseInfoFactory;

    @PostMapping("/_create")
    public ResponseEntity<SupervisorResponse> create(
            @Valid @RequestBody SupervisorRequest request) {

        vendorUtil.defaultJsonPathConfig();
        Supervisor supervisor = supervisorService.create(request);
        SupervisorResponse response = SupervisorResponse.builder()
                .supervisors(Collections.singletonList(supervisor))
                .responseInfo(responseInfoFactory
                        .createResponseInfoFromRequestInfo(request.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/_update")
    public ResponseEntity<SupervisorResponse> update(
            @Valid @RequestBody SupervisorRequest request) {

        vendorUtil.defaultJsonPathConfig();
        Supervisor supervisor = supervisorService.update(request);
        SupervisorResponse response = SupervisorResponse.builder()
                .supervisors(Collections.singletonList(supervisor))
                .responseInfo(responseInfoFactory
                        .createResponseInfoFromRequestInfo(request.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/_search")
    public ResponseEntity<SupervisorResponse> search(
            @Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
            @Valid @ModelAttribute SupervisorSearchCriteria criteria) {

        SupervisorResponse response = supervisorService.search(criteria,
                requestInfoWrapper.getRequestInfo());
        response.setResponseInfo(responseInfoFactory
                .createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}