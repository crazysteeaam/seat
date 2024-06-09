// import React from 'react';
import Seat from './Seat';
import './SeatList.css';

const SeatList = ({seats, moveSeat, cols}) => {
    return (
        <div
            className="seat-list"
            style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
            }}
        >
            {seats.map((seat, index) => (
                <Seat
                    key={seat.id}
                    index={index}
                    id={seat.id}
                    height={seat.height}
                    energy={seat.energy}
                    colIndex={seat.colIndex}
                    rowIndex={seat.rowIndex}
                    name={seat.name}
                    moveSeat={moveSeat}
                />
            ))}
        </div>
    );
};

export default SeatList;