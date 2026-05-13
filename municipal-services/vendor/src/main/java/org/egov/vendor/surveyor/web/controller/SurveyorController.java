package org.egov.vendor.surveyor.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.vendor.surveyor.service.SurveyorService;
import org.egov.vendor.surveyor.web.model.Surveyor;
import org.egov.vendor.surveyor.web.model.SurveyorRequest;
import org.egov.vendor.surveyor.web.model.SurveyorResponse;
import org.egov.vendor.surveyor.web.model.SurveyorSearchCriteria;
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
@RequestMapping("/surveyor/v1")
public class SurveyorController {

    @Autowired
    private SurveyorService surveyorService;

    @Autowired
    private VendorUtil vendorUtil;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @PostMapping("/_create")
    public ResponseEntity<SurveyorResponse> create(
            @Valid @RequestBody SurveyorRequest surveyorRequest) throws Exception {
        vendorUtil.defaultJsonPathConfig();
        Surveyor surveyor = surveyorService.create(surveyorRequest);
        List<Surveyor> list = new ArrayList<>();
        list.add(surveyor);
        SurveyorResponse response = SurveyorResponse.builder()
                .surveyors(list)
                .responseInfo(responseInfoFactory
                        .createResponseInfoFromRequestInfo(surveyorRequest.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/_update")
    public ResponseEntity<SurveyorResponse> update(
            @Valid @RequestBody SurveyorRequest surveyorRequest) {
        vendorUtil.defaultJsonPathConfig();
        Surveyor surveyor = surveyorService.update(surveyorRequest);
        List<Surveyor> list = new ArrayList<>();
        list.add(surveyor);
        SurveyorResponse response = SurveyorResponse.builder()
                .surveyors(list)
                .responseInfo(responseInfoFactory
                        .createResponseInfoFromRequestInfo(surveyorRequest.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/_search")
    public ResponseEntity<SurveyorResponse> search(
            @Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
            @Valid @ModelAttribute SurveyorSearchCriteria criteria) {
        SurveyorResponse response = surveyorService.search(criteria,
                requestInfoWrapper.getRequestInfo());
        response.setResponseInfo(responseInfoFactory
                .createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}