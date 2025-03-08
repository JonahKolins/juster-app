import React from 'react';
import styles from "./RatingSlider.module.sass"

interface IconSliderProps {
    leftNum: number;
    rightNum: number;
}

const RatingSlider: React.FC<IconSliderProps> = ({ leftNum, rightNum }) => {
    const total = leftNum + rightNum;
    const resolvedPercentage = total > 0 ? (leftNum / total) * 100 : 0;
    
    return (
        <div className={styles['rating-slider']}>
            <div className={styles['slider-labels']}>
                <div className={styles['slider-label-resolved']}>
                    <span className={styles['label-value']}>{leftNum}</span>
                    <span className={styles['label-text']}>Решено</span>
                </div>
                <div className={styles['slider-label-unresolved']}>
                    <span className={styles['label-value']}>{rightNum}</span>
                    <span className={styles['label-text']}>Не решено</span>
                </div>
            </div>
            
            <div className={styles['slider-container']}>
                <div className={styles['slider-progress']}>
                    <div 
                        className={styles['slider-resolved']} 
                        style={{ width: `${resolvedPercentage}%` }}
                    />
                    <div 
                        className={styles['slider-unresolved']} 
                        style={{ width: `${100 - resolvedPercentage}%` }}
                    />
                </div>
            </div>
            
            <div className={styles['slider-percentage']}>
                <span className={styles['percentage-value']}>{resolvedPercentage.toFixed(1)}%</span>
                <span className={styles['percentage-label']}>решенных обращений</span>
            </div>
        </div>
    );
};

export default RatingSlider;