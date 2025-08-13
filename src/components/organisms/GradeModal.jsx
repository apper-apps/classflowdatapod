import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const GradeModal = ({ isOpen, onClose, grade, onSave, students = [], classes = [] }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    assignmentName: "",
    score: "",
    maxScore: "100",
    date: new Date().toISOString().split("T")[0],
    type: "assignment"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
if (grade) {
      setFormData({
        studentId: (grade.student_id_c?.Id || grade.student_id_c || grade.studentId || "").toString(),
        classId: (grade.class_id_c?.Id || grade.class_id_c || grade.classId || "").toString(),
        assignmentName: grade.assignment_name_c || grade.assignmentName || "",
        score: (grade.score_c || grade.score || "").toString(),
        maxScore: (grade.max_score_c || grade.maxScore || 100).toString(),
        date: grade.date_c || grade.date ? new Date(grade.date_c || grade.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        type: grade.type_c || grade.type || "assignment"
      });
    } else {
      setFormData({
        studentId: "",
        classId: "",
        assignmentName: "",
        score: "",
        maxScore: "100",
        date: new Date().toISOString().split("T")[0],
        type: "assignment"
      });
    }
    setErrors({});
  }, [grade, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = "Student is required";
    if (!formData.classId) newErrors.classId = "Class is required";
    if (!formData.assignmentName.trim()) newErrors.assignmentName = "Assignment name is required";
    if (!formData.score || isNaN(formData.score)) newErrors.score = "Valid score is required";
    if (!formData.maxScore || isNaN(formData.maxScore)) newErrors.maxScore = "Valid max score is required";
    if (parseFloat(formData.score) > parseFloat(formData.maxScore)) {
      newErrors.score = "Score cannot be greater than max score";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const gradeData = {
        ...formData,
        score: parseFloat(formData.score),
        maxScore: parseFloat(formData.maxScore)
      };
      onSave(gradeData);
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
                  {grade ? "Edit Grade" : "Add Grade"}
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
                  label="Student"
                  type="select"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  error={errors.studentId}
                  required
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.Id} value={student.Id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </FormField>

                <FormField
                  label="Class"
                  type="select"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  error={errors.classId}
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.Id} value={cls.Id}>
                      {cls.name}
                    </option>
                  ))}
                </FormField>

                <FormField
                  label="Assignment Name"
                  name="assignmentName"
                  value={formData.assignmentName}
                  onChange={handleChange}
                  error={errors.assignmentName}
                  required
                  placeholder="e.g., Math Quiz 1, Final Exam"
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Score"
                    type="number"
                    name="score"
                    value={formData.score}
                    onChange={handleChange}
                    error={errors.score}
                    required
                    min="0"
                    step="0.1"
                  />
                  <FormField
                    label="Max Score"
                    type="number"
                    name="maxScore"
                    value={formData.maxScore}
                    onChange={handleChange}
                    error={errors.maxScore}
                    required
                    min="1"
                    step="0.1"
                  />
                </div>

                <FormField
                  label="Assignment Type"
                  type="select"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={[
                    { value: "assignment", label: "Assignment" },
                    { value: "quiz", label: "Quiz" },
                    { value: "test", label: "Test" },
                    { value: "final", label: "Final Exam" }
                  ]}
                />

                <FormField
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button type="submit" className="w-full sm:w-auto sm:ml-3">
                {grade ? "Update Grade" : "Add Grade"}
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

export default GradeModal;