package org.upyog.rs.enums;

public enum RequestServiceStatus {
	BOOKING_CREATED,
	IN_TRANSIT,
	SCHEDULED;
	String status;
	
	public String getStatus() {
		return status;
	}

}
