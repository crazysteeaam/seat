import {useRef} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import './Seat.css';

const ItemType = 'SEAT';

// eslint-disable-next-line react/prop-types
const Seat = ({id, name, height, energy, index, colIndex, rowIndex, moveSeat}) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: ItemType,
        drop: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveSeat(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    const [{isDragging}, drag] = useDrag({
        type: ItemType,
        item: {id, index},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className="seat"
            style={{
                opacity: isDragging ? 0.5 : 1,
                gridColumn: colIndex,
                gridRow: rowIndex,
                // energy范围1-3，3用红色，1用绿色，2用合适的颜色，如果name是空，则用灰色
                backgroundColor: energy == 3 ? "hotpink" : (energy == 2 ? "gold" : (energy == 1 ? "lightgreen" : "lightgray"))
            }}
        >
            <div className="name">{name}</div>
            <div className="height">{name === "空" ? "" : "身高：" + height}</div>

        </div>
    );
};

export default Seat;