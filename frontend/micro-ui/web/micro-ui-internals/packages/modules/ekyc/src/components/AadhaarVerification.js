import React, { useState, Fragment } from "react";
import { CardLabel, TextInput, Dropdown, UploadFile, FormStep } from "@djb25/digit-ui-react-components";

const AadhaarVerification = ({ config, onSelect }) => {
  // 🔹 STATES
  const [kno, setKno] = useState("");
  const [consumerType, setConsumerType] = useState(null);
  const [occupantType, setOccupantType] = useState(null);
  const [categoryType, setCategoryType] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState(null);
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [residents, setResidents] = useState("");

  // Tenant
  const [, setDocumentProof] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [ownerMobile, setOwnerMobile] = useState("");
  const [tenantVerification, setTenantVerification] = useState("");

  // Govt
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  // Other Entity
  const [contactPerson, setContactPerson] = useState("");
  const [entityName, setEntityName] = useState("");

  const [, setToast] = useState(null);

  // 🔹 OPTIONS
  const consumerTypeOptions = [{ name: "Individual" }, { name: "Govt" }, { name: "Company_Society_Org" }];

  const occupantOptions = [{ name: "Self" }, { name: "Tenanted" }];

  const genderOptions = [{ name: "Male" }, { name: "Female" }, { name: "Others" }, { name: "Not prefer to say" }];

  // 🔹 FILE UPLOAD
  const uploadFile = async (e, setter, idSetter) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await Digit.UploadServices.Filestorage("EKYC", file);
      const id = res?.data?.files?.[0]?.fileStoreId;
      if (id) {
        setter(file.name);
        idSetter(id);
      }
    } catch {
      setToast({ type: "error", message: "Upload failed" });
    }
  };

  // 🔹 VALIDATION
  const isValid = () => {
    if (!kno) return false;
    if (!consumerType) return false;
    if (!occupantType) return false;
    if (!categoryType) return false;
    if (!firstName) return false;
    if (!mobile) return false;
    if (!residents || Number(residents) <= 0) return false;

    if (occupantType?.name === "Tenanted" && !documentId && !ownerMobile) return false;

    return false;
    // return consent;
  };

  // 🔹 SUBMIT
  const onStepSelect = () => {
    if (!isValid()) {
      setToast({ type: "error", message: "Fill required fields" });
      return;
    }

    const data = {
      kno,
      consumerType: consumerType?.name,
      occupantType: occupantType?.name,
      categoryType: categoryType?.name,

      firstName,
      middleName,
      lastName,
      gender: gender?.name,
      mobile,
      whatsapp,
      email,
      residents,
      documentId,
      ownerMobile,
      tenantVerification,
      designation,
      department,
      employeeId,
      contactPerson,
      entityName,
    };

    onSelect(config.key, data);
  };

  return (
    <Fragment>
      <FormStep onSelect={onStepSelect} config={config}>
        <div>
          <CardLabel>K Number *</CardLabel>
          <TextInput value={kno} onChange={(e) => setKno(e.target.value)} />
        </div>

        <div>
          <CardLabel>Consumer Type *</CardLabel>
          <Dropdown option={consumerTypeOptions} selected={consumerType} select={setConsumerType} />
        </div>

        <div>
          <CardLabel>Occupant Type *</CardLabel>
          <Dropdown option={occupantOptions} selected={occupantType} select={setOccupantType} />
        </div>

        <div>
          <CardLabel>Category Type *</CardLabel>
          <Dropdown option={[]} selected={categoryType} select={setCategoryType} />
        </div>

        <div>
          <CardLabel>First Name *</CardLabel>
          <TextInput value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>

        <div>
          <CardLabel>Middle Name</CardLabel>
          <TextInput value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
        </div>

        <div>
          <CardLabel>Last Name</CardLabel>
          <TextInput value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div>
          <CardLabel>Gender</CardLabel>
          <Dropdown option={genderOptions} selected={gender} select={setGender} />
        </div>

        <div>
          <CardLabel>Mobile *</CardLabel>
          <TextInput value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </div>

        <div>
          <CardLabel>WhatsApp</CardLabel>
          <TextInput value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        </div>

        <div>
          <CardLabel>Email</CardLabel>
          <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <CardLabel>No. of Residents *</CardLabel>
          <TextInput value={residents} onChange={(e) => setResidents(e.target.value)} />
        </div>

        {/* TENANT LOGIC */}
        {occupantType?.name === "Tenanted" && (
          <Fragment>
            <div>
              <CardLabel>Document Proof</CardLabel>
              <UploadFile onUpload={(e) => uploadFile(e, setDocumentProof, setDocumentId)} />
            </div>

            {!documentId && (
              <Fragment>
                <div>
                  <CardLabel>Owner Mobile *</CardLabel>
                  <TextInput value={ownerMobile} onChange={(e) => setOwnerMobile(e.target.value)} />
                </div>

                <div>
                  <CardLabel>Tenant Verification</CardLabel>
                  <TextInput value={tenantVerification} onChange={(e) => setTenantVerification(e.target.value)} />
                </div>
              </Fragment>
            )}
          </Fragment>
        )}

        {/* GOVT */}
        {consumerType?.name === "Govt" && (
          <Fragment>
            <div>
              <CardLabel>Designation</CardLabel>
              <TextInput value={designation} onChange={(e) => setDesignation(e.target.value)} />
            </div>

            <div>
              <CardLabel>Department</CardLabel>
              <TextInput value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>

            <div>
              <CardLabel>Employee ID</CardLabel>
              <TextInput value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
            </div>
          </Fragment>
        )}

        {/* OTHER ENTITY */}
        {consumerType?.name === "Company_Society_Org" && (
          <Fragment>
            <div>
              <CardLabel>Entity Name</CardLabel>
              <TextInput value={entityName} onChange={(e) => setEntityName(e.target.value)} />
            </div>

            <div>
              <CardLabel>Contact Person</CardLabel>
              <TextInput value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
            </div>
          </Fragment>
        )}
      </FormStep>
    </Fragment>
  );
};

export default AadhaarVerification;
