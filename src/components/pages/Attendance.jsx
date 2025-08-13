import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import * as attendanceService from "@/services/api/attendanceService";
import * as studentService from "@/services/api/studentService";
import { toast } from "react-toastify";

const Attendance = ({ onMenuToggle }) => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [attendanceData, studentsData] = await Promise.all([
        attendanceService.getAll(),
        studentService.getAll()
      ]);
      setAttendance(attendanceData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleMarkAttendance = async (studentId, status, existingRecordId = null) => {
    try {
      const attendanceData = {
        student_id_c: studentId,
        class_id_c: 1, // Default class for demo
        date_c: selectedDate.toISOString().split('T')[0],
        status_c: status,
        notes_c: ""
      };

      if (existingRecordId) {
        await attendanceService.update(existingRecordId, attendanceData);
        toast.success("Attendance updated successfully!");
      } else {
        await attendanceService.create(attendanceData);
        toast.success("Attendance marked successfully!");
      }
      
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <Header
          title="Attendance"
          onMenuToggle={onMenuToggle}
        />
        <Empty
          title="No students available"
          description="You need to add students before you can track attendance."
          actionLabel="Add Students"
          onAction={() => window.location.href = "/students"}
          icon="Calendar"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header
        title="Attendance"
        onMenuToggle={onMenuToggle}
      />

      <AttendanceGrid
        attendanceData={attendance}
        students={students}
        selectedDate={selectedDate}
        onMarkAttendance={handleMarkAttendance}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default Attendance;