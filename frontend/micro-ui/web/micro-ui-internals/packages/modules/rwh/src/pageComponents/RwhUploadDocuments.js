import React, { useEffect, useRef, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, UploadFile, Toast, Loader, TextInput, CollapsibleCardPage } from "@djb25/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const RwhUploadDocuments = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [documents, setDocuments] = useState(formData?.DocumentsRequired?.documents || []);
  const [error, setError] = useState(null);
  const wsDocsData = window.location.href.includes("modify")
    ? "ModifyConnectionDocuments"
    : window.location.href.includes("disconnection")
    ? "DisconnectionDocuments"
    : "NewWSDocuments";
  let action = "create";

  const { pathname } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");
  const isMutation = pathname.includes("/property-mutate/");

  if (isEditScreen) action = "update";

  const { isLoading, data: wsDocs } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesNewMasters(tenantId, wsDocsData);

  const goNext = () => {
    onSelect(config.key, { documents });
  };

  useEffect(() => {
    goNext();
  }, [documents]);

  if (isLoading) {
    return <Loader />;
  }

  const applicationDetailsData = JSON.parse(sessionStorage.getItem("WS_EDIT_APPLICATION_DETAILS"));

  if (window.location.href.includes("edit") && applicationDetailsData?.applicationData?.documents?.length > 0) {
    const documentsData = applicationDetailsData?.applicationData?.documents || [];
    documentsData?.map((documentData) => {
      wsDocs?.[wsDocsData]?.forEach((docData) => {
        const docType = docData?.code?.split(".")[1]
          ? docData?.code?.split(".")[0] + "." + docData?.code?.split(".")[1]
          : docData?.code?.split(".")[0];
        const dataDocType = documentData?.documentType?.split(".")[1]
          ? documentData?.documentType?.split(".")[0] + "." + documentData?.documentType?.split(".")[1]
          : documentData?.documentType?.split(".")[0];
        if (docType == dataDocType) {
          docData.auditDetails = documentData.auditDetails;
          docData.documentType = docData.documentType;
          docData.documentUid = documentData.documentUid;
          docData.fileStoreId = documentData.fileStoreId;
          docData.id = documentData.id;
          docData.status = "ACTIVE";
        }
      });
    });
  }

  return (
    <CollapsibleCardPage title={t("WS_DOCUMENTS")} defaultOpen={true}>
      <div className="formcomposer-section-grid ws-doc-upload">
        {wsDocs?.[wsDocsData]?.map((document, index) => {
          return (
            <SelectDocument
              key={index}
              document={document}
              action={action}
              t={t}
              id={`pt-document-${index}`}
              error={error}
              setError={setError}
              setDocuments={setDocuments}
              documents={documents}
              formData={formData}
              setFormError={setFormError}
              clearFormErrors={clearFormErrors}
              config={config}
              formState={formState}
            />
          );
        })}
      </div>
      {error && <Toast label={error} onClose={() => setError(null)} error />}
    </CollapsibleCardPage>
  );
};

