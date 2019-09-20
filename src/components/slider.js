import React from 'react';

const Slider =  ({ data, component: Component, handler, height, marginTop }) => (
  <div className="d-flex flex-nowrap py-1" style={{ overflowX: "scroll", overflowY: "hidden", scrollbarWidth: "none", height: height ? height : "100%", marginTop: marginTop }}>
        {data.map((dt, index) => (
            <Component key={index} data={dt} handler={handler} />
        ))}
  </div>
  );

export default Slider;