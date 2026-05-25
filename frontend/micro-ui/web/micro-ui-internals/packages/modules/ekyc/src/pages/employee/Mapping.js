import React, { useState, useMemo } from "react";
import {
    Header,
    Card,
    CardHeader,
    CardText,
    CardLabel,
    Dropdown,
    SubmitBar,
    ActionBar,
    Table,
    Toast,
    LabelFieldPair,
    Modal,
    DeleteIcon,
    EditIcon,
} from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";

// ─── Static Mock Data ─────────────────────────────────────────────────────────

const MOCK_SURVEYORS = [
    { name: "Amit Kumar", id: "SVR001", role: "Surveyor" },
    { name: "Sanjay Singh", id: "SVR002", role: "Surveyor" },
    { name: "Rahul Sharma", id: "SVR003", role: "Surveyor" },
    { name: "Priya Verma", id: "SVR004", role: "Surveyor" },
];

const MOCK_MRDS = [
    { name: "MRD - 01 (Central Zone)", code: "MRD01", zone: "Central" },
    { name: "MRD - 02 (North Zone)", code: "MRD02", zone: "North" },
    { name: "MRD - 03 (South Zone)", code: "MRD03", zone: "South" },
    { name: "MRD - 04 (West Zone)", code: "MRD04", zone: "West" },
    { name: "MRD - 05 (East Zone)", code: "MRD05", zone: "East" },
    { name: "MRD - 06 (Rohini)", code: "MRD06", zone: "Rohini" },
    { name: "MRD - 07 (Dwarka)", code: "MRD07", zone: "Dwarka" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const Mapping = () => {
    const { t } = useTranslation();

    // Form state
    const [selectedSurveyor, setSelectedSurveyor] = useState(null);
    const [selectedMRD, setSelectedMRD] = useState(null);

    // Mappings list
    const [mappings, setMappings] = useState([]);

    // Edit state: stores the id of the row being edited + its draft values
    const [editingId, setEditingId] = useState(null);
    const [editSurveyor, setEditSurveyor] = useState(null);
    const [editMRD, setEditMRD] = useState(null);

    // Delete confirm modal
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [toast, setToast] = useState(null);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleAddMapping = () => {
        if (!selectedSurveyor || !selectedMRD) {
            setToast({ type: "error", message: t("EKYC_SELECT_BOTH_ERROR") || "Please select both Surveyor and MRD" });
            return;
        }
        const exists = mappings.some(
            m => m.surveyorId === selectedSurveyor.id && m.mrdCode === selectedMRD.code
        );
        if (exists) {
            setToast({ type: "warning", message: t("EKYC_MAPPING_EXISTS") || "This mapping already exists" });
            return;
        }
        setMappings(prev => [...prev, {
            id: Date.now(),
            surveyorName: selectedSurveyor.name,
            surveyorId: selectedSurveyor.id,
            mrdName: selectedMRD.name,
            mrdCode: selectedMRD.code,
            zone: selectedMRD.zone,
        }]);
        setSelectedMRD(null);
        setSelectedSurveyor(null);
        setToast({ type: "success", message: t("EKYC_MAPPING_ADDED") || "Mapping added successfully" });
    };

    const handleEditStart = (row) => {
        setEditingId(row.id);
        setEditSurveyor(MOCK_SURVEYORS.find(s => s.id === row.surveyorId) || null);
        setEditMRD(MOCK_MRDS.find(m => m.code === row.mrdCode) || null);
    };

    const handleEditSave = (id) => {
        if (!editSurveyor || !editMRD) {
            setToast({ type: "error", message: t("EKYC_SELECT_BOTH_ERROR") || "Please select both Surveyor and MRD to save" });
            return;
        }
        // Check duplicate (excluding self)
        const duplicate = mappings.some(
            m => m.id !== id && m.surveyorId === editSurveyor.id && m.mrdCode === editMRD.code
        );
        if (duplicate) {
            setToast({ type: "warning", message: t("EKYC_MAPPING_EXISTS") || "This mapping already exists" });
            return;
        }
        setMappings(prev => prev.map(m => m.id !== id ? m : {
            ...m,
            surveyorName: editSurveyor.name,
            surveyorId: editSurveyor.id,
            mrdName: editMRD.name,
            mrdCode: editMRD.code,
            zone: editMRD.zone,
        }));
        setEditingId(null);
        setToast({ type: "success", message: t("EKYC_MAPPING_UPDATED") || "Mapping updated successfully" });
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditSurveyor(null);
        setEditMRD(null);
    };

    const handleDeleteConfirm = () => {
        setMappings(prev => prev.filter(m => m.id !== deleteTarget.id));
        setDeleteTarget(null);
        setToast({ type: "success", message: t("EKYC_MAPPING_REMOVED") || "Mapping removed" });
    };

    const handleSaveMappings = () => {
        if (mappings.length === 0) {
            setToast({ type: "error", message: t("EKYC_NO_MAPPINGS_TO_SAVE") || "No mappings to save" });
            return;
        }
        // TODO: replace with real API call
        setToast({ type: "success", message: t("EKYC_MAPPINGS_SAVED_SUCCESS") || "Surveyor mappings saved successfully!" });
    };

    // ── Table columns ─────────────────────────────────────────────────────────

    const columns = useMemo(() => [
        {
            Header: t("EKYC_SURVEYOR_NAME") || "Surveyor",
            accessor: "surveyorName",
            Cell: ({ row }) => {
                const isEditing = editingId === row.original.id;
                if (isEditing) {
                    return (
                        <Dropdown
                            selected={editSurveyor}
                            select={setEditSurveyor}
                            option={MOCK_SURVEYORS}
                            optionKey="name"
                            t={t}
                            placeholder={t("EKYC_SELECT_SURVEYOR_PLACEHOLDER") || "Choose surveyor..."}
                        />
                    );
                }
                return (
                    <div>
                        <span className="link">{row.original.surveyorName}</span>
                        <div style={{ fontSize: "12px", color: "#666" }}>{row.original.surveyorId}</div>
                    </div>
                );
            },
        },
        {
            Header: t("EKYC_MRD_ASSIGNED") || "MRD Assigned",
            accessor: "mrdName",
            Cell: ({ row }) => {
                const isEditing = editingId === row.original.id;
                if (isEditing) {
                    return (
                        <Dropdown
                            selected={editMRD}
                            select={setEditMRD}
                            option={MOCK_MRDS}
                            optionKey="name"
                            t={t}
                            placeholder={t("EKYC_SELECT_MRD_PLACEHOLDER") || "Choose MRD..."}
                        />
                    );
                }
                return (
                    <div>
                        <span>{row.original.mrdName}</span>
                        <div style={{ fontSize: "12px", color: "#666" }}>{row.original.zone}</div>
                    </div>
                );
            },
        },
        {
            Header: t("ES_COMMON_ACTION") || "Actions",
            Cell: ({ row }) => {
                const isEditing = editingId === row.original.id;
                if (isEditing) {
                    return (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <span
                                style={{ cursor: "pointer", color: "#f47738", fontWeight: "bold" }}
                                onClick={() => handleEditSave(row.original.id)}
                            >
                                {t("ES_COMMON_SAVE")}
                            </span>
                            <span
                                style={{ cursor: "pointer", color: "#505A5F", fontWeight: "bold" }}
                                onClick={handleEditCancel}
                            >
                                {t("ES_COMMON_CANCEL")}
                            </span>
                        </div>
                    );
                }
                return (
                    <div style={{ display: "flex", gap: "16px" }}>
                        <span onClick={() => handleEditStart(row.original)} style={{ cursor: "pointer" }}>
                            <EditIcon className="icon" fill="#f47738" />
                        </span>
                        <span onClick={() => setDeleteTarget(row.original)} style={{ cursor: "pointer" }}>
                            <DeleteIcon className="icon" fill="#f47738" />
                        </span>
                    </div>
                );
            },
        },
    ], [editingId, editSurveyor, editMRD, mappings, t]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <React.Fragment>
            <div className="side-panel-item">
                <Card className="employeeCard filter inboxLinks" style={{ marginTop: "16px" }}>
                    <div className="complaint-links-container">
                        <div className="header" style={{ marginBottom: "0px" }}>
                            <span className="logo">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span className="text">{t("EKYC_SURVEYOR_MAPPING") || "Surveyor Mapping"}</span>
                        </div>
                    </div>
                </Card>
            </div>

            <Card>
                <CardHeader>{t("EKYC_NEW_MAPPING") || "New Mapping"}</CardHeader>
                <CardText>
                    {t("EKYC_MAPPING_SUBHEADER") || "Assign Meter Reading Dairies to surveyors to manage their data access."}
                </CardText>

                <LabelFieldPair>
                    <CardLabel>{t("EKYC_SELECT_SURVEYOR") || "Select Surveyor"} *</CardLabel>
                    <div className="">
                        <Dropdown
                            selected={selectedSurveyor}
                            select={setSelectedSurveyor}
                            option={MOCK_SURVEYORS}
                            optionKey="name"
                            t={t}
                            placeholder={t("EKYC_SELECT_SURVEYOR_PLACEHOLDER") || "Choose a surveyor..."}
                        />
                    </div>
                </LabelFieldPair>

                <LabelFieldPair>
                    <CardLabel>{t("EKYC_SELECT_MRD") || "Select MRD"} *</CardLabel>
                    <div className="field">
                        <Dropdown
                            selected={selectedMRD}
                            select={setSelectedMRD}
                            option={MOCK_MRDS}
                            optionKey="name"
                            t={t}
                            placeholder={t("EKYC_SELECT_MRD_PLACEHOLDER") || "Choose an MRD..."}
                        />
                    </div>
                </LabelFieldPair>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                    <SubmitBar
                        label={t("EKYC_ADD_TO_LIST") || "Add to Mapping List"}
                        onSubmit={handleAddMapping}
                        disabled={!selectedSurveyor || !selectedMRD}
                    />
                </div>
            </Card>

            {mappings.length > 0 && (
                <Card>
                    <CardHeader>
                        {t("EKYC_MAPPING_SUMMARY") || "Mapping Summary"} ({mappings.length})
                    </CardHeader>
                    <Table
                        t={t}
                        data={mappings}
                        columns={columns}
                        getCellProps={(cellInfo) => {
                            return {
                                style: {
                                    padding: "10px",
                                    fontSize: "16px",
                                }
                            };
                        }}
                        tableClassName="table digit-table"
                    />
                </Card>
            )}

            {mappings.length > 0 && (
                <ActionBar>
                    <SubmitBar
                        label={t("EKYC_SAVE_MAPPINGS") || "Save Mappings"}
                        onSubmit={handleSaveMappings}
                    />
                </ActionBar>
            )}

            {deleteTarget && (
                <Modal
                    headerBarMain={t("EKYC_REMOVE_MAPPING") || "Remove Mapping"}
                    headerBarEnd={
                        <span onClick={() => setDeleteTarget(null)} style={{ cursor: "pointer", padding: "8px" }}>
                            X
                        </span>
                    }
                    actionSaveLabel={t("ES_COMMON_REMOVE")}
                    actionSaveOnSubmit={handleDeleteConfirm}
                    actionCancelLabel={t("ES_COMMON_CANCEL")}
                    actionCancelOnSubmit={() => setDeleteTarget(null)}
                    style={{ borderRadius: "12px" }}
                >
                    <CardText style={{ marginTop: "16px", marginBottom: "16px" }}>
                        {t("EKYC_REMOVE_MAPPING_CONFIRM_MSG") || "Are you sure you want to remove the mapping between "}
                        <strong>{deleteTarget?.surveyorName}</strong> and <strong>{deleteTarget?.mrdName}</strong>?
                    </CardText>
                </Modal>
            )}

            {toast && (
                <Toast
                    label={toast.message}
                    error={toast.type === "error"}
                    warning={toast.type === "warning"}
                    info={toast.type === "info"}
                    isDsc={true}
                    onClose={() => setToast(null)}
                />
            )}
        </React.Fragment>
    );
};

export default Mapping;