import React from 'react';

// Simple wrapper that contains the views, navbar excluded
const Container = ({ children }) => (
    <div style={{ height: "92vh", paddingBottom: "8vh", overflowY: "scroll" }}>
        {children}
    </div>
);

export default Container;