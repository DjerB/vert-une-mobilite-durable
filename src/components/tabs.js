import React from 'react';
import './tabs.css';

const Tabs = ({ activeTab, onTabChange, tabs, width }) => (
    <div className="d-flex justify-content-center my-3">
        <ul id="challengesTabs" className="nav nav-tabs px-2 d-flex justify-content-around" style={{ width }}>
            {tabs.map((tab, index) => (
                <li key={index} className={activeTab === index ? "active" : ""} style={{ fontSize: "0.8em", paddingTop: "2%", paddingBottom: "2%", borderBottom: activeTab === index ? "2px solid #0052A0" : "", color: activeTab === index ? "#0052A0" : "" }}><span  onClick={() => onTabChange(index)}>{tab}</span></li>
            ))}
        </ul>
    </div>
);

export default Tabs;