import React from "react";
import { FaParking } from "react-icons/fa";
import "../Style/StatCardSkeleton.css";

const StatCardSkeleton = () => {
  return (
    <div className="stat-card skeleton">
      <div className="stat-icon">
        <FaParking />
      </div>
      <div className="stat-info">
        <div className="skeleton-title"></div>
        <div className="skeleton-value"></div>
      </div>
    </div>
  );
};

export default StatCardSkeleton;
