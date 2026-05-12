package org.upyog.rs.service.impl;

import java.util.*;

import digit.models.coremodels.UserDetailResponse;
import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.upyog.rs.config.RequestServiceConfiguration;
import org.upyog.rs.constant.RequestServiceConstants;
import org.upyog.rs.enums.RequestServiceStatus;
import org.upyog.rs.exception.DuplicateMobileNumberException;
import org.upyog.rs.repository.RequestServiceRepository;
import org.upyog.rs.service.DemandService;
import org.upyog.rs.service.EnrichmentService;
import org.upyog.rs.service.UserService;
import org.upyog.rs.service.WaterTankerService;
import org.upyog.rs.service.WorkflowService;
import org.upyog.rs.web.models.ApplicantDetail;
import org.upyog.rs.web.models.CriteriyaSearchDto;
import org.upyog.rs.web.models.RequestDetailsByDriverId;
import org.upyog.rs.web.models.waterTanker.*;
import org.upyog.rs.web.models.Workflow;
import org.upyog.rs.web.models.workflow.State;

import digit.models.coremodels.PaymentRequest;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class WaterTankerServiceImpl implements WaterTankerService {

	@Autowired
	EnrichmentService enrichmentService;

	@Autowired
	RequestServiceRepository requestServiceRepository;

	@Autowired
	WorkflowService workflowService;

	@Autowired
	DemandService demandService;

	@Autowired
	RequestServiceConfiguration config;

	@Autowired
	private UserService userService;


//	@Autowired
//	private FillingPointRepository fillingPointRepository;

//	@Override
//	public WaterTankerBookingDetail createNewWaterTankerBookingRequest(WaterTankerBookingRequest waterTankerRequest) {
//
//		log.info("Create water tanker booking for user : " + waterTankerRequest.getRequestInfo().getUserInfo().getUuid()
//				+ " for the request : " + waterTankerRequest.getWaterTankerBookingDetail());
//
//		enrichmentService.enrichCreateWaterTankerRequest(waterTankerRequest);
//		ApplicantDetail existingApplicant = requestServiceRepository.getApplicantByMobileNumber(waterTankerRequest.getWaterTankerBookingDetail().getMobileNumber());
//
//		WaterTankerBookingDetail waterTankerDetail = waterTankerRequest.getWaterTankerBookingDetail();
//		try {
//			RequestInfo requestInfo = waterTankerRequest.getRequestInfo();
//			ApplicantDetail applicantDetail = waterTankerRequest.getWaterTankerBookingDetail().getApplicantDetail();
//			String tenantId = waterTankerRequest.getWaterTankerBookingDetail().getTenantId();
//			org.upyog.rs.web.models.user.User user = userService.fetchExistingUser(tenantId, applicantDetail, requestInfo);
//			if (user == null) {
//				throw new RuntimeException("User not found for this mobile number: " +
//						applicantDetail.getMobileNumber());
//			}
//
//			if (existingApplicant != null) {
//				// EXISTING USER
//				waterTankerRequest.getWaterTankerBookingDetail()
//						.getApplicantDetail()
//						.setApplicantId(existingApplicant.getApplicantId());
//
//				waterTankerRequest.getWaterTankerBookingDetail()
//						.getAddress()
//						.setApplicantId(existingApplicant.getApplicantId());
//				waterTankerDetail.getApplicantDetail().setApplicantId(existingApplicant.getApplicantId());
//				waterTankerDetail.setApplicantId(existingApplicant.getApplicantId());
//				waterTankerDetail.getAddress().setApplicantId(existingApplicant.getApplicantId());
//
//				log.info("Existing applicant found: {}", existingApplicant.getApplicantId());
//			} else {
//
//				waterTankerRequest.getWaterTankerBookingDetail()
//						.setApplicantDetail(applicantDetail);
//
//			}
//
//
//			if(config.getIsUserProfileEnabled()) {
//				waterTankerRequest.getWaterTankerBookingDetail().setApplicantUuid(user.getUuid());
//			} else{
//				// If user profile is not enabled, set the applicantUuid null
//				waterTankerRequest.getWaterTankerBookingDetail().setApplicantUuid(null);
//			}
//
//			log.info("Applicant or User Uuid: " + user.getUuid());
//		} catch (Exception e) {
//			log.error("Error fetching or creating user: " + e.getMessage(), e);
//			throw new RuntimeException("Failed to fetch/create user: " + e.getMessage(), e);
//		}
//
////	if (existingApplicant == null) {
//		workflowService.updateWorkflowStatus(null, waterTankerRequest);
////		}
//		requestServiceRepository.saveWaterTankerBooking(waterTankerRequest);
//
//		if (waterTankerDetail.getApplicantDetail() != null
//				&& waterTankerDetail.getApplicantDetail().getApplicantId() != null
//				&& waterTankerDetail.getBookingId() != null) {
//			requestServiceRepository.updateApplicantBookingId(
//					waterTankerDetail.getApplicantDetail().getApplicantId(),
//					waterTankerDetail.getBookingId());
//		} else {
//			log.warn("Skipping updateApplicantBookingId — applicantDetail or bookingId is null");
//		}
//
//		return waterTankerDetail;
//	}
//
//@Override
//public WaterTankerBookingDetail createNewWaterTankerBookingRequest(WaterTankerBookingRequest waterTankerRequest) {
//	WaterTankerBookingDetail waterTankerDetail = waterTankerRequest.getWaterTankerBookingDetail();
//	String userUuid = waterTankerRequest.getRequestInfo().getUserInfo().getUuid();
//	// 1. Search for existing booking to determine if this is an Update or Create
//	// We use the mobile number and tenantId to see if a record already exists
//	WaterTankerBookingSearchCriteria criteria = WaterTankerBookingSearchCriteria.builder()
//			.mobileNumber(waterTankerDetail.getApplicantDetail().getMobileNumber())
//			.tenantId(waterTankerDetail.getTenantId())
//			.build();
//
//	List<WaterTankerBookingDetail> existingBookings = requestServiceRepository.getWaterTankerBookingDetails(criteria);
//	boolean isUpdate = !existingBookings.isEmpty();
//
//	if (isUpdate) {
//		WaterTankerBookingDetail existing = existingBookings.get(0);
//		log.info("Existing booking found: {}. Switching to Update logic.", existing.getBookingNo());
//
//		// Map existing IDs to the incoming request to ensure the DB 'Update' works
//		waterTankerDetail.setBookingId(existing.getBookingId());
//		waterTankerDetail.setBookingNo(existing.getBookingNo());
//
//		if (existing.getAuditDetails() != null) {
//			waterTankerDetail.setAuditDetails(existing.getAuditDetails());
//			waterTankerDetail.getAuditDetails().setLastModifiedBy(userUuid);
//			waterTankerDetail.getAuditDetails().setLastModifiedTime(System.currentTimeMillis());
//		}
//
//		// For updates, we usually don't trigger the initial workflow action again
//		// Just save the updated details to the repository
//		requestServiceRepository.updateWaterTankerBooking(waterTankerRequest);
//		return waterTankerDetail;
//	}
//
//	// 2. Normal Creation Flow (If no existing booking found)
//	enrichmentService.enrichCreateWaterTankerRequest(waterTankerRequest);
//
//	// Set dynamic action based on Business Service name to avoid "INVALID ACTION"
//	if ("watertanker".equalsIgnoreCase(waterTankerDetail.getWorkflow().getBusinessService())) {
//		waterTankerDetail.getWorkflow().setAction("APPLY");
//	} else if ("watertanker-fixedpoint".equalsIgnoreCase(waterTankerDetail.getWorkflow().getBusinessService())) {
//		waterTankerDetail.getWorkflow().setAction("CREATE");
//	}
//
//	try {
//		// User enrichment logic (fetching from userService)
//		org.upyog.rs.web.models.user.User user = userService.fetchExistingUser(
//				waterTankerDetail.getTenantId(),
//				waterTankerDetail.getApplicantDetail(),
//				waterTankerRequest.getRequestInfo());
//
//		if (user != null) {
//			waterTankerDetail.setApplicantUuid(user.getUuid());
//		}
//	} catch (Exception e) {
//		log.error("User enrichment failed, proceeding with manual details", e);
//	}
//
//	// 3. Workflow Call (Only for new applications)
//	workflowService.updateWorkflowStatus(null, waterTankerRequest);
//
//	// 4. Persistence (New Record)
//	requestServiceRepository.saveWaterTankerBooking(waterTankerRequest);
//
//	// 5. Link Applicant to Booking
//	if (waterTankerDetail.getApplicantDetail() != null && waterTankerDetail.getBookingId() != null) {
//		requestServiceRepository.updateApplicantBookingId(
//				waterTankerDetail.getApplicantDetail().getApplicantId(),
//				waterTankerDetail.getBookingId());
//	}
//
//	return waterTankerDetail;
//}

@Override
public WaterTankerBookingDetail createNewWaterTankerBookingRequest(WaterTankerBookingRequest waterTankerRequest) {
	WaterTankerBookingDetail waterTankerDetail = waterTankerRequest.getWaterTankerBookingDetail();
	String userUuid = waterTankerRequest.getRequestInfo().getUserInfo().getUuid();

	// 1. Search for existing bookings for this mobile number
	WaterTankerBookingSearchCriteria criteria = WaterTankerBookingSearchCriteria.builder()
			.mobileNumber(waterTankerDetail.getApplicantDetail().getMobileNumber())
			.tenantId(waterTankerDetail.getTenantId())
			.build();

	List<WaterTankerBookingDetail> existingBookings = requestServiceRepository.getWaterTankerBookingDetails(criteria);

	// 2. Identify if there's an ACTIVE (Not yet Delivered/Cancelled) booking
	WaterTankerBookingDetail activeBooking = null;
	activeBooking = existingBookings.stream()
			.filter(b -> !"TANKER_DELIVERED".equalsIgnoreCase(b.getBookingStatus()) &&
					!"CANCELLED".equalsIgnoreCase(b.getBookingStatus()) &&
					!"REJECTED".equalsIgnoreCase(b.getBookingStatus()) &&
					!"MISSED".equalsIgnoreCase(b.getBookingStatus()))
			.findFirst()
			.orElse(null);

	// 3. CASE A: UPDATE EXISTING (An active request is still in progress)
	if (activeBooking != null) {
		log.info("Active booking {} found. Updating existing record in upyog_rs_water_tanker_booking_details.", activeBooking.getBookingNo());

		// Map existing IDs to the incoming request to trigger an UPDATE instead of INSERT
		waterTankerDetail.setBookingId(activeBooking.getBookingId());
		waterTankerDetail.setBookingNo(activeBooking.getBookingNo());

		// Map applicant and address IDs to update existing rows in related tables
		if(activeBooking.getApplicantDetail() != null) {
			waterTankerDetail.getApplicantDetail().setApplicantId(activeBooking.getApplicantDetail().getApplicantId());
			waterTankerDetail.getAddress().setApplicantId(activeBooking.getApplicantDetail().getApplicantId());
		}

		// Populate AuditDetails (Fixes Persister 'createdBy' crash)
		if (activeBooking.getAuditDetails() != null) {
			waterTankerDetail.setAuditDetails(activeBooking.getAuditDetails());
		}
		waterTankerDetail.getAuditDetails().setLastModifiedBy(userUuid);
		waterTankerDetail.getAuditDetails().setLastModifiedTime(System.currentTimeMillis());

		// Push to 'update-water-tanker-booking' topic
		requestServiceRepository.updateWaterTankerBooking(waterTankerRequest);
		return waterTankerDetail;
	}

	// 4. CASE B: CREATE NEW (No records found OR the previous one is DELIVERED)
	log.info("No active booking found (last was DELIVERED or brand new). Generating new record.");

	// This will generate a NEW UUID for booking_id and a NEW WT-DJB-XXXX booking_no
	enrichmentService.enrichCreateWaterTankerRequest(waterTankerRequest);

	// Set dynamic action based on Business Service to avoid "INVALID ACTION"
	String businessService = waterTankerDetail.getWorkflow().getBusinessService();
	if ("watertanker".equalsIgnoreCase(businessService)) {
		waterTankerDetail.getWorkflow().setAction("APPLY");
	} else if ("watertanker-fixedpoint".equalsIgnoreCase(businessService)) {
		waterTankerDetail.getWorkflow().setAction("CREATE");
		waterTankerDetail.setBookingStatus("SCHEDULED");
	} else {
		throw new CustomException("INVALID_BUSINESS_SERVICE",
				"Unknown business service: " + businessService);
	}

	// User enrichment logic
	try {
		org.upyog.rs.web.models.user.User user = userService.fetchExistingUser(
				waterTankerDetail.getTenantId(),
				waterTankerDetail.getApplicantDetail(),
				waterTankerRequest.getRequestInfo());
		if (user != null) {
			waterTankerDetail.setApplicantUuid(user.getUuid());
		}
	} catch (Exception e) {
		log.error("User enrichment failed, continuing with request data", e);
	}

	// 5. Workflow call for the NEW instance (Generates new process instance)
	workflowService.updateWorkflowStatus(null, waterTankerRequest);

	// 6. Save NEW record (Push to 'create-water-tanker-booking' topic)
	requestServiceRepository.saveWaterTankerBooking(waterTankerRequest);

	// 7. Link Applicant to the NEW Booking ID
	if (waterTankerDetail.getApplicantDetail() != null && waterTankerDetail.getBookingId() != null) {
		requestServiceRepository.updateApplicantBookingId(
				waterTankerDetail.getApplicantDetail().getApplicantId(),
				waterTankerDetail.getBookingId());
	}

	return waterTankerDetail;
}

	@Override
	public WaterTankerFixedPointDetail createFixedPointWaterTankerBookingRequest(WaterTankerFixedPointRequest waterTankerFixedPointRequest) {

		log.info("Create water tanker booking for user : " + waterTankerFixedPointRequest.getRequestInfo().getUserInfo().getUuid()
				+ " for the request : " + waterTankerFixedPointRequest.getWaterTankerFixedPointDetail());

		String mobileNumber = waterTankerFixedPointRequest
				.getWaterTankerFixedPointDetail()
				.getApplicantDetail()
				.getMobileNumber();

		if (requestServiceRepository.existsByMobileNumber(mobileNumber)) {
			log.warn("Duplicate mobile number detected: {}. Blocking before ID generation.", mobileNumber);
			throw new DuplicateMobileNumberException(mobileNumber);

		}

		enrichmentService.enrichCreateFixedPointWaterTankerRequest(waterTankerFixedPointRequest);

		try {
			RequestInfo requestInfo = waterTankerFixedPointRequest.getRequestInfo();
			ApplicantDetail applicantDetail = waterTankerFixedPointRequest.getWaterTankerFixedPointDetail().getApplicantDetail();
			String tenantId = waterTankerFixedPointRequest.getWaterTankerFixedPointDetail().getTenantId();
			org.upyog.rs.web.models.user.User user = userService.fetchExistingUser(tenantId, applicantDetail, requestInfo);
//			if (user == null) {
//				throw new RuntimeException("User not found for this mobile number: " +
//						applicantDetail.getMobileNumber());
//			}
//			log.info("Applicant or User Uuid: " + user.getUuid());
		} catch (Exception e) {
			log.error("Error fetching or creating user: " + e.getMessage(), e);
			throw new RuntimeException("Failed to fetch/create user: " + e.getMessage(), e);
		}

		requestServiceRepository.saveFixedPointWaterTanker(waterTankerFixedPointRequest);

		WaterTankerFixedPointDetail waterTankerFixedPointDetail = waterTankerFixedPointRequest.getWaterTankerFixedPointDetail();

		return waterTankerFixedPointDetail;

	}



	@Override
	public WaterTankerFixedPointDetail updateFixedPointWaterTankerBookingRequest(
			WaterTankerFixedPointRequest waterTankerFixedPointRequest) {

		log.info("Update fixed point water tanker booking for user: "
				+ waterTankerFixedPointRequest.getRequestInfo().getUserInfo().getUuid()
				+ " for bookingId: "
				+ waterTankerFixedPointRequest.getWaterTankerFixedPointDetail());

		enrichmentService.enrichUpdateFixedPointWaterTankerRequest(waterTankerFixedPointRequest);

		requestServiceRepository.updateFixedPointWaterTanker(waterTankerFixedPointRequest);

		return waterTankerFixedPointRequest.getWaterTankerFixedPointDetail();
	}

	@Override
	public List<WaterTankerBookingDetail> getWaterTankerBookingDetails(RequestInfo requestInfo,
			WaterTankerBookingSearchCriteria waterTankerBookingSearchCriteria) {
		/*
		 * Retrieve WT booking details from the repository based on search criteria and
		 * and give the data already retrieved to the repository layer
		 */

//		if (waterTankerBookingSearchCriteria.getFromDate() == null
//				&& waterTankerBookingSearchCriteria.getToDate() == null)  {
//
//			long startOfDay = java.time.LocalDate.now()
//					.atStartOfDay(java.time.ZoneId.systemDefault())
//					.toInstant()
//					.toEpochMilli();
//
//			long endOfDay = java.time.LocalDate.now()
//					.atTime(23, 59, 59, 999_000_000)
//					.atZone(java.time.ZoneId.systemDefault())
//					.toInstant()
//					.toEpochMilli();
//
//			waterTankerBookingSearchCriteria.setFromDate(startOfDay);
//			waterTankerBookingSearchCriteria.setToDate(endOfDay);
//		}

		List<WaterTankerBookingDetail> applications = requestServiceRepository
				.getWaterTankerBookingDetails(waterTankerBookingSearchCriteria);

		/**
		 * Check if the retrieved list is empty using Spring's CollectionUtils Prevents
		 * potential null pointer exceptions by returning an empty list Ensures
		 * consistent return type and prevents calling methods from handling null
		 */
		if (CollectionUtils.isEmpty(applications)) {
			return new ArrayList<>();
		}
		if (config.getIsUserProfileEnabled()) {
			// Enrich each booking with user details
			for (WaterTankerBookingDetail booking : applications) {
				userService.enrichBookingWithUserDetails(booking, waterTankerBookingSearchCriteria);
			}
		}

//		for (WaterTankerBookingDetail booking : applications) {
//
//			//  Existing user enrichment
//			if (config.getIsUserProfileEnabled()) {
//				userService.enrichBookingWithUserDetails(booking, waterTankerBookingSearchCriteria);
//			}
//
//			// Filling Point Enrichment
//			if (booking.getFillingPointId() != null) {
//
//				FillingPointSearchCriteria criteria = new FillingPointSearchCriteria();
//				criteria.setTenantId(booking.getTenantId());
//				criteria.setId(booking.getFillingPointId());
//
//				List<FillingPoint> fps = fillingPointRepository.search(criteria);
//
//				if (!fps.isEmpty()) {
//					booking.setFillingPointName(fps.get(0).getFillingPointName());
//				}
//			}
//		}

		// Return retrieved application
		return applications;
	}

	@Override
	public List<WaterTankerFixedPointDetail> getWaterTankerFixedPointBookingDetails(
			RequestInfo requestInfo,
			WaterTankerFixedPointBookingSearchCriteria criteria) {


//		if ((criteria.getFromDate() == null || criteria.getFromDate() == 0) &&
//				(criteria.getToDate() == null || criteria.getToDate() == 0)) {
//
//			long startOfDay = java.time.LocalDate.now()
//					.atStartOfDay(java.time.ZoneId.systemDefault())
//					.toInstant()
//					.toEpochMilli();
//
//			long endOfDay = java.time.LocalDate.now()
//					.atTime(23, 59, 59, 999_000_000)
//					.atZone(java.time.ZoneId.systemDefault())
//					.toInstant()
//					.toEpochMilli();
//
//			criteria.setFromDate(startOfDay);
//			criteria.setToDate(endOfDay);
//		}

		List<WaterTankerFixedPointDetail> applications =
				requestServiceRepository.getWaterTankerFixedPointBookingDetails(criteria);

		return CollectionUtils.isEmpty(applications) ? new ArrayList<>() : applications;
	}

	@Override
	public Long getWaterTankerFixedPointCount(
			WaterTankerFixedPointBookingSearchCriteria criteria) {

		return requestServiceRepository.getWaterTankerFixedPointCount(criteria);
	}

	@Override
	public Integer getApplicationsCount(WaterTankerBookingSearchCriteria waterTankerBookingSearchCriteria,
			RequestInfo requestInfo) {
		waterTankerBookingSearchCriteria.setCountCall(true);
		Integer bookingCount = 0;

		waterTankerBookingSearchCriteria = addCreatedByMeToCriteria(waterTankerBookingSearchCriteria, requestInfo);
		bookingCount = requestServiceRepository.getApplicationsCount(waterTankerBookingSearchCriteria);

		return bookingCount;
	}

	private WaterTankerBookingSearchCriteria addCreatedByMeToCriteria(WaterTankerBookingSearchCriteria criteria,
			RequestInfo requestInfo) {
		if (requestInfo.getUserInfo() == null) {
			log.info("Request info is null returning criteira");
			return criteria;
		}
		List<String> roles = new ArrayList<>();
		for (Role role : requestInfo.getUserInfo().getRoles()) {
			roles.add(role.getCode());
		}
		log.info("user roles for searching : " + roles);
		/**
		 * Citizen can see booking details only booked by him
		 */
		List<String> uuids = new ArrayList<>();
		if (roles.contains(RequestServiceConstants.CITIZEN)
				&& !StringUtils.isEmpty(requestInfo.getUserInfo().getUuid())) {
			uuids.add(requestInfo.getUserInfo().getUuid());
			criteria.setCreatedBy(uuids);
			log.debug("loading data of created and by me" + uuids.toString());
		}
		return criteria;
	}

	@Override
	public WaterTankerBookingDetail updateWaterTankerBooking(WaterTankerBookingRequest waterTankerRequest,
			String applicationStatus) {
		String bookingNo = waterTankerRequest.getWaterTankerBookingDetail().getBookingNo();
		log.info("Updating booking for booking no: {}", bookingNo);

		if (bookingNo == null) {
			throw new CustomException("INVALID_BOOKING_CODE",
					"Booking no not valid. Failed to update booking status for : " + bookingNo);
		}

		// If no payment request, update workflow status and process booking request
		if (waterTankerRequest.getWaterTankerBookingDetail().getWorkflow() != null) {
			State state = workflowService.updateWorkflowStatus(null, waterTankerRequest);
			enrichmentService.enrichWaterTankerBookingUponUpdate(state.getApplicationStatus(), waterTankerRequest);

			// If action is APPROVE, create demand
			if (RequestServiceConstants.ACTION_APPROVE
					.equals(waterTankerRequest.getWaterTankerBookingDetail().getWorkflow().getAction())) {
				demandService.createDemand(waterTankerRequest);
			}
		}

		log.info("Payment request is null, updating water tanker booking without payment");
		// If no payment request, just update the water tanker booking request
		requestServiceRepository.updateWaterTankerBooking(waterTankerRequest);

		Workflow workflow = waterTankerRequest.getWaterTankerBookingDetail().getWorkflow();

		if (workflow != null && waterTankerRequest.getWaterTankerBookingDetail().getWorkflow().getAction()
				.equalsIgnoreCase(RequestServiceConstants.WF_ACTION_SUBMIT_FEEDBACK)) {
			log.info("Processing feedback submission for booking no: {}", bookingNo);
			handleRSSubmitFeeback(waterTankerRequest);
		}

		if (workflow != null && waterTankerRequest.getWaterTankerBookingDetail().getWorkflow().getAction()
				.equalsIgnoreCase(RequestServiceConstants.WF_ACTION_REJECTED_BY_VENDOR)) {
			log.info("Processing rejection by vendor for booking no: {}", bookingNo);
			handleRejectedByVendor(waterTankerRequest);
		}

		return waterTankerRequest.getWaterTankerBookingDetail();
	}

	@Override
	public void updateWaterTankerBooking(PaymentRequest paymentRequest, String applicationStatus) {
		log.info("Payment request: {}", paymentRequest);
		// Handle the payment request and update the water tanker booking if applicable
		WaterTankerBookingDetail waterTankerDetail=null;
		if (paymentRequest != null) {
			try {
				String consumerCode = paymentRequest.getPayment().getPaymentDetails().get(0).getBill().getConsumerCode();
				waterTankerDetail = requestServiceRepository
						.getWaterTankerBookingDetails(
								WaterTankerBookingSearchCriteria.builder().bookingNo(consumerCode).build())
						.stream().findFirst().orElse(null);
				log.info("Water tanker booking detail: {}", waterTankerDetail);
				log.info("Consumer code: {}", consumerCode);
				if (waterTankerDetail == null) {
					log.info("Application not found in consumer class while updating status");
				} else{
					// Update the booking details
					waterTankerDetail.getAuditDetails()
							.setLastModifiedBy(paymentRequest.getRequestInfo().getUserInfo().getUuid());
					waterTankerDetail.getAuditDetails().setLastModifiedTime(System.currentTimeMillis());
					waterTankerDetail.setBookingStatus(applicationStatus);
					waterTankerDetail.setPaymentDate(System.currentTimeMillis());

					log.info("Water tanker detail after updating booking status: {}", waterTankerDetail);

					// Update water tanker booking request
					WaterTankerBookingRequest updatedWaterTankerRequest = WaterTankerBookingRequest.builder()
							.requestInfo(paymentRequest.getRequestInfo()).waterTankerBookingDetail(waterTankerDetail).build();

					log.info("Water Tanker Request to update application status in consumer: {}", updatedWaterTankerRequest);
					requestServiceRepository.updateWaterTankerBooking(updatedWaterTankerRequest);
				}
			}
			catch (Exception e) {
				log.error("Error while updating water tanker booking: {}", e.getMessage(), e);
				throw new CustomException("UPDATE_FAILED", "Failed to update water tanker booking");
			}

		}
		log.info("final object {}", waterTankerDetail);
	}

	private void handleRSSubmitFeeback(WaterTankerBookingRequest waterTankerRequest) {
		log.info("Handling water tanker Submit Feedback for request: {}", waterTankerRequest);
		User citizen = waterTankerRequest.getRequestInfo().getUserInfo();
		if (!citizen.getUuid().equalsIgnoreCase(waterTankerRequest.getRequestInfo().getUserInfo().getUuid())) {
			throw new CustomException("Rating Error", " Only owner of the application can submit the feedback !.");
		}
		if (waterTankerRequest.getWaterTankerBookingDetail().getWorkflow().getRating() == null) {
			throw new CustomException("Rating Error", " Rating has to be provided!");
		} else if (config.getAverageRatingCommentMandatory() != null
				&& Integer.parseInt(config.getAverageRatingCommentMandatory()) > waterTankerRequest
						.getWaterTankerBookingDetail().getWorkflow().getRating()) {

			throw new CustomException("Rating Error", " Comment mandatory for rating "
					+ waterTankerRequest.getWaterTankerBookingDetail().getWorkflow().getRating());
		}

	}

	private void handleRejectedByVendor(WaterTankerBookingRequest waterTankerRequest) {
		log.info("Handling rejected by vendor for request: {}", waterTankerRequest);
		WaterTankerBookingDetail tankerRequest = waterTankerRequest.getWaterTankerBookingDetail();
		tankerRequest.setVendorId(null);

		org.upyog.rs.web.models.Workflow workflow = tankerRequest.getWorkflow();
		if ((StringUtils.isBlank(workflow.getComments()))) {
			throw new CustomException("", " Comment is mandatory to reject the request for vendor.");
		}
	}


	@Override
	public List<RequestDetailsByDriverId.RequestDetailsInfo> getBookingAndAssignmentDetails(
			String driverId, Long fromDate, Long toDate) {
		return requestServiceRepository.getFullBookingDetailsByDriver(driverId, fromDate, toDate);
	}

	@Override
	public List<WaterTankerBookingDetail> getDriverAssignedBookings(CriteriyaSearchDto criteriyaSearchDto) {
		String driverUuid = criteriyaSearchDto.getCriteriyaSearch().getDriverId();
		String tenantId = criteriyaSearchDto.getRequestInfo().getUserInfo().getTenantId();
		WaterTankerBookingSearchCriteria criteria = WaterTankerBookingSearchCriteria.builder()
				.tenantId(tenantId)
				.driverId(driverUuid)
				.build();

		return getWaterTankerBookingDetails(criteriyaSearchDto.getRequestInfo(),criteria);
	}

	@Override
	public WaterTankerBookingDetail updateBookingLifecycle(WaterTankerBookingRequest waterTankerRequest) {
		String bookingNo = waterTankerRequest.getWaterTankerBookingDetail().getBookingNo();
		log.info("Updating lifecycle for booking no: {}", bookingNo);

		if (bookingNo == null) {
			throw new CustomException("INVALID_BOOKING_CODE", "Booking number is required for update.");
		}

		if (waterTankerRequest.getWaterTankerBookingDetail().getWorkflow() != null) {
			State state = workflowService.updateWorkflowStatus(null, waterTankerRequest);

			enrichmentService.enrichWaterTankerBookingUponUpdate(state.getApplicationStatus(), waterTankerRequest);
		}

		requestServiceRepository.updateWaterTankerBooking(waterTankerRequest);

		return waterTankerRequest.getWaterTankerBookingDetail();
	}

	public FixedFillingPointMapping createMapping(FixedFillingPointMappingRequest request) {
		log.info("Creating FixedFillingPointMapping");
		FixedFillingPointMapping mapping = request.getFixedFillingPointMapping();
		requestServiceRepository.save(mapping);
		return mapping;
	}
}
