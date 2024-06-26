import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './receipt.css';

const PurchaseOrderForm = () => {
  const [formData, setFormData] = useState({
    poNo: '',
    poDate: '',
    vendor: '',
    vendorCode: '',
    location: '',
    receiptDate: '',
    lrNo: '',
    lrDate: ''
  });

  const [materials, setMaterials] = useState([
    { materialCode: '', materialShortText: '', quantity: '', uom: '' }
  ]);

  // Generate random PO No. starting with "40" and followed by 8 random digits
  useEffect(() => {
    generateRandomPONo();
  }, []);

  const generateRandomPONo = () => {
    const randomDigits = Math.floor(100000000 + Math.random() * 9000000); // Generates a random 8-digit number
    const poNo = `40${randomDigits}`; // Constructs the PO No. starting with "40"
    setFormData((prevData) => ({
      ...prevData,
      poNo: poNo
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'vendorCode' && value) {
      fetchVendorData(value);
    }
  };

  const fetchVendorData = async (vendorCode) => {
    try {
      const response = await axios.get('http://localhost:7001/fetchVendor', { params: { vendorCode } });
      const vendorData = response.data;
      setFormData((prevData) => ({
        ...prevData,
        vendor: vendorData.Vendor,
        location: vendorData.Location
      }));
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      alert('Error fetching vendor data.');
    }
  };

  const handleMaterialChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMaterials = [...materials];
    updatedMaterials[index][name] = value;
    setMaterials(updatedMaterials);
  };

  const addMaterial = () => {
    setMaterials([
      ...materials,
      { materialCode: '', materialShortText: '', quantity: '', uom: '' }
    ]);
  };

  const removeMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  const fetchMaterialData = async (index, query) => {
    try {
      const response = await axios.get('http://localhost:7001/fetch', { params: query });
      if (response.data.length > 0) {
        const material = response.data[0];
        const newEntries = [...materials];
        newEntries[index] = {
          materialCode: material.MaterialCode,
          materialShortText: material.MaterialShortText,
          uom: material.UOM,
          quantity: newEntries[index].quantity // preserve existing quantity
        };
        setMaterials(newEntries);
      } else {
        alert('No material data found.');
      }
    } catch (error) {
      console.error('Error fetching material data:', error);
      alert('Error fetching material data.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullFormData = { ...formData, materials };
    try {
      const response = await axios.post('http://localhost:7001/submitReceipt', fullFormData);
      console.log('Submission response:', response.data);
      alert('Receipt submitted successfully!');
      // Optionally reset form data or take other actions upon successful submission
    } catch (error) {
      console.error('Error submitting receipt:', error);
      alert('Error submitting receipt.');
    }
  };

  return (
    <div className="purchase-form-wrapper">
      <h1 className="purchase-heading">Store Receipt</h1>
      <form onSubmit={handleSubmit} className="purchase-form-container">
        <div className="po-no-date">
          <label className="po-no">
            PO No.:
            <input type="text" name="poNo" value={formData.poNo} readOnly />
          </label>
          <label className="po-date">
            PO Date:
            <input type="date" name="poDate" value={formData.poDate} onChange={handleFormChange} />
          </label>
        </div>

        <div className="vendor-info">
          <label className="vendor-code">
            Vendor Code:
            <input type="text" name="vendorCode" value={formData.vendorCode} onChange={handleFormChange} />
          </label>
          <label className="vendor">
            Vendor:
            <input type="text" name="vendor" value={formData.vendor} readOnly />
          </label>
          <label className="location">
            Location:
            <input type="text" name="location" value={formData.location} readOnly />
          </label>
        </div>

        <div className="receipt-info">
          <label className="receipt-date">
            Receipt Date:
            <input type="date" name="receiptDate" value={formData.receiptDate} onChange={handleFormChange} />
          </label>
        </div>

        <div className="lr-info">
          <label className="lr-no">
            LR No.:
            <input type="number" name="lrNo" value={formData.lrNo} onChange={handleFormChange} />
          </label>
          <label className="lr-date">
            LR Date:
            <input type="date" name="lrDate" value={formData.lrDate} onChange={handleFormChange} />
          </label>
        </div>

        {materials.map((material, index) => (
          <div key={index} className="material-fields">
            <label className="material-code">
              Material Code:
              <input
                type="text"
                name="materialCode"
                value={material.materialCode}
                onChange={(e) => {
                  handleMaterialChange(index, e);
                  if (e.target.value) {
                    fetchMaterialData(index, { code: e.target.value });
                  }
                }}
              />
            </label>
            <label className="material-short-text">
              Material Short Text:
              <input
                type="text"
                name="materialShortText"
                value={material.materialShortText}
                onChange={(e) => handleMaterialChange(index, e)}
              />
            </label>
            <label className="quantity">
              Quantity:
              <input
                type="number"
                name="quantity"
                value={material.quantity}
                onChange={(e) => handleMaterialChange(index, e)}
              />
            </label>
            <label className="uom">
              UOM:
              <input
                type="text"
                name="uom"
                value={material.uom}
                onChange={(e) => handleMaterialChange(index, e)}
              />
            </label>
          </div>
        ))}

        <div className="button-group">
          <button type="button" onClick={addMaterial} className="add-material-button">
            Add Material
          </button>
          <button type="button" onClick={() => removeMaterial(materials.length - 1)} className="remove-button">
            Remove
          </button>
        </div>

        <button type="submit">Submit</button>
      </form>
      <div className="purchase-form-padding"></div>
    </div>
  );
};

export default PurchaseOrderForm;
