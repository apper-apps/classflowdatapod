import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import ClassCard from "@/components/organisms/ClassCard";
import ClassModal from "@/components/organisms/ClassModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import * as classService from "@/services/api/classService";
import { toast } from "react-toastify";

const Classes = ({ onMenuToggle }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classService.getAll();
      setClasses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSaveClass = async (classData) => {
    try {
      if (editingClass) {
        await classService.update(editingClass.Id, classData);
        toast.success("Class updated successfully!");
      } else {
        await classService.create(classData);
        toast.success("Class added successfully!");
      }
      loadClasses();
      setIsModalOpen(false);
      setEditingClass(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditClass = (classData) => {
    setEditingClass(classData);
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await classService.delete(classId);
        toast.success("Class deleted successfully!");
        loadClasses();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleViewClass = (classData) => {
    toast.info(`Viewing ${classData.name}`);
  };

  const handleAddNew = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const filteredClasses = classes.filter(cls => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      cls.name.toLowerCase().includes(searchTerm) ||
      cls.subject.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadClasses} />;

  return (
    <div className="space-y-6">
      <Header
        title="Classes"
        onMenuToggle={onMenuToggle}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onAddNew={handleAddNew}
        addNewLabel="Add Class"
      />

      {classes.length === 0 && !loading ? (
        <Empty
          title="No classes yet"
          description="Create your first class to start organizing students and assignments."
          actionLabel="Add Class"
          onAction={handleAddNew}
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <ClassCard
              key={cls.Id}
              classData={cls}
              onEdit={handleEditClass}
              onDelete={handleDeleteClass}
              onView={handleViewClass}
            />
          ))}
        </div>
      )}

      <ClassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClass(null);
        }}
        classData={editingClass}
        onSave={handleSaveClass}
      />
    </div>
  );
};

export default Classes;