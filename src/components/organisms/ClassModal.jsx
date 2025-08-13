import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const ClassModal = ({ isOpen, onClose, classData, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    schedule: "",
    studentIds: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name || "",
        subject: classData.subject || "",
        schedule: classData.schedule || "",
        studentIds: classData.studentIds || []
      });
    } else {
      setFormData({
        name: "",
        subject: "",
        schedule: "",
        studentIds: []
      });
    }
    setErrors({});
  }, [classData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Class name is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.schedule.trim()) newErrors.schedule = "Schedule is required";
    
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
                  {classData ? "Edit Class" : "Add Class"}
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
                <FormField
                  label="Class Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  placeholder="e.g., Mathematics 101"
                />

                <FormField
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  error={errors.subject}
                  required
                  placeholder="e.g., Mathematics, Science, English"
                />

                <FormField
                  label="Schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  error={errors.schedule}
                  required
                  placeholder="e.g., Mon/Wed/Fri 9:00-10:30 AM"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button type="submit" className="w-full sm:w-auto sm:ml-3">
                {classData ? "Update Class" : "Add Class"}
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

export default ClassModal;