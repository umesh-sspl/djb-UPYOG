export const RwhCreateFormPayload = (data) => {
  const customerDetails = data?.customerDetails || {};
  const location = data?.location || {};
  const propertyDetails = data?.propertyDetails || {};
  const sizeOfPit = data?.sizeOfPit || {};
  const documents = data?.documents?.documents || [];
  const declaration = data?.declaration || {};

  const payload = {
    RainWaterHarvesting: {
      tenantId: Digit.ULBService.getCurrentTenantId(),
      applicationType: customerDetails?.applicationType?.code || "NEW",
      jurisdiction: customerDetails?.jurisdiction?.code || customerDetails?.jurisdiction,
      pid: customerDetails?.pid,
      kNo: customerDetails?.kNo,
      connectionCategory: customerDetails?.connectionCategory?.code || customerDetails?.connectionCategory,
      domesticType: customerDetails?.domesticType?.code || customerDetails?.domesticType,
      
      applicant: {
        firstName: customerDetails?.firstName,
        middleName: customerDetails?.middleName,
        lastName: customerDetails?.lastName,
        gender: customerDetails?.gender?.code || customerDetails?.gender,
        mobileNumber: customerDetails?.mobileNumber,
        email: customerDetails?.email,
        whatsAppNumber: customerDetails?.whatsAppNumber,
        isWhatsAppSameAsMobile: customerDetails?.isWhatsAppSameAsMobile,
        parentSpouse: customerDetails?.parentSpouse,
      },
      
      institution: customerDetails?.domesticType?.code === "ORGANIZATION" ? {
        name: customerDetails?.institutionName,
        type: customerDetails?.departmentType?.code || customerDetails?.departmentType,
        natureOfWork: customerDetails?.natureOfWork,
        document: customerDetails?.orgDeptDocument,
      } : null,

      address: {
        pincode: location?.pincode,
        city: location?.city?.code || location?.city,
        locality: {
          code: location?.locality?.code || location?.locality
        },
        streetName: location?.streetName,
        houseNo: location?.houseNo,
        landmark: location?.landmark,
        latitude: location?.latitude,
        longitude: location?.longitude,
        additionalDetails: {
          assembly: location?.assembly,
          block: location?.block,
          zone: location?.zone,
          zro: location?.zro,
        }
      },

      propertyDetails: {
        propertyCategory: propertyDetails?.propertyCategory?.code || propertyDetails?.propertyCategory,
        propertyType: propertyDetails?.propertyType?.code || propertyDetails?.propertyType,
        usageType: propertyDetails?.usageType?.code || propertyDetails?.usageType,
        yearOfConstruction: propertyDetails?.yearOfConstruction?.name || propertyDetails?.yearOfConstruction?.value || propertyDetails?.yearOfConstruction,
        plotArea: parseFloat(propertyDetails?.plotArea) || 0,
        roofTopArea: parseFloat(propertyDetails?.roofTopArea) || 0,
      },

      pitDetails: {
        typeOfPit: sizeOfPit?.typeOfPit?.code || sizeOfPit?.typeOfPit,
        length: parseFloat(sizeOfPit?.length) || 0,
        breadth: parseFloat(sizeOfPit?.breadth) || 0,
        dia: parseFloat(sizeOfPit?.dia) || 0,
        effectiveDepth: parseFloat(sizeOfPit?.effectiveDepth) || 0,
        retentionCapacity: parseFloat(sizeOfPit?.retentionCapacity) || 0,
      },

      documents: documents.map((doc) => ({
        documentType: doc?.documentType,
        fileStoreId: doc?.fileStoreId,
        documentUid: doc?.documentUid,
        status: "ACTIVE"
      })),

      declaration: {
        declarations: declaration?.declarations || [],
        submittedBy: declaration?.submittedBy?.code || declaration?.submittedBy,
      },

      channel: Digit.UserService.getType() === "CITIZEN" ? "CITIZEN" : "CFC_COUNTER",
      processInstance: {
        action: "INITIATE",
      },
    }
  };

  return payload;
};