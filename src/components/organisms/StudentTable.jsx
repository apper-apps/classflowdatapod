import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
  if (!students || students.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
        <p className="text-gray-600">Start by adding your first student to the class.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrollment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.Id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
<span className="text-sm font-medium text-white">
                          {(student.first_name_c || student.firstName || '').charAt(0)}{(student.last_name_c || student.lastName || '').charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
<div className="text-sm font-medium text-gray-900">
                        {student.first_name_c || student.firstName} {student.last_name_c || student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Born: {format(new Date(student.date_of_birth_c || student.dateOfBirth), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </td>
<td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.email_c || student.email}</div>
                  <div className="text-sm text-gray-500">{student.phone_c || student.phone}</div>
                </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(student.enrollment_date_c || student.enrollmentDate), "MMM d, yyyy")}
                </td>
<td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={(student.status_c || student.status) === "active" ? "success" : "inactive"}>
                    {student.status_c || student.status}
                  </Badge>
                </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(student.class_ids_c || student.classIds)?.split ? (student.class_ids_c || student.classIds).split(',').filter(id => id.trim()).length : (student.classIds?.length || 0)} classes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(student)}>
                      <ApperIcon name="Eye" className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(student)}>
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(student.Id)}>
                      <ApperIcon name="Trash2" className="h-4 w-4 text-error" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default StudentTable;