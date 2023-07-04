import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { OrderList } from './component/OrderComponent';
import { CreateOrder } from './component/CreateComponent';
import { EditOrder } from './component/EditComponent';


function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<OrderList />}/>
      <Route path='/add' element={<CreateOrder />}/>
      <Route path='/edit/:id' element={<EditOrder />}/>
    </Routes>
    </>
  );
}

export default App;
