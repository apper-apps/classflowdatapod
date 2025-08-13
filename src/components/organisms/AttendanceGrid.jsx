import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import AttendanceStatus from "@/components/molecules/AttendanceStatus";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AttendanceGrid = ({ attendanceData, students, selectedDate, onMarkAttendance, onDateChange }) => {
  const getAttendanceForStudent = (studentId) => {
    return attendanceData.find(
      (record) => record.studentId === studentId && 
      format(new Date(record.date), "yyyy-MM-dd") === format(new Date(selectedDate), "yyyy-MM-dd")
    );
  };

  const handleStatusChange = (studentId, newStatus) => {
    const existingRecord = getAttendanceForStudent(studentId);
    onMarkAttendance(studentId, newStatus, existingRecord?.Id);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance for {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
          </h3>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={format(new Date(selectedDate), "yyyy-MM-dd")}
              onChange={(e) => onDateChange(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <Button variant="outline" size="sm">
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const attendance = getAttendanceForStudent(student.Id);
                const currentStatus = attendance?.status || null;

                return (
                  <tr key={student.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {currentStatus ? (
                        <AttendanceStatus
                          status={currentStatus}
                          onClick={() => handleStatusChange(student.Id, currentStatus === "present" ? "absent" : "present")}
                        />
                      ) : (
                        <span className="text-sm text-gray-500">Not marked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant={currentStatus === "present" ? "success" : "ghost"}
                          size="sm"
                          onClick={() => handleStatusChange(student.Id, "present")}
                        >
                          <ApperIcon name="Check" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={currentStatus === "absent" ? "danger" : "ghost"}
                          size="sm"
                          onClick={() => handleStatusChange(student.Id, "absent")}
                        >
                          <ApperIcon name="X" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={currentStatus === "late" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => handleStatusChange(student.Id, "late")}
                        >
                          <ApperIcon name="Clock" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={currentStatus === "excused" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => handleStatusChange(student.Id, "excused")}
                        >
                          <ApperIcon name="Shield" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceGrid;