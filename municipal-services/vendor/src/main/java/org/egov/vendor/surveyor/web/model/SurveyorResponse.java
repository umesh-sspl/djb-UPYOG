package org.egov.vendor.surveyor.web.model;

import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Validated
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class SurveyorResponse {

    @JsonProperty("responseInfo")
    private ResponseInfo responseInfo = null;

    @Valid
    @JsonProperty("surveyors")
    private List<Surveyor> surveyors = null;

    @JsonProperty("totalCount")
    private Integer totalCount = null;
}