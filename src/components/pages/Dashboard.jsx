import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import * as studentService from "@/services/api/studentService";
import * as classService from "@/services/api/classService";
import * as attendanceService from "@/services/api/attendanceService";
import * as gradeService from "@/services/api/gradeService";
import { format } from "date-fns";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [studentsData, classesData, attendanceData, gradesData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
      setAttendance(attendanceData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAttendanceStats = () => {
const today = format(new Date(), "yyyy-MM-dd");
    const todayAttendance = attendance.filter(record => 
      format(new Date(record.date_c || record.date), "yyyy-MM-dd") === today
    );
    const totalStudents = students.length;
    const presentToday = todayAttendance.filter(record => record.status === "present").length;
    const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;
    
    return { presentToday, totalStudents, attendanceRate };
  };

  const getGradeAverage = () => {
    if (grades.length === 0) return 0;
const total = grades.reduce((sum, grade) => sum + ((grade.score_c || grade.score) / (grade.max_score_c || grade.maxScore)) * 100, 0);
    return Math.round(total / grades.length);
  };

  const getRecentActivity = () => {
const recentGrades = [...grades]
      .sort((a, b) => new Date(b.date_c || b.date) - new Date(a.date_c || a.date))
      .slice(0, 5);
    
    return recentGrades.map(grade => {
      const student = students.find(s => s.Id === (grade.student_id_c?.Id || grade.student_id_c || grade.studentId));
      return {
        ...grade,
        studentName: student ? `${student.first_name_c || student.firstName} ${student.last_name_c || student.lastName}` : "Unknown Student"
      };
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const attendanceStats = getAttendanceStats();
  const averageGrade = getGradeAverage();
  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
        <h1 className="text-2xl font-display font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">Here's what's happening with your classes today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={students.length}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Active Classes"
          value={classes.length}
          icon="BookOpen"
          color="secondary"
        />
        <StatCard
          title="Today's Attendance"
          value={`${attendanceStats.presentToday}/${attendanceStats.totalStudents}`}
          change={`${attendanceStats.attendanceRate}% rate`}
          changeType={attendanceStats.attendanceRate >= 80 ? "positive" : "negative"}
          icon="Calendar"
          color="success"
        />
        <StatCard
          title="Average Grade"
          value={`${averageGrade}%`}
          change={averageGrade >= 80 ? "Good performance" : "Needs attention"}
          changeType={averageGrade >= 80 ? "positive" : "negative"}
          icon="Award"
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Grades</h3>
            <Button variant="outline" size="sm">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Grade
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
<div key={activity.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.studentName}
                    </p>
                    <p className="text-xs text-gray-600">{activity.assignment_name_c || activity.assignmentName}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={(activity.score_c || activity.score) / (activity.max_score_c || activity.maxScore) >= 0.8 ? "success" : "warning"}>
                      {Math.round(((activity.score_c || activity.score) / (activity.max_score_c || activity.maxScore)) * 100)}%
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(activity.date_c || activity.date), "MMM d")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent grades</p>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <ApperIcon name="UserPlus" className="h-6 w-6 mb-2" />
              <span className="text-sm">Add Student</span>
            </Button>
            <Button variant="secondary" className="h-20 flex flex-col items-center justify-center">
              <ApperIcon name="BookOpen" className="h-6 w-6 mb-2" />
              <span className="text-sm">New Class</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <ApperIcon name="Calendar" className="h-6 w-6 mb-2" />
              <span className="text-sm">Mark Attendance</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <ApperIcon name="Award" className="h-6 w-6 mb-2" />
              <span className="text-sm">Add Grade</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Today's Classes Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Classes</h3>
        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.slice(0, 3).map((cls) => (
<div key={cls.Id} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">{cls.Name || cls.name}</h4>
                <p className="text-sm text-gray-600">{cls.subject_c || cls.subject}</p>
                <p className="text-xs text-gray-500 mt-2">{cls.schedule_c || cls.schedule}</p>
                <div className="mt-2">
                  <Badge variant="primary">
                    {(cls.student_ids_c || cls.studentIds)?.split(',').filter(id => id.trim()).length || 0} students
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No classes scheduled</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;