import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import * as studentService from "@/services/api/studentService";
import * as classService from "@/services/api/classService";
import { toast } from "react-toastify";

const Students = ({ onMenuToggle }) => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const data = await classService.getAll();
      setClasses(data);
    } catch (err) {
      console.error("Failed to load classes:", err);
    }
  };

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

const handleSaveStudent = async (studentData) => {
    try {
      // Map UI field names to database field names
      const mappedData = {
        first_name_c: studentData.firstName,
        last_name_c: studentData.lastName,
        email_c: studentData.email,
        phone_c: studentData.phone,
        date_of_birth_c: studentData.dateOfBirth,
        enrollment_date_c: studentData.enrollmentDate,
        status_c: studentData.status,
        class_ids_c: studentData.classIds?.join(',') || ''
      };

      if (editingStudent) {
        await studentService.update(editingStudent.Id, mappedData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(mappedData);
        toast.success("Student added successfully!");
      }
      loadStudents();
      setIsModalOpen(false);
      setEditingStudent(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        toast.success("Student deleted successfully!");
        loadStudents();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

const handleViewStudent = (student) => {
    // In a real app, this could open a detailed view or navigate to student profile
    toast.info(`Viewing ${student.first_name_c || student.firstName} ${student.last_name_c || student.lastName}`);
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const filteredStudents = students.filter(student => {
const searchTerm = searchQuery.toLowerCase();
    return (
      (student.first_name_c || student.firstName || '').toLowerCase().includes(searchTerm) ||
      (student.last_name_c || student.lastName || '').toLowerCase().includes(searchTerm) ||
      (student.email_c || student.email || '').toLowerCase().includes(searchTerm)
    );
  });

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      <Header
        title="Students"
        onMenuToggle={onMenuToggle}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onAddNew={handleAddNew}
        addNewLabel="Add Student"
      />

      {students.length === 0 && !loading ? (
        <Empty
          title="No students yet"
          description="Get started by adding your first student to the system."
          actionLabel="Add Student"
          onAction={handleAddNew}
          icon="Users"
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onView={handleViewStudent}
        />
      )}

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        student={editingStudent}
        onSave={handleSaveStudent}
        classes={classes}
      />
    </div>
  );
};

export default Students;