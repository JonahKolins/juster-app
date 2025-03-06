import React, { useState } from 'react';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import { Slider, SliderSingleProps } from 'antd';
import styles from "./RatingSlider.module.sass"

interface IconSliderProps {
    max: number;
    min: number;
    current: number;
    marks: SliderSingleProps['marks']
}

const RatingSlider: React.FC<IconSliderProps> = (props) => {
    const { max, min, current, marks} = props;
    const [value, setValue] = useState(0);

    const mid = Number(((max - min) / 2).toFixed(5));
    const preColorCls = value >= mid ? '' : styles['icon-wrapper-active'];
    const nextColorCls = value >= mid ? styles['icon-wrapper-active'] : '';

    return (
        <div className={styles['icon-wrapper']}>
            {/* <FrownOutlined className={preColorCls} /> */}
            <Slider 
                {...props}
                marks={marks}
                value={current} 
                onChange={() => {}}
            />
            {/* <SmileOutlined className={nextColorCls} /> */}
        </div>
    );
};

export default RatingSlider;