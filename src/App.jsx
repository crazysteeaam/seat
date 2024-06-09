import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import First from "./First.jsx";
import Into from "./Into.jsx";


const App = () => {

    return (
        <>
            <div className="title">
                <h1>基于身高和活跃度的班级座位排布工具</h1>
                <div style={{position:"relative",top:"-10px"}}>(使用模拟退火算法实现)</div>
            </div>
            <Router>
                <Routes>
                    <Route exact path="/" index element={<First/>}/>
                    <Route exact path="/intro" element={<Into/>}/>
                </Routes>
            </Router>
        </>
    );
};

export default App;
