import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const StudentModal = ({ isOpen, onClose, student, onSave, classes = [] }) => {
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    classIds: [],
    status: "active",
    parentContacts: [],
    emergencyContacts: []
  });
const [errors, setErrors] = useState({});
  const [editingContact, setEditingContact] = useState(null);
  const [contactType, setContactType] = useState(null);

  useEffect(() => {
if (student) {
      setFormData({
        firstName: student.first_name_c || student.firstName || "",
        lastName: student.last_name_c || student.lastName || "",
        email: student.email_c || student.email || "",
        phone: student.phone_c || student.phone || "",
        dateOfBirth: student.date_of_birth_c || student.dateOfBirth ? new Date(student.date_of_birth_c || student.dateOfBirth).toISOString().split("T")[0] : "",
        enrollmentDate: student.enrollment_date_c || student.enrollmentDate ? new Date(student.enrollment_date_c || student.enrollmentDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        classIds: student.class_ids_c?.split(',').filter(id => id.trim()).map(id => parseInt(id)) || student.classIds || [],
        status: student.status_c || student.status || "active",
        parentContacts: student.parentContacts || [],
        emergencyContacts: student.emergencyContacts || []
      });
    } else {
      setFormData({
        firstName: "",
lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        enrollmentDate: new Date().toISOString().split("T")[0],
        classIds: [],
        status: "active",
        parentContacts: [],
        emergencyContacts: []
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

const handleClassChange = (e) => {
    const { value, checked } = e.target;
    const classId = parseInt(value, 10);
    setFormData(prev => ({
      ...prev,
      classIds: checked 
        ? [...prev.classIds, classId]
        : prev.classIds.filter(id => id !== classId)
    }));
  };
const addContact = (type) => {
    setContactType(type);
    setEditingContact({ name: "", phone: "", email: "" });
  };

  const editContact = (type, index) => {
    setContactType(type);
    setEditingContact({ 
      ...formData[type][index], 
      index 
    });
  };

  const saveContact = (contactData) => {
    const { index, ...contact } = contactData;
    
    if (index !== undefined) {
      // Editing existing contact
      setFormData(prev => ({
        ...prev,
        [contactType]: prev[contactType].map((c, i) => i === index ? contact : c)
      }));
    } else {
      // Adding new contact
      setFormData(prev => ({
        ...prev,
        [contactType]: [...prev[contactType], contact]
      }));
    }
    
    setEditingContact(null);
    setContactType(null);
  };

  const deleteContact = (type, index) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setFormData(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {student ? "Edit Student" : "Add Student"}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    required
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    required
                  />
                </div>

                <FormField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                <FormField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />

                <FormField
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={errors.dateOfBirth}
                  required
                />

                <FormField
                  label="Enrollment Date"
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                />

                <FormField
                  label="Status"
                  type="select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" }
                  ]}
                />

                {classes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Classes
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                      {classes.map((cls) => (
                        <label key={cls.Id} className="flex items-center">
<input
                            type="checkbox"
                            value={cls.Id}
                            checked={formData.classIds.includes(parseInt(cls.Id, 10))}
                            onChange={handleClassChange}
                            className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                          />
                          <span className="text-sm text-gray-700">{cls.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
{/* Contact Information Section */}
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
                  
                  {/* Parent/Guardian Contacts */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Parent/Guardian Contacts
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addContact('parentContacts')}
                      >
                        <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                        Add Parent
                      </Button>
                    </div>
                    
                    {formData.parentContacts.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {formData.parentContacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                              <div className="text-xs text-gray-600">
                                {contact.phone} • {contact.email}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                type="button"
                                onClick={() => editContact('parentContacts', index)}
                                className="text-gray-400 hover:text-blue-600"
                              >
                                <ApperIcon name="Edit2" className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteContact('parentContacts', index)}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <ApperIcon name="Trash2" className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic border border-gray-200 rounded-lg p-3 text-center">
                        No parent/guardian contacts added
                      </div>
                    )}
                  </div>

                  {/* Emergency Contacts */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Emergency Contacts
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addContact('emergencyContacts')}
                      >
                        <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                        Add Emergency
                      </Button>
                    </div>
                    
                    {formData.emergencyContacts.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {formData.emergencyContacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                              <div className="text-xs text-gray-600">
                                {contact.phone} • {contact.email}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                type="button"
                                onClick={() => editContact('emergencyContacts', index)}
                                className="text-gray-400 hover:text-blue-600"
                              >
                                <ApperIcon name="Edit2" className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteContact('emergencyContacts', index)}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <ApperIcon name="Trash2" className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic border border-gray-200 rounded-lg p-3 text-center">
                        No emergency contacts added
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Form Modal */}
                {editingContact && (
                  <div className="fixed inset-0 z-60 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => {
                        setEditingContact(null);
                        setContactType(null);
                      }}></div>
                      
                      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:align-middle sm:max-w-md sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900">
                              {editingContact.index !== undefined ? 'Edit' : 'Add'} {
                                contactType === 'parentContacts' ? 'Parent/Guardian' : 'Emergency'
                              } Contact
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingContact(null);
                                setContactType(null);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <ApperIcon name="X" className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const contactData = {
                              name: formData.get('name'),
                              phone: formData.get('phone'),
                              email: formData.get('email'),
                              index: editingContact.index
                            };
                            saveContact(contactData);
                          }}>
                            <div className="space-y-4">
                              <FormField
                                label="Name"
                                name="name"
                                defaultValue={editingContact.name}
                                required
                              />
                              <FormField
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                defaultValue={editingContact.phone}
                                required
                              />
                              <FormField
                                label="Email"
                                name="email"
                                type="email"
                                defaultValue={editingContact.email}
                                required
                              />
                            </div>
                            
                            <div className="bg-gray-50 px-4 py-3 mt-6 -mx-4 -mb-4 flex flex-row-reverse space-x-reverse space-x-3">
                              <Button type="submit">
                                {editingContact.index !== undefined ? 'Update' : 'Add'} Contact
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  setEditingContact(null);
                                  setContactType(null);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button type="submit" className="w-full sm:w-auto sm:ml-3">
                {student ? "Update Student" : "Add Student"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="mt-3 w-full sm:mt-0 sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;