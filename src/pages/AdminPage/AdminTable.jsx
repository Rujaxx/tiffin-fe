import React, { useState, useEffect } from "react";
import "./AdminTable.css"; // Import styles
import { useNavigate } from "react-router-dom";

const ScrollToTopButton = ({ show }) => {
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!show) {
        return null;
    }

    return (
        <button onClick={handleScrollToTop} className="scroll-to-top-button">
            ^
        </button>
    );
};

const AssignRiderButton = ({ count, handleOnClick }) => {
    return (
        <button onClick={handleOnClick} className="assign-rider-button">
          Assign Rider ({count})
        </button>
    );
};

const RiderPopup = ({ show, onClose, onAssign, riderName, setRiderName }) => {
    if (!show) {
        return null;
    }
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Assign Rider</h2>
                <input
                    type="text"
                    placeholder="Enter rider name"
                    value={riderName}
                    onChange={(e) => setRiderName(e.target.value)}
                />
                <button onClick={onAssign}>Assign</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};


const AdminTable = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [riderName, setRiderName] = useState("");
    const [show, setShowPopup] = useState(false);

    const navigate = useNavigate();
    const onAssign = () => {
        handleAssignRider();
        setShowPopup(false);
        setSelectAll(false);
        setSelectedItems([]);        
    }
    const onClose = () => {
        setShowPopup(false);
    }

    const handleOnClick = () => {
        setShowPopup(true);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirect to login page if token is not present
        }
        const fetchData = async () => {
            console.log("Fetching data...");
            try {
                const response = await fetch("https://tiffin-be.onrender.com/deliveries", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }); // Replace with your API URL
                if (response.ok) {
                    const result = await response.json();
                    setData(result.data); // Assuming the response is an array of objects
                } else if (response.status !== 200) {
                    // Redirect to login page or show error message
                    navigate("/login"); // Replace with your login page URL
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    useEffect(() => {
        if (selectedItems.length < 1) {
            setShowPopup(false);
            setSelectAll(false)
        }
    }, [selectedItems]);

    const filteredData = data.filter(
        (item) =>
            item.landmark?.toLowerCase().includes(search.toLowerCase()) ||
            item.riderName?.toLowerCase().includes(search.toLowerCase()) ||
            item.address?.toLowerCase().includes(search.toLowerCase()) ||
            item.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            item.mobileNumber?.toLowerCase().includes(search.toLowerCase()) ||
            item.kitchen?.toLowerCase().includes(search.toLowerCase()) 
    ).sort((a, b) => {
        if (a.riderName && !b.riderName) {  // Sort by rider name
            return 1;  // a comes first
        } else{
            return -1
        }
    });

    if (loading) {
        return <p>Loading data...</p>;
    }

    const handleSelectItem = (id) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(id)
                ? prevSelectedItems.filter((item) => item !== id)
                : [...prevSelectedItems, id]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
            setShowPopup(false);
        } else {
            setSelectedItems(filteredData.map((item) => item._id));
        }
        setSelectAll(!selectAll);
    };


    const handleAssignRider = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            let response = await fetch("https://tiffin-be.onrender.com/assign-rider", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    riderName,
                    selectedItems,
                }),
            });
            let status = response.ok
            response = await response.json();
            if (status) {
                if(riderName === "") {
                    alert("Rider removed successfully");
                }else{
                    alert("Rider assigned successfully");
                }
                // Optionally, you can refresh the data or clear the selected items
                setSelectedItems([]);
                setRiderName("");
                let deliveries = response.data.deliveries
                let mappedData = new Map(deliveries.map((item) => [item._id, item]));
                setData((prevData) => {
                    return prevData.map((item) => {
                        if(mappedData.has(item._id)) {
                            return {
                                ...item,
                                riderName: riderName
                            }
                        }
                        return item;

                    })
                });
            } else {
                if(response?.message && response.message === "jwt expired") {
                    navigate("/login");
                }
                console.error("Failed to assign rider");
            }
        } catch (error) {
            console.error("Error assigning rider:", error);
        }
    };


    return (
        <div>
            <div className="table-header">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <div className="search-input">
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                    ></input>
                    <label>Select All</label>
                </div>
                {
                    selectedItems.length > 0 && (
                        <AssignRiderButton count={selectedItems.length} handleOnClick={handleOnClick} />
                    )
                }
                {
                    show && (<RiderPopup
                        show={show}
                        onClose={onClose}
                        onAssign={onAssign}
                        riderName={riderName}
                        setRiderName={setRiderName}
                    />)
                }
            </div>
            <div className="admin-table-container">
                <div className="table-cards">
                    {filteredData.map((item, index) => (
                        <div key={index} className="card">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item._id)}
                                onChange={() => handleSelectItem(item._id)}
                            />
                            {item.riderName && <div className="flag">Assigned</div>}
                            <p><strong>Landmark:</strong> {item.landmark}</p>
                            <p><strong>Rider Name:</strong> {item.riderName}</p>
                            <p><strong>Address:</strong> {item.address}</p>
                            <p><strong>Full Name:</strong> {item.fullName}</p>
                            <p><strong>Phone Number:</strong> {item.mobileNumber}</p>
                            <p><strong>Kitchen:</strong> {item.kitchen}</p>
                        </div>
                    ))}
                </div>
            </div>
            <ScrollToTopButton show={showScrollButton} />
        </div>
    );
};


export default AdminTable;
