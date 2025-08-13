import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import GradesList from "@/components/organisms/GradesList";
import GradeModal from "@/components/organisms/GradeModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import * as gradeService from "@/services/api/gradeService";
import * as studentService from "@/services/api/studentService";
import * as classService from "@/services/api/classService";
import { toast } from "react-toastify";

const Grades = ({ onMenuToggle }) => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [gradesData, studentsData, classesData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ]);
      setGrades(gradesData);
      setStudents(studentsData);
      setClasses(classesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveGrade = async (gradeData) => {
    try {
      if (editingGrade) {
        await gradeService.update(editingGrade.Id, gradeData);
        toast.success("Grade updated successfully!");
      } else {
        await gradeService.create(gradeData);
        toast.success("Grade added successfully!");
      }
      loadData();
      setIsModalOpen(false);
      setEditingGrade(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setIsModalOpen(true);
  };

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await gradeService.delete(gradeId);
        toast.success("Grade deleted successfully!");
        loadData();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleAddNew = () => {
    setEditingGrade(null);
    setIsModalOpen(true);
  };

  const filteredGrades = grades.filter(grade => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    const student = students.find(s => s.Id === grade.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : "";
    
    return (
      studentName.includes(searchTerm) ||
      grade.assignmentName.toLowerCase().includes(searchTerm) ||
      grade.type.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <Header
          title="Grades"
          onMenuToggle={onMenuToggle}
        />
        <Empty
          title="No students available"
          description="You need to add students before you can record grades."
          actionLabel="Add Students"
          onAction={() => window.location.href = "/students"}
          icon="Award"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header
        title="Grades"
        onMenuToggle={onMenuToggle}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onAddNew={handleAddNew}
        addNewLabel="Add Grade"
      />

      {grades.length === 0 && !loading ? (
        <Empty
          title="No grades recorded"
          description="Start recording student performance by adding their first grades."
          actionLabel="Add Grade"
          onAction={handleAddNew}
          icon="Award"
        />
      ) : (
        <GradesList
          grades={filteredGrades}
          students={students}
          onEdit={handleEditGrade}
          onDelete={handleDeleteGrade}
          onAdd={handleAddNew}
        />
      )}

      <GradeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGrade(null);
        }}
        grade={editingGrade}
        onSave={handleSaveGrade}
        students={students}
        classes={classes}
      />
    </div>
  );
};

export default Grades;