import React, { useState } from "react";
import "./HomePage.css";

const HomePage = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNumber: "",
        address: "",
        quantity: 1,
        kitchen: "",
        landmark: "",
        date: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    // const isBookingDisabled = () => {
    //     const currentHour = new Date().getHours();
    //     return currentHour >= 23;
    // };

    // if (isBookingDisabled()) {
    //     return <h1>Booking is closed for today!</h1>;
    // }


    const kitchens = ["Asad Mamu", "Osmanpura" ]; // Example options for kitchens
    const landmarks = ["Alampura","Tuition Area", "Khori Galli", ]; // Example options for landmarks
    
    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormData((prev) => ({ ...prev, ["date"]: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) }));
    };

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {};
        const mobileRegex = /^[6-9]\d{9}$/; // Regex for validating Indian mobile numbers

        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
        if (!formData.mobileNumber.trim())
            newErrors.mobileNumber = "Mobile Number is required.";
        else if (!mobileRegex.test(formData.mobileNumber))
            newErrors.mobileNumber = "Enter a valid Indian Mobile Number.";
        if (!formData.address.trim()) newErrors.address = "Address is required.";
        if (!formData.kitchen) newErrors.kitchen = "Please select a kitchen.";
        if (!formData.landmark) newErrors.landmark = "Please select a landmark.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                let response = await fetch("https://tiffin-be.onrender.com/tiffins", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    setSuccessMessage("Tiffin booked successfully!");
                    setFormData({
                        fullName: "",
                        mobileNumber: "",
                        address: "",
                        kitchen: "",
                        landmark: "",
                        quantity: 1,
                        date: "",
                    });
                    setErrors({});
                } else {
                    response = await response.json()
                    setSuccessMessage(response.message || "Failed to book tiffin. Please try again.");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                setSuccessMessage("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="home-page">
            <h1>Book Your Tiffin</h1>
            <form onSubmit={handleSubmit} className="tiffin-form">
                <div className="form-group">
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    {errors.fullName && <p className="error">{errors.fullName}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="mobileNumber">Mobile Number:</label>
                    <input
                        type="text"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                    />
                    {errors.mobileNumber && (
                        <p className="error">{errors.mobileNumber}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="kitchen">Kitchen:</label>
                    <select
                        id="kitchen"
                        name="kitchen"
                        value={formData.kitchen}
                        onChange={handleChange}
                    >
                        <option value="">Select a kitchen</option>
                        {kitchens.map((kitchen, index) => (
                            <option key={index} value={kitchen}>
                                {kitchen}
                            </option>
                        ))}
                    </select>
                    {errors.kitchen && <p className="error">{errors.kitchen}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <select
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                    {errors.quantity && <p className="error">{errors.quantity}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    {errors.address && <p className="error">{errors.address}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="landmark">Landmark:</label>
                    <select
                        id="landmark"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                    >
                        <option value="">Select a landmark</option>
                        {landmarks.map((landmark, index) => (
                            <option key={index} value={landmark}>
                                {landmark}
                            </option>
                        ))}
                    </select>
                    {errors.landmark && <p className="error">{errors.landmark}</p>}
                </div>

                <button type="submit">Submit</button>
                {successMessage && <p className="success">{successMessage}</p>}
            </form>
        </div>
    );
};

export default HomePage;