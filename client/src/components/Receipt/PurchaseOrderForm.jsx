import React, { useState } from 'react';
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullFormData = { ...formData, materials };
    console.log(fullFormData);
  };

  return (
    <div className="purchase-form-wrapper">
      <h1 className="purchase-heading">Store Receipt</h1>
      <form onSubmit={handleSubmit} className="purchase-form-container">
        <div className="po-no-date">
          <label className="po-no">
            PO No.:
            <input type="number" name="poNo" value={formData.poNo} onChange={handleFormChange} />
          </label>
          <label className="po-date">
            PO Date:
            <input type="date" name="poDate" value={formData.poDate} onChange={handleFormChange} />
          </label>
        </div>

        <div className="vendor-info">
          <label className="vendor-code">
            Vendor Code:
            <input type="number" name="vendorCode" value={formData.vendorCode} onChange={handleFormChange} />
          </label>
          <label className="vendor">
            Vendor:
            <input type="text" name="vendor" value={formData.vendor} onChange={handleFormChange} />
          </label>
          <label className="location">
            Location:
            <input type="text" name="location" value={formData.location} onChange={handleFormChange} />
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
                type="number"
                name="materialCode"
                value={material.materialCode}
                onChange={(e) => handleMaterialChange(index, e)}
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
