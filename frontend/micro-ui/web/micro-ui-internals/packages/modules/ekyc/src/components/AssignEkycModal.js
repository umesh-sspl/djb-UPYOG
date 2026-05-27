import React, { useMemo, useState } from "react";
import { Modal, Close } from "@djb25/digit-ui-react-components";

const AssignEkycModal = ({ surveyor, closeModal }) => {
  const [selectedKnos, setSelectedKnos] = useState([]);

  const [filters, setFilters] = useState({
    pincode: "",
    locality: "",
    status: "",
    route: "",
    search: "",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const knoList = [
    {
      kno: "1029384756",
      consumerName: "Rahul Sharma",
      locality: "Rohini",
      pincode: "110085",
      status: "PENDING",
      route: "R1",
    },
    {
      kno: "9283746555",
      consumerName: "Amit Kumar",
      locality: "Pitampura",
      pincode: "110034",
      status: "VERIFIED",
      route: "R2",
    },
    {
      kno: "8473625147",
      consumerName: "Neha Verma",
      locality: "Dwarka",
      pincode: "110075",
      status: "PENDING",
      route: "R3",
    },
    {
      kno: "5647382910",
      consumerName: "Sanjay Singh",
      locality: "Janakpuri",
      pincode: "110058",
      status: "ASSIGNED",
      route: "R1",
    },
    {
      kno: "9182736450",
      consumerName: "Priya Mehta",
      locality: "Laxmi Nagar",
      pincode: "110092",
      status: "PENDING",
      route: "R4",
    },
    {
      kno: "7463829105",
      consumerName: "Vikas Gupta",
      locality: "Karol Bagh",
      pincode: "110005",
      status: "VERIFIED",
      route: "R2",
    },
    {
      kno: "1122334455",
      consumerName: "Anjali Kapoor",
      locality: "Saket",
      pincode: "110017",
      status: "PENDING",
      route: "R5",
    },
    {
      kno: "6677889900",
      consumerName: "Rohit Yadav",
      locality: "Uttam Nagar",
      pincode: "110059",
      status: "ASSIGNED",
      route: "R3",
    },
    {
      kno: "8899776655",
      consumerName: "Deepak Chauhan",
      locality: "Burari",
      pincode: "110084",
      status: "PENDING",
      route: "R6",
    },
    {
      kno: "5544332211",
      consumerName: "Sneha Arora",
      locality: "Shahdara",
      pincode: "110032",
      status: "VERIFIED",
      route: "R4",
    },
    {
      kno: "3344556677",
      consumerName: "Karan Malhotra",
      locality: "Mayur Vihar",
      pincode: "110091",
      status: "PENDING",
      route: "R7",
    },
    {
      kno: "9988776654",
      consumerName: "Pooja Bansal",
      locality: "Patel Nagar",
      pincode: "110008",
      status: "ASSIGNED",
      route: "R5",
    },
    {
      kno: "7766554433",
      consumerName: "Harsh Jain",
      locality: "Punjabi Bagh",
      pincode: "110026",
      status: "PENDING",
      route: "R8",
    },
    {
      kno: "2233445566",
      consumerName: "Nitin Sharma",
      locality: "Rajouri Garden",
      pincode: "110027",
      status: "VERIFIED",
      route: "R1",
    },
    {
      kno: "4433221100",
      consumerName: "Megha Sethi",
      locality: "Ashok Vihar",
      pincode: "110052",
      status: "PENDING",
      route: "R9",
    },
    {
      kno: "1010101010",
      consumerName: "Aditya Rana",
      locality: "Model Town",
      pincode: "110009",
      status: "ASSIGNED",
      route: "R10",
    },
    {
      kno: "2020202020",
      consumerName: "Simran Kaur",
      locality: "Tilak Nagar",
      pincode: "110018",
      status: "PENDING",
      route: "R11",
    },
    {
      kno: "3030303030",
      consumerName: "Mohit Saini",
      locality: "Narela",
      pincode: "110040",
      status: "VERIFIED",
      route: "R6",
    },
    {
      kno: "4040404040",
      consumerName: "Ritika Sharma",
      locality: "Bawana",
      pincode: "110039",
      status: "PENDING",
      route: "R7",
    },
    {
      kno: "5050505050",
      consumerName: "Yash Aggarwal",
      locality: "Okhla",
      pincode: "110020",
      status: "ASSIGNED",
      route: "R8",
    },
  ];

  const filteredKnos = useMemo(() => {
    return knoList.filter((item) => {
      const matchesPincode = filters.pincode ? item.pincode.includes(filters.pincode) : true;

      const matchesLocality = filters.locality ? item.locality.toLowerCase().includes(filters.locality.toLowerCase()) : true;

      const matchesStatus = filters.status ? item.status === filters.status : true;

      const matchesRoute = filters.route ? item.route.toLowerCase().includes(filters.route.toLowerCase()) : true;

      const matchesSearch = filters.search
        ? item.kno.includes(filters.search) || item.consumerName.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      return matchesPincode && matchesLocality && matchesStatus && matchesRoute && matchesSearch;
    });
  }, [filters, knoList]);

  const handleSelect = (kno) => {
    setSelectedKnos((prev) => (prev.includes(kno) ? prev.filter((item) => item !== kno) : [...prev, kno]));
  };

  const handleSelectAll = () => {
    const visibleKnos = filteredKnos.map((item) => item.kno);

    const allSelected = visibleKnos.every((kno) => selectedKnos.includes(kno));

    if (allSelected) {
      setSelectedKnos((prev) => prev.filter((kno) => !visibleKnos.includes(kno)));
    } else {
      setSelectedKnos((prev) => [...new Set([...prev, ...visibleKnos])]);
    }
  };

  const handleAssign = () => {
    const payload = {
      surveyorId: surveyor?.uuid,
      knos: selectedKnos,
      filters,
    };

    console.log(payload);

    closeModal();
  };

  return (
    <Modal
      headerBarMain={`Assign KNOs to ${surveyor?.name}`}
      headerBarEnd={<Close onClick={closeModal} />}
      actionCancelLabel="Cancel"
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={`Assign ${selectedKnos.length} KNOs`}
      actionSaveOnSubmit={handleAssign}
      popupStyles={{
        width: "95%",
        maxWidth: "1400px",
        minHeight: "700px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <input
            placeholder="Search by KNO / Consumer"
            value={filters.search}
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Pincode"
            value={filters.pincode}
            onChange={(e) =>
              setFilters({
                ...filters,
                pincode: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Locality"
            value={filters.locality}
            onChange={(e) =>
              setFilters({
                ...filters,
                locality: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Route"
            value={filters.route}
            onChange={(e) =>
              setFilters({
                ...filters,
                route: e.target.value,
              })
            }
            style={inputStyle}
          />

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value,
              })
            }
            style={inputStyle}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="ASSIGNED">Assigned</option>
          </select>
        </div>

        {/* Summary */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f5f7fa",
            padding: "14px 18px",
            borderRadius: "12px",
            fontWeight: "600",
          }}
        >
          <div>Total Records: {filteredKnos.length}</div>

          <div>Selected KNOs: {selectedKnos.length}</div>
        </div>

        {/* Table */}
        <div
          style={{
            border: "1px solid #d6d6d6",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1.2fr 1.4fr 1fr 1fr 1fr 0.8fr",
              padding: "16px",
              background: "#eef2f7",
              fontWeight: "700",
              fontSize: "14px",
              color: "#0B2559",
            }}
          >
            <div>
              <input
                type="checkbox"
                checked={filteredKnos.length > 0 && filteredKnos.every((item) => selectedKnos.includes(item.kno))}
                onChange={handleSelectAll}
              />
            </div>

            <div>KNO</div>
            <div>Consumer Name</div>
            <div>Locality</div>
            <div>Pincode</div>
            <div>Status</div>
            <div>Route</div>
          </div>

          {/* Rows */}
          <div
            style={{
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            {filteredKnos.length > 0 ? (
              filteredKnos.map((item, index) => (
                <div
                  key={item.kno}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1.2fr 1.4fr 1fr 1fr 1fr 0.8fr",
                    padding: "16px",
                    alignItems: "center",
                    borderTop: "1px solid #edf0f4",
                    background: index % 2 === 0 ? "#fff" : "#fafbfd",
                    fontSize: "14px",
                  }}
                >
                  <div>
                    <input type="checkbox" checked={selectedKnos.includes(item.kno)} onChange={() => handleSelect(item.kno)} />
                  </div>

                  <div
                    style={{
                      fontWeight: "600",
                      color: "#0B2559",
                    }}
                  >
                    {item.kno}
                  </div>

                  <div>{item.consumerName}</div>
                  <div>{item.locality}</div>
                  <div>{item.pincode}</div>

                  <div>
                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: item.status === "PENDING" ? "#FEF3C7" : item.status === "VERIFIED" ? "#DCFCE7" : "#DBEAFE",
                        color: item.status === "PENDING" ? "#92400E" : item.status === "VERIFIED" ? "#166534" : "#1E40AF",
                      }}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div>{item.route}</div>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                No KNO records found
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const inputStyle = {
  height: "48px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  padding: "0 14px",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  background: "#fff",
};

export default AssignEkycModal;
