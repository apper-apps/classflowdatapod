import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ClassCard = ({ classData, onEdit, onDelete, onView }) => {
  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{classData.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{classData.subject}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
              {classData.schedule}
            </div>
            <div className="flex items-center">
              <ApperIcon name="Users" className="h-4 w-4 mr-1" />
              {classData.studentIds?.length || 0} students
            </div>
          </div>
          <Badge variant="primary">Active</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onView(classData)}>
            <ApperIcon name="Eye" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(classData)}>
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(classData.Id)}>
            <ApperIcon name="Trash2" className="h-4 w-4 text-error" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ClassCard;