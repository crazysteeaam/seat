import {useRef, useState} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DownloadOutlined, FileExcelOutlined, UploadOutlined} from '@ant-design/icons';
import './App.css';
import SeatList from "./SeatList.jsx";
import CountUp from 'react-countup';
import {Button, Divider, InputNumber, message, Statistic, Tour, Upload} from "antd";
import * as XLSX from 'xlsx'
import {useNavigate} from "react-router-dom";

// 代码复制49组{'id': X, 'colIndex': X, 'rowIndex': X, 'name': 'XXX', 'height': XXX, 'energy': X}
const initialSeats = []
for (let i = 0; i < 49; i++) {
    initialSeats.push({
        'id': i,
        'colIndex': i % 7 + 1,
        'rowIndex': Math.floor(i / 7),
        'name': 'XXX',
        'height': 0,
        'energy': 0
    })
};

const First = () => {
    const [seats, setSeats] = useState(initialSeats);
    const [rows, setRows] = useState(7);
    const [cols, setCols] = useState(7);
    const [score, setScore] = useState(0);
    const [iter, setIter] = useState(800);
    const [heightWeight, setHeightWeight] = useState(1);
    const [energyWeight, setEnergyWeight] = useState(1000);
    const [allowDownload, setAllowDownload] = useState(false);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const steps = [
        {
            title: 'Step 1:下载模版',
            description: '请点击这里下载模版 template.xlsx，根据模版内容将班级。请注意不要修改表格抬头和表结构，活跃度填写1-3为佳。',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => ref1.current,
        },
        {
            title: 'Step 2:填写参数',
            description: '请根据实际需求，填写座位排数、座位列数、迭代次数和权重参数。',
            target: () => ref2.current,
        },
        {
            title: 'Step 3:上传数据',
            description: '请将之前下载的模版填写好的表格上传，系统将自动排布座位。',
            target: () => ref3.current,
        },
        {
            title: 'Step 4:拖拽微调',
            description: '请根据实际情况，拖拽座位进行微调，得出最终的座位排布。',
            target: () => ref4.current,
        },
        {
            title: 'Step 5:下载结果',
            description: '请点击导出按钮，下载最终的座位排布表格。',
            target: () => ref5.current,
        },
    ];

    const moveSeat = (dragIndex, hoverIndex) => {
        const updatedSeats = [...seats];
        const draggedSeat = updatedSeats[dragIndex];
        const hoverSeat = updatedSeats[hoverIndex];

        // 交换 colIndex 和 rowIndex
        const tempColIndex = draggedSeat.colIndex;
        const tempRowIndex = draggedSeat.rowIndex;

        draggedSeat.colIndex = hoverSeat.colIndex;
        draggedSeat.rowIndex = hoverSeat.rowIndex;

        hoverSeat.colIndex = tempColIndex;
        hoverSeat.rowIndex = tempRowIndex;

        // 交换位置
        updatedSeats[dragIndex] = hoverSeat;
        updatedSeats[hoverIndex] = draggedSeat;

        setSeats(updatedSeats);
    };

    const props = {
        action: 'http://124.222.113.8:5000/upload?rows=' + rows + '&cols=' + cols + '&iter=' + iter + '&heightWeight=' + heightWeight + '&energyWeight=' + energyWeight,
        accept: '/xls,.xlsx',
        maxCount: 1,
        method: 'post',
        onChange({file, fileList}) {
            if (file.status !== 'uploading') {
                console.log(file, fileList);
            }
            if (file.status === 'done') {
                message.success(`${file.name} 文件上传成功`, 1);
                setSeats(file.response.data)
                setScore(file.response.score)
                setAllowDownload(true)
            } else if (file.status === 'error') {
                // 返回错误理由，错误理由是接口返回的
                message.error(`${file.name} 文件上传失败: ${file.response}`);
            }
        },
    };

    // 下载模版，从public里的template.xlsx
    const downloadTemplate = () => {
        message.loading('正在下载模版', 1);
        const link = document.createElement('a');
        link.href = 'template.xlsx';
        link.download = 'template.xlsx';
        link.click();
    }

    const formatter = (value) => <CountUp end={value} separator=","/>;

    const onChangeRow = (value) => {
        setRows(value);
    }

    const onChangeCol = (value) => {
        setCols(value);
    }

    const onChangeIter = (value) => {
        setIter(value)
    }

    const onChangeHeight = (value) => {
        setHeightWeight(value)
    }

    const onChangeEnergy = (value) => {
        setEnergyWeight(value)
    }

    const download = () => {
        // 将seats转换为json格式
        const data = seats
        const rowCount = Math.max(...data.map(item => item.rowIndex)) + 1;
        const colCount = Math.max(...data.map(item => item.colIndex)) + 1;

        // 创建表格
        const table = Array.from({length: rowCount}, () => Array(colCount).fill(null));

        // 填充表格
        data.forEach(item => {
            table[item.rowIndex][item.colIndex] = item.name;
        });

        // 转换为Sheet
        const ws = XLSX.utils.aoa_to_sheet(table);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // 生成xlsx文件
        const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
        const blob = new Blob([wbout], {type: 'application/octet-stream'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'seats.xlsx';
        link.click();
    }

    return (
        <>
            <div className="input" ref={ref2}>
                <div className="inputline">
                    <div className="inputele">
                        座位排数：<InputNumber size="medium" min={1} max={10} defaultValue={7} onChange={onChangeRow}/>
                    </div>
                    <div className="inputele">
                        座位列数：<InputNumber size="medium" min={1} max={10} defaultValue={7} onChange={onChangeCol}/>
                    </div>
                </div>
                <div className="inputline">
                    <div className="inputele">
                        迭代次数：<InputNumber size="medium" min={1} defaultValue={800} onChange={onChangeIter}/>
                    </div>
                    <div className="inputele">
                        身高权重：<InputNumber size="medium" min={1} defaultValue={1} onChange={onChangeHeight}/>
                    </div>
                    <div className="inputele">
                        活跃度权重：<InputNumber size="medium" min={1} defaultValue={1000} onChange={onChangeEnergy}/>
                    </div>
                </div>
            </div>
            <div className="button">
                <Button
                    ref={ref1}
                    icon={<DownloadOutlined/>}
                    size="middle"
                    style={{
                        width: "100px"
                    }}
                    onClick={downloadTemplate}
                >下载模版
                </Button>
                <Upload {...props}>
                    <Button
                        ref={ref3}
                        icon={<UploadOutlined/>}
                        size="middle"
                        style={{
                            width: "100px"
                        }}
                    >上传表格</Button>
                </Upload>
            </div>
            <DndProvider backend={HTML5Backend} ref={ref4}>
                <div className="blackboard">黑板</div>
                <div className="seat-container">
                    <SeatList seats={seats} moveSeat={moveSeat} cols={cols}/>
                </div>
            </DndProvider>
            <div className="data">
                {/*<Row gutter={12}>*/}
                {/*    <Col span={12}>*/}
                <Statistic title="算法得分(越低越好)" value={score} formatter={formatter}/>
                {/*</Col>*/}
                {/*<Col span={12}>*/}
                {/*    <Statistic title="排序" value={112893} precision={2} formatter={formatter}/>*/}
                {/*</Col>*/}
                {/*</Row>*/}
            </div>
            <Divider/>
            <div className="footer">
                <Button
                    ref={ref5}
                    icon={<FileExcelOutlined />}
                    size="middle"
                    style={{
                        width: "100px"
                    }}
                    onClick={download}
                    disabled={!allowDownload}
                >导出结果
                </Button>
                <Button type="primary" onClick={() => setOpen(true)}>
                    使用指南
                </Button>
                <Button type="primary" onClick={() => navigate('/intro')}>
                    算法原理
                </Button>
            </div>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps}/>

        </>
    );
};

export default First;