function SelectDocument({
  t,
  document: doc,
  setDocuments,
  error,
  setError,
  documents,
  action,
  formData,
  setFormError,
  clearFormErrors,
  config,
  formState,
  fromRawData,
  id,
}) {
  const fileRef = useRef();
  const filteredDocument = documents?.filter((item) => item?.documentType?.includes(doc?.code))[0];
  const [selectedDocument, setSelectedDocument] = useState(
    filteredDocument
      ? { ...filteredDocument, code: filteredDocument?.documentType }
      : doc?.hasDropdown
      ? doc?.dropdownData?.length === 1
        ? doc?.dropdownData[0]
        : {}
      : doc
  );
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);
  const [documentUid, setDocumentUid] = useState(() => filteredDocument?.documentUid || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraFile, setIsCameraFile] = useState(false);


  const viewDocument = async () => {
    if (uploadedFile) {
      try {
        const res = await Digit.UploadServices.Filefetch([uploadedFile], Digit.ULBService.getStateId());
        let fileURL = "";
        if (res?.data?.[uploadedFile]?.url) {
          fileURL = res.data[uploadedFile].url;
        } else if (res?.data?.fileStoreIds?.[0]?.url) {
          fileURL = res.data.fileStoreIds[0].url;
        }
        if (fileURL) {
          let downloadLink = fileURL.split(",")[0];
          window.open(downloadLink, "_blank");
        }
      } catch (err) {
        console.error("Failed to fetch file URL", err);
      }
    }
  };

  useEffect(() => {
    if (filteredDocument) {
      setSelectedDocument(
        filteredDocument
          ? { ...filteredDocument, code: filteredDocument?.documentType }
          : doc?.hasDropdown
          ? doc?.dropdownData?.length === 1
            ? doc?.dropdownData[0]
            : {}
          : doc
      );
    }
  }, []);

  function selectfile(e) {
    setFile(e.target.files[0]);
    setIsCameraFile(false);
  }
  const [isHidden, setHidden] = useState(false);

  const addError = () => {
    let type = formState.errors?.[config.key]?.type;
    if (!Array.isArray(type)) type = [];
    if (!type.includes(doc.code)) {
      type.push(doc.code);
      setFormError(config.key, { type });
    }
  };

  const removeError = () => {
    let type = formState.errors?.[config.key]?.type;
    if (!Array.isArray(type)) type = [];
    if (type.includes(doc?.code)) {
      type = type.filter((e) => e != doc?.code);
      if (!type.length) {
        clearFormErrors(config.key);
      } else {
        setFormError(config.key, { type });
      }
    }
  };

  useEffect(() => {
    if (selectedDocument?.code) {
      setDocuments((prev) => {
        const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);

        if (uploadedFile?.length === 0 || uploadedFile === null) {
          return filteredDocumentsByDocumentType;
        }

        const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
        const data = [
          ...filteredDocumentsByFileStoreId,
          {
            documentType: selectedDocument?.code,
            fileStoreId: uploadedFile,
            documentUid: documentUid,
            i18nKey: selectedDocument?.code,
            id: selectedDocument?.id,
            status: "ACTIVE",
          },
        ];
        sessionStorage.setItem("DISCONNECTION_EDIT_DOCS", JSON.stringify(data));
        return data;
      });
    }
    if (!isHidden) {
      if ((!uploadedFile || !selectedDocument?.code) && doc?.required) {
        addError();
      } else if (uploadedFile && selectedDocument?.code) {
        removeError();
      }
    } else if (isHidden) {
      removeError();
    }
  }, [uploadedFile, selectedDocument, documentUid, isHidden, formData?.ConnectionDetails?.[0]]);

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            setUploadedFile(null);
            setIsUploading(true);
            const response = await Digit.UploadServices.Filestorage("WS", file, Digit.ULBService.getStateId());
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            setError(t("CS_FILE_UPLOAD_ERROR"));
          } finally {
            setIsUploading(false);
          }
        }
      }
    })();
  }, [file]);

  useEffect(() => {
    if (isHidden) setUploadedFile(null);
  }, [isHidden]);

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel>
          {doc?.required
            ? `${t(`${doc?.i18nKey?.replaceAll(".", "_")}_UPLOAD_DOCUMENT`)}*`
            : `${t(`${doc?.i18nKey?.replaceAll(".", "_")}_UPLOAD_DOCUMENT`)}`}
        </CardLabel>
        <div className="field" style={{ display: "flex", gap: "20px", alignItems: "flex-start", width: "100%" }}>
          <div style={{ flex: 1 }}>
            <UploadFile
              onUpload={selectfile}
              onDelete={() => {
                setUploadedFile(null);
                setFile(null);
                setIsCameraFile(false);
              }}
              id={id}
              message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
              textStyles={{ width: "100%" }}
              buttonType="button"
              error={!uploadedFile}
              accept="image/*, .pdf, .png, .jpeg, .jpg"
              uploadedFiles={
                uploadedFile && file && isCameraFile ? [[file?.name || "applicant_photo.jpg", { fileStoreId: uploadedFile }]] : undefined
              }
              removeTargetedFile={() => {
                setUploadedFile(null);
                setFile(null);
                setIsCameraFile(false);
              }}
            />
          </div>
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{t("WS_VIEW_DOCUMENT")}</CardLabel>
        <div className="field" style={{ display: "flex", alignItems: "center" }}>
          {uploadedFile ? (
            <div
              style={{ padding: "8px 16px", backgroundColor: "#eee", borderRadius: "4px", width: "100%", textAlign: "center", cursor: "pointer" }}
              onClick={viewDocument}
            >
              <span style={{ color: "#000", fontWeight: "bold" }}>{t("WS_VIEW")}</span>
            </div>
          ) : (
            <div style={{ padding: "8px 16px", backgroundColor: "#eee", borderRadius: "4px", width: "100%", textAlign: "center", opacity: 0.5 }}>
              <span style={{ color: "#000", fontWeight: "bold" }}>{t("WS_VIEW")}</span>
            </div>
          )}
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
}

export default RwhUploadDocuments;
